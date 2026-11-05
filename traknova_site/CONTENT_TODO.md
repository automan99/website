# Content verification checklist

Items below must be confirmed by the business before public launch. The site is written
so unconfirmed facts are stated generically or marked "subject to configuration"; the
placeholder contact details and spec gaps still need to be replaced.

## Contact and form

- [ ] Replace `sales@traknova.com` in `src/data/site.ts`
- [ ] Replace the WhatsApp number (`10000000000`)
- [ ] Replace the Facebook page URL
- [ ] Create and replace the Formspree endpoint
- [ ] Confirm the public response-time expectation (do not promise an SLA unless approved)

## Company facts (About / trust sections)

- [ ] Legal company name and brand ownership
- [ ] Founding year and company history
- [ ] Headquarters and manufacturing locations
- [ ] Factory area, headcount, production capacity
- [ ] Certifications actually held (e.g. ISO 9001 / ISO 14001), with certificate numbers
- [ ] Test-lab capabilities and third-party test reports
- [ ] Export markets and regional support structure
- [ ] Customer logos or named references (written permission required)
- [ ] Warranty, RMA and after-sales policy
- [ ] Privacy Policy and Terms of Use, reviewed for the operating jurisdiction

## Product data

The following are currently flagged "Confirm exact configuration" in
`src/data/products/base.ts`. Public pages should show only confirmed values.

- [ ] HT400: barcode engine, OS, display, memory, wireless, ruggedness
- [ ] HT510: barcode engine, OS, display, memory, battery, ruggedness; variant differences
- [ ] HT520: OS, processor, display, barcode/NFC options, connectivity, ruggedness
- [ ] HT530: document/ID reader module, supported standards for target countries, OS,
      connectivity, ruggedness
- [ ] HT800: print method, print width, barcode engine, OS, battery
- [ ] HT540: RFID frequency/standard, read range, OS, connectivity, ruggedness
- [ ] Y100 Android: exact resolution, OS, processor, memory, module options, battery,
      protection rating
- [ ] Y70: processor, memory, connectivity, battery, protection; Android vs Windows
- [ ] T120A: processor, memory, I/O, battery, protection
- [ ] Y100 RFID: resolve the IP67 vs IP68 contradiction before publication
- [ ] Confirm regional UHF RFID bands for every target market
- [ ] Confirm which models have CE / FCC / RoHS / other market approvals
- [ ] Replace domestic-catalogue imagery with approved high-resolution originals, or
      confirm redistribution rights

## Localization

- [ ] Have the Simplified Chinese marketing copy reviewed by a native speaker before launch
- [ ] Re-sync `zh.json` and Chinese content files whenever the English copy changes
- [ ] When enabling another language, add its dictionary/content files and update
      `ENABLED_LOCALES` plus the sitemap `i18n.locales` list
- [ ] Confirm that product specs and legal text remain English-only by design

## Imagery

- [ ] Replace the About and OEM / ODM page stock photos (`public/images/about-*.webp`,
      `public/images/oem-*.webp`) with approved company photography when available
- [ ] Re-check the source URLs and license record in `IMAGE_CREDITS.md` before launch

## Solutions pages (added 2026-11-05)

The industry solution pages are built at `/solutions/` plus four detail pages. The
items below are content dependencies; the pages currently use approved fallbacks.

- [ ] Product photography for the device bundle: provide clean white or transparent
      background product images for the models listed on each industry page. The
      current `public/images/products/device-*.svg` silhouettes are intentional
      fallbacks; replace them with real product images and update
      `src/components/SolutionDeviceCard.astro`.
- [ ] Certifications for the Solutions trust bar: confirm per model whether IP65/IP67,
      MIL-STD-810H, Android GMS, CE, FCC and RoHS are actually held (with certificate
      numbers where applicable). Do not publish the trust bar until verified.
- [ ] Real deployment cases: provide named or anonymised customer cases with permission,
      including region, device mix, deployment scale and verified outcomes. Replace or
      supplement the qualitative "What improves" and "Deployment snapshot" sections.
- [ ] Decide whether to generate branded static Solution Brief PDFs (English and Chinese,
      one per industry) instead of the browser's Print / Save as PDF flow.

## OEM / ODM

- [ ] Minimum order quantity policy
- [ ] Sample policy and sample lead time
- [ ] Production lead-time ranges
- [ ] Branding options that are actually available (logo method, boot animation,
      packaging MOQ)
- [ ] Software customization scope (OS image, preload, MDM)
- [ ] Tooling ownership and change-notification terms
- [ ] Certification responsibility split by market
- [ ] Warranty and spares commitments for OEM partners

## Legal and system

- [ ] Privacy Policy content and cookie behaviour (review against the operating jurisdiction)
- [ ] Terms of Use content and governing-law clause
- [ ] Image licensing for any stock photography used
- [ ] Final proofreading of English copy by a native reviewer
- [ ] Confirm the canonical site URL and base path in `astro.config.mjs` (currently
      `https://automan99.github.io` + `/website`) before pointing a custom domain
- [ ] Add a social preview image (`og:image`) if link previews are required
- [ ] Replace or approve the generated SVG favicon
