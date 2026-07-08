/* JobFit — client-side ATS resume/job-description matcher.
 * Everything in this file runs in the browser. No network calls except
 * Gumroad license verification (which sends only the license key). */
(function () {
  "use strict";

  var cfg = window.JOBFIT_CONFIG || {};

  /* ---------------------------------------------------------------- data */

  var STOPWORDS = new Set(("a about above after again against all am an and any are as at be because been before being below between both but by could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours yourself yourselves").split(" "));

  // Job-posting boilerplate that looks frequent but carries no signal.
  var BOILERPLATE = new Set(("experience experiences experienced years year ability able skills skill work working works team teams role roles position responsibilities responsibility qualifications qualification requirements required require preferred plus strong excellent including include includes etc join company opportunity opportunities benefits salary compensation equal employer employment applicant applicants apply application candidate candidates ideal successful looking seeking help日 day days week weeks month months knowledge understanding familiarity proficiency demonstrated proven track record related relevant degree bachelor bachelors master masters field environment fast paced dynamic passionate motivated detail oriented within across also well new must will duties status gender race religion orientation veteran disability accommodation location remote hybrid onsite office hours full time part").split(" "));

  // Known skills & competencies. Multi-word entries are matched as phrases.
  var SKILLS = [
    // languages & core tech
    "javascript","typescript","python","java","c++","c#","go","golang","rust","ruby","php","swift","kotlin","scala","perl","r","matlab","sql","nosql","html","css","sass","bash","powershell","objective-c","dart","elixir","haskell","assembly","fortran","cobol","vba","graphql","json","xml","yaml","regex",
    // frameworks & libraries
    "react","react native","angular","vue","svelte","next.js","nuxt","node.js","express","django","flask","fastapi","spring","spring boot","rails","ruby on rails",".net","asp.net","laravel","symfony","jquery","redux","tailwind","bootstrap","electron","flutter","xamarin","pytorch","tensorflow","keras","scikit-learn","pandas","numpy","spark","hadoop","kafka","rabbitmq","selenium","cypress","playwright","jest","mocha","junit","pytest",
    // data & ai
    "machine learning","deep learning","artificial intelligence","natural language processing","computer vision","data science","data analysis","data analytics","data engineering","data visualization","data modeling","data mining","big data","business intelligence","predictive modeling","statistical analysis","statistics","a/b testing","etl","data warehouse","data pipeline","large language models","llm","prompt engineering","generative ai","mlops","feature engineering","recommendation systems","time series","regression","classification","clustering","tableau","power bi","looker","excel","google sheets","dbt","snowflake","databricks","redshift","bigquery",
    // databases
    "postgresql","mysql","mongodb","redis","elasticsearch","sqlite","oracle","sql server","dynamodb","cassandra","firebase","supabase","neo4j",
    // cloud & devops
    "aws","amazon web services","azure","gcp","google cloud","docker","kubernetes","terraform","ansible","jenkins","github actions","gitlab ci","ci/cd","continuous integration","continuous deployment","devops","sre","site reliability","infrastructure as code","serverless","lambda","ec2","s3","cloudformation","microservices","distributed systems","load balancing","nginx","linux","unix","windows server","vmware","networking","tcp/ip","dns","http","rest","rest api","restful","api design","grpc","websockets","oauth","message queues","observability","monitoring","logging","prometheus","grafana","datadog","splunk","new relic",
    // security
    "cybersecurity","information security","penetration testing","vulnerability assessment","siem","incident response","threat modeling","encryption","identity and access management","soc 2","iso 27001","nist","gdpr","hipaa","pci dss","compliance","risk management","risk assessment","audit","internal controls",
    // product / project / methods
    "project management","program management","product management","product development","agile","scrum","kanban","waterfall","lean","six sigma","sprint planning","backlog","user stories","roadmap","stakeholder management","okrs","kpis","jira","confluence","asana","trello","monday.com","notion","smartsheet","ms project","pmp","prince2","change management","process improvement","business analysis","requirements gathering","gap analysis","user acceptance testing","quality assurance","quality control","test automation","manual testing","regression testing","root cause analysis",
    // design & ux
    "user experience","user interface","ux design","ui design","ux research","user research","usability testing","wireframing","prototyping","figma","sketch","adobe xd","adobe photoshop","photoshop","illustrator","indesign","after effects","premiere pro","canva","design systems","interaction design","information architecture","accessibility","wcag","typography","branding","graphic design","motion graphics","3d modeling","autocad","solidworks","revit",
    // marketing & sales
    "digital marketing","content marketing","email marketing","social media marketing","social media","seo","search engine optimization","sem","ppc","google ads","facebook ads","meta ads","google analytics","marketing automation","hubspot","marketo","mailchimp","copywriting","content creation","content strategy","brand management","market research","competitive analysis","crm","salesforce","lead generation","demand generation","account management","business development","sales operations","pipeline management","cold calling","prospecting","negotiation","closing","quota","b2b","b2c","saas","customer acquisition","conversion rate optimization","growth marketing","influencer marketing","affiliate marketing","public relations","event planning","campaign management",
    // finance & accounting
    "financial analysis","financial modeling","financial reporting","financial planning","forecasting","budgeting","variance analysis","accounting","accounts payable","accounts receivable","general ledger","reconciliation","month-end close","gaap","ifrs","quickbooks","sap","netsuite","oracle financials","erp","payroll","tax preparation","tax compliance","cpa","cfa","valuation","due diligence","mergers and acquisitions","investment analysis","portfolio management","equity research","fixed income","derivatives","bloomberg","treasury","cash flow","cost accounting","internal audit","fp&a","bookkeeping","invoicing","procurement","sourcing","vendor management","contract negotiation","contract management",
    // operations & supply chain
    "supply chain","supply chain management","logistics","inventory management","warehouse management","demand planning","fulfillment","shipping","transportation","fleet management","lean manufacturing","production planning","operations management","facilities management","erp systems","forecasting demand","supplier relations","purchase orders","quality management","osha","safety compliance","5s","continuous improvement",
    // hr & people
    "human resources","talent acquisition","recruiting","full cycle recruiting","onboarding","employee relations","performance management","compensation and benefits","hris","workday","adp","succession planning","training and development","learning and development","organizational development","diversity and inclusion","employee engagement","labor relations","conflict resolution",
    // healthcare & science
    "patient care","clinical research","clinical trials","electronic health records","ehr","epic","cerner","medical terminology","phlebotomy","medication administration","hipaa compliance","care coordination","case management","utilization review","cpt coding","icd-10","medical billing","medical coding","laboratory","gmp","glp","fda regulations","pharmacovigilance","biostatistics",
    // customer & support
    "customer service","customer support","customer success","customer experience","technical support","help desk","ticketing systems","zendesk","servicenow","intercom","sla management","escalation management","retention","churn reduction","upselling","cross-selling","client relations","relationship management",
    // general professional
    "leadership","team leadership","cross-functional collaboration","communication skills","public speaking","presentation skills","written communication","problem solving","critical thinking","analytical skills","time management","organizational skills","multitasking","adaptability","mentoring","coaching","strategic planning","strategic thinking","decision making","data-driven","budget management","p&l","revenue growth","cost reduction","performance metrics","reporting","documentation","training","teaching","research","editing","proofreading","translation","bilingual","spanish","french","mandarin","german","microsoft office","microsoft word","microsoft excel","powerpoint","outlook","google workspace","slack","zoom","teams","typing","data entry","scheduling","calendar management","travel coordination","expense reports","front desk","cash handling","pos systems","merchandising","visual merchandising","food safety","servsafe","cdl","forklift","first aid","cpr"
  ];

  var ACTION_VERBS = new Set(("led managed built developed designed created launched delivered implemented improved increased decreased reduced grew drove owned shipped architected engineered automated optimized streamlined negotiated closed generated saved cut achieved exceeded won earned established founded scaled spearheaded directed coordinated oversaw supervised mentored coached trained hired recruited analyzed researched identified resolved solved diagnosed migrated refactored deployed integrated maintained tested authored wrote published presented pitched partnered collaborated advised consulted transformed modernized accelerated boosted expanded secured administered executed produced organized planned facilitated initiated redesigned revamped standardized consolidated eliminated audited forecasted budgeted monitored tracked evaluated").split(" "));

  var WEAK_PHRASES = ["responsible for", "duties included", "references available", "hard worker", "hard-working", "team player", "go-getter", "think outside the box", "results-driven professional", "seasoned professional"];

  /* ------------------------------------------------------- text utilities */

  function normalize(text) {
    return text.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9+#./&-]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function tokenize(text) {
    return normalize(text).split(" ")
      .map(function (t) { return t.replace(/^[./-]+|[./-]+$/g, ""); })
      .filter(function (t) { return t.length > 0; });
  }

  function singular(t) {
    if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
    return t;
  }

  function phraseIn(joined, phrase) {
    return joined.indexOf(" " + phrase + " ") !== -1;
  }

  /* --------------------------------------------------- keyword extraction */

  function countOccurrences(joined, phrase) {
    var n = 0, idx = 0, needle = " " + phrase + " ";
    while ((idx = joined.indexOf(needle, idx)) !== -1) { n++; idx += phrase.length; }
    return n;
  }

  // Returns [{term, weight, isSkill}] — the keywords the JD emphasizes.
  function extractKeywords(jdText) {
    var toks = tokenize(jdText);
    var joined = " " + toks.join(" ") + " ";
    var keywords = [];
    var claimed = new Set(); // tokens already covered by a matched skill phrase

    SKILLS.forEach(function (skill) {
      var norm = normalize(skill);
      if (phraseIn(joined, norm)) {
        var freq = countOccurrences(joined, norm);
        keywords.push({ term: skill, weight: 3 + Math.min(freq - 1, 4) * 0.5, isSkill: true });
        norm.split(" ").forEach(function (w) { claimed.add(w); });
      }
    });

    var uniFreq = {};
    toks.forEach(function (t) {
      var s = singular(t);
      if (s.length < 3 || STOPWORDS.has(s) || BOILERPLATE.has(s) || BOILERPLATE.has(t) || claimed.has(t) || claimed.has(s) || /^\d+$/.test(s)) return;
      uniFreq[s] = (uniFreq[s] || 0) + 1;
    });

    var biFreq = {};
    for (var i = 0; i < toks.length - 1; i++) {
      var a = toks[i], b = toks[i + 1];
      if (STOPWORDS.has(a) || STOPWORDS.has(b) || BOILERPLATE.has(a) || BOILERPLATE.has(b)) continue;
      if (a.length < 3 || b.length < 3 || /^\d+$/.test(a) || /^\d+$/.test(b)) continue;
      if (claimed.has(a) && claimed.has(b)) continue;
      var bg = a + " " + b;
      biFreq[bg] = (biFreq[bg] || 0) + 1;
    }

    var keptBigrams = [];
    Object.keys(biFreq).forEach(function (bg) {
      if (biFreq[bg] >= 2) {
        keywords.push({ term: bg, weight: 2 + Math.min(biFreq[bg] - 2, 3) * 0.4, isSkill: false });
        keptBigrams.push(bg);
      }
    });

    Object.keys(uniFreq).forEach(function (t) {
      if (uniFreq[t] < 2) return;
      var inBigram = keptBigrams.some(function (bg) { return bg.split(" ").indexOf(t) !== -1; });
      if (inBigram) return;
      keywords.push({ term: t, weight: 1 + Math.min(uniFreq[t] - 2, 4) * 0.3, isSkill: false });
    });

    keywords.sort(function (x, y) { return y.weight - x.weight; });
    return keywords.slice(0, 30);
  }

  function resumeHas(term, resumeJoined, resumeTokenSet) {
    var norm = normalize(term);
    if (norm.indexOf(" ") !== -1) return phraseIn(resumeJoined, norm);
    return resumeTokenSet.has(norm) || resumeTokenSet.has(singular(norm)) || resumeTokenSet.has(norm + "s");
  }

  /* ------------------------------------------------------------ ATS checks */

  function runChecks(rawResume, wordCount) {
    var lower = rawResume.toLowerCase();
    var checks = [];

    var hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(rawResume);
    var hasPhone = /(\+?\d[\d\s().-]{7,}\d)/.test(rawResume);
    checks.push({
      label: "Contact info (email & phone)",
      pass: hasEmail && hasPhone,
      tip: hasEmail && hasPhone ? "Recruiters can reach you. Good."
        : "Add " + (!hasEmail ? "an email address" : "a phone number") + " near the top — ATS parsers look for it there."
    });

    var sectionGroups = [/\b(work|professional)?\s*experience\b|\bemployment history\b/, /\beducation\b/, /\bskills\b/, /\b(summary|objective|profile)\b/, /\b(projects|certifications|licenses)\b/];
    var sectionsFound = sectionGroups.filter(function (re) { return re.test(lower); }).length;
    checks.push({
      label: "Standard section headings",
      pass: sectionsFound >= 3,
      tip: sectionsFound >= 3 ? "ATS parsers recognize your sections."
        : "Only " + sectionsFound + " standard headings found. Use conventional names: Summary, Experience, Education, Skills."
    });

    var yearMatches = (rawResume.match(/\b(19|20)\d{2}\b/g) || []).length;
    checks.push({
      label: "Employment dates",
      pass: yearMatches >= 2,
      tip: yearMatches >= 2 ? "Dates detected — parsers can build your timeline."
        : "Few or no years detected. Every role needs a date range (e.g. 2021 – 2024) or the ATS may drop it."
    });

    checks.push({
      label: "Resume length",
      pass: wordCount >= 350 && wordCount <= 900,
      tip: wordCount < 350 ? "Only " + wordCount + " words — likely too thin to rank. Aim for 400–800."
        : wordCount > 900 ? wordCount + " words — likely over 2 pages. Cut to the most relevant 400–800."
        : wordCount + " words — in the sweet spot."
    });

    var quantified = (rawResume.match(/\d+(\.\d+)?\s*%|\$\s?[\d,]+|[\d,]+\+?\s*(users|customers|clients|people|employees|students|patients|projects|accounts|leads|downloads|views|units|orders|tickets|calls)\b/gi) || []).length;
    checks.push({
      label: "Quantified achievements",
      pass: quantified >= 3,
      tip: quantified >= 3 ? quantified + " measurable results found — this is what interviews are made of."
        : "Only " + quantified + " measurable results (%, $, counts). Add numbers: “increased X by 40%”, “managed $2M budget”, “served 50+ clients”."
    });

    var lines = rawResume.split(/\n/).map(function (l) { return l.replace(/^[\s•·▪‣*+-]+/, "").trim(); }).filter(Boolean);
    var verbStarts = lines.filter(function (l) {
      var first = (l.split(/\s+/)[0] || "").toLowerCase().replace(/[^a-z]/g, "");
      return ACTION_VERBS.has(first);
    }).length;
    checks.push({
      label: "Action verbs",
      pass: verbStarts >= 5,
      tip: verbStarts >= 5 ? verbStarts + " bullets start with strong action verbs."
        : "Only " + verbStarts + " bullets start with action verbs. Start each bullet with Led / Built / Increased / Delivered — not “Was responsible for”."
    });

    var weakFound = WEAK_PHRASES.filter(function (p) { return lower.indexOf(p) !== -1; });
    checks.push({
      label: "No weak phrases",
      pass: weakFound.length === 0,
      tip: weakFound.length === 0 ? "No clichés detected."
        : "Found: “" + weakFound.join("”, “") + "”. Replace clichés with specific accomplishments."
    });

    var pronouns = (rawResume.match(/\b(i|me|my)\b/gi) || []).length;
    checks.push({
      label: "No first-person pronouns",
      pass: pronouns <= 3,
      tip: pronouns <= 3 ? "Reads in professional resume voice."
        : pronouns + " uses of I/me/my. Resumes use implied first person: “Led a team of 5”, not “I led a team of 5”."
    });

    return checks;
  }

  /* --------------------------------------------------------------- scoring */

  function analyze(resumeRaw, jdRaw) {
    var resumeToks = tokenize(resumeRaw);
    var resumeJoined = " " + resumeToks.join(" ") + " ";
    var resumeSet = new Set(resumeToks.map(singular).concat(resumeToks));

    var keywords = extractKeywords(jdRaw);
    var matched = [], missing = [];
    keywords.forEach(function (k) {
      (resumeHas(k.term, resumeJoined, resumeSet) ? matched : missing).push(k);
    });

    var totalW = keywords.reduce(function (s, k) { return s + k.weight; }, 0) || 1;
    var matchedW = matched.reduce(function (s, k) { return s + k.weight; }, 0);
    var coverage = matchedW / totalW;

    var wordCount = resumeToks.length;
    var checks = runChecks(resumeRaw, wordCount);
    var checksPassed = checks.filter(function (c) { return c.pass; }).length;

    var score = Math.round(coverage * 80 + (checksPassed / checks.length) * 20);
    score = Math.max(0, Math.min(100, score));

    return { score: score, keywords: keywords, matched: matched, missing: missing, checks: checks, checksPassed: checksPassed, wordCount: wordCount };
  }

  function band(score) {
    if (score >= 80) return { label: "Strong match", color: "var(--good)", summary: "You're in the top tier for this posting. Fix any remaining red flags below and apply with confidence." };
    if (score >= 60) return { label: "Fair match", color: "var(--warning)", summary: "Close, but an ATS may rank others above you. Add the missing keywords that are true of you and re-check." };
    if (score >= 40) return { label: "Below average", color: "var(--serious)", summary: "Your resume isn't speaking this posting's language yet. Work the missing keywords into your bullets and skills." };
    return { label: "Low match", color: "var(--critical)", summary: "As written, an ATS will likely filter this out. Tailor your resume to this posting before applying — or reconsider fit." };
  }

  /* -------------------------------------------------------------- gauge UI */

  var GAUGE_R = 84, GAUGE_CX = 100, GAUGE_CY = 102;
  var GAUGE_LEN = Math.PI * GAUGE_R;

  function gaugeArc() {
    return "M " + (GAUGE_CX - GAUGE_R) + " " + GAUGE_CY + " A " + GAUGE_R + " " + GAUGE_R + " 0 0 1 " + (GAUGE_CX + GAUGE_R) + " " + GAUGE_CY;
  }

  function renderGauge(score, color) {
    var track = document.getElementById("gauge-track");
    var fill = document.getElementById("gauge-fill");
    track.setAttribute("d", gaugeArc());
    fill.setAttribute("d", gaugeArc());
    fill.setAttribute("stroke", color);
    fill.setAttribute("stroke-dasharray", String(GAUGE_LEN));
    fill.setAttribute("stroke-dashoffset", String(GAUGE_LEN));
    // force layout so the transition animates from 0
    fill.getBoundingClientRect();
    fill.setAttribute("stroke-dashoffset", String(GAUGE_LEN * (1 - score / 100)));
  }

  /* ----------------------------------------------------------- results UI */

  var isPro = false;
  var lastResult = null;
  var FREE_MISSING = 3, FREE_CHECKS = 2;

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }

  function chip(term, kind, mask) {
    var c = el("span", "chip " + kind, mask ? term.replace(/[a-z0-9]/gi, "x") : term);
    return c;
  }

  function checkItem(check, mask) {
    var li = document.createElement("li");
    var icon = el("span", "check-icon " + (mask ? "" : check.pass ? "pass" : "fail"), mask ? "?" : check.pass ? "✓" : "✕");
    var body = el("div");
    body.appendChild(el("div", null, check.label));
    body.appendChild(el("div", "check-tip", mask ? "Unlock Pro to see this result and how to fix it." : check.tip));
    li.appendChild(icon);
    li.appendChild(body);
    return li;
  }

  function render(result) {
    lastResult = result;
    var b = band(result.score);

    document.getElementById("results").hidden = false;
    document.getElementById("score-value").textContent = result.score;
    document.getElementById("band-label").textContent = b.label;
    document.getElementById("band-dot").style.background = b.color;
    document.getElementById("score-summary").textContent = b.summary;
    renderGauge(result.score, b.color);

    document.getElementById("stat-keywords").textContent = result.matched.length + " / " + result.keywords.length;
    document.getElementById("stat-keywords-detail").textContent = "of the keywords this posting emphasizes";
    document.getElementById("stat-checks").textContent = result.checksPassed + " / " + result.checks.length;
    document.getElementById("stat-checks-detail").textContent = "formatting checks passed";
    document.getElementById("stat-words").textContent = result.wordCount.toLocaleString();
    document.getElementById("stat-words-detail").textContent = result.wordCount >= 350 && result.wordCount <= 900 ? "words — good length" : "words — see length check below";

    // matched keywords: always fully visible (generosity builds trust)
    var matchedRow = document.getElementById("matched-list");
    matchedRow.textContent = "";
    if (result.matched.length === 0) matchedRow.appendChild(el("p", "hint", "None yet — your resume shares no key terms with this posting."));
    result.matched.forEach(function (k) { matchedRow.appendChild(chip(k.term, "matched")); });

    // missing keywords: free sees top 3, pro sees all
    var freeRow = document.getElementById("missing-free");
    var proRow = document.getElementById("missing-pro");
    var lockedBlock = document.getElementById("missing-locked");
    var blurRow = document.getElementById("missing-blur");
    freeRow.textContent = ""; proRow.textContent = ""; blurRow.textContent = "";

    if (result.missing.length === 0) {
      freeRow.appendChild(el("p", "hint", "Nothing missing — every key term in the posting appears in your resume. 🎉"));
      lockedBlock.hidden = true; proRow.hidden = true;
    } else if (isPro) {
      lockedBlock.hidden = true; proRow.hidden = false;
      result.missing.forEach(function (k) { proRow.appendChild(chip(k.term, "missing")); });
    } else {
      result.missing.slice(0, FREE_MISSING).forEach(function (k) { freeRow.appendChild(chip(k.term, "missing")); });
      var rest = result.missing.slice(FREE_MISSING);
      proRow.hidden = true;
      if (rest.length > 0) {
        lockedBlock.hidden = false;
        // masked chips: layout-honest, but the real terms are never in the DOM
        rest.forEach(function (k) { blurRow.appendChild(chip(k.term, "missing", true)); });
        document.getElementById("missing-locked-count").textContent = rest.length;
      } else {
        lockedBlock.hidden = true;
      }
    }

    // checks: free sees first 2, pro sees all
    var checksFree = document.getElementById("checks-free");
    var checksPro = document.getElementById("checks-pro");
    var checksLocked = document.getElementById("checks-locked");
    var checksBlur = document.getElementById("checks-blur");
    checksFree.textContent = ""; checksPro.textContent = ""; checksBlur.textContent = "";

    if (isPro) {
      checksLocked.hidden = true; checksPro.hidden = false;
      result.checks.forEach(function (c) { checksPro.appendChild(checkItem(c)); });
      checksFree.hidden = true;
    } else {
      checksFree.hidden = false; checksPro.hidden = true; checksLocked.hidden = false;
      result.checks.slice(0, FREE_CHECKS).forEach(function (c) { checksFree.appendChild(checkItem(c)); });
      result.checks.slice(FREE_CHECKS).forEach(function (c) { checksBlur.appendChild(checkItem(c, true)); });
      document.getElementById("checks-locked-count").textContent = result.checks.length - FREE_CHECKS;
    }

    // tailoring checklist (pro only)
    var tCard = document.getElementById("tailoring-card");
    var tList = document.getElementById("tailoring-list");
    tList.textContent = "";
    if (isPro) {
      tCard.hidden = false;
      buildChecklist(result).forEach(function (item) { tList.appendChild(el("li", null, item)); });
    } else {
      tCard.hidden = true;
    }

    document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildChecklist(result) {
    var items = [];
    result.missing.slice(0, 6).forEach(function (k) {
      items.push("Work “" + k.term + "” into a Skills entry or an experience bullet — only if it's genuinely true of you." + (k.isSkill ? " This is a named skill the posting asks for, so it carries extra weight." : ""));
    });
    result.checks.filter(function (c) { return !c.pass; }).forEach(function (c) {
      items.push(c.label + ": " + c.tip);
    });
    if (items.length === 0) items.push("Nothing left to fix — this resume is well tailored. Apply!");
    items.push("Re-run the check after editing. Aim for 80+ before you submit.");
    return items;
  }

  /* ---------------------------------------------------------------- report */

  function buildReport(r) {
    var lines = [];
    var b = band(r.score);
    lines.push("JOBFIT — ATS MATCH REPORT");
    lines.push("");
    lines.push("Match score: " + r.score + "/100 (" + b.label + ")");
    lines.push("Keywords matched: " + r.matched.length + " of " + r.keywords.length);
    lines.push("ATS checks passed: " + r.checksPassed + " of " + r.checks.length);
    lines.push("Resume length: " + r.wordCount + " words");
    lines.push("");
    lines.push("MISSING KEYWORDS (add where true of you)");
    lines.push(r.missing.length ? r.missing.map(function (k) { return "  + " + k.term; }).join("\n") : "  (none)");
    lines.push("");
    lines.push("MATCHED KEYWORDS");
    lines.push(r.matched.length ? r.matched.map(function (k) { return "  ✓ " + k.term; }).join("\n") : "  (none)");
    lines.push("");
    lines.push("ATS CHECKS");
    r.checks.forEach(function (c) {
      lines.push("  " + (c.pass ? "[PASS]" : "[FIX ]") + " " + c.label);
      lines.push("         " + c.tip);
    });
    lines.push("");
    lines.push("TAILORING CHECKLIST");
    buildChecklist(r).forEach(function (item, i) { lines.push("  " + (i + 1) + ". " + item); });
    lines.push("");
    lines.push("Generated locally in your browser by JobFit. Nothing was uploaded.");
    return lines.join("\n");
  }

  function downloadReport() {
    if (!lastResult) return;
    var blob = new Blob([buildReport(lastResult)], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jobfit-report.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ------------------------------------------------------ pro / licensing */

  var LS_KEY = "jobfit_license";

  function setPro(on) {
    isPro = on;
    document.body.classList.toggle("pro", on);
    document.getElementById("nav-unlock").textContent = on ? "Pro ✓" : "Enter license key";
    if (lastResult) render(lastResult);
  }

  function verifyLicense(key) {
    var body = new URLSearchParams();
    if (cfg.gumroadProductId) body.set("product_id", cfg.gumroadProductId);
    else body.set("product_permalink", cfg.gumroadProductPermalink || "");
    body.set("license_key", key);
    return fetch("https://api.gumroad.com/v2/licenses/verify", { method: "POST", body: body })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        if (r.data && r.data.success && r.data.purchase && !r.data.purchase.refunded && !r.data.purchase.chargebacked) return true;
        var msg = (r.data && r.data.message) || "That license key doesn't look valid.";
        var err = new Error(msg); err.rejected = true; throw err;
      });
  }

  function openModal() {
    document.getElementById("unlock-modal").hidden = false;
    document.getElementById("license-input").focus();
  }
  function closeModal() {
    document.getElementById("unlock-modal").hidden = true;
    document.getElementById("verify-status").textContent = "";
    document.getElementById("verify-status").className = "verify-status";
  }

  function handleVerifyClick() {
    var key = document.getElementById("license-input").value.trim();
    var status = document.getElementById("verify-status");
    if (!key) { status.textContent = "Paste the license key from your Gumroad receipt email."; status.className = "verify-status err"; return; }
    status.textContent = "Checking…"; status.className = "verify-status";
    verifyLicense(key).then(function () {
      localStorage.setItem(LS_KEY, key);
      status.textContent = "✓ Pro unlocked. Enjoy!"; status.className = "verify-status ok";
      setPro(true);
      setTimeout(closeModal, 1200);
    }).catch(function (e) {
      status.textContent = e.rejected ? e.message : "Couldn't reach the license server — check your connection and try again.";
      status.className = "verify-status err";
    });
  }

  function restoreLicense() {
    var key = localStorage.getItem(LS_KEY);
    if (!key) return;
    setPro(true); // optimistic — don't punish offline users
    verifyLicense(key).catch(function (e) {
      if (e.rejected) { localStorage.removeItem(LS_KEY); setPro(false); }
    });
  }

  /* ------------------------------------------------------------ sample data */

  var SAMPLE_RESUME = "ALEX RIVERA\nSan Diego, CA • alex.rivera@email.com • (619) 555-0142\n\nSUMMARY\nMarketing coordinator with 3 years of experience running email campaigns and social media for consumer brands.\n\nEXPERIENCE\nMarketing Coordinator — Brightwave Co. (2022 – Present)\n- Managed email marketing calendar and sent 12 campaigns per month in Mailchimp\n- Grew Instagram following from 8,000 to 31,000 in 14 months\n- Wrote copy for landing pages and product launches\n- Coordinated with designers on creative assets\n\nMarketing Assistant — Sunline Retail (2021 – 2022)\n- Scheduled social media posts across 4 platforms\n- Compiled weekly performance reports in Excel\n- Supported event planning for 6 trade shows\n\nEDUCATION\nB.A. Communications, San Diego State University (2021)\n\nSKILLS\nMailchimp, Canva, Excel, Instagram, TikTok, copywriting",
      SAMPLE_JD = "Digital Marketing Specialist\n\nWe're looking for a data-driven digital marketing specialist to own our paid and organic growth channels.\n\nResponsibilities:\n- Plan and execute digital marketing campaigns across email marketing, SEO, and paid social\n- Manage Google Ads and Meta Ads budgets and report on ROAS\n- Use Google Analytics to analyze funnel performance and run A/B testing on landing pages\n- Own SEO strategy including keyword research and content marketing\n- Build automated workflows in HubSpot and manage the CRM\n- Present campaign results and KPIs to leadership monthly\n\nRequirements:\n- 2+ years in digital marketing\n- Hands-on experience with Google Analytics, Google Ads, and SEO tools\n- Experience with marketing automation (HubSpot preferred)\n- Strong analytical skills and comfort with A/B testing\n- Excellent copywriting and communication skills";

  /* ----------------------------------------------------------------- wiring */

  function applyConfig() {
    document.querySelectorAll(".price-slot").forEach(function (n) { n.textContent = cfg.priceLabel || "$9"; });
    var buy = document.getElementById("buy-link");
    buy.href = cfg.gumroadProductUrl || "#";
    if (!cfg.gumroadProductUrl || cfg.gumroadProductUrl.indexOf("REPLACE_ME") !== -1) {
      buy.textContent = "⚠ Owner: set your Gumroad link in assets/config.js";
    }
  }

  function initTheme() {
    var saved = localStorage.getItem("jobfit_theme");
    var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.getElementById("theme-toggle").addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("jobfit_theme", next);
    });
  }

  function wordCounter(textarea, counter) {
    textarea.addEventListener("input", function () {
      var n = tokenize(textarea.value).length;
      counter.textContent = n.toLocaleString() + " words";
    });
  }

  function init() {
    applyConfig();
    initTheme();
    restoreLicense();

    var resumeInput = document.getElementById("resume-input");
    var jdInput = document.getElementById("jd-input");
    wordCounter(resumeInput, document.getElementById("resume-count"));
    wordCounter(jdInput, document.getElementById("jd-count"));

    document.getElementById("load-sample").addEventListener("click", function () {
      resumeInput.value = SAMPLE_RESUME;
      jdInput.value = SAMPLE_JD;
      resumeInput.dispatchEvent(new Event("input"));
      jdInput.dispatchEvent(new Event("input"));
    });

    document.getElementById("analyze-btn").addEventListener("click", function () {
      var resume = resumeInput.value.trim();
      var jd = jdInput.value.trim();
      if (resume.length < 100) { alert("Paste your full resume text first (it looks too short)."); return; }
      if (jd.length < 100) { alert("Paste the full job description (it looks too short)."); return; }
      render(analyze(resume, jd));
    });

    document.getElementById("export-btn").addEventListener("click", downloadReport);
    document.getElementById("nav-unlock").addEventListener("click", openModal);
    document.querySelectorAll(".unlock-cta").forEach(function (b) { b.addEventListener("click", openModal); });
    document.querySelector(".modal-close").addEventListener("click", closeModal);
    document.getElementById("unlock-modal").addEventListener("click", function (e) {
      if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById("verify-btn").addEventListener("click", handleVerifyClick);
    document.getElementById("license-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleVerifyClick();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
