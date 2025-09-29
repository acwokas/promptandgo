import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Privacy = () => (
  <>
    <PageHero title={<>Privacy Policy</>} subtitle={<>How [bold]Prompt[close bold]and[bold]Go[close bold].ai collects, uses, and protects your data.</>} minHeightClass="min-h-[28svh]" />
    <main className="container py-10">
      <SEO title="Privacy Policy" description="Privacy Policy (PDPA, Singapore): how PromptandGo.ai collects, uses, and protects your data." />

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
            <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

    <p className="text-sm text-muted-foreground">Effective Date: 01 January 2025</p>
    <p className="text-sm text-muted-foreground mb-6">Jurisdiction: Singapore</p>

    <section className="prose prose-neutral max-w-none dark:prose-invert">
      <p>
        promptandgo (“we”, “our”, “us”) operates the website https://promptandgo.ai (the “Site”). We are
        committed to protecting your personal data in compliance with Singapore’s Personal Data Protection Act 2012 (PDPA)
        and other applicable laws.
      </p>
      <p>By using our Site, you agree to the terms of this Privacy Policy.</p>

      <h2>1.&nbsp;&nbsp;Information We Collect</h2>
      <p>We may collect the following types of personal data:</p>
      <ul>
        <li><strong>Contact Information</strong> – name, email address, and other details you provide when signing up or contacting us.</li>
        <li><strong>Account Information</strong> – username, password, profile settings, subscription details, and preferences if you create an account.</li>
        <li><strong>Usage Data</strong> – IP address, browser type, device information, pages visited, time spent on the Site, and AI tool usage patterns.</li>
        <li><strong>Content Submissions</strong> – prompts, AI-generated content, comments, feedback, favorites, or other materials you submit or interact with.</li>
        <li><strong>AI Interaction Data</strong> – conversations with AI tools, prompt inputs, generated outputs, usage frequency, and personalization data for Smart Suggestions.</li>
        <li><strong>Profile Context</strong> – industry, project type, preferred tone, desired outcomes, and other context you provide to enhance AI recommendations.</li>
        <li><strong>Transactional Data</strong> – payment details are processed securely via Stripe and other third-party payment providers; we do not store full credit card details. This includes purchases of Monthly Memberships ($12.99 USD/month), Lifetime Access ($99.50 USD), and individual Prompt Packs ($9.99 USD each).</li>
        <li><strong>Analytics Data</strong> – aggregated usage statistics, feature adoption metrics, and performance data for our AI services.</li>
        <li><strong>Behavioral Tracking Data</strong> – detailed user interaction patterns including:</li>
        <ul>
          <li>Page navigation history and time spent on each page</li>
          <li>Click tracking on buttons, links, and interactive elements</li>
          <li>Scroll depth and reading behavior patterns</li>
          <li>Form interaction data (fields focused, completion rates)</li>
          <li>Mouse movement patterns and exit intent signals</li>
          <li>Session duration, visit frequency, and return visitor identification</li>
          <li>Engagement scores and user intent level assessments</li>
          <li>Conversion funnel progression and drop-off points</li>
        </ul>
        <li><strong>Email Marketing Data</strong> – newsletter subscription status, email preferences, engagement metrics (opens, clicks), unsubscribe history, and lead magnet interactions.</li>
        <li><strong>Personalization Data</strong> – preferences, recommendation history, content interaction patterns, and algorithmic profiling for customized user experiences.</li>
        <li><strong>Social Proof Data</strong> – aggregated and anonymized user activity data used to display social proof elements (e.g., "X users copied this prompt today").</li>
      </ul>

      <h2>2.&nbsp;&nbsp;How We Use Your Information</h2>
      <p>We use your personal data to:</p>
      <ul>
        <li>Provide, maintain, and improve our services, including AI tools and personalized recommendations.</li>
        <li>Process your account registration and authenticate your access.</li>
        <li>Generate AI-powered prompts, suggestions, and assist with your queries through Scout, our AI Assistant.</li>
        <li>Track usage limits and quotas for our AI services (currently in beta).</li>
        <li>Personalize your experience based on your industry, project type, and preferences.</li>
        <li>Respond to your enquiries and support requests.</li>
        <li>Send you updates, newsletters, and marketing (only with your consent).</li>
        <li>Analyze usage patterns to improve our AI algorithms and service quality.</li>
        <li>Comply with legal obligations and enforce our terms of use.</li>
        <li><strong>Behavioral Analysis and Optimization</strong> – analyze user interactions, navigation patterns, and engagement levels to:</li>
        <ul>
          <li>Optimize website layout, content placement, and user interface design</li>
          <li>Personalize call-to-action messages and content recommendations</li>
          <li>Identify high-intent users for targeted messaging and offers</li>
          <li>Improve conversion rates and user experience optimization</li>
          <li>Generate engagement scores and user behavior insights</li>
        </ul>
        <li><strong>Email Marketing and Communication</strong> – deliver personalized newsletters, promotional content, lead magnets, and transactional messages based on user preferences and behavior patterns.</li>
        <li><strong>Social Proof Generation</strong> – create anonymized activity feeds and testimonials to demonstrate platform usage and build trust with new users.</li>
        <li><strong>A/B Testing and Experimentation</strong> – test different features, content, and user experience variations to optimize our services.</li>
        <li><strong>Fraud Prevention and Security</strong> – monitor for suspicious activity, prevent abuse, and protect user accounts and data.</li>
      </ul>

      <h2>3.&nbsp;&nbsp;How We Share Your Information</h2>
      <p>We do not sell your personal data. We may share your data with:</p>
      <ul>
        <li><strong>AI Service Providers</strong> – third-party AI providers (including OpenAI) to process your prompts and generate AI responses. These providers have their own privacy policies and data handling practices.</li>
        <li><strong>Payment Processors</strong> – transactions are processed by Stripe and other secure payment providers who have their own privacy policies and data handling practices.</li>
        <li><strong>Service Providers</strong> – third parties who help us operate the Site, such as hosting, analytics, and infrastructure services (including Supabase).</li>
        <li><strong>Email Service Providers</strong> – third-party services for newsletter delivery, email marketing campaigns, and transactional email communications.</li>
        <li><strong>Analytics and Tracking Services</strong> – services that help us understand user behavior, track conversions, and optimize our platform performance.</li>
        <li><strong>Legal Authorities</strong> – if required by law, court order, or government regulation.</li>
        <li><strong>Business Transfers</strong> – if promptandgo is acquired, merged, or reorganised.</li>
        <li><strong>Aggregated Data</strong> – we may share anonymized, aggregated usage statistics that do not identify individual users.</li>
        <li><strong>Social Proof Data</strong> – anonymized activity data may be shared in aggregate form to display social proof elements and testimonials.</li>
      </ul>

      <h2>4.&nbsp;&nbsp;International Data Transfers</h2>
      <p>
        As part of our operations, your data may be transferred and stored outside Singapore. We ensure that any such
        transfer complies with the PDPA and that the receiving party offers a comparable level of data protection.
      </p>

      <h2>5.&nbsp;&nbsp;Data Retention and Business Continuity</h2>
      <p>We retain your personal data only for as long as necessary to fulfil the purposes stated in this policy or as required by law. Specifically:</p>
      <ul>
        <li><strong>AI Conversation Data</strong> – stored for up to 30 days to improve service quality and provide support.</li>
        <li><strong>Account Data</strong> – retained while your account is active and for a reasonable period thereafter.</li>
        <li><strong>Usage Analytics</strong> – aggregated data may be retained indefinitely in anonymized form.</li>
        <li><strong>User-Generated Content</strong> – prompts and favorites are retained until you delete them or close your account.</li>
        <li><strong>Payment Records</strong> – transaction history retained for legal and accounting purposes as required by Singapore law.</li>
        <li><strong>Membership Data</strong> – subscription status and access rights maintained for active memberships and lifetime purchases.</li>
        <li><strong>Behavioral Tracking Data</strong> – session data and interaction patterns retained for up to 12 months for analytics and personalization purposes.</li>
        <li><strong>Email Marketing Data</strong> – subscription status and preferences retained until unsubscribe; engagement metrics retained for up to 24 months for campaign optimization.</li>
        <li><strong>Personalization Data</strong> – user preferences and recommendation history retained while account is active and for up to 6 months after account closure.</li>
      </ul>
      
      <h3>Business Discontinuation and Data Handling</h3>
      <p>In the event that promptandgo discontinues operations:</p>
      <ul>
        <li>We will make reasonable efforts to provide advance notice when possible</li>
        <li>User data will be handled in accordance with this privacy policy during any transition period</li>
        <li>We may provide data export tools or instructions where technically feasible</li>
        <li>All personal data will be securely deleted according to our standard retention schedule unless legally required otherwise</li>
        <li>No personal data will be transferred to third parties without explicit consent, except as required by law</li>
      </ul>

      <h2>6.&nbsp;&nbsp;Security</h2>
      <p>
        We implement reasonable administrative, technical, and physical safeguards to protect your personal data from
        unauthorised access, disclosure, alteration, or destruction. However, no method of transmission over the Internet is completely secure.
      </p>

      <h2>7.&nbsp;&nbsp;Your Rights</h2>
      <p>Under the PDPA, you have the right to:</p>
      <ul>
        <li>Access and request a copy of your personal data.</li>
        <li>Request correction of your personal data.</li>
        <li>Withdraw consent for the collection, use, or disclosure of your personal data.</li>
        <li>Request deletion of your personal data, subject to legal and contractual obligations.</li>
      </ul>
      <p>Requests can be made by contacting us at <a href="mailto:legal@promptandgo.ai">legal@promptandgo.ai</a>.</p>

      <h2>8.&nbsp;&nbsp;Use of Cookies and Tracking</h2>
      <p>We use cookies and similar technologies to:</p>
      <ul>
        <li>Improve your user experience and remember your preferences.</li>
        <li>Analyse Site performance and user behavior patterns.</li>
        <li>Deliver relevant content and personalized recommendations.</li>
        <li>Track user interactions for conversion optimization.</li>
        <li>Provide social proof and engagement metrics.</li>
        <li>Enable personalization features and smart recommendations.</li>
        <li>Monitor security and prevent fraudulent activity.</li>
      </ul>
      <p><strong>Specific Tracking Technologies:</strong></p>
      <ul>
        <li><strong>Essential Cookies</strong> – necessary for site functionality, authentication, and security</li>
        <li><strong>Analytics Cookies</strong> – track page views, user journeys, and site performance</li>
        <li><strong>Personalization Cookies</strong> – remember preferences and enable customized experiences</li>
        <li><strong>Marketing Cookies</strong> – track conversions, email signups, and campaign effectiveness</li>
        <li><strong>Behavioral Tracking Scripts</strong> – monitor user interactions, scroll behavior, and engagement patterns</li>
        <li><strong>Session Storage</strong> – temporary data storage for current session management</li>
        <li><strong>Local Storage</strong> – persistent storage for user preferences and behavior tracking</li>
      </ul>
      <p>You may disable cookies in your browser settings, but some Site features may not function properly. Disabling behavioral tracking may limit personalization features.</p>

      <h2>9.&nbsp;&nbsp;AI Services and Beta Features</h2>
      <p>
        Our AI tools (including Scout Prompt Generator, Smart Suggestions, and Scout Assistant) are currently in beta. 
        Please note that:
      </p>
      <ul>
        <li>Usage limits and quotas may change without notice as we optimize our services.</li>
        <li>AI-generated content may be used to improve our algorithms (in anonymized form).</li>
        <li>Beta services may be modified, suspended, or discontinued at any time.</li>
        <li>AI outputs are generated by third-party providers and we cannot guarantee their accuracy or appropriateness.</li>
        <li>Personalization algorithms may evolve and change based on user behavior patterns and service improvements.</li>
        <li>Behavioral tracking data may be used to enhance AI recommendations and user experience optimization.</li>
      </ul>

      <h2>10.&nbsp;&nbsp;Email Marketing and Communication Preferences</h2>
      <p>We offer various email communication services:</p>
      <ul>
        <li><strong>Newsletter Subscriptions</strong> – periodic updates about new features, prompts, and AI industry insights</li>
        <li><strong>Lead Magnets</strong> – free resources offered in exchange for email subscription</li>
        <li><strong>Promotional Campaigns</strong> – information about discounts, new products, and special offers</li>
        <li><strong>Behavioral Triggered Emails</strong> – automated messages based on user actions and engagement patterns</li>
        <li><strong>Transactional Emails</strong> – account notifications, purchase confirmations, and service updates</li>
      </ul>
      <p>Email communication practices:</p>
      <ul>
        <li>All marketing emails include clear unsubscribe options</li>
        <li>We track email engagement (opens, clicks) to improve content and deliverability</li>
        <li>Email preferences can be managed through your account settings</li>
        <li>We may personalize email content based on your usage patterns and interests</li>
        <li>Transactional emails cannot be opted out while maintaining an active account</li>
        <li>Email data is processed by third-party email service providers with appropriate data protection measures</li>
      </ul>

      <h2>11.&nbsp;&nbsp;Third-Party Links</h2>
      <p>
        Our Site may contain links to external websites. We are not responsible for the privacy practices or content of those third-party sites.
      </p>

      <h2>12.&nbsp;&nbsp;Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version will be posted on this page with a new “Effective Date.”
      </p>

      <h2>13.&nbsp;&nbsp;Contact Us</h2>
      <p>If you have any questions about this Privacy Policy or our data practices, please contact:</p>
      <p>
        <strong>prompt</strong>andgo<br />
        Email: <a href="mailto:legal@promptandgo.ai">legal@promptandgo.ai</a><br />
        Jurisdiction: Singapore
      </p>
    </section>
  </main>
  </>
);

export default Privacy;
