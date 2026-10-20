#!/usr/bin/env python3
"""Reject new public-table creation paths that omit explicit Data API access.
The dated legacy baseline is an inventory of existing paths, not a readiness waiver.
"""
import json,re,subprocess,sys
from pathlib import Path
CREATE=re.compile(r'\bcreate\s+(?:unlogged\s+)?table\s+(?:if\s+not\s+exists\s+)?(?:(\w+)\.)?"?(\w+)"?\s*\(',re.I)
def strip_comments(s):return re.sub(r'/\*.*?\*/|--[^\n]*','',s,flags=re.S)
def declarations(s):
 return [(m[2].lower(),m.start()) for m in CREATE.finditer(strip_comments(s)) if m[1] is None or m[1].lower()=='public']
def validate(s,table):
 clean=strip_comments(s);q=r'(?:public\.)?"?'+re.escape(table)+r'\b"?'
 grants=list(re.finditer(r'\bgrant\s+([^;]+?)\s+on\s+(?:table\s+)?'+q+r'\s+to\s+([^;]+);',clean,re.I))
 private=bool(re.search(r'Data API private:\s*'+re.escape(table)+r'\b',s,re.I))
 if not grants and not private:return ['missing explicit per-table GRANT or named private disposition']
 roles=' '.join(g[2] for g in grants)
 errors=[]
 if re.search(r'\b(anon|authenticated)\b',roles,re.I):
  if not re.search(r'\balter\s+table\s+(?:only\s+)?'+q+r'\s+enable\s+row\s+level\s+security\b',clean,re.I):errors.append('client grant without RLS in same migration')
  if not re.search(r'\bcreate\s+policy\b[^;]+\bon\s+'+q+r'\s',clean,re.I):errors.append('client grant without policy in same migration')
 if private and re.search(r'\b(anon|authenticated)\b',roles,re.I):errors.append('private disposition conflicts with client grants')
 # Inserts backed by SERIAL/nextval need explicit owned-sequence permissions.
 if any(re.search(r'\binsert\b',g[1],re.I) for g in grants) and re.search(r'\b(?:bigserial|serial|smallserial|nextval)\b',clean,re.I):
  if not re.search(r'\bgrant\s+usage\s+on\s+sequence\b',clean,re.I):errors.append('INSERT into serial-backed table without explicit sequence USAGE')
 return errors

def main():
 root=Path(__file__).resolve().parents[1];baseline=json.loads((root/'scripts/config/data-api-grants-legacy.json').read_text());known={tuple(x) for x in baseline['existing_declarations']};failures=[];checked=0
 for name in subprocess.check_output(['git','-C',str(root),'ls-files'],text=True).splitlines():
  p=root/name
  if p.suffix not in ('.sql','.mjs','.js','.ts','.py','.sh') or p.name.startswith(('test_','test-')) or '.test.' in p.name or any(x in name for x in ('__tests__','/tests/','/fixtures/','/dare-report-tests/')) or name.startswith('tests/'):continue
  try:s=p.read_text()
  except (UnicodeError,FileNotFoundError):continue
  for table,_ in declarations(s):
   if (name,table) in known:continue
   checked+=1
   failures += [f'{name}: public.{table}: {e}' for e in validate(s,table)]
 print(json.dumps({'new_declarations_checked':checked,'legacy_declarations':len(known),'errors':failures}))
 return bool(failures)
if __name__=='__main__':sys.exit(main())
