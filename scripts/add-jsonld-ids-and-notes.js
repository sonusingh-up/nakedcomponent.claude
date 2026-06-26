#!/usr/bin/env node
/**
 * add-jsonld-ids-and-notes.js
 *
 * For the 21 review HTML files that have Review JSON-LD:
 *   1. Add @id linking between JSON-LD schemas (Review, BreadcrumbList, FAQPage)
 *   2. Add positiveNotes and negativeNotes to Review JSON-LD
 *
 * Skips 4 files without Review JSON-LD:
 *   - gnc-pro-performance-creatine.html
 *   - bigmuscles-premium-gold-whey-review.html
 *   - wellbeing-slow-melts-d3-k2-review.html
 *   - nakpro-gold-whey-review.html
 */

const fs = require('fs');
const path = require('path');

// Files to skip (no Review JSON-LD)
const SKIP_FILES = new Set([
  'gnc-pro-performance-creatine.html',
  'bigmuscles-premium-gold-whey-review.html',
  'wellbeing-slow-melts-d3-k2-review.html',
  'nakpro-gold-whey-review.html'
]);

// Pros and cons for each review file (keyed by filename)
const REVIEW_NOTES = {
  'pure-nutrition-ksm66-ashwagandha-review.html': {
    positiveNotes: [
      'Root-only KSM-66 extract with 5% withanolide standardisation',
      'Clean ingredient list — no fillers, no magnesium stearate',
      'HPMC vegetable capsule suitable for vegetarians and vegans',
      '24+ published clinical trials on the KSM-66 extract specifically',
      'Competitive India pricing at ₹11.7 per capsule'
    ],
    negativeNotes: [
      '500mg dose is 100mg below the 600mg peak-studied RCT protocol',
      'No published third-party batch COA on the brand website',
      'No Trustified or Unbox Health verification at time of review'
    ]
  },

  'as-it-is-one-creatine-monohydrate-review.html': {
    positiveNotes: [
      'Single ingredient — 100% pure micronized creatine monohydrate',
      'Labdoor certified for label accuracy and purity',
      'Trustified QR batch authentication on every pouch',
      'Best value certified creatine in India at ₹2.2–2.6 per gram',
      'Zero additives, fillers, or artificial ingredients'
    ],
    negativeNotes: [
      '3g scoop sits below the 5g/day clinical maintenance dose',
      'Raw material source not disclosed — not Creapure',
      'No per-batch COA publicly posted',
      'Not enrolled in Informed Sport or NSF for competitive athletes'
    ]
  },

  'kapiva-get-slim-juice-review.html': {
    positiveNotes: [
      'FSSAI licensed manufacturing facility',
      'Recognisable Ayurvedic ingredient list (Garcinia, Amla, Triphala)',
      'Accessible juice format for first-time supplement buyers'
    ],
    negativeNotes: [
      'No per-ingredient doses disclosed — proprietary blend',
      'Juice format cannot deliver clinical doses of any active ingredient',
      'Weight-loss claims not supported at the doses plausibly present',
      'No published third-party COA for heavy metals or contaminants'
    ]
  },

  'pure-encapsulations-magnesium-glycinate-review.html': {
    positiveNotes: [
      'Only 3 ingredients — no fillers, flow agents, or magnesium oxide',
      'True bisglycinate chelate with 23.5% bioavailability',
      'NSF certified, GMP manufactured, third-party tested',
      'Glycine co-delivery provides independent calming and sleep benefit',
      'Perfect 10/10 label honesty score — fully transparent'
    ],
    negativeNotes: [
      'Most expensive magnesium in India at ₹132–144 per day',
      '120mg elemental per capsule requires 2–3 caps for therapeutic dose',
      'No India-specific NABL or Trustified verification of imported product'
    ]
  },

  'hk-vitals-multivitamin-review.html': {
    positiveNotes: [
      'Broad coverage of vitamins A through K plus 10 minerals',
      'Best value multivitamin in India at ₹399 for 60 tablets',
      'Includes Ginseng and Taurine for energy support',
      'Widely available across Amazon, Flipkart, and HealthKart'
    ],
    negativeNotes: [
      'Vitamin D is D2 (ergocalciferol) not the superior D3 form',
      'B12 is cyanocobalamin at only 1mcg — below ICMR RDA',
      'Magnesium dose is essentially homeopathic — trace amount only',
      'Iron at 100% RDA is a flag for adult men and postmenopausal women'
    ]
  },

  'solgar-vm75-review.html': {
    positiveNotes: [
      'Therapeutic 75mg B-vitamin complex — clinically meaningful doses',
      'Chelated bisglycinate mineral forms for better absorption',
      'Natural D-alpha tocopheryl Vitamin E (not synthetic DL-alpha)',
      '75mcg B12 compensates for the cyanocobalamin form',
      '75+ year brand history with strong manufacturing standards'
    ],
    negativeNotes: [
      'Vitamin D is D2 at 400 IU — insufficient for most Indian adults',
      'Import pricing at ₹42–47 per day is 6–7x domestic alternatives',
      'Cyanocobalamin B12 form rather than the preferred methylcobalamin'
    ]
  },

  'carbamide-forte-omega3-triple-strength-review.html': {
    positiveNotes: [
      'Strong EPA+DHA dose at 900mg per softgel (550 EPA + 350 DHA)',
      'Enteric-coated softgel reduces fishy burps',
      'Competitive India pricing at ₹799 for 60 softgels',
      'FSSAI licensed domestic brand'
    ],
    negativeNotes: [
      'No IFOS certification or published TOTOX oxidation data',
      'No publicly available third-party COA for purity',
      'Oil form (triglyceride vs ethyl ester) not disclosed on label',
      'No cold-chain guarantee during Indian summer shipping'
    ]
  },

  'himalayan-organics-plant-omega-3-6-9-review.html': {
    positiveNotes: [
      'Vegan-friendly — plant-based capsules from flaxseed oil',
      'Affordable at ₹599 for 60 capsules',
      'FSSAI licensed manufacturing'
    ],
    negativeNotes: [
      'Contains only ALA — zero EPA and zero DHA',
      'ALA-to-DHA conversion in adults is under 1%',
      'Label claims cardiovascular and brain benefits that require EPA/DHA',
      'No third-party COA or certification published'
    ]
  },

  'nordic-naturals-ultimate-omega-review.html': {
    positiveNotes: [
      'Best-in-class 650mg EPA + 450mg DHA per 2-softgel serving',
      'Re-esterified triglyceride form with 70% better absorption than EE',
      'GOED-compliant third-party testing with COA available on request',
      'Wild-caught anchovies and sardines, Friend of the Sea certified',
      'Clean ingredient list with natural lemon flavour'
    ],
    negativeNotes: [
      'Import price makes it ₹95 per serving in India — 4x domestic cost',
      'Not IFOS enrolled — uses own COA programme instead',
      'Batch COAs not publicly posted by default — must request them'
    ]
  },

  'solgar-triple-strength-omega3-950mg-review.html': {
    positiveNotes: [
      'Strong per-softgel dose of 504mg EPA + 378mg DHA',
      'Molecular distillation for heavy metal and PCB removal',
      'GOED-compliant purity standards',
      '75-year Solgar brand history with consistent quality controls'
    ],
    negativeNotes: [
      'Ethyl ester form — 27% lower absorption than rTG competitors',
      'Marketing describes it as "natural triglyceride form" which is misleading',
      'India import price at ₹140 per serving is very expensive',
      'No publicly posted per-batch COA available'
    ]
  },

  'pure-encapsulations-vitamin-d3-vegan-review.html': {
    positiveNotes: [
      'Lichen-sourced D3 (cholecalciferol) — genuinely vegan',
      'NSF Contents Certified for potency and purity',
      'Hypoallergenic — only 2 excipients, zero common allergens',
      'Cholecalciferol form is superior to ergocalciferol (D2)',
      'Lot-traceable manufacturing in NSF-registered US facility'
    ],
    negativeNotes: [
      'Fixed 1,000 IU dose is below the corrective range for most Indian adults',
      'Import price premium is significant vs domestic D3 options',
      'Not vegan-certified by an external body — relies on brand claim'
    ]
  },

  'thorne-vitamin-d-k2-review.html': {
    positiveNotes: [
      'NSF Contents Certified with only 4 ingredients total',
      'Flexible liquid dosing in 500 IU increments via metered dropper',
      'MCT oil carrier enhances fat-soluble vitamin absorption',
      'D3 + K2 synergy for calcium metabolism and bone health',
      '600 two-drop servings per bottle — exceptional value per dose'
    ],
    negativeNotes: [
      'K2 form is MK-4 with only 1–2 hour serum half-life, not MK-7',
      'MK-4 provides less consistent daily K2 exposure than MK-7',
      'Import-only availability in India at ₹3,500–5,000 per bottle'
    ]
  },

  'dymatize-iso100-hydrolyzed-whey-review.html': {
    positiveNotes: [
      'NSF Certified for Sport — gold-standard anti-doping certification',
      'Hydrolyzed whey isolate — fastest absorbing whey form',
      '25g protein per 32g scoop at 78% protein by weight',
      'Informed Choice certified with per-batch banned substance testing'
    ],
    negativeNotes: [
      'India import price at ₹56 per gram of protein — 6x domestic options',
      'Contains artificial flavours and sucralose',
      'Hydrolysis processing advantage over WPI is marginal for most users',
      'Counterfeiting risk when buying from unverified Amazon India sellers'
    ]
  },

  'muscleblaze-biozyme-performance-whey-review.html': {
    positiveNotes: [
      '25g protein per 33g serving — 75.8% protein by weight',
      'DigeSEB enzyme blend reduces GI discomfort in lactose-sensitive users',
      'Competitive India pricing for a branded domestic whey',
      'Widely available with strong Indian distribution'
    ],
    negativeNotes: [
      'Enzyme efficacy claims are overstated beyond clinical evidence',
      'Whey concentrate base — not isolate despite premium positioning',
      'Label honesty score of 6/10 — marketing exceeds formulation reality',
      'No independent third-party blind-purchase verification published'
    ]
  },

  'myprotein-impact-whey-isolate-review.html': {
    positiveNotes: [
      'Labdoor 2022 test confirmed label accuracy (20.65g vs 20g claimed)',
      'Clean amino acid profile with no spiking detected',
      'Competitive India pricing at ₹4–5 per gram of protein',
      'Broad flavour range with frequent sales and discounts'
    ],
    negativeNotes: [
      '"90%+ protein" headline claim does not hold under independent testing',
      'Protein per serving is only 20g — lower than most WPI competitors',
      'No India-specific third-party testing or Trustified verification',
      'Sweetened with sucralose in most flavoured variants'
    ]
  },

  'nakpro-platinum-whey-isolate-review.html': {
    positiveNotes: [
      '31g protein per 34g scoop (unflavoured) — 91.2% protein by weight',
      'Trustified Eurofins pass from April 2023 — independently verified',
      'Cross-flow microfiltrated imported whey with no amino spiking',
      'Best value verified WPI in India at ₹7.3–8.0 per gram of protein',
      'Bengaluru-made with strong domestic manufacturing controls'
    ],
    negativeNotes: [
      'Confusing product lineup — multiple Nakpro SKUs easy to mix up',
      'Flavoured variants have lower protein per scoop (28g vs 31g)',
      'No NSF or Informed Choice certification for competitive athletes'
    ]
  },

  'nutrabay-gold-whey-isolate-review.html': {
    positiveNotes: [
      '25g WPI per 30g scoop — clean protein-to-powder ratio',
      'Trustified Eurofins blind-purchase verification (November 2024)',
      'No amino spiking, no fillers, no added sugar',
      'Cross-flow microfiltered WPI at ₹9.6 per gram of protein',
      'Active independent certification with batch traceability'
    ],
    negativeNotes: [
      'Higher cost than Nakpro Platinum for similar protein purity',
      'Flavour range is limited compared to larger brands',
      'No NSF Certified for Sport for WADA-governed athletes'
    ]
  },

  'on-gold-standard-whey-review.html': {
    positiveNotes: [
      'Unbox Health A+ on label accuracy, toxicity, and nutrition',
      'Informed Choice UK anti-doping certification',
      'Made in India since 2023 in Himachal Pradesh',
      '24g protein from WPI-primary blend with no free amino additions',
      'Global benchmark product with over a billion servings sold'
    ],
    negativeNotes: [
      'Aggressive counterfeiting on Amazon.in — must verify seller carefully',
      'Whey blend (isolate + concentrate + hydrolysate) not pure isolate',
      'Price premium over domestically verified alternatives like Nakpro',
      'Flavoured variants contain artificial sweeteners and colours'
    ]
  },

  'transparent-labs-grass-fed-whey-isolate-review.html': {
    positiveNotes: [
      '28g protein per 33g scoop — 88% purity by weight',
      'Informed Choice and Informed Protein dual certification',
      'Publicly posted per-batch COAs with Labdoor 98/100 accuracy',
      'No artificial sweeteners, flavours, dyes, or fillers',
      '2.8g leucine per serving at the mTORC1 activation threshold'
    ],
    negativeNotes: [
      'Import price is the highest in the category for Indian buyers',
      'Grass-fed claim adds cost without proven nutritional advantage',
      'Limited availability in India — primarily via iHerb or direct import'
    ]
  },

  'ultimate-nutrition-iso-sensation-93-review.html': {
    positiveNotes: [
      'IsoChill ultra-low temperature WPI preserves bioactive proteins',
      'Cross-flow microfiltrated processing retains IgG and lactoferrin',
      'Technically premium whey isolate manufacturing process'
    ],
    negativeNotes: [
      '30g protein claim includes nitrogen from Glutamine Complex, not all whey',
      'SI Complex (Colostrum + Enzyme blend) has thin evidence at these doses',
      'Price per gram of actual whey isolate is one of the highest reviewed',
      'Brand has had inconsistent India distribution and SKU availability'
    ]
  },

  'wellbeing-nutrition-whey-protein-isolate-review.html': {
    positiveNotes: [
      '31g protein per 30g scoop (unflavoured) — impressive protein ratio',
      'Cross-flow microfiltration with native whey sourcing',
      'Added probiotics (4B CFU) with disclosed strains',
      'Digestive enzymes for GI comfort'
    ],
    negativeNotes: [
      'No NDTL or third-party blind-purchase testing result published',
      'Premium pricing not fully justified without independent verification',
      'Native whey sourcing claims difficult to independently verify',
      'Relatively new entrant with limited track record in the WPI category'
    ]
  }
};

