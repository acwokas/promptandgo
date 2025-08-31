import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Terms = () => (
  <>
    <PageHero title={<>Terms &amp; Conditions</>} subtitle={<>Usage rules, IP, payments, privacy, liability, and your rights.</>} minHeightClass="min-h-[28vh]" />
    <main className="container py-10">
      <SEO title="Terms & Conditions" description="PromptAndGo.ai Terms & Conditions (Singapore): usage rules, IP, payments, privacy, liability, and your rights." />

      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Terms & Conditions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

    <p className="text-sm text-muted-foreground">Effective Date: 01 January 2025</p>
    <p className="text-sm text-muted-foreground mb-6">Jurisdiction: Singapore</p>

    <section className="prose prose-neutral max-w-none dark:prose-invert">
      <p>
        Welcome to PromptAndGo ("we", "our", "us"). These Terms &amp; Conditions ("Terms") govern your use of the
        website https://promptandgo.ai (the "Site") and any related services we provide.
      </p>
      <p>By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.</p>

      <h2>1.&nbsp;&nbsp;Use of the Site</h2>
      <p>You may use the Site for lawful purposes only. You must not:</p>
      <ul>
        <li>Violate any applicable laws or regulations.</li>
        <li>Infringe intellectual property rights.</li>
        <li>Upload or distribute harmful, obscene, defamatory, or unlawful content.</li>
        <li>Attempt to gain unauthorised access to our systems or interfere with the Site's operation.</li>
      </ul>
      <p>We may suspend or terminate your access if you breach these Terms.</p>

      <h2>2.&nbsp;&nbsp;AI Tools and Beta Services</h2>
      <p>PromptAndGo provides AI-powered tools including but not limited to:</p>
      <ul>
        <li><strong>Scout Prompt Generator</strong> – generates customized prompts based on your inputs</li>
        <li><strong>Smart Suggestions</strong> – provides AI-powered recommendations</li>
        <li><strong>Scout Assistant</strong> – interactive AI chat assistance</li>
      </ul>
      <p><strong>IMPORTANT BETA DISCLAIMER:</strong> All AI tools are currently in beta testing. We reserve the right to:</p>
      <ul>
        <li>Modify, suspend, or discontinue any AI service at any time without prior notice</li>
        <li>Change usage limits, quotas, or access restrictions as needed</li>
        <li>Update AI models, features, or functionality</li>
        <li>Impose temporary or permanent limitations on service availability</li>
      </ul>
      <p>AI services are provided "as is" without guarantees of availability, accuracy, or fitness for any particular purpose. Usage limits may change based on operational needs and cost considerations.</p>

      <h2>3.&nbsp;&nbsp;Acceptable Use of AI Tools</h2>
      <p>When using our AI services, you must not:</p>
      <ul>
        <li>Generate content that is illegal, harmful, defamatory, or violates others' rights</li>
        <li>Attempt to reverse engineer or extract AI models or training data</li>
        <li>Use the services for any unlawful purpose or in violation of applicable laws</li>
        <li>Exceed usage limits or attempt to circumvent access controls</li>
        <li>Share account credentials or allow unauthorized access to AI tools</li>
        <li>Generate content that infringes intellectual property rights</li>
      </ul>
      <p>We reserve the right to monitor AI usage and suspend access for violations.</p>

      <h2>4.&nbsp;&nbsp;Account Registration</h2>
      <p>Some features may require creating an account. You agree to:</p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Keep your login credentials secure</li>
        <li>Be responsible for all activities under your account</li>
        <li>Maintain the security of your AI usage and not share access with unauthorized parties</li>
      </ul>

      <h2>5.&nbsp;&nbsp;Content and Intellectual Property</h2>
      <p>All content on the Site, including text, graphics, code, prompts, and designs, is owned by or licensed to PromptAndGo, unless otherwise stated.</p>
      <ul>
        <li>You may use content for personal or internal business purposes only</li>
        <li>You may not copy, redistribute, or commercially exploit any content without our written permission</li>
        <li>AI-generated content remains subject to the terms of the underlying AI provider and applicable IP laws</li>
        <li>If you submit content (e.g., prompts, comments, reviews, AI interactions), you grant us a non-exclusive, royalty-free, worldwide licence to use, display, and distribute that content in connection with our services</li>
        <li>User-generated prompts and favorites are owned by you but may be used by us to improve our services</li>
        <li>We may use anonymized, aggregated data from AI interactions to enhance our algorithms</li>
      </ul>

      <h2>6.&nbsp;&nbsp;Payment and Memberships</h2>
      <p>We offer the following paid services:</p>
      <ul>
        <li><strong>Monthly Membership</strong> - $12.99 USD per month with enhanced AI usage limits (30 generator + 40 assistant queries daily)</li>
        <li><strong>Lifetime Access</strong> - $99.50 USD one-time payment with premium AI usage limits (60 queries daily each tool)</li>
        <li><strong>Prompt Packs</strong> - Individual collections at $9.99 USD each (Social Media, Career, Real Estate, Business Automation, Content Marketing, Wellness & Lifestyle, Midjourney Essentials, Ideogram Essentials)</li>
        <li><strong>AI Tools</strong> - Access to Scout Prompt Generator, Smart Suggestions, and Scout Assistant with usage limits based on your plan</li>
      </ul>
      <p>Payment terms:</p>
      <ul>
        <li>All prices are listed in US Dollars (USD) unless otherwise stated</li>
        <li>Payment processing is handled by Stripe and other secure third-party providers; we do not store full payment details</li>
        <li>You may see "PromptAndGo" or an affiliated entity on your payment statements</li>
        <li>Monthly memberships are billed in advance and renew automatically until cancelled</li>
        <li>Lifetime access is a one-time payment for ongoing access subject to these Terms</li>
        <li>Individual prompt packs are one-time purchases</li>
        <li>AI usage limits are tied to your subscription tier and may change as services evolve</li>
        <li>Beta services may affect pricing or access levels without prior notice</li>
      </ul>

      <h2>7.&nbsp;&nbsp;Privacy</h2>
      <p>Your use of the Site is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data in compliance with Singapore's Personal Data Protection Act (PDPA).</p>

      <h2>8.&nbsp;&nbsp;AI Output Disclaimers</h2>
      <p>Regarding AI-generated content and services:</p>
      <ul>
        <li>AI outputs are generated by third-party providers and we do not guarantee their accuracy, completeness, or appropriateness</li>
        <li>You are solely responsible for reviewing and validating any AI-generated content before use</li>
        <li>AI services may be temporarily unavailable due to technical issues or third-party provider limitations</li>
        <li>We are not liable for any decisions made based on AI-generated content or suggestions</li>
        <li>Beta AI features may produce unexpected results and should be used with caution</li>
      </ul>

      <h2>9.&nbsp;&nbsp;Service Availability and Modifications</h2>
      <p>We reserve the right to:</p>
      <ul>
        <li>Modify, suspend, or discontinue any part of our services, including AI tools, at any time</li>
        <li>Change usage limits, quotas, or access restrictions without prior notice</li>
        <li>Update our AI models, algorithms, or service providers as needed</li>
        <li>Temporarily restrict access for maintenance, updates, or operational needs</li>
        <li>Implement new features or remove existing ones as part of service evolution</li>
      </ul>

      <h2>10.&nbsp;&nbsp;General Disclaimers</h2>
      <ul>
        <li>The Site and its content are provided "as is" without warranties of any kind</li>
        <li>We do not guarantee uninterrupted access or that content will be error-free</li>
        <li>We are not responsible for actions you take based on the content or prompts provided</li>
        <li>Beta services are provided without warranties and may change or be discontinued</li>
      </ul>

      <h2>11.&nbsp;&nbsp;Limitation of Liability</h2>
      <ul>
        <li>We are not liable for indirect, incidental, special, or consequential damages, to the fullest extent permitted by law</li>
        <li>Our total liability to you for any claims shall not exceed the total amount paid by you to us in the 6 months preceding the claim</li>
        <li>We are not liable for AI-generated content, service interruptions, or beta feature limitations</li>
      </ul>

      <h2>12.&nbsp;&nbsp;Indemnity</h2>
      <p>You agree to indemnify and hold harmless PromptAndGo, its officers, employees, and partners from any claims, damages, or expenses arising from your use of the Site, AI tools, or breach of these Terms.</p>

      <h2>13.&nbsp;&nbsp;Third-Party Links and Services</h2>
      <p>The Site may contain links to third-party websites and relies on third-party AI providers. We are not responsible for their content, policies, practices, or service availability.</p>

      <h2>14.&nbsp;&nbsp;Governing Law</h2>
      <p>These Terms are governed by and construed in accordance with the laws of Singapore. You agree to submit to the exclusive jurisdiction of the Singapore courts.</p>

      <h2>15.&nbsp;&nbsp;Changes to the Terms</h2>
      <p>We may update these Terms at any time by posting a new version on this page, particularly as our AI services evolve. Your continued use of the Site constitutes acceptance of the updated Terms.</p>

      <h2>16.&nbsp;&nbsp;Contact Us</h2>
      <p>If you have any questions about these Terms, please contact:</p>
      <p>
        PromptAndGo<br />
        Email: <a href="mailto:legal@promptandgo.ai">legal@promptandgo.ai</a><br />
        Jurisdiction: Singapore
      </p>

      <h2>17.&nbsp;&nbsp;Refunds, Cancellations &amp; Business Discontinuation</h2>
      
      <h3>Standard Refund Policy</h3>
      <p>All sales of digital products, including prompt packs, downloads, and memberships, are final. We do not offer refunds, exchanges, or cancellations once a purchase is completed, except as required under Singapore law or as specified below.</p>
      <p>If a digital product is defective, inaccessible, or not as described, you must notify us within 7 days of purchase at <a href="mailto:legal@promptandgo.ai">legal@promptandgo.ai</a> so we can investigate and, if appropriate, provide a replacement or alternative remedy.</p>
      <p>Note that changes to AI service limits, features, or availability do not constitute grounds for refunds, as these services are clearly marked as beta and subject to modification.</p>
      
      <h3>Monthly Membership Cancellation</h3>
      <p>Monthly memberships ($12.99/month) can be cancelled at any time. Upon cancellation, your membership benefits will continue until the end of your current billing period, after which no further charges will occur.</p>
      
      <h3>Business Discontinuation Rights</h3>
      <p><strong>IMPORTANT:</strong> We reserve the absolute right to discontinue, suspend, or terminate PromptAndGo's operations at any time, for any reason, with or without notice. This includes but is not limited to:</p>
      <ul>
        <li>Permanent closure of the website and services</li>
        <li>Discontinuation of specific features, AI tools, or product lines</li>
        <li>Changes in business model or operational structure</li>
        <li>Technical, financial, or legal constraints</li>
      </ul>
      
      <h3>Lifetime Access Limitations</h3>
      <p>Lifetime Access purchases ($99.50) provide ongoing access to PromptAndGo services <strong>for as long as the business operates</strong>. "Lifetime" refers to the operational life of PromptAndGo, not the user's natural lifetime. In the event of business discontinuation:</p>
      <ul>
        <li>No refunds will be provided for Lifetime Access purchases</li>
        <li>We may, at our sole discretion, provide reasonable advance notice when possible</li>
        <li>We may attempt to provide alternative access or export tools, but this is not guaranteed</li>
        <li>Users acknowledge that business closure is a normal commercial risk</li>
      </ul>
      
      <h3>Force Majeure and Service Interruption</h3>
      <p>We are not liable for service interruptions, data loss, or business discontinuation due to circumstances beyond our reasonable control, including but not limited to:</p>
      <ul>
        <li>Technical failures, cyber attacks, or infrastructure issues</li>
        <li>Changes in third-party AI provider policies or availability</li>
        <li>Legal or regulatory changes</li>
        <li>Economic conditions or market changes</li>
        <li>Natural disasters, pandemics, or other force majeure events</li>
      </ul>
      
      <p><strong>By purchasing any services, including Lifetime Access, you acknowledge and agree that PromptAndGo may discontinue operations without liability for refunds or damages.</strong></p>
    </section>
  </main>
  </>
);

export default Terms;