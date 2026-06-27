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

};
