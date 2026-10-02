/**
 * Approved landing-page copy. Keep these strings exact.
 * Section labels match the copy document's section names.
 */
export const mailto = "mailto:hello@trace.so";

export const copy = {
  brand: "Trace",
  email: "hello@trace.so",
  contactCta: "Get in touch",
  foundersCta: "Talk to the founders",
  footer: "Trace · AI-native ERP for startups",
  hero: {
    eyebrow: "Building in public · Early access",
    headline: "AI-native ERP for startups that outgrow spreadsheets",
    subhead:
      "Start with accounting that closes the books. Add modules as you grow. One stack for software companies, without buying SAP.",
  },
  problem: {
    label: "Problem",
    heading: "Spreadsheets work until they don’t",
    body: "Early teams run finance on sheets, Slack, and a patchwork of point tools. Close gets slower every month. R&D credits, sales tax, AR/AP, and FP&A each live in a different product (or firm). Classic ERP is for companies that already look like enterprises.",
    emphasis:
      "Most startups sit in between: too messy for spreadsheets, too early for SAP or NetSuite. Trace is for that gap.",
  },
  product: {
    label: "Product",
    heading: "Accounting first. Modular ERP next.",
    intro:
      "Trace starts with core accounting and book close. From there, the same platform can grow into adjacent finance modules (AR/AP, FP&A, sales tax, R&D tax) and, over time, more of an ops stack, without a monolith on day one.",
    toward: "What we’re building toward:",
    points: [
      "Book close and core accounting as the entry point",
      "Modular finance add-ons you turn on when you need them",
      "One path from startup accounting toward a full ERP for software companies",
      "AI-native for small teams that automate ops instead of hiring a back-office army",
    ],
    modules: ["AR/AP", "FP&A", "sales tax", "R&D tax"],
    disclaimer:
      "We are not claiming a finished SAP replacement today. We are shipping toward that direction, starting with accounting.",
  },
  how: {
    label: "How it works",
    heading: "Start narrow. Expand when it pays off.",
    steps: [
      "Start with accounting (Delaware C-corps and YC-style companies first)",
      "Add modules as you grow (tax, AR/AP, FP&A, later HR/CRM-style ops)",
      "Grow into the stack: same foundation, more coverage; long-term modular ERP for tech companies that never want to implement SAP",
    ],
  },
  audience: {
    label: "Who it’s for",
    heading: "Built for software startups first",
    points: [
      "Founders and finance leads at early software/SaaS companies who have outgrown spreadsheets",
      "Teams that want accounting now and a path to more finance ops later",
      "Modular adoption over a big-bang suite",
    ],
    note: "Later other verticals may follow. Beachhead is tech startups.",
  },
  closing: {
    heading: "Accounting today. ERP as you scale.",
    body: "If you’re a software startup looking for accounting that can grow into a fuller stack, we’d like to talk. We’re pressure-testing this direction with founders and investors now.",
  },
} as const;
