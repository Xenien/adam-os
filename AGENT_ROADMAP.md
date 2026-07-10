# Agent Improvement Roadmap

This file drives the autonomous improvement loop. An agent session runs daily,
picks the **topmost unchecked item**, implements it, verifies it, checks it off
(edit this file: `[ ]` → `[x]` + one-line note), commits, and pushes.

## Hard rules — read before every run

1. Work ONLY on branch `claude/ai-revenue-app-concept-wxcbr0`. Never force-push.
2. **One item per run.** Small and shipped beats big and broken.
3. Verify before committing: `npm i playwright-core --no-save && node tools/smoke-test.js`
   must print `SMOKE TEST PASSED`. If your change breaks it, fix or revert.
4. **Never fabricate:** no fake testimonials, fake review counts, fake user numbers,
   fake "as seen in" logos. Honest scarcity only (the launch-price counter must
   reflect what the owner actually does on Gumroad).
5. The privacy claim is load-bearing: resume text must NEVER be sent anywhere.
   No analytics that touch input text. Permitted third-party scripts: pdf.js
   and the owner-approved Google Ads tag (AW-18309597951) in index.html —
   do not remove it, and never attach it to the resume/JD textareas.
6. Don't change prices or the offer structure — that's the owner's call.
7. Keep every page working with zero build step (plain HTML/CSS/JS).
8. The loop runs until the owner declares ROI reached (~$104 revenue: 4 Pro
   sales or 1 Coach + 1 Pro) or says stop. Owner extended the mandate on
   2026-07-11: "Make money is the motive. We do until we roi."

## Backlog (priority order)

- [x] **SEO field pages.** Create `checkers/` pages for 6 fields (nurses, software
  engineers, teachers, accountants, marketers, sales reps): each a short page
  titled "ATS Resume Checker for [Field] (2026)" with field-specific keyword
  guidance (reuse the dictionary in `assets/app.js`), an embedded link to the
  main scanner, and proper meta/OG tags. Add a sitemap.xml and link them in the
  site footer. This is the compounding free-traffic channel.
  *Done 2026-07-08: 6 pages in `checkers/`, sitemap.xml, footer "Field guides" links.*
- [x] **.docx upload.** Add Word-file support to the resume upload using mammoth.js
  from a CDN (lazy-loaded like pdf.js). Most resumes are .docx — this is the
  single biggest effort-reducer left.
  *Done 2026-07-09: mammoth 1.8.0 lazy-loaded from cdnjs; handleFile routes .docx via extractRawText; accept attr, button label, and drag-drop filter updated; graceful fallback messages.*
