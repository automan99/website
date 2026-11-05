export type LegalInline = { text: string } | { emailLink: true };

export type LegalBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; content: LegalInline[] }
  | { type: 'list'; items: LegalInline[][] };

export type LegalDocument = {
  id: 'privacy' | 'terms';
  updated: string;
  blocks: LegalBlock[];
};

const text = (value: string): LegalInline => ({ text: value });
const email: LegalInline = { emailLink: true };

export const privacyDocument: LegalDocument = {
  id: 'privacy',
  updated: '5 November 2026',
  blocks: [
    { type: 'heading', text: '1. Who we are' },
    {
      type: 'paragraph',
      content: [
        text('This website is operated by TRAKNOVA. For questions about this policy or the information we hold, contact us at '),
        email,
        text('.')
      ]
    },
    { type: 'heading', text: '2. Information we collect' },
    {
      type: 'paragraph',
      content: [text('When you submit the inquiry form, we collect the information you provide: name, business email, company, country or region, product and application interest, cooperation interest, deployment timeline, estimated quantity and project details. If you contact us by email, WhatsApp or another channel, we receive the information you choose to send.')]
    },
    {
      type: 'paragraph',
      content: [text('Our form service may also process technical information necessary to deliver and protect the form, such as the time of submission and basic request metadata.')]
    },
    { type: 'heading', text: '3. How we use information' },
    {
      type: 'list',
      items: [
        [text('To respond to your inquiry and answer your questions')],
        [text('To prepare a device shortlist, datasheet request or quotation')],
        [text('To manage an ongoing commercial relationship')],
        [text('To understand how the website is used and improve it')],
        [text('To comply with legal, tax and record-keeping obligations')]
      ]
    },
    { type: 'heading', text: '4. Legal basis' },
    {
      type: 'paragraph',
      content: [text('Where applicable law requires a legal basis, we process inquiry information because you have asked us to provide information or a quotation, because we have a legitimate interest in responding to business inquiries, and where necessary to comply with legal obligations.')]
    },
    { type: 'heading', text: '5. Sharing' },
    {
      type: 'paragraph',
      content: [text('We use service providers for website hosting and form processing, including Formspree, and may share information with manufacturing, logistics or professional advisers where needed to respond to your request. We do not sell personal information.')]
    },
    { type: 'heading', text: '6. Retention' },
    {
      type: 'paragraph',
      content: [text('We retain inquiry records for as long as needed to respond and maintain the business relationship, and afterwards for the period required by applicable law.')]
    },
    { type: 'heading', text: '7. Cookies and analytics' },
    {
      type: 'paragraph',
      content: [text('This website does not currently use advertising or analytics cookies. If analytics or other tracking technologies are introduced, this policy will be updated and, where required, consent will be requested.')]
    },
    { type: 'heading', text: '8. International transfers' },
    {
      type: 'paragraph',
      content: [text('Inquiry information may be processed in countries where our service providers operate. Where required, we use appropriate safeguards for those transfers.')]
    },
    { type: 'heading', text: '9. Your rights' },
    {
      type: 'paragraph',
      content: [
        text('Depending on your jurisdiction, you may have rights to access, correct, delete or restrict the use of your personal information, or to object to processing. To exercise a right, contact us at '),
        email,
        text('.')
      ]
    },
    { type: 'heading', text: '10. Security' },
    {
      type: 'paragraph',
      content: [text('We use reasonable technical and organizational measures to protect inquiry information. No internet transmission is completely secure, so please avoid sending sensitive personal information through the inquiry form.')]
    },
    { type: 'heading', text: '11. Changes' },
    {
      type: 'paragraph',
      content: [text('We may update this policy from time to time. The date at the top of this page shows the latest revision.')]
    },
    { type: 'heading', text: '12. Contact' },
    {
      type: 'paragraph',
      content: [text('For privacy questions or requests, contact '), email, text('.')]
    }
  ]
};

export const termsDocument: LegalDocument = {
  id: 'terms',
  updated: '5 November 2026',
  blocks: [
    { type: 'heading', text: '1. Website use' },
    {
      type: 'paragraph',
      content: [text('You may use this website for lawful business evaluation and purchasing purposes. You must not attempt to disrupt the site, gain unauthorized access to it, or use it in a way that infringes the rights of others.')]
    },
    { type: 'heading', text: '2. Product information' },
    {
      type: 'paragraph',
      content: [text('Product descriptions, images and specifications are provided for general information. Only the approved datasheet and the quotation for your specific configuration are authoritative. Module availability, memory, operating system versions, protection ratings and regional approvals vary by model and market.')]
    },
    { type: 'heading', text: '3. Intellectual property' },
    {
      type: 'paragraph',
      content: [text('The site content, brand, graphics and text are owned by or licensed to TRAKNOVA. You may not reproduce, modify or distribute them for commercial use without written permission.')]
    },
    { type: 'heading', text: '4. Inquiries and quotations' },
    {
      type: 'paragraph',
      content: [text('Submitting an inquiry or requesting a datasheet does not create a contract. Quotations, orders, delivery and supply terms are governed by the applicable commercial agreement between the parties.')]
    },
    { type: 'heading', text: '5. Third-party links' },
    {
      type: 'paragraph',
      content: [text('Links to third-party sites are provided for convenience. We are not responsible for their content, availability or privacy practices.')]
    },
    { type: 'heading', text: '6. Disclaimer' },
    {
      type: 'paragraph',
      content: [text('The website is provided on an “as is” basis to the extent permitted by law. We do not warrant that it will be uninterrupted, error-free or free of harmful components.')]
    },
    { type: 'heading', text: '7. Limitation of liability' },
    {
      type: 'paragraph',
      content: [text('To the extent permitted by law, TRAKNOVA is not liable for indirect or consequential loss arising from the use of this website. Nothing in these terms excludes liability that cannot be excluded by law.')]
    },
    { type: 'heading', text: '8. Governing law' },
    {
      type: 'paragraph',
      content: [text('These terms are governed by the laws applicable to the TRAKNOVA operating entity. The applicable jurisdiction is confirmed in the commercial agreement.')]
    },
    { type: 'heading', text: '9. Changes' },
    {
      type: 'paragraph',
      content: [text('We may update these terms from time to time. The date at the top of this page shows the latest revision.')]
    },
    { type: 'heading', text: '10. Contact' },
    {
      type: 'paragraph',
      content: [text('For questions about these terms, contact '), email, text('.')]
    }
  ]
};
