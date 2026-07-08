# 🚀 JobFit Launch Playbook

Everything between you and your first sale. Setup is ~1 hour, one time.
Be realistic: the product is done, but **revenue = product × distribution**.
The distribution steps below are where the money actually comes from.

---

## Step 1 — Gumroad (≈30 min) — this is how money reaches your bank

1. Sign up at [gumroad.com](https://gumroad.com) (free; they take 10% + processing per sale).
2. Connect your bank account under **Settings → Payments** (payouts are weekly, every Friday).
3. Create a product:
   - **Type:** Digital product. **Name:** `JobFit Pro — The Interview Engine (lifetime)`.
   - **Price:** $29. Then add a **Version/Tier** called `Coach license (commercial use)` at **$99**.
   - ⚠ The site advertises "launch price $29, rises to $49 after the first 100 licenses."
     **Actually raise it at 100 sales** — fake scarcity is illegal and brand-fatal.
   - In the product's **Content** tab, write: *"Your license key is below. Go to
     [your site URL], click 'Enter license key', paste it — Pro is unlocked forever."*
   - **Settings → check "Generate a unique license key per sale."** (This is the paywall — don't skip it.)
4. Create a **second, $0+ product**: `2026 ATS Keyword Cheat Sheet (free)` — attach a
   PDF export of `cheatsheet.html` (open it → print → save as PDF). This is the
   lead magnet: every download captures an email into your Gumroad audience, and
   Gumroad's "Emails" feature sends the follow-up sequence (written for you in
   `MARKETING.md` §3).
5. Copy three things:
   - your Pro product's short URL (e.g. `https://yourname.gumroad.com/l/jobfit`)
   - the permalink slug (the part after `/l/`)
   - the free cheat-sheet product URL

## Step 2 — Configure the app (2 min)

Edit `assets/config.js`:

```js
gumroadProductUrl: "https://yourname.gumroad.com/l/jobfit",
gumroadProductPermalink: "jobfit",
leadMagnetUrl: "https://yourname.gumroad.com/l/ats-cheatsheet",
```

Commit and push.

## Step 3 — Turn on hosting (2 min, free)

GitHub repo → **Settings → Pages → Source: "GitHub Actions"**. The included
workflow deploys automatically on every push. Your site goes live at
`https://<username>.github.io/adam-os/`.

*Optional but high-impact ($10):* buy a domain like `jobfitcheck.com` on
Namecheap/Cloudflare and point it at Pages — conversion is meaningfully better
on a real domain than on a github.io URL.

## Step 4 — Buy your own product once ($9)

Test the full loop: checkout → license key email → paste key → Pro unlocks.
(Gumroad also has a "test purchase" mode on your own products — free.)

---

## Distribution — where the sales come from

The niche math: job seekers are desperate and numerous (volume at $9);
career coaches and resume writers **charge $150–$700 per resume** and buy tools
without blinking (margin at $39). Hit both.

### Day 1 (free, ~2 hours)
- **Reddit** — the single best channel for this product. Post genuinely helpful
  content (not ads) in r/resumes, r/jobsearchhacks, r/jobs, r/GetEmployed:
  *"I built a free ATS checker that runs 100% in your browser — your resume never
  gets uploaded anywhere."* The privacy angle is the hook; every competitor uploads resumes.
- **LinkedIn post** from your account: same privacy angle + a screenshot of the score screen.
- **Hacker News** "Show HN: JobFit — an ATS resume checker that never uploads your resume".
  Privacy-first + no-signup tools do well there.

### Day 2–3 (free)
- **Career coach outreach (the $99 tier):** DM/email 20 resume writers and career
  coaches on LinkedIn — search "resume writer" — with: *"Tool that generates a
  branded ATS keyword report you can hand to clients — one-time $99 commercial
  license, no subscription. Free tier to try: [link]."* Coaches are the buyers
  with money; 1 coach sale ≈ 3.5 consumer sales.
- **Paid ads:** the full playbook — platforms, hooks, budgets, CAC targets, kill
  criteria — is in `MARKETING.md` §6. Start Google Search at $30/day.
- **Facebook groups:** job-hunting groups (millions of members). Post as a helpful free tool.
- **Product Hunt** launch (schedule for a Tuesday–Thursday).

### Ongoing (compounding)
- **SEO:** the site already targets "ATS resume checker" / "resume keyword checker".
  Add one blog-style page per week ("Do resumes get rejected by ATS? 2026 data").
- **TikTok/Shorts:** 30-second screen recordings — "watch this resume score 34,
  then 86 after 3 fixes" — this format demonstrably drives job-tool virality.

### Pricing experiments (Gumroad makes these one-click)
- $29 is the launch hypothesis; test $39/$49 with discount codes once traffic flows.
- Gumroad discount codes ("REDDIT10", "GOOGLE10", "META10") are both the tracking
  mechanism and the A/B test — see `MARKETING.md` §6.

---

## Realistic expectations

| Scenario | What it takes | Week-1 revenue |
|---|---|---|
| Posted nowhere | — | $0. Products don't sell themselves. |
| A few Reddit/LinkedIn posts | 2–3 hrs | $0–$100 (traffic-dependent) |
| Front page of HN/PH or a viral post | luck × good copy | $500–$3,000 |
| 20 coach DMs + posts, sustained a month | ~1 hr/day | $100–$1,000/mo, compounding with SEO |

Zero running costs means the site can sit there earning trickle sales from
search traffic indefinitely — there is no downside to leaving it live.

## Legal/tax quick notes

- Gumroad is the merchant of record — they handle sales tax/VAT for you.
- Income is self-employment income; keep the Gumroad payout records.
- The site collects no user data (analysis is client-side), so no privacy
  policy obligations beyond the honest claim already in the footer. If you add
  Google Analytics later, add a privacy page.
