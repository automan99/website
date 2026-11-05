# Content verification checklist

Items below must be confirmed by the business before public launch. The site is written
so unconfirmed facts are stated generically or marked "subject to configuration"; the
placeholder contact details and spec gaps still need to be replaced.

## Contact and form

- [ ] Replace `sales@YOUR-DOMAIN.com` in `src/data/site.ts`
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
`src/data/products.ts`. Public pages should show only confirmed values.

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
