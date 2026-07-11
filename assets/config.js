/*
 * JobFit configuration — the ONE file you must edit before launch.
 *
 * 1. Create a product on Gumroad (https://gumroad.com) — type: "Digital product",
 *    price $9, and ENABLE "Generate a unique license key per sale" in the
 *    product's settings.
 * 2. Paste your product's short URL below (e.g. https://adam.gumroad.com/l/jobfit).
 * 3. Paste the product ID below. Find it in the Gumroad product edit page URL or
 *    via Settings → Advanced → it is shown as "product_id" in the API section.
 *    (For license verification Gumroad accepts the product's permalink slug via
 *    the `product_permalink` field too — set whichever you have.)
 */
window.JOBFIT_CONFIG = {
  // Where the "Unlock Pro" button sends buyers:
  gumroadProductUrl: "https://hafezian22.gumroad.com/l/rarpyh",

  // Used to verify license keys. Set ONE of these two (leave the other ""):
  gumroadProductId: "DFaI5f05y26lcHdVh30PcA==",
  gumroadProductPermalink: "",

  priceLabel: "$29",

  // Optional: your Gumroad $0 lead-magnet product URL (captures emails).
  // Until set, the cheat sheet link points at the local cheatsheet.html page.
  leadMagnetUrl: "https://hafezian22.gumroad.com/l/pfkhle",

  // Optional $9 downsell: a separate Gumroad product ("AI Resume Rewrite
  // Prompt only", $9, license keys ON). Leave blank to hide the downsell
  // offer entirely. Fill both to activate.
  downsellProductUrl: "",
  downsellProductId: "",
  downsellPriceLabel: "$9",
};
