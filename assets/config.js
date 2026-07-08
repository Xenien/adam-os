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
  gumroadProductUrl: "https://gumroad.com/l/REPLACE_ME",

  // Used to verify license keys. Set ONE of these two (leave the other ""):
  gumroadProductId: "",          // e.g. "AbCdEfGhIjKlMnOp=="
  gumroadProductPermalink: "REPLACE_ME", // e.g. "jobfit" (the slug after /l/)

  priceLabel: "$9",
};
