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

Product data is now owned by `src/data/products/` (HT540 Series, HT550, Y100 Series).
Public pages show only values transcribed from the supplied specification documents.

- [ ] Re-check the conflict-resolution table in
      `docs/superpowers/specs/2026-11-05-products-redesign-design.md` §2.4 before launch.
- [ ] Confirm certification wording and certificate numbers with the business; the site
      currently says "per configuration; certificates available on request".
- [ ] Confirm regional UHF RFID bands for every target market.
- [ ] Confirm the Y100 IP67 standard / IP68 optional wording with the approved datasheet.
- [ ] Replace the processed catalogue imagery with approved high-resolution originals if
      the business requires different photography.

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
