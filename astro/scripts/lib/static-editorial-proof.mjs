// Portable, dependency-free verification for static Markdown publications.
// Only the exact draft boolean is operational. Titles, summaries, dates, HTML,
// quotations, reference links and all other frontmatter remain in the digest.
import {createHash, verify} from 'node:crypto';
export const STATIC_PROOF_VERSION='estate-static-editorial-v1';
export function staticDocument(raw, path = '') {
 if(typeof raw!=='string'||Buffer.byteLength(raw)>48000||raw.includes('\0'))throw Error('Unsupported static document');
 if(path==='astro/src/content/editorial/glossary.json'){
  const value=JSON.parse(raw);
  if(!value||Array.isArray(value)||typeof value!=='object'||raw!==JSON.stringify(value,null,2)+'\n')throw Error('Canonical JSON object required; duplicate or ambiguous keys are not allowed');
  if(/<(?:script|style|iframe|audio|video)\b|!\[[^\]]*\]\(|<img\b/i.test(raw))throw Error('Static text review cannot certify executable or visual media');
  return {canonical:raw,draft:false,sha256:createHash('sha256').update(raw).digest('hex')};
 }
 const match=raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
 if(!match)throw Error('Markdown frontmatter required');
 const lines=match[1].split(/\r?\n/),drafts=lines.filter(x=>/^draft\s*:/.test(x));
 if(drafts.length>1||drafts.some(x=>!/^draft: (?:true|false)$/.test(x)))throw Error('Ambiguous draft state');
 // Preserve all bytes except this single exact field value. Even whitespace
 // elsewhere changes the proof. Do not parse YAML and silently omit fields.
 const canonical=raw.slice(0,match[0].length).replace(/^draft: (?:true|false)$/m,'draft: [operational]')+raw.slice(match[0].length);
 if(/<(?:script|style|iframe|audio|video)\b|!\[[^\]]*\]\(|<img\b/i.test(raw))throw Error('Static text review cannot certify executable or visual media');
 return {canonical,draft:drafts[0]==='draft: true',sha256:createHash('sha256').update(canonical).digest('hex')};
}
export function staticIdentity(repository,path) {
 if(repository==='acwokas/promptandgo'&&path==='astro/src/content/editorial/glossary.json')return {repository,path};
 if(!['acwokas/adrian-2026','acwokas/promptandgo'].includes(repository)||!/^src\/content\/(?:friday-frame|writing|glossary)\/[a-z0-9-]+\.md$/.test(path))throw Error('Static editorial identity is not admitted');
 return {repository,path};
}
export function proofMessage(proof) {
 return JSON.stringify([proof.version,proof.repository,proof.path,proof.document_sha256,proof.review_sha256,proof.source_sha256,proof.reviewed_at,proof.expires_at]);
}
export function verifyStaticProof({raw,repository,path,receipt,publicKey,now=new Date()}) {
 staticIdentity(repository,path);const doc=staticDocument(raw,path),p=receipt?.proof;
 if(!p||p.version!==STATIC_PROOF_VERSION||p.repository!==repository||p.path!==path||p.document_sha256!==doc.sha256)throw Error('Static proof does not match this complete document');
 for(const key of ['document_sha256','review_sha256','source_sha256'])if(!/^[a-f0-9]{64}$/.test(p[key]||''))throw Error('Invalid proof digest');
 const reviewed=Date.parse(p.reviewed_at),expires=Date.parse(p.expires_at),time=now.getTime();
 if(!Number.isFinite(reviewed)||!Number.isFinite(expires)||reviewed>time||expires<=time||expires-reviewed>7*86400000||expires<=reviewed)throw Error('Static factual proof expired or has invalid timing');
 if(typeof receipt.signature!=='string'||!verify(null,Buffer.from(proofMessage(p)),publicKey,Buffer.from(receipt.signature,'base64')))throw Error('Invalid independent static signature');
 return {approved:true,sha256:doc.sha256,expires_at:p.expires_at};
}
