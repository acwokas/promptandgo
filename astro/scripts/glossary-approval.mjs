import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {verifyStaticProof} from './lib/static-editorial-proof.mjs';
export const GLOSSARY_PATH='astro/src/content/editorial/glossary.json';
export function loadApprovedGlossary({root=fileURLToPath(new URL('../',import.meta.url)),now=new Date()}={}) {
 const raw=readFileSync(join(root,'src/content/editorial/glossary.json'),'utf8');
 const receipt=JSON.parse(readFileSync(join(root,'ops/editorial/approvals/glossary.json'),'utf8'));
 const publicKey=readFileSync(join(root,'ops/editorial/static-editorial-public-key.pem'),'utf8');
 verifyStaticProof({raw,repository:'acwokas/promptandgo',path:GLOSSARY_PATH,receipt,publicKey,now});
 const data=JSON.parse(raw);
 for(const key of ['title','description','heading','introduction'])if(typeof data[key]!=='string'||!data[key].trim())throw Error('Missing glossary '+key);
 if(!Array.isArray(data.terms)||!data.terms.length)throw Error('Empty glossary');
 const seen=new Set();
 for(const term of data.terms){
  for(const key of ['term','def','source'])if(typeof term[key]!=='string'||!term[key].trim())throw Error('Incomplete glossary term');
  const url=new URL(term.source);if(url.protocol!=='https:'||url.username||url.password)throw Error('Invalid glossary source');
  const name=term.term.toLocaleLowerCase('en-GB');if(seen.has(name))throw Error('Duplicate glossary term');seen.add(name);
 }
 return data;
}
