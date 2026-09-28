import {loadApprovedGlossary} from './glossary-approval.mjs';
try {const data=loadApprovedGlossary();console.log('Independent complete-glossary approval verified: '+data.terms.length+' terms.');}
catch(error){console.error('Glossary publication held: '+error.message);process.exitCode=1;}
