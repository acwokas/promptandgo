# Glossary factual publication gate

All glossary titles, introductions, definitions and source links are rendered from
src/content/editorial/glossary.json. npm run build and the page frontmatter both
require a current independent whole-file Ed25519 approval. There is no legacy
allowance for this glossary. Changed content cannot reuse an earlier signature.

The central AI Factory static-editorial-factual-review workflow retrieves this
public JSON at an immutable commit, collects original evidence, independently
reviews every passage using the existing subscription route, and signs only a
complete passing review on a separate runner. Copy its static-proof.json artifact
to approvals/glossary.json. The private key never belongs in this repository.
Proof validity is seven days; renew through the central workflow before expiry.
Never edit the receipt's timestamps or bypass the build to force deployment.

This gate covers the glossary only. Database-backed tips and other static copy
remain outside this approval. Supabase project access is currently denied to the
connected account, so its database publication barrier is still outstanding.
