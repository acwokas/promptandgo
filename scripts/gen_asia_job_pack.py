"""Generate 22 high-quality, Asia-aware job-search prompts and insert into Supabase + create new pack."""
import os, sys, json, re, time, threading
from concurrent.futures import ThreadPoolExecutor
import urllib.request, urllib.error
import psycopg2
from psycopg2.extras import execute_values

OPENAI_KEY = os.environ["OPENAI_API_KEY"]
DB_URL = os.environ["DB_URL"]

PACK = {
    "name": "Asia Job Hunt Survival Kit",
    "slug": "asia-job-hunt-survival-kit",
    "description": "22 battle-tested prompts for navigating Asia's brutal 2026 job market — Singapore EPs, Tokyo bilingual roles, Korean chaebol applications, Hong Kong banking, mainland China tech, plus the unglamorous bits: salary negotiation, recruiter ghosting, career-break narratives, and tech-layoff rebrands.",
    "price_cents": 1299,
}

# (title, what_for, country/market focus, is_pro)
TOPICS = [
    ("Singapore Tech CV — ATS-Optimised", "tailor a CV for a Singapore tech role (Shopee, Grab, Sea, GovTech, banks) with ATS keywords and competency-led bullets", "Singapore", True),
    ("Hong Kong Investment Banking Cover Letter", "write a tight one-page cover letter for HK IB analyst/associate roles emphasising deal exposure and technicals", "Hong Kong", True),
    ("Tokyo Bilingual Rirekisho", "produce a Japanese rirekisho (履歴書) for a bilingual mid-career role with correct date format, photo guidance and seal placement notes", "Japan", True),
    ("Tokyo Shokumukeirekisho — Tech Role", "write a Japanese shokumukeirekisho (職務経歴書) emphasising career narrative, reverse-chronological with quantified outcomes, in keigo register", "Japan", True),
    ("Korean Ja-gi-so-gae-seo for Chaebol", "draft a Korean self-introduction essay (자기소개서) for Samsung/LG/SK/Hyundai with the four classic sections (성장과정, 성격, 지원동기, 입사 후 포부)", "Korea", True),
    ("Mainland China 简历 (Jianli) — Tech", "write a mainland-China-style Chinese resume (简历) for a tech PM role, including 政治面貌 field, scoped to one page", "China", True),
    ("LinkedIn Outreach to APAC Recruiter", "open a cold LinkedIn message to an APAC tech recruiter that is concise, specific to one role, and avoids the 'I'm passionate' cliché", "Pan-Asia", False),
    ("Salary Negotiation Anchored to SG/HK COL", "write a salary counter-offer email anchored to Singapore or Hong Kong cost-of-living data, asking for a $15-25k bump or housing allowance", "Singapore / Hong Kong", True),
    ("Keigo Informational-Interview Request", "write a Japanese keigo email asking a senior contact for a 30-minute informational interview, structured with appropriate seasonal greeting and closing", "Japan", False),
    ("Bangkok/Jakarta Mixer Networking Script", "produce a 60-second introduction script for ChamCom or AmCham mixers in Bangkok or Jakarta, including a memorable hook and ask", "Thailand / Indonesia", False),
    ("Korean PT-style Interview Slides", "outline a 5-slide Korean PT-면접 self-presentation deck for a Korean conglomerate, with section titles in Hangul and English speaker notes", "Korea", True),
    ("STAR Behavioural Interview — Asia Context", "rehearse a STAR-method behavioural answer for 'tell me about a time you handled conflict' set in a multi-country Asian team (e.g. SG–Tokyo–KL collaboration)", "Pan-Asia", False),
    ("Career Break Narrative — Caregiving Return", "frame a 2-3 year career break for caregiving as a clean, confident paragraph for cover letters and LinkedIn About sections", "Pan-Asia", False),
    ("HK Agency-to-In-House Pivot", "write a cover letter pivoting from agency creative to an in-house role at a Hong Kong fashion or luxury brand", "Hong Kong", False),
    ("Tech-Layoff Rebrand for LinkedIn", "rewrite a LinkedIn 'Open to Work' status from 'just laid off' to 'exploring next chapter' that recruiters click", "Pan-Asia", False),
    ("Singapore EP/S-Pass Justification Letter", "draft a hiring-manager justification letter for a Singapore Employment Pass / S-Pass application, citing skills shortage and TAFEP fair-consideration framework", "Singapore", True),
    ("Multi-Country Job Search Tracker", "build a job-application CRM tracker prompt with columns for company, role, country, recruiter, last-touch, blockers, and a fortnightly reminder email", "Pan-Asia", False),
    ("Coffee Chat with APAC VC / Founder", "open a coffee-chat request to an APAC VC or founder mentioning one specific portfolio company and the help you can offer in return", "Pan-Asia", False),
    ("Three-Offer Comparison: SG vs Tokyo vs KL", "compare three competing offers across Singapore, Tokyo and Kuala Lumpur on take-home pay (after tax + housing), career capital, and lifestyle, and recommend one", "Singapore / Japan / Malaysia", True),
    ("Async Video-Interview Script", "produce a 90-second answer script for a HireVue/Hireflix one-way video interview prompt, with eye-line and pacing cues", "Pan-Asia", False),
    ("Polite Reply to Ghosting Recruiter", "write a follow-up message to a recruiter who has gone silent for 3+ weeks, in a register that's polite, face-saving, and re-opens the door", "Pan-Asia", False),
    ("Singapore Civil Service Cover Letter", "draft a cover letter for a Singapore civil service / statutory board role (e.g. EDB, MAS, GovTech) emphasising public-mission alignment and data fluency", "Singapore", True),
]