- [x] **Score improvement preview.** On the free tier, show "adding the top 3
  missing keywords would raise your score to ~N" (compute by simulating the
  additions). Concrete dream-outcome math is the strongest free→paid nudge.
  *(Moved ahead of dictionary expansion 2026-07-10: day-1 ad data shows strong
  CTR but the free→paid bridge is the funnel's weakest link.)*
  *Done 2026-07-10: pure `projectedScore()` in app.js simulates matching the top
  3 missing keywords; projection line in the missing-keywords lock overlay,
  shown only to free users and only when the gain is ≥3 points; smoke-test
  asserts it renders with a projection above the real score (sample: 21 → ~36).*
- [x] **SEO wave 2 (acquisition priority — ads paused, organic is the engine).**
  (a) Six more checker pages in `checkers/`: project-managers, data-analysts,
  customer-service, human-resources, mechanical-engineers, warehouse-logistics —
  same pattern as wave 1. (b) Three guide articles in `guides/`:
  "why-resumes-get-rejected.html" (Why your resume gets rejected by ATS — and
  how to fix it), "ats-resume-format.html" (ATS resume format: the 8 rules),
  "resume-keywords.html" (How to find the right resume keywords for any job).
  800–1200 words each, honest content drawn from the app's actual checks and
  dictionary, strong CTA to the scanner, meta/OG tags, cross-links. (c) Add all
  new URLs to sitemap.xml and the index footer.
  *Done 2026-07-10: 6 new checker pages (project-managers, data-analysts,
  customer-service, human-resources, mechanical-engineers, warehouse-logistics)
  mirroring the wave-1 template with dictionary-verified keyword lists; 3 guide
  articles in `guides/` (800–860 words each, drawn from the app's 8 checks and
  keyword logic, CTAs to the scanner, meta/OG tags, cross-linked to checkers);
  sitemap.xml +9 URLs; index footer extended + new "Guides" list. Smoke test passed.*
- [x] **Skills dictionary expansion.** Add ~150 terms covering fields the dictionary
  is thin on: education/teaching, legal, construction/trades, hospitality,
  government/defense, creative/media. Keep the existing format; verify no
  duplicates; smoke test must pass.
  *Done 2026-07-10: 156 terms added in 6 comment-grouped blocks (education &
  teaching, legal, construction & trades, hospitality & food service,
  government & defense, creative & media); programmatic check confirms 676
  total entries, zero duplicates, all lowercase; extraction verified on a
  sample teaching JD. Smoke test passed.*
- [x] **JD quality guard.** If the pasted job description is very short or looks
  like a URL, show a helpful inline message instead of weak results.
  *Done 2026-07-10: inline warning note under the JD field (reuses the hint
  style, warning-colored border) when the JD is under 80 words or is a bare
  URL; analysis is never blocked; note self-clears live once a fuller posting
  is pasted; two smoke-test assertions added. Smoke test passed.*
- [ ] **FAQ schema markup.** Add JSON-LD FAQPage structured data to index.html
  (rich results in Google) and Product schema for the Pro offer.
- [ ] **Per-check anchors + copy tweaks.** Each ATS check gets an id so SEO pages
  and emails can deep-link (e.g. `/#check-action-verbs`).
- [ ] **Accessibility pass.** Keyboard-navigate the whole flow; aria-live on the
  results region; focus management when the modal opens/closes.
- [ ] **Performance.** Inline critical CSS above the fold; defer app.js; verify
  Lighthouse ≥95 on mobile (run via Playwright if available).
- [ ] **More rewrite patterns.** Grow REWRITE_PATTERNS to ~12, keyed to keyword
  type (tool vs. method vs. soft skill) so suggestions feel less templated.
- [ ] **SEO wave 3.** Six more checker pages (registered-nurses is done; add:
  administrative-assistants, financial-analysts, graphic-designers,
  electricians, executive-assistants, product-managers) + three more guides
  ("resume-action-verbs.html", "resume-summary-examples.html" — examples must
  be original generic templates, not fabricated people, and
  "one-page-vs-two-page-resume.html"). Same quality bar as wave 2; update
  sitemap + footer.
- [ ] **Social share image.** Generate a static og-image (1200x630) matching the
  brand look (dark gradient, gauge, "Beat the resume filter"), save as
  assets/og-image.png, reference it with og:image + twitter:card meta tags on
  index.html and all checker/guide pages. Improves click-through whenever any
  page is shared or linked.
- [ ] **Guides internal-link audit.** Every checker page links to all 3+ guides
  and vice versa; every page's title/meta reviewed against the exact phrasing
  in the "Searches" report terms (ats resume checker, resume score, rate my
  resume, ai resume checker, resume grader) — align page titles with real
  query language where honest.

## Log

- 2026-07-10 — JD quality guard shipped: `jdQualityMessage()` in app.js flags a pasted JD that is a bare URL (explains JobFit can't open web pages — nothing leaves the browser) or under 80 words (notes short postings give weaker keyword results, states the word count, says the scan runs anyway); friendly inline `#jd-quality-note` under the JD field styled off the existing hint pattern with a warning border; analysis is never blocked; once visible the note re-evaluates on input so it clears itself when the full posting is pasted; smoke test gained assertions that a full-length posting shows no note and a short JD warns without blocking. Smoke test passed.
- 2026-07-10 — Skills dictionary expansion shipped: 156 new SKILLS entries in six comment-grouped blocks (education & teaching 26, legal 25, construction & trades 26, hospitality & food service 25, government & defense 25, creative & media 29), matching the existing lowercase/comment-grouped format with multi-word phrases kept where natural; ambiguous single words avoided (e.g. "trademark law" not bare "trademark", no bare "far"/"concrete"); programmatic verification: 676 total, zero duplicates, all lowercase, app.js parses, new terms extract correctly from a sample teaching JD. Smoke test passed.
- 2026-07-10 — SEO wave 2 shipped: checkers/{project-managers,data-analysts,customer-service,human-resources,mechanical-engineers,warehouse-logistics}.html (same structure/voice as wave 1, keyword lists verified programmatically against the SKILLS dictionary, only the existing 75%/90% stats used), guides/{why-resumes-get-rejected,ats-resume-format,resume-keywords}.html (801/819/856 words, content drawn from the app's real 8 checks and keyword-extraction logic, strong CTA to ../index.html#app, meta description + OG tags, cross-links between guides and checkers), sitemap.xml +9 absolute URLs, index footer Field-guides list extended + new Guides list. Smoke test passed.
- 2026-07-08 — Loop created. Backlog seeded by the initial build session.
- 2026-07-08 — SEO field pages shipped: checkers/{nurses,software-engineers,teachers,accountants,marketers,sales-reps}.html (field intro, keyword list from the app dictionary, 3 tips, CTA to the scanner, meta/OG tags), sitemap.xml at root, "Field guides" links in the index footer. Smoke test passed.
- 2026-07-10 — Score improvement preview shipped: pure `projectedScore(result, topN)` moves the top-3 missing keywords' weights into the matched side of the coverage math (no mutation of the real result); free-tier lock overlay now shows "Adding just the top 3 keywords above would take your score from X to ~Y" (numbers in primary ink, hidden if the gain is under 3 points or the user is Pro); minimal honest copy tweak on the locked-count line; smoke test asserts the projection renders and beats the displayed score. Sample data: 21 → ~36. Smoke test passed.
- 2026-07-09 — .docx upload shipped: mammoth.js 1.8.0 lazy-loaded from cdnjs only when a Word file is chosen (mirrors the pdf.js loader), handleFile routes .docx/officedocument MIME through mammoth.extractRawText, file-input accept + "Upload PDF / DOCX / TXT" label + drag-drop filter updated, graceful error alerts suggest pasting text. Smoke test passed.
