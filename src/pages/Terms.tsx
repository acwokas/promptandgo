import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";

const Terms = () => (
  <>
    <PageHero title={<>Terms &amp; Conditions</>} subtitle={<>Usage rules, IP, payments, privacy, liability, and your rights.</>} minHeightClass="min-h-[28vh]" />
    <main className="container py-10">
      <SEO title="Terms & Conditions" description="PromptAndGo.ai Terms & Conditions (Singapore): usage rules, IP, payments, privacy, liability, and your rights." />

    <p className="text-sm text-muted-foreground">Effective Date: 01 January 2025</p>
    <p className="text-sm text-muted-foreground mb-6">Jurisdiction: Singapore</p>

    <section className="prose prose-neutral max-w-none dark:prose-invert">
      <p>
        Welcome to PromptAndGo (“we”, “our”, “us”). These Terms &amp; Conditions (“Terms”) govern your use of the
        website https://promptandgo.ai (the “Site”) and any related services we provide.
      </p>
      <p>By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.</p>

      <h2>1.&nbsp;&nbsp;Use of the Site</h2>
      <p>You may use the Site for lawful purposes only. You must not:</p>
      <ul>
        <li>Violate any applicable laws or regulations.</li>
        <li>Infringe intellectual property rights.</li>
        <li>Upload or distribute harmful, obscene, defamatory, or unlawful content.</li>
        <li>Attempt to gain unauthorised access to our systems or interfere with the Site’s operation.</li>
      </ul>
      <p>We may suspend or terminate your access if you breach these Terms.</p>

      <h2>2.&nbsp;&nbsp;Account Registration</h2>
      <p>Some features may require creating an account. You agree to:</p>
      <ul>
        <li>Provide accurate and complete information.</li>
        <li>Keep your login credentials secure.</li>
        <li>Be responsible for all activities under your account.</li>
      </ul>

      <h2>3.&nbsp;&nbsp;Content and Intellectual Property</h2>
      <p>All content on the Site, including text, graphics, code, prompts, and designs, is owned by or licensed to PromptAndGo, unless otherwise stated.</p>
      <ul>
        <li>You may use content for personal or internal business purposes only.</li>
        <li>You may not copy, redistribute, or commercially exploit any content without our written permission.</li>
        <li>If you submit content (e.g., prompts, comments, reviews), you grant us a non-exclusive, royalty-free, worldwide licence to use, display, and distribute that content in connection with our services.</li>
      </ul>

      <h2>4.&nbsp;&nbsp;Payment and Subscriptions</h2>
      <p>If you purchase premium prompts, downloads, or subscription services:</p>
      <ul>
        <li>All prices are listed in Singapore Dollars (SGD) unless otherwise stated.</li>
        <li>Payment processing is handled by secure third-party providers; we do not store full payment details.</li>
        <li>Subscription fees are billed in advance and are non-refundable unless required by law.</li>
      </ul>

      <h2>5.&nbsp;&nbsp;Privacy</h2>
      <p>Your use of the Site is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data in compliance with Singapore’s Personal Data Protection Act (PDPA).</p>

      <h2>6.&nbsp;&nbsp;Disclaimers</h2>
      <ul>
        <li>The Site and its content are provided “as is” without warranties of any kind.</li>
        <li>We do not guarantee uninterrupted access or that content will be error-free.</li>
        <li>We are not responsible for actions you take based on the content or prompts provided.</li>
      </ul>

      <h2>7.&nbsp;&nbsp;Limitation of Liability</h2>
      <ul>
        <li>We are not liable for indirect, incidental, special, or consequential damages, to the fullest extent permitted by law.</li>
        <li>Our total liability to you for any claims shall not exceed the total amount paid by you to us in the 6 months preceding the claim.</li>
      </ul>

      <h2>8.&nbsp;&nbsp;Indemnity</h2>
      <p>You agree to indemnify and hold harmless PromptAndGo, its officers, employees, and partners from any claims, damages, or expenses arising from your use of the Site or breach of these Terms.</p>

      <h2>9.&nbsp;&nbsp;Third-Party Links</h2>
      <p>The Site may contain links to third-party websites. We are not responsible for their content, policies, or practices.</p>

      <h2>10.&nbsp;&nbsp;Governing Law</h2>
      <p>These Terms are governed by and construed in accordance with the laws of Singapore. You agree to submit to the exclusive jurisdiction of the Singapore courts.</p>

      <h2>11.&nbsp;&nbsp;Changes to the Terms</h2>
      <p>We may update these Terms at any time by posting a new version on this page. Your continued use of the Site constitutes acceptance of the updated Terms.</p>

      <h2>12.&nbsp;&nbsp;Contact Us</h2>
      <p>If you have any questions about these Terms, please contact:</p>
      <p>
        PromptAndGo<br />
        Email: <a href="mailto:legal@promptandgo.ai">legal@promptandgo.ai</a><br />
        Jurisdiction: Singapore
      </p>

      <h2>13.&nbsp;&nbsp;Refunds &amp; Cancellations</h2>
      <p>All sales of digital products, including prompt packs, downloads, and subscriptions, are final. We do not offer refunds, exchanges, or cancellations once a purchase is completed, except as required under Singapore law.</p>
      <p>If a digital product is defective, inaccessible, or not as described, you must notify us within 7 days of purchase at <a href="mailto:legal@promptandgo.ai">legal@promptandgo.ai</a> so we can investigate and, if appropriate, provide a replacement or alternative remedy.</p>
    </section>
  </main>
  </>
);

export default Terms;