SYSTEM = """You are a senior career coach who has placed 200+ professionals across Singapore, Hong Kong, Tokyo, Seoul, Bangkok, Jakarta, and mainland China.

Generate ONE structured prompt for an AI tool (ChatGPT/Claude/Gemini). The prompt is the *output the user will copy and paste* — not advice ABOUT writing one.

OUTPUT EXACTLY THIS JSON (and nothing else):
{
  "title": "≤60 chars, action-oriented, no clickbait",
  "excerpt": "1 sentence ≤140 chars summarising what the prompt produces",
  "what_for": "≤200 chars describing the user this is for",
  "prompt_body": "The actual prompt template the user will send to an LLM. ~140-260 words. Use [bracketed placeholders] for fields the user fills in. Be specific about format, length, tone, and any cultural register required (keigo, Hangul honorifics, mainland-China policy fields, Singapore TAFEP framing, etc.). End with a clear 'Output format:' or 'Return:' specification.",
  "image_prompt": "≤140 char illustration brief for an OG image — flat colour, 16:9, brand purple→teal gradient",
  "tags": ["3-6","short","lowercase","tags"]
}

DO NOT include any preface, markdown fence, or commentary. Just the JSON."""

def gen_one(topic):
    title, what_for_hint, market, is_pro = topic
    user = f"""Title hint: {title}
Market: {market}
Use case: {what_for_hint}

Generate the prompt object now."""
    body = json.dumps({
        "model": "gpt-4o-mini",
        "messages": [{"role":"system","content":SYSTEM},{"role":"user","content":user}],
        "temperature": 0.7,
        "response_format": {"type":"json_object"},
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type":"application/json"},
        method="POST",
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.loads(r.read())
                content = data["choices"][0]["message"]["content"]
                obj = json.loads(content)
                obj["_market"] = market
                obj["_is_pro"] = is_pro
                obj["_title_hint"] = title
                return obj
        except Exception as e:
            print(f"[retry {attempt+1}] {title}: {e}", file=sys.stderr)
            time.sleep(2 ** attempt)
    return None

print("Generating 22 prompts in parallel...")
results = []
with ThreadPoolExecutor(max_workers=8) as ex:
    for i, r in enumerate(ex.map(gen_one, TOPICS)):
        if r:
            results.append(r)
            print(f"  [{i+1}] OK: {r.get('title','?')[:60]}")
        else:
            print(f"  [{i+1}] FAILED: {TOPICS[i][0]}")
print(f"Got {len(results)} prompts.")

if len(results) < 18:
    print("Too few prompts, aborting.")
    sys.exit(1)

# Insert into DB
conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

def slugify(s):
    s = re.sub(r"[^\w\s-]","", s.lower()).strip()
    s = re.sub(r"[\s_]+","-", s)
    s = re.sub(r"-+","-", s)
    return s[:80].strip("-")

# Get HR > Job Descriptions subcategory
cur.execute("SELECT s.id, s.category_id FROM subcategories s WHERE s.slug='job-descriptions'")
row = cur.fetchone()
subcat_id, cat_id = row[0], row[1]

# Resolve any existing slugs to avoid collision
cur.execute("SELECT slug FROM prompts")
existing_slugs = {r[0] for r in cur.fetchall()}

inserted = []
for r in results:
    base_slug = slugify(r["title"])
    slug = base_slug
    n = 2
    while slug in existing_slugs:
        slug = f"{base_slug}-{n}"
        n += 1
    existing_slugs.add(slug)
    cur.execute("""
        INSERT INTO prompts (title, slug, excerpt, what_for, prompt, image_prompt, subcategory_id, category_id, is_pro, review_status)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,'approved')
        RETURNING id
    """, (
        r["title"][:120],
        slug,
        r.get("excerpt","")[:200],
        r.get("what_for","")[:300],
        r.get("prompt_body",""),
        r.get("image_prompt","")[:200],
        subcat_id,
        cat_id,
        bool(r["_is_pro"]),
    ))
    pid = cur.fetchone()[0]
    inserted.append(pid)

# Create the new pack
cur.execute("""
    INSERT INTO packs (name, slug, description, price_cents, is_active)
    VALUES (%s,%s,%s,%s, true)
    ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, price_cents=EXCLUDED.price_cents
    RETURNING id
""", (PACK["name"], PACK["slug"], PACK["description"], PACK["price_cents"]))
pack_id = cur.fetchone()[0]

# Wire prompts into pack
execute_values(cur,
    "INSERT INTO pack_prompts (pack_id, prompt_id) VALUES %s ON CONFLICT DO NOTHING",
    [(pack_id, pid) for pid in inserted]
)

conn.commit()

# Final stats
cur.execute("SELECT COUNT(*) FROM prompts WHERE review_status='approved'")
total = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM prompts WHERE is_pro=true AND review_status='approved'")
pro_total = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM pack_prompts WHERE pack_id=%s", (pack_id,))
pack_count = cur.fetchone()[0]

cur.close()
conn.close()

print()
print(f"INSERTED: {len(inserted)} prompts into pack '{PACK['slug']}'")
print(f"Pack now contains: {pack_count} prompts")
print(f"TOTAL APPROVED LIBRARY: {total} prompts ({pro_total} premium, {round(pro_total/total*100)}%)")