// ─── Main processing ─────────────────────────────────────────────────────────

const reviewsDir = path.join(__dirname, '..', 'project', 'reviews');

function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

function extractCanonicalPath(html) {
  const match = html.match(/<link\s+rel="canonical"\s+href="(https:\/\/www\.nakedcompound\.in\/[^"]+)"/);
  if (!match) return null;
  // Return just the path part
  try {
    const url = new URL(match[1]);
    return url.pathname.replace(/\/$/, ''); // remove trailing slash
  } catch {
    return null;
  }
}

function extractCanonicalUrl(html) {
  const match = html.match(/<link\s+rel="canonical"\s+href="(https:\/\/www\.nakedcompound\.in\/[^"]+)"/);
  return match ? match[1] : null;
}

function processFile(filePath) {
  const fileName = path.basename(filePath);

  // Skip files without Review JSON-LD
  if (SKIP_FILES.has(fileName)) {
    console.log(`  SKIP: ${fileName} (no Review JSON-LD)`);
    return;
  }

  // Check if we have notes data for this file
  const notes = REVIEW_NOTES[fileName];
  if (!notes) {
    console.log(`  WARN: No notes data for ${fileName} — skipping`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf-8');
  const canonicalUrl = extractCanonicalUrl(html);
  const canonicalPath = extractCanonicalPath(html);

  if (!canonicalUrl || !canonicalPath) {
    console.log(`  WARN: No canonical URL found in ${fileName} — skipping`);
    return;
  }

  const baseUrl = 'https://www.nakedcompound.in' + canonicalPath;

  // Find all JSON-LD blocks
  const jsonLdRegex = /<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g;
  let match;
  const blocks = [];

  while ((match = jsonLdRegex.exec(html)) !== null) {
    blocks.push({
      fullMatch: match[0],
      json: match[1],
      index: match.index
    });
  }

  if (blocks.length === 0) {
    console.log(`  WARN: No JSON-LD blocks found in ${fileName}`);
    return;
  }

  let modified = html;
  let changeCount = 0;

  // Process blocks in reverse order to preserve indices
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i];
    let parsed;
    try {
      parsed = JSON.parse(block.json);
    } catch (e) {
      console.log(`  WARN: Failed to parse JSON-LD block ${i} in ${fileName}: ${e.message}`);
      continue;
    }

    const schemaType = parsed['@type'];

    if (schemaType === 'Review') {
      // Add @id
      if (!parsed['@id']) {
        parsed['@id'] = baseUrl + '#review';
      }

      // Add positiveNotes and negativeNotes after reviewRating
      if (!parsed.positiveNotes && notes.positiveNotes) {
        parsed.positiveNotes = {
          '@type': 'ItemList',
          itemListElement: notes.positiveNotes.map((note, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: note
          }))
        };
      }

      if (!parsed.negativeNotes && notes.negativeNotes) {
        parsed.negativeNotes = {
          '@type': 'ItemList',
          itemListElement: notes.negativeNotes.map((note, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: note
          }))
        };
      }
      changeCount++;

    } else if (schemaType === 'BreadcrumbList') {
      if (!parsed['@id']) {
        parsed['@id'] = baseUrl + '#breadcrumb';
        changeCount++;
      }

    } else if (schemaType === 'FAQPage') {
      if (!parsed['@id']) {
        parsed['@id'] = baseUrl + '#faq';
        changeCount++;
      }
    }

    // Rebuild the JSON-LD block with proper formatting
    // We need to reconstruct the JSON with @id placed right after @type
    let newJson;
    if (schemaType === 'Review') {
      // Build the Review object with specific key ordering
      const ordered = buildOrderedReview(parsed);
      newJson = JSON.stringify(ordered, null, 4);
    } else {
      newJson = JSON.stringify(parsed, null, 4);
    }

    const newBlock = `<script type="application/ld+json">\n  ${newJson.split('\n').join('\n  ')}\n  </script>`;

    modified = modified.substring(0, block.index) + newBlock + modified.substring(block.index + block.fullMatch.length);
  }

  if (changeCount > 0) {
    fs.writeFileSync(filePath, modified, 'utf-8');
    console.log(`  OK: ${fileName} — ${changeCount} JSON-LD block(s) updated`);
  } else {
    console.log(`  OK: ${fileName} — no changes needed (already has @id and notes)`);
  }
}

