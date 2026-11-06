# ENPFOX site expansion — design

Date: 2026-11-05
Status: approved direction; content blueprint for phased implementation
Scope: whole site (`traknova_site`)

## Intent

The current site is a working preview: clear positioning, but too thin to read as a
real B2B industrial-mobility website. The goal is to turn it into a complete corporate
site with the structure a distributor, solution provider or enterprise buyer expects:
scenario-led solutions, product selection guidance, a credible OEM/ODM process,
company capability pages, and a contact path that explains what happens next.

This is a content and information-architecture project. The visual language (navy,
blue, orange, geometric device art, DM Sans / Manrope) stays; the pages get deeper,
more specific and more consistent.

## Audience

- Distributors and channel partners evaluating a hardware brand
- Solution providers building Auto-ID deployments for their customers
- Enterprise operations, IT and procurement teams comparing devices and partners
- OEM/ODM prospects who need branding, configuration or project development

The reader is practical and skeptical. They want to know which workflow a device fits,
what the deployment process looks like, and what must be confirmed before quotation.

## Goals

1. Make every primary page feel complete enough to support a real sales conversation.
2. Lead with workflows and scenarios, not only product categories.
3. Give buyers selection tools: scenario cards, device recommendations, comparison table.
4. Explain OEM/ODM as a staged, governed process rather than three bullet points.
5. Add trust infrastructure: quality/documentation, deployment path, FAQs, legal pages.
6. Keep the site static, fast and deployable on GitHub Pages under `/website`.

## Non-goals

- Building a product configurator, cart, account area or CMS.
- Publishing unverified specifications, certifications or performance claims.
- Inventing customer names, logos, case-study metrics or company history.
- Replacing the existing brand or visual direction.

## Anti-goals

- A site that looks impressive but makes claims the company cannot support.
- Hiding all depth behind accordions or carousels; primary content should be crawlable.
- Generic "industry solution" copy that could belong to any hardware vendor.

## Constraints

- Astro 5 static output, deployed at `https://automan99.github.io/website`.
- All root-relative links must go through `withBase()`.
- Copy stays in English, matching the existing site.
- Product data in `src/data/products.ts` remains the source of truth for models and
  specs. Unconfirmed spec fields are not promoted into public marketing copy.
- Verifiable company facts (founding year, factory size, certifications, headcount,
  customer logos, financial/performance figures) are not invented. Their placement is
  documented in `traknova_site/CONTENT_TODO.md` for the business to fill.

## Content principles

1. **Specific over sweeping.** Name the document, the scan, the exception, the system.
2. **Workflow first.** Each scenario shows the physical steps before the hardware.
3. **Honest by default.** Say "subject to configuration/region" where that is true.
4. **One idea per block.** Headline, short explanation, evidence, next action.
5. **No fake proof.** Typical scenarios are labelled as typical; they are not presented
   as named customer cases.

## Site architecture

### Global

- Header: active nav state; same five primary sections; quote CTA retained.
- Footer: brand statement, product categories, solution anchors, company links, contact
  details, compliance/verification note.
- Shared components: eyebrow, section heading, scenario card, device chip, workflow
  list, outcome list, comparison table, process grid, FAQ accordion, CTA band.
- New page-level SEO descriptions; JSON-LD in a later phase.

### Home (P2)

Trust strip, four capability pillars, scenario entry points, product portfolio, working
process, OEM teaser, FAQ, CTA. Keep the existing hero art.

### Products index (P2)

- Category introductions for Rugged PDA, RFID and Industrial Tablets.
- Task-based selector: scanning, UHF RFID, mobile printing, industrial I/O, ID/document.
- Series comparison table.
- Accessories, configuration notes, FAQ.

### Product detail (P2)

- Breadcrumb, overview, highlights, best-fit scenarios.
- Configuration notes; only verified specs shown as specs.
- Accessories/options, related products, datasheet request, inquiry CTA.

### Solutions (P1)

- Hero with anchor navigation.
- "Anatomy of a solution": Capture → Compute → Connect → Integrate.
- Four industries, three scenarios each (12 total):
  - Warehouse & Logistics: dock-to-stock receiving; RFID cycle counting;
    pick-pack-dispatch.
  - Manufacturing: work-order execution and WIP; material traceability and kitting;
    equipment inspection rounds.
  - Retail & Commerce: replenishment and price accuracy; RFID item-level stocktake;
    mobile labeling and service.
  - Field Service & Asset Tracking: inspection and digital work orders; asset tagging
    and audit rounds; on-site service and documentation.
- Each scenario: situation, 4–5 workflow steps, recommended devices (linked), outcomes.
- Specialized workflows: HT510 Medical variant; HT530 document/ID capture.
- Selection matrix: industry × typical tasks × devices × capture method.
- Deployment path: workflow review → configuration → pilot → rollout.
- CTA.

### OEM / ODM (P1)

- Hero.
- Three engagement models: private label, configured product, project development.
- Customization matrix: brand, capture modules, compute/memory, I/O, accessories,
  software, documentation, production.
- Six-step process: discovery, proposal, prototype, validation, pilot production,
  production & support.
- Quality and documentation: QC approach, document package, lifecycle support.
- FAQ covering branding, MOQ, preloaded apps/MDM, regional RFID bands, samples,
  tooling ownership and certification scope.
- CTA.

### About (P3)

Positioning, capability map, working principles, quality approach, global support, and
clearly replaceable company-fact blocks. No fabricated history or certifications.

### Contact (P3)

Channels, "what happens next" steps, expanded inquiry form (application, quantity,
timeline, target market, OEM interest), FAQ, regional support note.

### Legal / system (P3)

Privacy Policy, Terms of Use, 404 page. Footer legal links become live.

## Design system additions

New stylesheet `src/styles/enterprise.css`, imported after `global.css`:

- `anatomy-grid`, `industry-block`, `scenario-grid`, `scenario-card`
- `workflow`, `outcome-list`, `device-link`, `mini-label`
- `special-grid`, `matrix-table`, `deploy-grid`
- OEM: `model-grid`, `custom-table`, `process-grid`, `quality-grid`, `faq-list`
- Footer expansion and active-nav state
- Responsive rules at 900px and 650px

## Phased delivery

- **P1** — design system, header/footer, Solutions, OEM/ODM.
- **P2** — Home enrichment, Products index, product detail, task selector.
- **P3** — About, Contact, Privacy/Terms, 404, SEO metadata and JSON-LD.

## Success criteria

- Solutions page contains 12 distinct, workflow-specific scenarios with linked devices.
- OEM/ODM page explains models, customization, process, quality and FAQ without
  inventing facts.
- Header/footer navigation is consistent and internal links resolve.
- Pages remain responsive at 360px, 768px and desktop widths.
- `astro build` succeeds.
- All unverified company/product claims are tracked in `CONTENT_TODO.md`.
