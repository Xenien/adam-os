# 🎯 JobFit — ATS Resume Match Checker

A sellable, zero-running-cost web product: paste a resume + a job description, get an
instant ATS match score, missing keywords, and 8 formatting checks. The entire
analysis runs client-side in the browser — no server, no AI API costs, no data
collection. Free tier hooks users; a one-time **$9 Pro** / **$39 Coach** unlock
(via Gumroad license keys) is the revenue.

**Why this sells:** 90%+ of companies filter resumes with applicant tracking
systems, the market leader (Jobscan) charges **$49.95/month** for this exact
feature, and career coaches charge **$150–$700 per resume** — a one-time $9/$39
alternative is an impulse purchase. Every sale is ~100% margin.

## Stack

Plain HTML/CSS/JS. No build step, no dependencies, no backend.

| File | What it is |
|---|---|
| `index.html` | Landing page + the app |
| `assets/app.js` | The analysis engine (keyword extraction, ATS checks, scoring), UI, and Gumroad license verification |
| `assets/style.css` | Design system (light + dark) |
| `assets/config.js` | **The only file you edit** — your Gumroad link + product ID |
| `.github/workflows/pages.yml` | Auto-deploys to GitHub Pages on push |
| `LAUNCH.md` | Step-by-step playbook to go live and start selling |

## How the paywall works (no server needed)

1. You create one Gumroad product with two variants ($9 Personal, $39 Coach) and
   enable **"Generate a unique license key per sale"**.
2. Buyers get a license key by email automatically.
3. The app verifies keys client-side against Gumroad's public
   `POST /v2/licenses/verify` endpoint and stores the unlock in `localStorage`.
4. Gumroad handles checkout, receipts, refunds, and payouts to your bank.
   You do nothing per sale.

## Run locally

Open `index.html` in a browser, or `python3 -m http.server` and visit
`http://localhost:8000`.

## Go live

See **[LAUNCH.md](LAUNCH.md)** — ~1 hour of one-time setup (Gumroad account,
paste one URL into `assets/config.js`, enable GitHub Pages), then distribution.