/**
 * Build a Review object with the desired key order:
 * @context, @type, @id, name, description/reviewBody, reviewRating, positiveNotes, negativeNotes, author, ...
 */
function buildOrderedReview(parsed) {
  const ordered = {};

  // First keys
  if (parsed['@context']) ordered['@context'] = parsed['@context'];
  if (parsed['@type']) ordered['@type'] = parsed['@type'];
  if (parsed['@id']) ordered['@id'] = parsed['@id'];

  // Name and description
  if (parsed.name) ordered.name = parsed.name;
  if (parsed.description) ordered.description = parsed.description;
  if (parsed.reviewBody) ordered.reviewBody = parsed.reviewBody;

  // Rating
  if (parsed.reviewRating) ordered.reviewRating = parsed.reviewRating;

  // positiveNotes and negativeNotes after reviewRating
  if (parsed.positiveNotes) ordered.positiveNotes = parsed.positiveNotes;
  if (parsed.negativeNotes) ordered.negativeNotes = parsed.negativeNotes;

  // Remaining keys
  for (const key of Object.keys(parsed)) {
    if (!ordered.hasOwnProperty(key)) {
      ordered[key] = parsed[key];
    }
  }

  return ordered;
}

// ─── Run ──────────────────────────────────────────────────────────────────────

console.log('Adding @id and positiveNotes/negativeNotes to review JSON-LD schemas...\n');

const files = findHtmlFiles(reviewsDir);
console.log(`Found ${files.length} HTML files in ${reviewsDir}\n`);

for (const file of files.sort()) {
  processFile(file);
}

console.log('\nDone.');
