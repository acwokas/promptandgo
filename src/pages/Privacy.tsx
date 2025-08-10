import SEO from "@/components/SEO";

const Privacy = () => (
  <main className="container py-10">
    <SEO title="Privacy Policy" description="Privacy Policy (PDPA, Singapore): how PromptAndGo.ai collects, uses, and protects your data." />
    <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>

    <p className="text-sm text-muted-foreground">Effective Date: 01 January 2025</p>
    <p className="text-sm text-muted-foreground mb-6">Jurisdiction: Singapore</p>

    <section className="prose prose-neutral max-w-none dark:prose-invert">
      <p>
        PromptAndGo (“we”, “our”, “us”) operates the website https://promptandgo.ai (the “Site”). We are
        committed to protecting your personal data in compliance with Singapore’s Personal Data Protection Act 2012 (PDPA)
        and other applicable laws.
      </p>
      <p>By using our Site, you agree to the terms of this Privacy Policy.</p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following types of personal data:</p>
      <ul>
        <li><strong>Contact Information</strong> – name, email address, and other details you provide when signing up or contacting us.</li>
        <li><strong>Account Information</strong> – username, password, and profile settings if you create an account.</li>
        <li><strong>Usage Data</strong> – IP address, browser type, device information, pages visited, and time spent on the Site.</li>
        <li><strong>Content Submissions</strong> – prompts, comments, or other materials you submit.</li>
        <li><strong>Transactional Data</strong> – payment details (processed securely via third-party payment providers; we do not store full credit card details).</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your personal data to:</p>
      <ul>
        <li>Provide, maintain, and improve our services.</li>
        <li>Process your account registration and authenticate your access.</li>
        <li>Respond to your enquiries and support requests.</li>
        <li>Send you updates, newsletters, and marketing (only with your consent).</li>
        <li>Customise content and recommendations.</li>
        <li>Comply with legal obligations and enforce our terms of use.</li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <p>We do not sell your personal data. We may share your data with:</p>
      <ul>
        <li><strong>Service Providers</strong> – third parties who help us operate the Site, such as hosting, analytics, and payment processing.</li>
        <li><strong>Legal Authorities</strong> – if required by law, court order, or government regulation.</li>
        <li><strong>Business Transfers</strong> – if PromptAndGo is acquired, merged, or reorganised.</li>
      </ul>

      <h2>4. International Data Transfers</h2>
      <p>
        As part of our operations, your data may be transferred and stored outside Singapore. We ensure that any such
        transfer complies with the PDPA and that the receiving party offers a comparable level of data protection.
      </p>

      <h2>5. Data Retention</h2>
      <p>We retain your personal data only for as long as necessary to fulfil the purposes stated in this policy or as required by law.</p>

      <h2>6. Security</h2>
      <p>
        We implement reasonable administrative, technical, and physical safeguards to protect your personal data from
        unauthorised access, disclosure, alteration, or destruction. However, no method of transmission over the Internet is completely secure.
      </p>

      <h2>7. Your Rights</h2>
      <p>Under the PDPA, you have the right to:</p>
      <ul>
        <li>Access and request a copy of your personal data.</li>
        <li>Request correction of your personal data.</li>
        <li>Withdraw consent for the collection, use, or disclosure of your personal data.</li>
        <li>Request deletion of your personal data, subject to legal and contractual obligations.</li>
      </ul>
      <p>Requests can be made by contacting us at <a href="mailto:legal@promptandgo.ai">legal@promptandgo.ai</a>.</p>

      <h2>8. Use of Cookies and Tracking</h2>
      <p>We use cookies and similar technologies to:</p>
      <ul>
        <li>Improve your user experience.</li>
        <li>Analyse Site performance.</li>
        <li>Deliver relevant content and ads.</li>
      </ul>
      <p>You may disable cookies in your browser settings, but some Site features may not function properly.</p>

      <h2>9. Third-Party Links</h2>
      <p>
        Our Site may contain links to external websites. We are not responsible for the privacy practices or content of those third-party sites.
      </p>

      <h2>10. Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version will be posted on this page with a new “Effective Date.”
      </p>

      <h2>11. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy or our data practices, please contact:</p>
      <p>
        PromptAndGo<br />
        Email: <a href="mailto:legal@promptandgo.ai">legal@promptandgo.ai</a><br />
        Jurisdiction: Singapore
      </p>
    </section>
  </main>
);

export default Privacy;
