/* ============================================================
   Brand flagship content packs  (id -> editorial content)
   Consumed by scripts/build-brand-pages.js. Structure, scores,
   verdict colour, flags and testingBody come from BRANDS_DB;
   this file holds the human-written editorial copy + catalogue.
   ============================================================ */
module.exports = {

  // ───────────────────────── NOW Foods ─────────────────────────
  'now-foods': {
    metaDesc: "Independent NOW Foods brand profile. NC Trust Score 7.8/10, Recommended. NSF GMP-registered, with the broadest verified vitamin, mineral and omega-3 range in India's import segment — standout value on D3 and fish oil.",
    ogDesc: "NC Trust Score 7.8/10. NSF GMP-registered imports with the broadest verified vitamin and omega-3 range — D3 5,000 IU and real EPA+DHA fish oil are the standout buys.",
    kicker: "The broadest GMP-tested vitamin, mineral and omega-3 range in India's import segment. Buy it for the range and the standout-value D3 and fish oil — just source it from a reputable importer.",
    thesis: "NOW Foods is the most reliable broad-range vitamin and wellness brand in India's import segment: NSF GMP-registered manufacturing, correct well-absorbed forms, and a decades-long track record. Its Vitamin D3 5,000 IU and a true EPA+DHA fish oil are genuine value standouts. The only real caveats are imported pricing on commodity vitamins and the grey-market risk that comes with any imported supplement.",
    metaChips: [
      { label: "Updated May 2026", ok: true },
      { label: "NSF GMP-registered", ok: true },
      { label: "USA · est. 1968", ok: false },
      { label: "Imports · buy authorised", ok: false },
    ],
    keyrow: [
      { k: "Buy it for", v: "A broad, GMP-tested vitamin & omega range" },
      { k: "Standout", v: "D3 5,000 IU and true EPA+DHA fish oil" },
      { k: "Keep in mind", v: "Imported — buy authorised, check expiry" },
    ],
    glance: [
      { k: "Founded", v: "1968 · Bloomingdale, IL, USA" },
      { k: "Category focus", v: "Vitamins, minerals, omega-3, herbs" },
      { k: "Best for", v: "A broad, correctly-formulated wellness range" },
      { k: "Watch for", v: "Grey-market imports — check the sticker & expiry" },
      { k: "Testing", v: "NSF GMP-registered · in-house + external labs" },
      { k: "Where to buy", v: "Authorised NOW India distributor · reputable importers" },
    ],
    scorecardLead: "Every brand in our database is scored on the same five dimensions, each out of 10, using the same rubric. NOW scores evenly across the board — its GMP testing and correct formulations carry it.",
    scoreWhys: {
      labelAccuracy: "NSF GMP manufacturing and a long clean record; assays match labels, with COAs available on request.",
      dosing: "Correct, well-absorbed forms at sensible doses across vitamins, minerals and omega-3.",
      fssai: "Import-compliant and sold through distributors — a notch below domestic licensing transparency.",
      thirdParty: "NSF GMP registration plus in-house and external verification; COAs on request rather than published per batch.",
      value: "Strong for an import — D3 and fish oil are genuine bargains — though commodity vitamins beat it on price domestically.",
    },
    testing: {
      paras: [
        "NOW Foods runs one of the more credible quality operations among imported brands: its facilities are <strong>NSF GMP-registered</strong>, it operates extensive in-house laboratories, and it backs that with external verification. Certificates of analysis are <strong>available on request</strong> rather than published per batch, but the testing infrastructure behind them is real and long-established.",
        "The caveat for Indian buyers isn't the lab — it's the <strong>supply chain</strong>. Imported tubs can be grey-marketed or sold close to expiry. Buy through the authorised NOW India distributor or a reputable importer's storefront, check the import sticker and best-before date, and treat unusually cheap listings with suspicion.",
      ],
      chips: ["FSSAI import compliant", "NSF GMP registered", "In-house + external labs", "COAs on request"],
    },
    rangeLead: "The core NOW Foods catalogue sold in India, grouped by use-case. Each tag is a positioning note, not a separate score, and the one-line take flags both the use and the catch. Prices are last-checked estimates — confirm on Amazon before buying.",
    cats: [
      { name: "Vitamins", items: [
        { name: "Vitamin D3 5,000 IU", unit: "240 softgels", price: 1199, pn: "months per tub", tag: "Best value", star: true, note: "India's deficiency burden makes high-dose D3 one of the best-value imports here. Correct cholecalciferol, and a huge softgel count per tub. Match the dose to a blood test.", q: "now+foods+vitamin+d3+5000" },
        { name: "Vitamin C-1000", unit: "250 tablets", price: 1299, pn: "sustained release", tag: "Immune", note: "1,000 mg sustained-release C with rose hips. Sensible dosing; vitamin C is cheap, so judge it on count-per-rupee.", q: "now+foods+vitamin+c+1000" },
        { name: "B-50 Complex", unit: "100 capsules", price: 1099, pn: "balanced B", tag: "Energy / B", note: "A balanced B-complex at generous doses. Useful for vegetarians and high-stress periods; the bright-yellow urine is just excess riboflavin.", q: "now+foods+b+50+complex" },
        { name: "Vitamin E-400", unit: "100 softgels", price: 1199, pn: "natural d-alpha", tag: "Antioxidant", note: "Natural d-alpha tocopherol, the better-absorbed form. A niche supplement for most people; fine if you specifically need it.", q: "now+foods+vitamin+e+400" },
      ]},
      { name: "Minerals", items: [
        { name: "Zinc Gluconate 50 mg", unit: "250 tablets", price: 899, pn: "pair with copper", tag: "Immune", note: "Well-dosed elemental zinc. Don't run 50 mg long-term without copper — it can deplete it; cycle or pair accordingly.", q: "now+foods+zinc+gluconate" },
        { name: "Magnesium Citrate", unit: "250 tablets", price: 1399, pn: "well absorbed", tag: "Sleep / cramps", note: "Citrate form absorbs well and helps sleep and cramps. Start low — citrate can loosen stools at higher doses.", q: "now+foods+magnesium+citrate" },
        { name: "Calcium & Magnesium", unit: "250 tablets", price: 1299, pn: "with D", tag: "Bone", note: "A balanced Cal-Mag with vitamin D. Reasonable for bone support, though food sources should come first.", q: "now+foods+calcium+magnesium" },
        { name: "Iron 18 mg", unit: "120 capsules", price: 799, pn: "gentle bisglycinate", tag: "Deficiency", note: "Gentle iron bisglycinate, easier on the gut than ferrous sulphate. Only supplement iron if a blood test says you need it.", q: "now+foods+iron+bisglycinate" },
      ]},
      { name: "Omega & Essential Fats", items: [
        { name: "Omega-3 1,000 mg", unit: "200 softgels", price: 1299, pn: "180 EPA / 120 DHA", tag: "EPA + DHA", star: true, note: "Real EPA+DHA (180/120 per softgel), molecularly distilled — not ALA. Among the best omega-3 values in the import segment.", q: "now+foods+omega+3+fish+oil" },
        { name: "Super Omega 3-6-9", unit: "180 softgels", price: 1499, pn: "diet covers 6 & 9", tag: "Blend", note: "A 3-6-9 blend — but most people already get plenty of 6 and 9 from diet. A straight EPA/DHA fish oil is usually the smarter buy.", q: "now+foods+super+omega+3+6+9" },
      ]},
      { name: "Herbs & Wellness", items: [
        { name: "Ashwagandha", unit: "90 capsules", price: 999, pn: "standardised root", tag: "Adaptogen", note: "Standardised root extract for stress. Competently made, though domestic KSM-66 options can cost less for a comparable standardised dose.", q: "now+foods+ashwagandha" },
        { name: "Melatonin 3 mg", unit: "180 capsules", price: 699, pn: "sensible dose", tag: "Sleep", note: "A sensible 3 mg dose — closer to what the evidence supports than the 10 mg tablets many brands sell. Good for jet lag and sleep timing.", q: "now+foods+melatonin+3mg" },
        { name: "L-Theanine 200 mg", unit: "60 capsules", price: 999, pn: "pairs with caffeine", tag: "Calm focus", note: "Pairs well with caffeine for calm, jitter-free focus. A legitimate, well-tolerated nootropic at a sensible dose.", q: "now+foods+l+theanine" },
        { name: "Tribulus", unit: "90 capsules", price: 1099, pn: "claims overstated", tag: "Overhyped", note: "Marketed for testosterone, but the evidence for that claim is weak. Buy only if you want it for libido anecdotes, not hormonal effects.", q: "now+foods+tribulus" },
      ]},
    ],
    buybox: {
      text: "<strong>Buy authorised — imported NOW Foods is sometimes grey-marketed.</strong> Use the official NOW India distributor or a reputable importer's Amazon storefront, and check the import sticker and expiry date. We don't publish discount codes we can't verify — check the official store for any live offer.",
      amazon: "https://www.amazon.in/s?k=now+foods",
      directUrl: "https://www.nowfoods.com/",
      directLabel: "Buy from NOW Foods",
    },
    pros: [
      "NSF GMP-registered manufacturing — a credible global quality standard",
      "The broadest verified vitamin, mineral and herb range in India's import segment",
      "Standout value items: D3 5,000 IU and a true EPA+DHA fish oil",
      "Correct, well-absorbed forms (bisglycinate iron, citrate magnesium, natural E)",
      "Decades-long track record with COAs available on request",
    ],
    cons: [
      "Imported pricing runs above domestic equivalents on commodity vitamins",
      "Grey-market and expiry risk — buy only from reputable importers",
      "A few range items (Tribulus, 3-6-9) are low-evidence or redundant",
      "COAs are 'on request' rather than published per batch",
    ],
    audience: {
      good: "Want a broad, GMP-certified range of correctly-formulated vitamins, minerals and omega-3 from a brand with a long track record — and you'll source it from a reputable importer.",
      bad: "Only need one or two basics (a domestic D3 or fish oil is cheaper), or you can't verify the import is genuine and in-date.",
    },
    compareLead: "Against the vitamin-and-wellness field, NOW leads the import segment on range and verification; domestic brands compete on price for single items.",
    compare: [
      { name: "NOW Foods", score: 7.8, tier: "Recommended", why: "Broadest verified import range; GMP-tested; standout D3 & fish oil", self: true },
      { name: "Unived", slug: "unived", score: 7.6, tier: "Recommended", why: "Best vegan-certified domestic range; algae omega-3" },
      { name: "Carbamide Forte", slug: "carbamide-forte", score: 6.8, tier: "Acceptable", why: "Best rupee-per-dose value; no public COA" },
      { name: "HK Vitals", slug: "hk-vitals", score: 6.4, tier: "Acceptable", why: "Budget range; base multivitamin uses D2, not D3" },
    ],
    faq: [
      { q: "Is NOW Foods Vitamin D3 5,000 IU too high a dose?", a: "For India's high deficiency burden, 5,000 IU is a common corrective dose, but it's best matched to a blood test. Many people maintain on less; check your 25-OH-D level and pair long-term D3 with vitamin K2." },
      { q: "Is NOW Foods third-party tested?", a: "NOW's facilities are NSF GMP-registered with extensive in-house and external testing, and COAs are available on request. It's a credible standard, though not published per-batch like some Indian brands." },
      { q: "How do I avoid fake or expired NOW Foods in India?", a: "Buy from the authorised NOW India distributor or a reputable importer's official storefront, check the import sticker and expiry date, and avoid unusually cheap third-party listings." },
      { q: "Is NOW Foods fish oil real EPA+DHA or just 'fish oil'?", a: "It provides actual EPA and DHA (roughly 180/120 per softgel), molecularly distilled — not ALA. Compare the EPA/DHA split, not the headline mg, when judging any fish oil." },
      { q: "NOW Foods or a domestic brand for vitamins?", a: "NOW offers the broadest verified range and standout value on D3 and fish oil. For single commodity vitamins a domestic brand is usually cheaper; for a wide, correctly-formulated range, NOW is hard to beat in the import segment." },
    ],
    verdict: "NOW Foods is the most reliable broad-range vitamin and wellness brand in India's import segment — GMP-tested, correctly formulated, and genuinely good value on D3 and fish oil. Buy it for the range and the standout items, source it from a reputable importer, and skip the few low-evidence products.",
    altsLead: "Want a domestic option, a vegan-certified range, or a cheaper price on basics? These brands are where we'd point you next.",
    alternatives: [
      { slug: "unived", name: "Unived", score: 7.6, why: "India's best vegan-certified range — algae omega-3 and correctly-formed D3+K2, with domestic pricing and no import worries." },
      { slug: "carbamide-forte", name: "Carbamide Forte", score: 6.8, why: "The best rupee-per-dose value in domestic vitamins, if you'll accept that it doesn't publish independent COAs." },
      { slug: "steadfast", name: "Steadfast Nutrition", score: 7.6, why: "Clean-label, clinically-positioned Indian brand with batch COAs across sports and wellness." },
    ],
  },

  // ───────────────────────── Unived ─────────────────────────
  'unived': {
    metaDesc: "Independent Unived brand profile. NC Trust Score 7.6/10, Recommended. India's best vegan-certified supplement brand — algae-sourced EPA+DHA and correctly-formed D3+K2, NABL-tested.",
    ogDesc: "NC Trust Score 7.6/10. India's best vegan supplement brand: algae omega-3 (real EPA+DHA, not flax ALA) and correct-form D3+K2, at domestic prices.",
    kicker: "India's best vegan-certified supplement brand. Algae-sourced EPA+DHA — the clinically correct omega-3 for vegetarians, not flaxseed ALA — and correctly-formed D3+K2.",
    thesis: "Unived is the brand we point vegetarians and vegans to first. Its edge isn't a louder testing claim — it's getting the vegan chemistry right: algae-sourced EPA+DHA instead of flax ALA, methylcobalamin B12, and lichen-derived D3 with K2. It's FSSAI-licensed, vegan-certified and NABL-tested, with transparent sourcing. You pay a premium over generic plant supplements, but that's the cost of correct forms.",
    metaChips: [
      { label: "Updated May 2026", ok: true },
      { label: "Vegan-certified · NABL-tested", ok: true },
      { label: "India · Bengaluru · est. 2014", ok: false },
      { label: "Plant-based · Wellness", ok: false },
    ],
    keyrow: [
      { k: "Buy it for", v: "Genuinely vegan, correctly-formed essentials" },
      { k: "Standout", v: "Algae EPA+DHA + correct-form D3+K2" },
      { k: "Keep in mind", v: "Premium vs generic; small protein range" },
    ],
    glance: [
      { k: "Founded", v: "2014 · Bengaluru, India" },
      { k: "Category focus", v: "Vegan vitamins, algae omega-3, minerals, protein" },
      { k: "Best for", v: "Vegetarians & vegans who want correct forms" },
      { k: "Watch for", v: "Premium pricing vs generic plant supplements" },
      { k: "Testing", v: "NABL-accredited labs · transparent sourcing" },
      { k: "Where to buy", v: "Official Amazon.in store & brand website" },
    ],
    scorecardLead: "Every brand in our database is scored on the same five dimensions, each out of 10, using the same rubric. Unived's strength is getting the vegan forms right; value is where the premium shows.",
    scoreWhys: {
      labelAccuracy: "Clean, accurate vegan labels with disclosed sourcing; NABL testing backs the claims.",
      dosing: "Correct, clinically-relevant forms and doses — real EPA+DHA, methyl-B12, D3+K2.",
      fssai: "Fully licensed with a vegan-certified, transparent-sourcing product line.",
      thirdParty: "NABL-accredited lab testing with supplier disclosure; not an independent blind-purchase programme.",
      value: "Fair for certified vegan formulations, though you pay a premium over generic plant supplements.",
    },
    testing: {
      paras: [
        "Unived's edge isn't a louder testing claim — it's <strong>getting the vegan chemistry right</strong>. It uses <strong>NABL-accredited lab testing</strong> with transparent supplier disclosure, and, crucially, the correct clinically-relevant forms: algae-sourced EPA+DHA rather than flax ALA, methylcobalamin B12, and lichen-derived D3 with K2. For a plant-based buyer, form matters as much as purity.",
        "The honest limitation is the <strong>kind</strong> of testing: NABL lab reports with supplier disclosure are solid, but this isn't an independently-initiated blind-purchase programme like the one behind AS-IT-IS. Treat the verification as good-but-brand-led, and check the report for the specific product.",
      ],
      chips: ["FSSAI licensed", "Vegan certified", "NABL-accredited testing", "Transparent sourcing"],
    },
    rangeLead: "The core Unived catalogue, grouped by use-case. Each tag is a positioning note, not a separate score, and the one-line take flags both the use and the catch. Prices are last-checked estimates — confirm on Amazon before buying.",
    cats: [
      { name: "Vitamins & Essentials", items: [
        { name: "Vegan D3 + K2", unit: "60 capsules", price: 899, pn: "lichen D3 + MK-7", tag: "Correct forms", star: true, note: "Lichen-derived vegan D3 with K2 (MK-7) — the correct pairing, in genuinely vegan form. One of the better-value items in the range.", q: "unived+vitamin+d3+k2+vegan" },
        { name: "Methylcobalamin B12", unit: "60 capsules", price: 699, pn: "active form", tag: "Vegan essential", note: "The active methyl form of B12 — a non-negotiable for vegans. Correctly chosen and adequately dosed.", q: "unived+b12+methylcobalamin" },
        { name: "Daily Vegan Multivitamin", unit: "60 capsules", price: 999, pn: "covers vegan gaps", tag: "Daily base", note: "A plant-based daily multi covering the common vegan gaps (B12, D, iron, zinc). A sensible floor, not a performance product.", q: "unived+vegan+multivitamin" },
        { name: "Algae Omega-3 EPA+DHA", unit: "60 capsules", price: 1299, pn: "not flax ALA", tag: "EPA + DHA", star: true, note: "The product that defines the brand: algae-sourced EPA+DHA, the form vegetarians actually need. Flax/ALA products don't convert efficiently — this does the job properly.", q: "unived+vegan+omega+3+algae" },
      ]},
      { name: "Minerals", items: [
        { name: "Plant-based Iron", unit: "60 capsules", price: 699, pn: "with vitamin C", tag: "Gentle iron", note: "A gentle, plant-based iron with vitamin C for absorption. Only supplement iron if a blood test indicates a need.", q: "unived+plant+iron" },
        { name: "Magnesium Bisglycinate", unit: "60 capsules", price: 799, pn: "well absorbed", tag: "Sleep / cramps", note: "The well-absorbed, gut-friendly bisglycinate form. A good evening choice for sleep and cramps.", q: "unived+magnesium+bisglycinate" },
        { name: "Vegan Calcium", unit: "60 capsules", price: 799, pn: "with D + K2", tag: "Bone", note: "Plant-sourced calcium with D and K2 for bone support. Useful for vegans with low dietary calcium; food first where possible.", q: "unived+vegan+calcium" },
      ]},
      { name: "Sports & Endurance", items: [
        { name: "Vegan Plant Protein", unit: "500 g", price: 1199, pn: "pea + rice", tag: "Vegan protein", note: "A pea/brown-rice blend with a complete amino profile. A legitimate vegan protein; the per-gram cost runs above dairy whey.", q: "unived+vegan+plant+protein" },
        { name: "Elemental Electrolytes", unit: "30 servings", price: 699, pn: "low sugar", tag: "Hydration", note: "A sugar-light electrolyte mix aimed at runners. Sensible electrolyte ratios; useful for long sessions in Indian heat.", q: "unived+electrolytes" },
      ]},
      { name: "Herbs & Wellness", items: [
        { name: "Ashwagandha", unit: "60 capsules", price: 599, pn: "standardised", tag: "Adaptogen", note: "Standardised ashwagandha for stress and sleep. Competently made; verify the standardisation matches a clinical dose.", q: "unived+ashwagandha" },
        { name: "L-Theanine", unit: "60 capsules", price: 699, pn: "pairs with caffeine", tag: "Calm focus", note: "Pairs with caffeine for calm, jitter-free focus. A well-tolerated, evidence-backed nootropic.", q: "unived+l+theanine" },
        { name: "Melatonin", unit: "60 tablets", price: 499, pn: "lowest effective dose", tag: "Sleep", note: "For shifting sleep timing (jet lag, shift work). Start at the lowest effective dose to avoid next-day grogginess.", q: "unived+melatonin" },
      ]},
    ],
    buybox: {
      text: "<strong>Where to buy authentic stock:</strong> use Unived's official Amazon.in storefront or brand website, and check the product's NABL report. We don't publish discount codes we can't verify — check the official store for any live offer.",
      amazon: "https://www.amazon.in/s?k=unived",
      directUrl: "https://www.unived.in/",
      directLabel: "Buy direct from Unived",
    },
    pros: [
      "Algae-sourced EPA+DHA — the clinically correct vegan omega-3, not flax ALA",
      "Correct vegan forms throughout (methyl-B12, lichen D3 + K2, bisglycinate magnesium)",
      "FSSAI licensed and vegan-certified with transparent supplier disclosure",
      "NABL-accredited testing across the range",
      "Genuinely plant-based — credible for strict vegetarians and vegans",
    ],
    cons: [
      "Premium pricing versus generic plant supplements",
      "Protein / sports range is small next to dedicated protein brands",
      "Testing is brand-led NABL, not independent blind-purchase",
      "Niche availability compared with mass-market brands",
    ],
    audience: {
      good: "Are vegetarian or vegan and want supplements in the correct, clinically-relevant forms — especially algae omega-3 and D3+K2 — from a genuinely plant-based, FSSAI-licensed brand.",
      bad: "Aren't fussed about vegan sourcing and just want the lowest price, or you need a large dedicated sports and protein range.",
    },
    compareLead: "Among India's wellness brands, Unived is the vegan benchmark — correct forms and certification that generic plant-supplement sellers don't match.",
    compare: [
      { name: "NOW Foods", slug: "now-foods", score: 7.8, tier: "Recommended", why: "Broadest verified import range; GMP-tested" },
      { name: "Unived", score: 7.6, tier: "Recommended", why: "Best vegan-certified range; algae EPA+DHA, correct D3+K2", self: true },
      { name: "Carbamide Forte", slug: "carbamide-forte", score: 6.8, tier: "Acceptable", why: "Budget value; no public COA" },
      { name: "Himalayan Organics", slug: "himalayan-organics", score: 4.8, tier: "Flagged", why: "ALA-only 'omega-3' marketed like fish oil; misleading" },
    ],
    faq: [
      { q: "Is Unived's omega-3 better than flaxseed omega-3?", a: "Yes, for most people. Unived uses algae-sourced EPA and DHA — the forms the body actually uses. Flaxseed provides ALA, which converts to EPA at under ~10% in most people, so algae omega-3 is the clinically smarter vegan choice." },
      { q: "Is Unived genuinely vegan?", a: "Yes. The range is vegan-certified, using lichen-derived D3, algae omega-3 and plant-based capsules, with transparent supplier disclosure. It's one of the few Indian brands you can take at face value on vegan claims." },
      { q: "Is Unived third-party tested?", a: "Unived uses NABL-accredited lab testing with supplier disclosure. That's solid verification, though it's brand-led rather than an independent blind-purchase programme — check the report for the specific product." },
      { q: "Is Unived worth the premium over generic plant supplements?", a: "If you care about correct forms and genuine vegan certification, yes. Generic plant supplements are cheaper but often use ALA omega-3, cyano-B12 or unverified extracts. You're paying for getting the chemistry right." },
      { q: "Unived or NOW Foods?", a: "Unived is the better choice for strict vegans and for algae omega-3 and D3+K2; NOW offers a broader overall range. For a plant-based buyer, Unived's correct forms win; for sheer breadth, NOW leads." },
    ],
    verdict: "Unived is the brand we point vegetarians and vegans to first. It gets the things that matter right — algae EPA+DHA, methyl-B12, lichen D3 with K2 — and certifies them honestly. You pay a premium over generic plant supplements, but you're paying for correct forms and genuine vegan sourcing, which is exactly where cheap alternatives cut corners.",
    altsLead: "Not vegan-specific, or want a broader range or lower price? These brands are where we'd send you next.",
    alternatives: [
      { slug: "now-foods", name: "NOW Foods", score: 7.8, why: "The broadest GMP-tested vitamin and omega range if you don't need strictly vegan sourcing." },
      { slug: "steadfast", name: "Steadfast Nutrition", score: 7.6, why: "Clean-label, clinically-positioned Indian brand with batch COAs across sports and wellness." },
      { slug: "carbamide-forte", name: "Carbamide Forte", score: 6.8, why: "The best rupee-per-dose value in domestic vitamins, if you'll accept no published COA." },
    ],
  },

  // ───────────────────────── Steadfast Nutrition ─────────────────────────
  'steadfast': {
    metaDesc: "Independent Steadfast Nutrition brand profile. NC Trust Score 7.6/10, Recommended. Clean-label, clinically-positioned Indian sports brand with per-batch NABL COAs. Sachet formats are pricey per gram.",
    ogDesc: "NC Trust Score 7.6/10. Clean-label Indian sports-nutrition brand with batch COAs and genuine clinical positioning — the sachet format just costs more per gram.",
    kicker: "A clean-label Indian sports brand with genuine clinical positioning and per-batch COAs. The trade-off is format: convenient sachets cost more per gram than tubs.",
    thesis: "Steadfast is a clean, credible sports brand that does the unglamorous things right: accurate labels, per-batch certificates of analysis from NABL labs, and a genuinely useful endurance line. The trade-off is value — its sachets and clinical-grade formats cost noticeably more per gram than bulk tubs. It's best for athletes who prize convenience, clean labels and transparency over the lowest possible price.",
    metaChips: [
      { label: "Updated May 2026", ok: true },
      { label: "Batch COAs · NABL", ok: true },
      { label: "India · New Delhi · est. 2017", ok: false },
      { label: "Sports · Endurance · Wellness", ok: false },
    ],
    keyrow: [
      { k: "Buy it for", v: "Clean-label sports nutrition with batch COAs" },
      { k: "Standout", v: "Per-batch COAs + clinical positioning" },
      { k: "Keep in mind", v: "Sachet formats cost more per gram" },
    ],
    glance: [
      { k: "Founded", v: "2017 · New Delhi, India" },
      { k: "Category focus", v: "Whey, endurance, electrolytes, vitamins" },
      { k: "Best for", v: "Athletes wanting clean labels & travel formats" },
      { k: "Watch for", v: "Sachets are convenient but pricey per gram" },
      { k: "Testing", v: "NABL labs · per-batch COAs published" },
      { k: "Where to buy", v: "Official Amazon.in store & brand website" },
    ],
    scorecardLead: "Every brand in our database is scored on the same five dimensions, each out of 10, using the same rubric. Steadfast scores well on compliance and clean labelling; value takes the hit from premium formats.",
    scoreWhys: {
      labelAccuracy: "Clean, accurate labels backed by per-batch COAs — what's printed is what's tested.",
      dosing: "Sensible, clinically-oriented doses across the sports and wellness range.",
      fssai: "Fully licensed with strong compliance and a clinical-grade positioning.",
      thirdParty: "Brand-commissioned NABL testing with COAs published per batch — solid, but not independently initiated.",
      value: "Fair for clean-label sports nutrition; sachet and clinical formats cost more per gram than bulk tubs.",
    },
    testing: {
      paras: [
        "Steadfast leans into a <strong>clinical-grade</strong> positioning and backs it where it counts: clean, accurate labels and <strong>certificates of analysis published per batch</strong> from NABL laboratories. For a sports brand, publishing batch COAs at all puts it ahead of most of the acceptable tier.",
        "The qualifier is independence: the COAs are <strong>brand-commissioned</strong> rather than independently-initiated blind-purchase tests. That's a meaningful step below the AS-IT-IS / Trustified model, but a clear step above brands that publish nothing. Check the batch COA for the product you're buying.",
      ],
      chips: ["FSSAI licensed", "NABL lab testing", "Per-batch COAs", "Clean-label formulas"],
    },
    rangeLead: "The core Steadfast catalogue, grouped by use-case. Each tag is a positioning note, not a separate score, and the one-line take flags both the use and the catch. Prices are last-checked estimates — confirm on Amazon before buying.",
    cats: [
      { name: "Proteins & Gainers", items: [
        { name: "Whey Protein (25 sachets)", unit: "25 × 33 g", price: 2499, pn: "single-serve", tag: "Travel format", star: true, note: "Single-serve sachets are genuinely convenient for travel and portion control — but you pay clearly more per gram than a tub. Clean label, batch-tested.", q: "steadfast+nutrition+whey+protein+sachets" },
        { name: "Whey Isolate", unit: "1 kg", price: 3199, pn: "~90% protein", tag: "Isolate", note: "A clean isolate at ~90% protein. Priced toward the premium end; the per-batch COA is the reassurance you're paying for.", q: "steadfast+nutrition+whey+isolate" },
        { name: "Plant Protein", unit: "500 g", price: 1499, pn: "pea + rice", tag: "Vegan", note: "A pea/rice vegan blend with a clean label. Reasonable, though dedicated vegan brands compete hard on price.", q: "steadfast+nutrition+plant+protein" },
      ]},
      { name: "Performance & Endurance", items: [
        { name: "Creatine Monohydrate", unit: "250 g", price: 699, pn: "correct form", tag: "Monohydrate", note: "Plain monohydrate, the right form. Fairly priced, though raw-focused brands undercut it per serving.", q: "steadfast+nutrition+creatine" },
        { name: "Intra-Workout EAA", unit: "250 g", price: 1399, pn: "all 9 essentials", tag: "Full spectrum", note: "All nine essentials for intra-workout use — the more complete choice than BCAAs, if you use an amino at all.", q: "steadfast+nutrition+eaa" },
        { name: "Hydra Electrolyte", unit: "30 servings", price: 799, pn: "low sugar", tag: "Endurance", star: true, note: "A sensibly-dosed, low-sugar electrolyte for endurance and Indian heat. One of the more useful products in the range.", q: "steadfast+nutrition+electrolyte" },
        { name: "Energy Gel", unit: "box of 10", price: 999, pn: "race-day fuel", tag: "Endurance fuel", note: "Carb gels for long runs and rides. Useful race-day fuel; check the carb and caffeine content against your needs.", q: "steadfast+nutrition+energy+gel" },
      ]},
      { name: "Vitamins & Minerals", items: [
        { name: "Magnesium Glycinate", unit: "60 capsules", price: 999, pn: "well absorbed", tag: "Sleep / cramps", note: "The well-absorbed glycinate form for sleep and cramps. A good evening choice, with a clean label.", q: "steadfast+nutrition+magnesium" },
        { name: "Daily Multivitamin", unit: "60 tablets", price: 899, pn: "uses D3", tag: "Daily base", note: "A sports-oriented multivitamin — a sensible base, not a performance aid. Check it uses D3, not D2.", q: "steadfast+nutrition+multivitamin" },
        { name: "Vitamin D3", unit: "60 capsules", price: 499, pn: "cholecalciferol", tag: "Deficiency", note: "Correct D3 form for India's deficiency burden. Effective; a generic D3 delivers the same molecule for less.", q: "steadfast+nutrition+vitamin+d3" },
      ]},
      { name: "Wellness", items: [
        { name: "Omega-3 Fish Oil", unit: "60 softgels", price: 899, pn: "check EPA/DHA", tag: "EPA + DHA", note: "Provides real EPA+DHA. Compare the per-softgel split rather than the total fish-oil mg.", q: "steadfast+nutrition+omega+3" },
        { name: "Marine Collagen", unit: "200 g", price: 1499, pn: "not a muscle protein", tag: "Joints & skin", note: "Hydrolysed marine collagen for skin and joints. Promising but modest evidence; not a muscle-building protein.", q: "steadfast+nutrition+collagen" },
      ]},
    ],
    buybox: {
      text: "<strong>Where to buy authentic stock:</strong> use Steadfast's official Amazon.in storefront or brand website, and check the per-batch COA for the product. We don't publish discount codes we can't verify — check the official store for any live offer.",
      amazon: "https://www.amazon.in/s?k=steadfast+nutrition",
      directUrl: "https://www.steadfastnutrition.in/",
      directLabel: "Buy direct from Steadfast",
    },
    pros: [
      "Per-batch certificates of analysis from NABL labs — rare transparency for a sports brand",
      "Clean, accurate labels with genuine clinical-grade positioning",
      "Useful endurance line — sensibly-dosed, low-sugar electrolytes and gels",
      "Travel-friendly single-serve sachet formats",
      "Strong FSSAI compliance record",
    ],
    cons: [
      "Sachet and clinical formats cost noticeably more per gram than bulk tubs",
      "COAs are brand-commissioned, not independently-initiated",
      "Premium pricing across the protein range",
      "Smaller, more niche availability than mass-market brands",
    ],
    audience: {
      good: "Want clean-label sports nutrition with published batch COAs, value travel-friendly formats, and train for endurance where the electrolytes and gels are genuinely useful.",
      bad: "Want the lowest price per gram (bulk tubs from raw-focused brands win) or need fully independent, blind-purchase testing.",
    },
    compareLead: "Against the Indian sports field, Steadfast's batch COAs and clean labels put it in the recommended tier — value is where the premium formats cost it.",
    compare: [
      { name: "AS-IT-IS Nutrition", slug: "as-it-is", score: 8.6, tier: "Recommended", why: "Best transparency & price per gram; per-batch COAs" },
      { name: "Nakpro", slug: "nakpro", score: 8.2, tier: "Recommended", why: "Trustified/Eurofins-verified protein" },
      { name: "Steadfast Nutrition", score: 7.6, tier: "Recommended", why: "Clean-label, per-batch COAs; premium sachet formats", self: true },
      { name: "Scitron", slug: "scitron", score: 6.5, tier: "Acceptable", why: "Reasonable protein; no independent COA" },
    ],
    faq: [
      { q: "Is Steadfast Nutrition third-party tested?", a: "Steadfast publishes per-batch certificates of analysis from NABL laboratories. That's strong transparency for a sports brand, though the COAs are brand-commissioned rather than independently-initiated blind-purchase tests." },
      { q: "Why is Steadfast more expensive than other Indian brands?", a: "A lot of its range uses premium formats — single-serve sachets, clinical-grade positioning, endurance products — that cost more per gram than bulk tubs. You're paying for convenience, clean labels and batch testing." },
      { q: "Are the sachets worth it over a tub?", a: "For travel and portion control, yes — they're genuinely convenient. For everyday home use, a tub from a raw-focused brand gives you far more protein per rupee." },
      { q: "Is Steadfast good for endurance athletes?", a: "Its endurance line — low-sugar electrolytes and energy gels — is one of its stronger areas, sensibly dosed for long sessions in Indian heat. It's a credible pick for runners and cyclists." },
      { q: "Steadfast or AS-IT-IS?", a: "AS-IT-IS wins on price per gram and independent COAs; Steadfast wins on clean clinical formats, endurance products and travel-friendly sachets. Choose by what you value: raw value, or convenience and a curated sports range." },
    ],
    verdict: "Steadfast is a clean, credible sports brand that does the unglamorous things right — accurate labels, per-batch COAs, and a genuinely useful endurance line. You pay a premium for the formats and the clinical positioning, so it's best for athletes who value convenience and transparency over the lowest possible price per gram.",
    altsLead: "Want better price per gram or fully independent testing? These verified brands are where we'd point you next.",
    alternatives: [
      { slug: "as-it-is", name: "AS-IT-IS Nutrition", score: 8.6, why: "The transparency and value benchmark — per-batch COAs and the lowest price per gram on raw whey and creatine." },
      { slug: "nakpro", name: "Nakpro", score: 8.2, why: "Independently Trustified/Eurofins-verified protein and amino profile, with flavoured options." },
      { slug: "unived", name: "Unived", score: 7.6, why: "India's best vegan-certified range if you want algae omega-3 and correct-form essentials." },
    ],
  },

  // ───────────────────────── Dymatize ─────────────────────────
  'dymatize': {
    metaDesc: "Independent Dymatize brand profile. NC Trust Score 7.0/10, Acceptable. ISO100 is a genuinely excellent NSF-certified hydrolysed isolate — but it's among the priciest protein per gram in India, and the rest of the range isn't independently certified here.",
    ogDesc: "NC Trust Score 7.0/10. Dymatize ISO100 is a top-tier NSF-certified hydrolysed isolate; the catch is price — among the highest per gram in India.",
    kicker: "ISO100 is one of the best hydrolysed isolates you can buy — NSF Certified for Sport, clean, fast-digesting. The catch is the price, among the highest per gram in India.",
    thesis: "Dymatize sits in the acceptable tier on the strength of one outstanding product: ISO100, an NSF Certified for Sport hydrolysed whey isolate that's genuinely top-class. The problem is value — ISO100's price per gram is among the highest in the Indian market, and the rest of the range isn't independently certified here. Buy it if a premium, fast-digesting isolate is worth paying up for; most goals don't require it.",
    metaChips: [
      { label: "Updated May 2026", ok: true },
      { label: "ISO100 NSF Certified", ok: true },
      { label: "USA · est. 1994", ok: false },
      { label: "Premium price", ok: false },
    ],
    keyrow: [
      { k: "Buy it for", v: "A premium NSF-certified hydrolysed isolate" },
      { k: "Standout", v: "ISO100 — clean, fast, NSF-tested" },
      { k: "Keep in mind", v: "Among the priciest protein per gram" },
    ],
    glance: [
      { k: "Founded", v: "1994 · Dallas, TX, USA" },
      { k: "Category focus", v: "Whey isolate, whey, casein, gainers" },
      { k: "Best for", v: "Buyers who want a certified premium isolate" },
      { k: "Watch for", v: "Only ISO100 is NSF-certified for India" },
      { k: "Testing", v: "NSF Certified for Sport (ISO100); others uncertified" },
      { k: "Where to buy", v: "Authorised Amazon.in & importers" },
    ],
    scorecardLead: "Every brand in our database is scored on the same five dimensions, each out of 10, using the same rubric. Dymatize's ISO100 lifts label accuracy and testing; value is the clear weak point.",
    scoreWhys: {
      labelAccuracy: "ISO100's label is independently verified by NSF; the broader range relies on the brand.",
      dosing: "Sensible protein dosing; the hydrolysed isolate digests fast and clean.",
      fssai: "Import-compliant via authorised distributors.",
      thirdParty: "NSF Certified for Sport on ISO100 — strong — but other SKUs aren't independently certified for India.",
      value: "ISO100's price per gram is among the highest in the category; you pay a clear premium.",
    },
    testing: {
      paras: [
        "Dymatize's testing story begins and ends with <strong>ISO100</strong>, which carries <strong>NSF Certified for Sport</strong> — one of the most rigorous banned-substance and quality certifications available. For that single product, verification is excellent and among the best on the India market.",
        "The honest caveat: that certification <strong>doesn't extend across the range</strong>. Elite Whey, the gainers and the aminos are not independently certified for India, and Dymatize doesn't publish per-batch COAs. Buy ISO100 for the certification; treat the rest as a normal, uncertified branded range.",
      ],
      chips: ["FSSAI import compliant", "NSF Certified for Sport (ISO100)", "Hydrolysed isolate", "Authorised import"],
    },
    rangeLead: "The Dymatize range sold in India, grouped by use-case. Each tag is a positioning note, not a separate score, and the one-line take flags both the use and the catch. Prices are last-checked estimates — confirm on Amazon before buying.",
    cats: [
      { name: "Proteins & Gainers", items: [
        { name: "ISO100 Hydrolyzed Isolate", unit: "1.6 lb", price: 4499, pn: "premium ₹ / g", tag: "NSF certified", star: true, note: "The reason to consider Dymatize: a fast-digesting hydrolysed isolate, NSF Certified for Sport and very low in lactose. Excellent — and among the most expensive protein per gram in India.", q: "dymatize+iso100+hydrolyzed+whey" },
        { name: "Elite 100% Whey", unit: "2 lb", price: 3499, pn: "uncertified for India", tag: "Whey blend", note: "A solid everyday whey blend, but not independently certified for India and priced above domestic verified options.", q: "dymatize+elite+100+whey" },
        { name: "Elite Casein", unit: "2 lb", price: 3999, pn: "nighttime protein", tag: "Slow-release", note: "Micellar casein for overnight protein. Fine product, premium price; a tool rather than a daily essential.", q: "dymatize+elite+casein" },
        { name: "Super Mass Gainer", unit: "6 lb", price: 4999, pn: "high-calorie", tag: "Mass gainer", note: "A high-calorie gainer. As with all gainers, most people get cleaner calories from food plus whey.", q: "dymatize+super+mass+gainer" },
      ]},
      { name: "Creatine & Performance", items: [
        { name: "Micronized Creatine", unit: "500 g", price: 1499, pn: "commodity", tag: "Monohydrate", note: "Plain micronized monohydrate — good quality, but creatine is a commodity that domestic brands sell for far less.", q: "dymatize+creatine" },
        { name: "Pre W.O. Pre-Workout", unit: "20 servings", price: 2999, pn: "disclosed doses", tag: "Stimulant", note: "A fully-dosed pre-workout with disclosed actives. Effective, but priced at a premium over equivalent Indian options.", q: "dymatize+pre+workout" },
      ]},
      { name: "Amino Acids", items: [
        { name: "All9 Amino", unit: "30 servings", price: 2499, pn: "all 9 EAAs", tag: "EAA", note: "All nine essential aminos with electrolytes for intra-workout use. Competent; redundant if your daily protein is already covered.", q: "dymatize+all9+amino" },
      ]},
    ],
    buybox: {
      text: "<strong>Buy authorised — and look for ISO100's NSF seal.</strong> Imported Dymatize should come from an authorised distributor or reputable importer; check the import sticker and expiry. We don't publish discount codes we can't verify — check the official store for any live offer.",
      amazon: "https://www.amazon.in/s?k=dymatize",
      directUrl: "https://www.dymatize.com/",
      directLabel: "Buy from Dymatize",
    },
    pros: [
      "ISO100 is an excellent NSF Certified for Sport hydrolysed isolate",
      "Very low lactose and fat — easy digestion, fast absorption",
      "Clean, accurate labelling on the certified flagship",
      "Fully-disclosed pre-workout doses (no proprietary blend)",
    ],
    cons: [
      "Among the highest price per gram of protein in India",
      "Only ISO100 is NSF-certified — the rest of the range isn't, for India",
      "No published per-batch COAs",
      "Commodities like creatine cost far more than domestic equivalents",
    ],
    audience: {
      good: "Specifically want a premium, fast-digesting, NSF-certified hydrolysed isolate and are willing to pay a clear premium for that certification and digestibility.",
      bad: "Are price-sensitive, or just need everyday protein — a domestic verified whey gives you far more per rupee with comparable label accuracy.",
    },
    compareLead: "Among imported proteins, ISO100 is genuinely premium; value is where Dymatize falls behind the recommended tier.",
    compare: [
      { name: "AS-IT-IS Nutrition", slug: "as-it-is", score: 8.6, tier: "Recommended", why: "Best price per gram with per-batch COAs" },
      { name: "Optimum Nutrition", slug: "optimum-nutrition", score: 8.0, tier: "Recommended", why: "Strongest 3P cert stack across the range; better value than ISO100" },
      { name: "MuscleBlaze", slug: "muscleblaze", score: 7.8, tier: "Recommended", why: "Widest availability; Biozyme enzyme line" },
      { name: "Dymatize", score: 7.0, tier: "Acceptable", why: "ISO100 is NSF-certified and excellent; among priciest per gram", self: true },
    ],
    faq: [
      { q: "Is Dymatize ISO100 worth the price?", a: "ISO100 is a genuinely top-tier hydrolysed isolate — NSF Certified for Sport, very low lactose, fast-digesting. Whether it's 'worth it' depends on budget: it's excellent, but among the priciest protein per gram in India, and most goals don't require a hydrolysed isolate." },
      { q: "Is all of Dymatize third-party tested?", a: "No. ISO100 carries NSF Certified for Sport, but the rest of the range (Elite Whey, gainers, aminos) isn't independently certified for India, and Dymatize doesn't publish per-batch COAs." },
      { q: "Is ISO100 good for lactose intolerance?", a: "It's one of the better choices — a hydrolysed whey isolate with very little lactose. Most lactose-sensitive users tolerate it well, though individual responses vary." },
      { q: "Dymatize or Optimum Nutrition?", a: "Both are premium imports. ON has the stronger certification stack across its whole range and better value; Dymatize's ISO100 is the better single product if you specifically want a certified hydrolysed isolate. ON edges it overall." },
    ],
    verdict: "Dymatize is a one-product recommendation: ISO100 is an excellent, NSF-certified hydrolysed isolate worth considering if a premium, fast-digesting protein justifies the price. The rest of the range is competent but uncertified for India and expensive. For value or breadth, look to the recommended tier; for a certified isolate splurge, ISO100 delivers.",
    altsLead: "Want better value or a fully certified range? These are the brands we'd point you to next.",
    alternatives: [
      { slug: "optimum-nutrition", name: "Optimum Nutrition", score: 8.0, why: "Stronger certification across the whole range, and better value than ISO100 per gram." },
      { slug: "as-it-is", name: "AS-IT-IS Nutrition", score: 8.6, why: "The value benchmark — per-batch COAs and the lowest price per gram on raw whey." },
      { slug: "nakpro", name: "Nakpro", score: 8.2, why: "Independently verified domestic protein with flavoured options at a fraction of the import premium." },
    ],
  },

  // ───────────────────────── Fast&Up ─────────────────────────
  'fastanup': {
    metaDesc: "Independent Fast&Up brand profile. NC Trust Score 6.8/10, Acceptable. Effervescent vitamin C and electrolytes are genuinely convenient, but doses often sit below therapeutic thresholds, pricing is high vs capsules, and no independent testing is published.",
    ogDesc: "NC Trust Score 6.8/10. Fast&Up's effervescent format is convenient for vitamin C and electrolytes, but doses can be light and prices high — and there's no published independent testing.",
    kicker: "Effervescent delivery makes vitamin C and electrolytes genuinely convenient. The catches: doses often sit below therapeutic thresholds, prices run high vs capsules, and there's no published independent testing.",
    thesis: "Fast&Up's effervescent tablets are a legitimately convenient format for vitamin C, electrolytes and hydration — easy to take and pleasant to drink. But convenience is doing a lot of the work: per-tablet doses frequently fall below the thresholds that matter, the price per dose is high next to plain capsules, and the brand publishes no independent third-party testing. A handy lifestyle range, not a clinical one.",
    metaChips: [
      { label: "Updated May 2026", ok: true },
      { label: "Effervescent format", ok: true },
      { label: "India · Mumbai · est. 2015", ok: false },
      { label: "No public COA", ok: false },
    ],
    keyrow: [
      { k: "Buy it for", v: "Convenient effervescent hydration & vitamin C" },
      { k: "Standout", v: "Genuinely pleasant, easy-to-take format" },
      { k: "Keep in mind", v: "Light doses, premium price, no public testing" },
    ],
    glance: [
      { k: "Founded", v: "2015 · Mumbai, India" },
      { k: "Category focus", v: "Effervescent vitamins, electrolytes, aminos" },
      { k: "Best for", v: "Convenience-led buyers who like effervescent tabs" },
      { k: "Watch for", v: "Doses often below therapeutic thresholds" },
      { k: "Testing", v: "No independent COA published; internal QC claimed" },
      { k: "Where to buy", v: "Amazon.in, pharmacies, brand site" },
    ],
    scorecardLead: "Every brand in our database is scored on the same five dimensions, each out of 10, using the same rubric. Fast&Up scores on compliance and a useful format; testing and value drag it into the acceptable tier.",
    scoreWhys: {
      labelAccuracy: "Labels appear accurate, but without published independent testing you're trusting the brand.",
      dosing: "Electrolyte ratios are sensible; vitamin C and some actives sit below therapeutic doses per tablet.",
      fssai: "Fully licensed; effervescent (Taiyo) delivery system.",
      thirdParty: "No independent third-party certification published — internal QC only.",
      value: "Effervescent tablets cost noticeably more per dose than equivalent capsules.",
    },
    testing: {
      paras: [
        "Fast&Up's appeal is its <strong>effervescent delivery</strong> — a genuinely pleasant, convenient way to take vitamin C, electrolytes and B-vitamins. The format is legitimate and well-executed.",
        "What's missing is <strong>independent verification</strong>: the brand publishes no third-party COA and relies on internal QC. Combined with per-tablet doses that often fall below therapeutic thresholds (vitamin C frequently under the 1,000 mg mark), it's best treated as a convenient lifestyle product rather than a clinically-dosed one.",
      ],
      chips: ["FSSAI licensed", "Effervescent (Taiyo) format", "India-manufactured"],
    },
    rangeLead: "The Fast&Up range, grouped by use-case. Each tag is a positioning note, not a separate score, and the one-line take flags both the use and the catch. Prices are last-checked estimates — confirm on Amazon before buying.",
    cats: [
      { name: "Vitamins & Minerals", items: [
        { name: "Charge Vitamin C + Zinc", unit: "20 tablets", price: 549, pn: "check the C dose", tag: "Effervescent", note: "Convenient effervescent C + zinc, but the vitamin C dose often sits below the ~1,000 mg therapeutic mark — check the label.", q: "fast+up+charge+vitamin+c+effervescent" },
        { name: "Reload Electrolytes", unit: "20 tablets", price: 499, pn: "sensible ratios", tag: "Hydration", star: true, note: "Sensibly-ratioed electrolytes in a convenient tab — the most useful product in the range for training and heat.", q: "fast+up+reload+electrolytes" },
        { name: "Fortify Calcium + D3 + K2", unit: "60 tablets", price: 699, pn: "correct forms", tag: "Bone", note: "Correct D3+K2 pairing with calcium. Reasonable, though capsule equivalents cost less.", q: "fast+up+fortify+calcium" },
        { name: "Vitalize Multivitamin", unit: "20 tablets", price: 599, pn: "convenience multi", tag: "Effervescent multi", note: "A pleasant daily effervescent multi — a convenience product, not a high-potency formula.", q: "fast+up+vitalize+multivitamin" },
      ]},
      { name: "Performance", items: [
        { name: "Intra-Workout BCAA", unit: "250 g", price: 699, pn: "redundant if fed", tag: "BCAA", note: "A flavoured BCAA; fine, but redundant once daily protein is covered.", q: "fast+up+bcaa" },
        { name: "Pre-Workout", unit: "250 g", price: 899, pn: "read the doses", tag: "Stimulant", note: "A caffeine-led pre-workout — judge it on the disclosed per-scoop doses, not the name.", q: "fast+up+pre+workout" },
        { name: "Magnesium", unit: "60 tablets", price: 599, pn: "check the form", tag: "Sleep / cramps", note: "Magnesium for sleep and cramps; check the form and elemental dose against cheaper glycinate options.", q: "fast+up+magnesium" },
      ]},
    ],
    buybox: {
      text: "<strong>Where to buy:</strong> Fast&Up's official Amazon.in storefront, pharmacies or brand website. Note the brand publishes no independent COA — judge products on their label doses. We don't publish discount codes we can't verify — check the official store for any live offer.",
      amazon: "https://www.amazon.in/s?k=fast+up",
      directUrl: "https://www.fastandup.in/",
      directLabel: "Buy from Fast&Up",
    },
    pros: [
      "Effervescent format is genuinely convenient and pleasant to take",
      "Electrolyte products are sensibly ratioed for hydration",
      "FSSAI licensed with a well-executed delivery system",
      "Useful for people who struggle with capsules",
    ],
    cons: [
      "Per-tablet doses often below therapeutic thresholds (e.g. vitamin C)",
      "Significantly more expensive per dose than capsules",
      "No independent third-party testing published",
      "Marketing leans on the format more than the formulation",
    ],
    audience: {
      good: "Like the effervescent format, want convenient hydration and vitamin C, and value taste and ease over maximum dose per rupee.",
      bad: "Want therapeutic doses at the lowest cost, or require independently tested products — plain capsules deliver more for less.",
    },
    compareLead: "In the vitamins-and-hydration space, Fast&Up wins on format but trails verified brands on testing and value.",
    compare: [
      { name: "NOW Foods", slug: "now-foods", score: 7.8, tier: "Recommended", why: "GMP-tested, correctly-dosed vitamins and omega-3" },
      { name: "Unived", slug: "unived", score: 7.6, tier: "Recommended", why: "Vegan-certified, correct forms, NABL-tested" },
      { name: "Fast&Up", score: 6.8, tier: "Acceptable", why: "Convenient effervescent format; light doses, no public COA", self: true },
      { name: "Carbamide Forte", slug: "carbamide-forte", score: 6.8, tier: "Acceptable", why: "Better rupee-per-dose value; also no public COA" },
    ],
    faq: [
      { q: "Are Fast&Up effervescent tablets effective?", a: "The format is convenient and the electrolytes are sensibly dosed. The weakness is that vitamins like C often sit below therapeutic thresholds per tablet, so check the label dose against what you actually need." },
      { q: "Is Fast&Up third-party tested?", a: "No independent third-party COA is published; the brand relies on internal QC. You're trusting the label rather than an external assay." },
      { q: "Why is Fast&Up more expensive than capsules?", a: "You're paying for the effervescent delivery and convenience. For the same nutrients, plain capsules or tablets are usually cheaper per dose." },
      { q: "Is Fast&Up Reload good for hydration?", a: "Yes — Reload is the standout, with sensible electrolyte ratios in a convenient tablet, useful for training and Indian heat. Just watch the added sugar and total sodium for your needs." },
    ],
    verdict: "Fast&Up is a convenience play: the effervescent format is genuinely nice, and the electrolytes are useful. But light doses, premium pricing and no published independent testing keep it in the acceptable tier. Buy it for hydration and ease of use, not for clinical potency — and a plain capsule will usually give you more for less.",
    altsLead: "Want therapeutic doses, lower prices or independent testing? These brands are where we'd point you next.",
    alternatives: [
      { slug: "now-foods", name: "NOW Foods", score: 7.8, why: "GMP-tested vitamins at proper doses, including a true high-dose vitamin C and D3." },
      { slug: "unived", name: "Unived", score: 7.6, why: "Vegan-certified, correctly-formed essentials with NABL testing." },
      { slug: "carbamide-forte", name: "Carbamide Forte", score: 6.8, why: "Better rupee-per-dose value on vitamin C and ashwagandha, if you'll accept no public COA." },
    ],
  },

  // ───────────────────────── Carbamide Forte ─────────────────────────
  'carbamide-forte': {
    metaDesc: "Independent Carbamide Forte brand profile. NC Trust Score 6.8/10, Acceptable. The best rupee-per-dose value in domestic vitamins, with correctly-labelled KSM-66 ashwagandha — held back only by the lack of any published independent COA.",
    ogDesc: "NC Trust Score 6.8/10. Carbamide Forte offers the best rupee-per-dose value in domestic vitamins and correctly-labelled KSM-66 — the one gap is no public COA.",
    kicker: "The best rupee-per-dose value in domestic vitamins, and it labels KSM-66 ashwagandha correctly — rare at this price. The one real gap: no published independent COA.",
    thesis: "Carbamide Forte punches above its price: it's the best rupee-per-dose value in the domestic vitamin space, and unlike many budget brands it labels patented ingredients like KSM-66 ashwagandha correctly. The single thing keeping it out of the recommended tier is verification — there's no published independent COA, so you're trusting accurate-looking labels rather than an external assay. For price-sensitive buyers, it's a strong-value pick with that caveat.",
    metaChips: [
      { label: "Updated May 2026", ok: true },
      { label: "Best value · domestic", ok: true },
      { label: "India · Delhi · est. 2017", ok: false },
      { label: "No public COA", ok: false },
    ],
    keyrow: [
      { k: "Buy it for", v: "Best rupee-per-dose value in vitamins" },
      { k: "Standout", v: "Correctly-labelled KSM-66 at a budget price" },
      { k: "Keep in mind", v: "No independent COA published" },
    ],
    glance: [
      { k: "Founded", v: "2017 · Delhi, India" },
      { k: "Category focus", v: "Vitamins, minerals, herbal extracts" },
      { k: "Best for", v: "Price-sensitive buyers who read labels" },
      { k: "Watch for", v: "No published independent COA" },
      { k: "Testing", v: "In-house testing; no public third-party COA" },
      { k: "Where to buy", v: "Amazon.in & brand website" },
    ],
    scorecardLead: "Every brand in our database is scored on the same five dimensions, each out of 10, using the same rubric. Carbamide Forte's value and honest labelling carry it; the missing independent COA is what caps the score.",
    scoreWhys: {
      labelAccuracy: "Labels are honest for the price — patented extracts like KSM-66 are named correctly — but unverified by an external COA.",
      dosing: "Sensible, clinically-relevant doses on the key products (1,000 mg C, KSM-66 600 mg).",
      fssai: "Fully licensed, budget-positioned domestic brand.",
      thirdParty: "No published independent COA; in-house testing without public disclosure.",
      value: "The best rupee-per-dose value in the domestic vitamins segment.",
    },
    testing: {
      paras: [
        "Carbamide Forte's strength is unusual for a budget brand: <strong>honest labelling</strong>. Where cheap competitors hide behind generic 'ashwagandha extract', Carbamide Forte correctly names <strong>patented KSM-66</strong> and gives sensible, clinically-relevant doses — at the lowest prices in the segment.",
        "The gap is <strong>verification</strong>. The brand relies on in-house testing and publishes no independent third-party COA, so the accurate-looking labels aren't externally confirmed. That's the single reason it sits in the acceptable rather than recommended tier — buy it for value, with eyes open on testing.",
      ],
      chips: ["FSSAI licensed", "Names patented extracts (KSM-66)", "India-manufactured"],
    },
    rangeLead: "The Carbamide Forte range, grouped by use-case. Each tag is a positioning note, not a separate score, and the one-line take flags both the use and the catch. Prices are last-checked estimates — confirm on Amazon before buying.",
    cats: [
      { name: "Vitamins", items: [
        { name: "Vitamin C 1,000 mg + Zinc", unit: "120 tablets", price: 479, pn: "≈ ₹4 / tab", tag: "Best value", star: true, note: "A genuine 1,000 mg vitamin C with zinc at a category-best price. Honest dose, honest cost — the flagship value pick.", q: "carbamide+forte+vitamin+c+1000mg" },
        { name: "Vitamin D3 + K2", unit: "60 capsules", price: 399, pn: "correct forms", tag: "Deficiency", note: "Correct D3+K2 forms at a budget price. Good value for India's deficiency burden.", q: "carbamide+forte+vitamin+d3+k2" },
        { name: "Biotin 10,000 mcg", unit: "120 tablets", price: 399, pn: "can skew lab tests", tag: "Hair & skin", note: "Appropriately dosed biotin. Note high-dose biotin can skew some blood tests — tell your doctor before bloodwork.", q: "carbamide+forte+biotin" },
        { name: "Multivitamin", unit: "60 tablets", price: 449, pn: "check it uses D3", tag: "Daily base", note: "A budget daily multi. Check it uses D3, not D2; a sensible floor for the price.", q: "carbamide+forte+multivitamin" },
      ]},
      { name: "Minerals", items: [
        { name: "Magnesium Glycinate", unit: "120 tablets", price: 449, pn: "well absorbed", tag: "Sleep / cramps", note: "Well-absorbed glycinate form at a low price. A good-value evening magnesium.", q: "carbamide+forte+magnesium+glycinate" },
      ]},
      { name: "Herbs & Wellness", items: [
        { name: "Ashwagandha KSM-66 600 mg", unit: "60 capsules", price: 449, pn: "patented extract", tag: "Correctly labelled", star: true, note: "Correctly-labelled, clinically-dosed KSM-66 — rare at this price. The product that earns the brand its reputation.", q: "carbamide+forte+ashwagandha+ksm+66" },
        { name: "Collagen Builder", unit: "200 g", price: 599, pn: "modest evidence", tag: "Skin", note: "A collagen-support blend (vitamin C + amino precursors). Modest evidence; fine as an inexpensive add-on.", q: "carbamide+forte+collagen" },
        { name: "Apple Cider Vinegar", unit: "60 capsules", price: 399, pn: "low evidence", tag: "Overhyped", note: "Popular but low-evidence for weight or metabolism. Buy only if you specifically want it.", q: "carbamide+forte+apple+cider+vinegar" },
      ]},
    ],
    buybox: {
      text: "<strong>Where to buy:</strong> Carbamide Forte's official Amazon.in storefront or brand website. Note the brand publishes no independent COA — its value and honest labelling are the draw. We don't publish discount codes we can't verify — check the official store for any live offer.",
      amazon: "https://www.amazon.in/s?k=carbamide+forte",
      directUrl: "https://www.carbamideforte.com/",
      directLabel: "Buy from Carbamide Forte",
    },
    pros: [
      "Best rupee-per-dose value in the domestic vitamins segment",
      "Correctly labels patented extracts like KSM-66 — rare at this price",
      "Sensible, clinically-relevant doses on the key products",
      "FSSAI licensed and widely available",
    ],
    cons: [
      "No published independent COA — labels are unverified externally",
      "Some cheaper SKUs still use generic, unstandardised extracts",
      "A few low-evidence products (ACV) in the range",
      "Budget positioning means little formulation innovation",
    ],
    audience: {
      good: "Are price-sensitive, read labels, and want correctly-dosed basics — especially vitamin C, D3+K2 and KSM-66 ashwagandha — at the lowest domestic prices.",
      bad: "Require a published independent COA before buying, or want premium, innovative formulations.",
    },
    compareLead: "Among budget domestic vitamins, Carbamide Forte is the value leader; the recommended brands above it add the independent testing it lacks.",
    compare: [
      { name: "NOW Foods", slug: "now-foods", score: 7.8, tier: "Recommended", why: "GMP-tested, broadest verified range" },
      { name: "Unived", slug: "unived", score: 7.6, tier: "Recommended", why: "Vegan-certified, correct forms, NABL-tested" },
      { name: "Carbamide Forte", score: 6.8, tier: "Acceptable", why: "Best rupee-per-dose value; correctly-labelled KSM-66; no public COA", self: true },
      { name: "HK Vitals", slug: "hk-vitals", score: 6.4, tier: "Acceptable", why: "Budget range; base multi uses D2, not D3" },
    ],
    faq: [
      { q: "Is Carbamide Forte a good brand?", a: "For value, yes — it's the best rupee-per-dose pick in domestic vitamins and labels patented extracts like KSM-66 correctly. The one caveat is that it publishes no independent COA, so you're trusting accurate-looking labels." },
      { q: "Is Carbamide Forte ashwagandha real KSM-66?", a: "Yes — it correctly names patented KSM-66 at a clinically-relevant 600 mg dose, which is rare in this price bracket. That honest labelling is a key reason it scores well on value." },
      { q: "Is Carbamide Forte third-party tested?", a: "Not publicly. It relies on in-house testing and doesn't publish an independent COA. That's the main thing holding it in the acceptable tier despite strong value and labelling." },
      { q: "Carbamide Forte or HK Vitals?", a: "Carbamide Forte is the better pick — its key products are correctly dosed (real 1,000 mg C, KSM-66), whereas HK Vitals' base multivitamin uses the inferior D2 form. Neither publishes an independent COA." },
    ],
    verdict: "Carbamide Forte is the value champion of domestic vitamins: correctly-dosed, honestly-labelled basics at the lowest prices, with KSM-66 ashwagandha as a standout. The missing independent COA is the only real knock, and it's why it sits just below the recommended tier. For price-sensitive, label-literate buyers, it's an easy recommendation with that one caveat.",
    altsLead: "Want independent testing or a broader verified range? These brands are where we'd point you next.",
    alternatives: [
      { slug: "now-foods", name: "NOW Foods", score: 7.8, why: "GMP-tested vitamins and omega-3 with a long track record, if you'll pay import prices." },
      { slug: "unived", name: "Unived", score: 7.6, why: "Vegan-certified, correctly-formed essentials with NABL testing." },
      { slug: "steadfast", name: "Steadfast Nutrition", score: 7.6, why: "Clean-label brand with per-batch COAs if published testing matters to you." },
    ],
  },

  // ───────────────────────── Labrada ─────────────────────────
  'labrada': {
    metaDesc: "Independent Labrada brand profile. NC Trust Score 6.8/10, Acceptable. Lean Body whey has decent transparency and label accuracy, but India-market SKUs carry no current independent certification — and some scoop sizes are inflated.",
    ogDesc: "NC Trust Score 6.8/10. Labrada's Lean Body whey is decent and label-honest, but India SKUs aren't independently certified — and watch the scoop-size arithmetic.",
    kicker: "Lean Body whey has decent transparency and reasonable label accuracy. The catches: no current independent certification for India, and some inflated scoop sizes that quietly cut value.",
    thesis: "Labrada is a long-standing US brand with reasonable transparency and label accuracy on its Lean Body whey line. The qualifiers are real, though: its India-market SKUs carry no current independent certification, and some products use inflated scoop sizes that reduce the effective protein per rupee. A competent mid-tier import — just check the serving-size arithmetic before assuming it's good value.",
    metaChips: [
      { label: "Updated May 2026", ok: true },
      { label: "Label-honest range", ok: true },
      { label: "USA · est. 1987", ok: false },
      { label: "India SKUs uncertified", ok: false },
    ],
    keyrow: [
      { k: "Buy it for", v: "Decent, label-honest imported whey" },
      { k: "Standout", v: "Lean Body line's transparency" },
      { k: "Keep in mind", v: "No India cert; check scoop sizes" },
    ],
    glance: [
      { k: "Founded", v: "1987 · Houston, TX, USA" },
      { k: "Category focus", v: "Whey, mass gainers, aminos, bars" },
      { k: "Best for", v: "Buyers who like the Lean Body line and read labels" },
      { k: "Watch for", v: "Inflated scoop sizes on some SKUs" },
      { k: "Testing", v: "Some US products had Informed Sport; India SKUs uncertified" },
      { k: "Where to buy", v: "Authorised Amazon.in & importers" },
    ],
    scorecardLead: "Every brand in our database is scored on the same five dimensions, each out of 10, using the same rubric. Labrada's label honesty carries it; the lack of current India certification and value caveats keep it acceptable.",
    scoreWhys: {
      labelAccuracy: "Reasonable label accuracy and ingredient transparency on the Lean Body line.",
      dosing: "Sensible protein dosing — but check scoop size, as some are inflated.",
      fssai: "Import-compliant via Indian e-commerce.",
      thirdParty: "Some US products previously held Informed Sport; India SKUs aren't currently independently certified.",
      value: "Mid-tier value, eroded on SKUs that use larger scoops to flatter the serving.",
    },
    testing: {
      paras: [
        "Labrada earns reasonable marks for <strong>transparency and label accuracy</strong> on its Lean Body whey — it's an established brand that doesn't hide behind proprietary blends, and its labels are generally honest about what's inside.",
        "Two caveats keep it in the acceptable tier. First, <strong>certification</strong>: while some US-market products have historically carried Informed Sport, the India-market SKUs aren't currently independently certified, and no per-batch COAs are published. Second, <strong>scoop-size arithmetic</strong> — some products use larger scoops that inflate the apparent serving, so compare protein per 100 g, not just per scoop.",
      ],
      chips: ["FSSAI import compliant", "Transparent Lean Body labels", "Authorised import"],
    },
    rangeLead: "The Labrada range sold in India, grouped by use-case. Each tag is a positioning note, not a separate score, and the one-line take flags both the use and the catch. Prices are last-checked estimates — confirm on Amazon before buying.",
    cats: [
      { name: "Proteins & Gainers", items: [
        { name: "Lean Body 100% Whey", unit: "2 lb", price: 2999, pn: "check the scoop", tag: "Flagship", star: true, note: "The Lean Body flagship: a decent, label-honest whey blend. Verify the scoop size and protein-per-serving before judging value — some run larger than expected.", q: "labrada+lean+body+whey+protein" },
        { name: "Muscle Mass Gainer", unit: "6 lb", price: 3499, pn: "high-calorie", tag: "Mass gainer", note: "A high-calorie gainer. As ever, most people get cleaner calories from food plus whey.", q: "labrada+muscle+mass+gainer" },
        { name: "Lean Body Protein Bar", unit: "box of 12", price: 1499, pn: "on-the-go", tag: "Protein snack", note: "A convenient ~20 g protein bar. Useful on the go; check the sugar and sugar-alcohol content.", q: "labrada+lean+body+protein+bar" },
      ]},
      { name: "Creatine & Performance", items: [
        { name: "Micronized Creatine", unit: "300 g", price: 1199, pn: "commodity", tag: "Monohydrate", note: "Plain micronized monohydrate — fine quality, but domestic creatine costs far less per serving.", q: "labrada+creatine" },
        { name: "BCAA", unit: "250 g", price: 1399, pn: "redundant if fed", tag: "BCAA", note: "A flavoured 2:1:1; redundant once daily protein is covered.", q: "labrada+bcaa" },
      ]},
      { name: "Wellness", items: [
        { name: "Glutamine", unit: "300 g", price: 1099, pn: "evidence weak", tag: "Recovery", note: "Pure glutamine; recovery evidence in well-fed lifters is thin. A low priority.", q: "labrada+glutamine" },
      ]},
    ],
    buybox: {
      text: "<strong>Buy authorised — and check the scoop.</strong> Imported Labrada should come from an authorised distributor or reputable importer; verify the protein-per-100 g, not just per scoop. We don't publish discount codes we can't verify — check the official store for any live offer.",
      amazon: "https://www.amazon.in/s?k=labrada+lean+body",
      directUrl: "https://www.labrada.com/",
      directLabel: "Buy from Labrada",
    },
    pros: [
      "Decent transparency and label accuracy on the Lean Body line",
      "No proprietary blends hiding ingredient doses",
      "Established brand with a broad protein and snack range",
      "Widely available via Indian e-commerce",
    ],
    cons: [
      "No current independent certification for India-market SKUs",
      "Some products use inflated scoop sizes that reduce real value",
      "No published per-batch COAs",
      "Imported pricing above domestic verified whey",
    ],
    audience: {
      good: "Like the Lean Body range, read labels carefully (including scoop sizes), and want a transparent imported whey without needing a certification stamp.",
      bad: "Require independent certification or per-batch COAs, or want the best protein per rupee — domestic verified whey wins there.",
    },
    compareLead: "Among imported proteins, Labrada is label-honest but uncertified for India; the recommended brands offer either certification or better value.",
    compare: [
      { name: "Nakpro", slug: "nakpro", score: 8.2, tier: "Recommended", why: "Independently verified protein at domestic prices" },
      { name: "Optimum Nutrition", slug: "optimum-nutrition", score: 8.0, tier: "Recommended", why: "Strongest 3P cert stack; better verified value" },
      { name: "Labrada", score: 6.8, tier: "Acceptable", why: "Decent, label-honest whey; uncertified for India, check scoops", self: true },
      { name: "MyProtein", slug: "myprotein", score: 6.5, tier: "Acceptable", why: "Good price-to-protein; UK cert doesn't cover India batches" },
    ],
    faq: [
      { q: "Is Labrada Lean Body whey good?", a: "It's a decent, label-honest whey blend. The caveats: India-market SKUs aren't independently certified, and some scoop sizes are inflated, so check the protein-per-100 g before deciding it's good value." },
      { q: "Is Labrada third-party tested for India?", a: "Not currently. Some US-market products have historically carried Informed Sport, but the India SKUs aren't independently certified and no per-batch COAs are published." },
      { q: "What does 'inflated scoop size' mean?", a: "Some products use a larger scoop so each 'serving' looks bigger, which can make the protein-per-rupee look better than it is. Compare protein per 100 g across brands to judge true value." },
      { q: "Labrada or MyProtein?", a: "Both are mid-tier imports without India-specific certification. MyProtein's Impact Whey is often better value per gram; Labrada's Lean Body labels are transparent. Buy whichever is genuinely cheaper per gram of protein from an official channel." },
    ],
    verdict: "Labrada is a competent, label-honest import that just doesn't clear the bar for the recommended tier: no current India certification, no published COAs, and value that depends on watching the scoop size. If you like the Lean Body range and check the arithmetic, it's fine — but a verified domestic whey or a certified import gives you more confidence per rupee.",
    altsLead: "Want certification or better value? These brands are where we'd point you next.",
    alternatives: [
      { slug: "optimum-nutrition", name: "Optimum Nutrition", score: 8.0, why: "The strongest certification stack on the India market, if you'll pay a premium and buy authorised." },
      { slug: "nakpro", name: "Nakpro", score: 8.2, why: "Independently Trustified/Eurofins-verified protein at domestic prices." },
      { slug: "as-it-is", name: "AS-IT-IS Nutrition", score: 8.6, why: "The value benchmark — per-batch COAs and the lowest price per gram." },
    ],
  },

};
