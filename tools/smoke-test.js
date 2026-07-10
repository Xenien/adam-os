/* Smoke test: serves the site, drives the core flow in headless Chromium,
 * asserts the free gate and Pro views work, and fails on any console error.
 *
 * Usage:  npm i playwright-core --no-save && node tools/smoke-test.js
 * Assumes a Chromium at /opt/pw-browsers (Claude Code remote env) or set
 * CHROMIUM_PATH. Starts its own static server on :8901.
 */
const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = '/opt/pw-browsers';
  for (const dir of fs.readdirSync(base)) {
    const p = path.join(base, dir, 'chrome-linux');
    if (fs.existsSync(path.join(p, 'headless_shell'))) return path.join(p, 'headless_shell');
    if (fs.existsSync(path.join(p, 'chrome'))) return path.join(p, 'chrome');
  }
  throw new Error('No Chromium found; set CHROMIUM_PATH');
}

const server = http.createServer((req, res) => {
  const file = path.join(ROOT, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

function assert(cond, msg) {
  if (!cond) { console.error('FAIL: ' + msg); process.exitCode = 1; }
  else console.log('ok: ' + msg);
}

(async () => {
  await new Promise(r => server.listen(8901, r));
  const browser = await chromium.launch({ executablePath: findChromium() });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    // Third-party scripts (Google tag, pdf.js CDN, Gumroad) may be unreachable
    // in sandboxed test environments — their load failures are not app bugs.
    const src = (m.location() && m.location().url) || '';
    if (/googletagmanager|googleadservices|google-analytics|cdnjs\.cloudflare|gumroad/.test(src)) return;
    errors.push(m.text());
  });

  // free flow
  await page.goto('http://localhost:8901/index.html');
  await page.click('#load-sample');
  await page.click('#analyze-btn');
  await page.waitForSelector('#results:not([hidden])');
  const score = parseInt(await page.textContent('#score-value'), 10);
  assert(score >= 0 && score <= 100, 'score in range (' + score + ')');
  assert((await page.$$('#missing-free .chip')).length === 3, 'free tier shows exactly 3 missing keywords');
  assert(await page.isVisible('#missing-locked .lock-overlay'), 'paywall overlay visible for free users');
  assert(await page.isVisible('#score-projection'), 'score projection line visible for free users');
  const projTo = parseInt((await page.textContent('#proj-to')).replace(/[^0-9]/g, ''), 10);
  assert(projTo > score, 'projected score (' + projTo + ') exceeds current score (' + score + ')');
  assert(!(await page.isVisible('#rewrites-card')), 'rewrites hidden for free users');
  assert(await page.isVisible('#aiprompt-locked'), 'AI prompt teaser locked for free users');
  assert(!(await page.isVisible('#jd-quality-note')), 'no JD quality note for a full-length posting');

  // JD quality guard: a short JD warns but does not block the analysis
  await page.fill('#jd-input', 'We are hiring a digital marketing specialist with experience in email marketing, seo, google analytics and copywriting. Apply today to join our marketing team in San Diego.');
  await page.click('#analyze-btn');
  await page.waitForSelector('#results:not([hidden])');
  assert(await page.isVisible('#jd-quality-note'), 'short JD shows quality note without blocking analysis');

  // pro flow (simulated unlock)
  await page.evaluate(() => localStorage.setItem('jobfit_license', 'TEST'));
  await page.reload();
  await page.click('#load-sample');
  await page.click('#analyze-btn');
  await page.waitForSelector('#results:not([hidden])');
  assert((await page.$$('#missing-pro .chip')).length > 3, 'pro sees all missing keywords');
  assert((await page.$$('#checks-pro li')).length === 8, 'pro sees all 8 checks');
  assert(await page.isVisible('#rewrites-card'), 'pro sees rewrite patterns');
  assert(await page.isVisible('#bonuses-card'), 'pro sees bonuses');
  assert(await page.isVisible('#print-btn'), 'pro sees print/PDF button');
  assert(await page.isVisible('#aiprompt-pro'), 'pro sees AI rewrite prompt');
  const promptText = await page.textContent('#aiprompt-text');
  assert(promptText.includes('NEVER invent') && promptText.includes('=== MY CURRENT RESUME ==='), 'AI prompt contains guardrails and resume');

  // cheat sheet page loads
  const resp = await page.goto('http://localhost:8901/cheatsheet.html');
  assert(resp.status() === 200, 'cheatsheet.html serves');

  assert(errors.length === 0, 'no console/page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));

  await browser.close();
  server.close();
  console.log(process.exitCode ? 'SMOKE TEST FAILED' : 'SMOKE TEST PASSED');
})().catch(e => { console.error('FAILED:', e); process.exit(1); });
