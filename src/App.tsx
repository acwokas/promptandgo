import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/hooks/useTheme";

import ExitIntentPopup from "@/components/conversion/ExitIntentPopup";
import Header from "@/components/layout/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import Footer from "@/components/layout/Footer";
import GlobalStructuredData from "@/components/seo/GlobalStructuredData";
import AuthEffects from "@/components/auth/AuthEffects";
import ContextPopup from "@/components/ContextPopup";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { LoginWidget } from "@/components/LoginWidget";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { LoginWidgetProvider } from "@/hooks/useLoginWidget";
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";
import GAListener from "@/components/analytics/GAListener";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import ErrorBoundary from "@/components/ErrorBoundary";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";

// Lazy-loaded route components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PromptLibrary = lazy(() => import("./pages/PromptLibrary"));
const PromptPacks = lazy(() => import("./pages/PromptPacks"));
const SubmitPrompt = lazy(() => import("./pages/SubmitPrompt"));
const Blog = lazy(() => import("./pages/Blog"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQs = lazy(() => import("./pages/FAQs"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Contact = lazy(() => import("./pages/Contact"));
const SingaporeStartups = lazy(() => import("./pages/SingaporeStartups"));
const WelcomeToPromptAndGo = lazy(() => import("./pages/blog/WelcomeToPromptAndGo"));
const BestAIPromptsForSmallBusiness2025 = lazy(() => import("./pages/blog/BestAIPromptsForSmallBusiness2025"));
const HowToWriteAIPrompts = lazy(() => import("./pages/blog/HowToWriteAIPrompts"));
const AIPromptsThatSaveYouHours = lazy(() => import("./pages/blog/AIPromptsThatSaveYouHours"));
const AIPromptsForMarketingCampaigns = lazy(() => import("./pages/blog/AIPromptsForMarketingCampaigns"));
const AIPromptsForCustomerSupport = lazy(() => import("./pages/blog/AIPromptsForCustomerSupport"));
const AIPromptsForSocialMediaContent = lazy(() => import("./pages/blog/AIPromptsForSocialMediaContent"));
const AIPromptsForContentWriters = lazy(() => import("./pages/blog/AIPromptsForContentWriters"));
const AIPromptsForBusinessStrategy = lazy(() => import("./pages/blog/AIPromptsForBusinessStrategy"));
const BeginnersGuideMidjourneyPrompts = lazy(() => import("./pages/blog/BeginnersGuideMidjourneyPrompts"));
const AIPromptsInAsianLanguages = lazy(() => import("./pages/blog/AIPromptsInAsianLanguages"));
const MultiPlatformPromptingGuide = lazy(() => import("./pages/blog/MultiPlatformPromptingGuide"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminBulkUpload = lazy(() => import("./pages/AdminBulkUpload"));
const AdminTools = lazy(() => import("./pages/AdminTools"));
const AdminPromptTool = lazy(() => import("./pages/AdminPromptTool"));
const AdminExport = lazy(() => import("./pages/AdminExport"));
const AdminWidgetSettings = lazy(() => import("./pages/AdminWidgetSettings"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback"));
const AdminPolls = lazy(() => import("./pages/AdminPolls"));
const AdminArticles = lazy(() => import("./pages/AdminArticles"));
const AdminArticleEditor = lazy(() => import("./pages/AdminArticleEditor"));
const AdminCountdownSettings = lazy(() => import("./pages/AdminCountdownSettings"));
const AdminSecurity = lazy(() => import("./pages/AdminSecurity"));
const AdminCoupons = lazy(() => import("./pages/AdminCoupons"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const TipsIndex = lazy(() => import("./pages/TipsIndex"));
const ArticleView = lazy(() => import("./pages/ArticleView"));
const FavoritesPage = lazy(() => import("./pages/account/Favorites"));
const AccountPage = lazy(() => import("./pages/account/Account"));
const PurchasesPage = lazy(() => import("./pages/account/Purchases"));
const ProfilePage = lazy(() => import("./pages/account/Profile"));
const NotificationsPage = lazy(() => import("./pages/account/Notifications"));
const SecurityPage = lazy(() => import("./pages/account/Security"));
const AIPreferencesPage = lazy(() => import("./pages/account/AIPreferences"));
const XPDashboard = lazy(() => import("./pages/account/XPDashboard"));
const CartPage = lazy(() => import("./pages/Cart"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCanceled = lazy(() => import("./pages/CheckoutCanceled"));
const MembershipSuccess = lazy(() => import("./pages/MembershipSuccess"));
const MembershipCanceled = lazy(() => import("./pages/MembershipCanceled"));
const EmailConfirmed = lazy(() => import("./pages/EmailConfirmed"));
const ShareRedirect = lazy(() => import("./pages/ShareRedirect"));
const AIPromptGeneratorPage = lazy(() => import("./pages/AIPromptGenerator"));
const AIAssistantPage = lazy(() => import("./pages/AIAssistant"));
const ToolkitPage = lazy(() => import("./pages/Toolkit"));
const PromptStudioPage = lazy(() => import("./pages/PromptStudio"));
const CertificationPage = lazy(() => import("./pages/Certification"));
const AICreditsExhaustedPage = lazy(() => import("./pages/AICreditsExhausted"));
const PromptOptimizerPage = lazy(() => import("./pages/PromptOptimizer"));
const SavedPromptsPage = lazy(() => import("./pages/SavedPrompts"));
const MarketInsights = lazy(() => import("./pages/MarketInsights"));
const MalaysiaInsights = lazy(() => import("./pages/market/MalaysiaInsights"));
const IndonesiaInsights = lazy(() => import("./pages/market/IndonesiaInsights"));
const VietnamInsights = lazy(() => import("./pages/market/VietnamInsights"));
const AustraliaInsights = lazy(() => import("./pages/market/AustraliaInsights"));
const SmallBusiness = lazy(() => import("./pages/SmallBusiness"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AskScout = lazy(() => import("./pages/AskScout"));
const HelpCenterPage = lazy(() => import("./pages/HelpCenter"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LanguageLearning = lazy(() => import("./pages/LanguageLearning"));
const PromptTemplates = lazy(() => import("./pages/PromptTemplates"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const Community = lazy(() => import("./pages/Community"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Integrations = lazy(() => import("./pages/Integrations"));
const SearchPage = lazy(() => import("./pages/Search"));
const PlatformComparison = lazy(() => import("./pages/PlatformComparison"));
const BlogArticle = lazy(() => import("@/components/blog/BlogArticle"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const ReferralPage = lazy(() => import("./pages/Referral"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Tutorial = lazy(() => import("./pages/Tutorial"));
const Glossary = lazy(() => import("./pages/Glossary"));
const NewsletterArchive = lazy(() => import("./pages/NewsletterArchive"));
const HtmlSitemap = lazy(() => import("./pages/HtmlSitemap"));
const KeyboardShortcuts = lazy(() => import("./pages/KeyboardShortcuts"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Partners = lazy(() => import("./pages/Partners"));
const UseCasesPage = lazy(() => import("./pages/UseCases"));
const StatusPage = lazy(() => import("./pages/StatusPage"));
const JapaneseLanding = lazy(() => import("./pages/JapaneseLanding"));
const KoreanLanding = lazy(() => import("./pages/KoreanLanding"));
const ChineseLanding = lazy(() => import("./pages/ChineseLanding"));
const CareersPage = lazy(() => import("./pages/Careers"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicy"));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-primary animate-pulse">P</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">読み込み中... Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

const AppContent = () => {
  const { shouldShowPopup, dismissPopup, markContextFieldsCompleted } = usePageVisitTracker();
  const { user } = useSupabaseAuth();

  return (
    <SidebarProvider defaultOpen={false}>
      <LoginWidgetProvider>
        <GlobalStructuredData />
        
        <div className="flex min-h-screen w-full overflow-hidden">
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          <AppSidebar />
          <main id="main-content" className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
            <Header />
            <div className="flex-1 w-full overflow-x-hidden max-w-full" role="main">
              <ScrollToTop />
              <AnalyticsProvider>
              <GAListener />
              <AuthEffects />
              <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/library" element={<PromptLibrary />} />
                <Route path="/packs" element={<PromptPacks />} />
                <Route path="/saved" element={<SavedPromptsPage />} />
                <Route path="/submit" element={<SubmitPrompt />} />
                <Route path="/submit-prompt" element={<SubmitPrompt />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/tips" element={<TipsIndex />} />
                <Route path="/tips/:slug" element={<ArticleView />} />
                <Route path="/tips/welcome-to-promptandgo-ai" element={<WelcomeToPromptAndGo />} />
                <Route path="/tips/best-ai-prompts-for-small-business-2025" element={<BestAIPromptsForSmallBusiness2025 />} />
                <Route path="/tips/how-to-write-ai-prompts" element={<HowToWriteAIPrompts />} />
                <Route path="/tips/ai-prompts-that-save-you-hours" element={<AIPromptsThatSaveYouHours />} />
                <Route path="/tips/ai-prompts-for-marketing-campaigns" element={<AIPromptsForMarketingCampaigns />} />
                <Route path="/tips/ai-prompts-for-customer-support" element={<AIPromptsForCustomerSupport />} />
                <Route path="/tips/ai-prompts-for-social-media-content" element={<AIPromptsForSocialMediaContent />} />
                <Route path="/tips/ai-prompts-for-content-writers" element={<AIPromptsForContentWriters />} />
                <Route path="/tips/ai-prompts-for-business-strategy" element={<AIPromptsForBusinessStrategy />} />
                <Route path="/tips/beginners-guide-midjourney-prompts" element={<BeginnersGuideMidjourneyPrompts />} />
                <Route path="/tips/ai-prompts-in-asian-languages" element={<AIPromptsInAsianLanguages />} />
                <Route path="/tips/multi-platform-prompting-guide" element={<MultiPlatformPromptingGuide />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/singapore-startups" element={<SingaporeStartups />} />
                <Route path="/small-business" element={<SmallBusiness />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/market-insights" element={<MarketInsights />} />
                <Route path="/market-insights/malaysia" element={<MalaysiaInsights />} />
                <Route path="/market-insights/indonesia" element={<IndonesiaInsights />} />
                <Route path="/market-insights/vietnam" element={<VietnamInsights />} />
                <Route path="/market-insights/australia" element={<AustraliaInsights />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<AdminTools />} />
                <Route path="/admin/polls" element={<AdminPolls />} />
                <Route path="/admin/upload" element={<AdminBulkUpload />} />
                <Route path="/admin/prompts" element={<AdminPromptTool />} />
                <Route path="/admin/export" element={<AdminExport />} />
                <Route path="/admin/widgets" element={<AdminWidgetSettings />} />
                <Route path="/admin/feedback" element={<AdminFeedback />} />
                <Route path="/admin/articles" element={<AdminArticles />} />
                <Route path="/admin/articles/new" element={<AdminArticleEditor />} />
                <Route path="/admin/countdown" element={<AdminCountdownSettings />} />
                <Route path="/admin/security" element={<AdminSecurity />} />
                <Route path="/admin/coupons" element={<AdminCoupons />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/profile" element={<ProfilePage />} />
                <Route path="/account/notifications" element={<NotificationsPage />} />
                <Route path="/account/security" element={<SecurityPage />} />
                <Route path="/account/purchases" element={<PurchasesPage />} />
                <Route path="/account/favorites" element={<FavoritesPage />} />
                <Route path="/account/ai-preferences" element={<AIPreferencesPage />} />
                <Route path="/account/xp" element={<XPDashboard />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
                <Route path="/membership/success" element={<MembershipSuccess />} />
                <Route path="/membership/canceled" element={<MembershipCanceled />} />
                <Route path="/email-confirmed" element={<EmailConfirmed />} />
                <Route path="/s/:shortCode" element={<ShareRedirect />} />
                <Route path="/scout" element={<ToolkitPage />} />
                <Route path="/ask-scout" element={<AskScout />} />
                <Route path="/ai/generator" element={<AIPromptGeneratorPage />} />
                <Route path="/ai/studio" element={<PromptStudioPage />} />
                <Route path="/ai/assistant" element={<AIAssistantPage />} />
                <Route path="/ai-credits-exhausted" element={<AICreditsExhaustedPage />} />
                <Route path="/certification" element={<CertificationPage />} />
                <Route path="/optimize" element={<PromptOptimizerPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/language-learning" element={<LanguageLearning />} />
                <Route path="/templates" element={<PromptTemplates />} />
                <Route path="/enterprise" element={<Enterprise />} />
                <Route path="/api-docs" element={<ApiDocs />} />
                <Route path="/community" element={<Community />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/compare" element={<PlatformComparison />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/referral" element={<ReferralPage />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/tutorial" element={<Tutorial />} />
                <Route path="/glossary" element={<Glossary />} />
                <Route path="/newsletter" element={<NewsletterArchive />} />
                <Route path="/sitemap" element={<HtmlSitemap />} />
                <Route path="/shortcuts" element={<KeyboardShortcuts />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/use-cases" element={<UseCasesPage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/ja" element={<JapaneseLanding />} />
                <Route path="/ko" element={<KoreanLanding />} />
                <Route path="/zh" element={<ChineseLanding />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/cookies" element={<CookiePolicyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
              </AnalyticsProvider>
            </div>
            <Footer />
          </main>
        </div>
        
        <ContextPopup
          isOpen={shouldShowPopup}
          onClose={() => dismissPopup(false)}
          onDismissPermanently={() => dismissPopup(true)}
          onComplete={markContextFieldsCompleted}
        />
        
        {user ? <FeedbackWidget /> : <LoginWidget />}
        <ExitIntentPopup />
        <PWAInstallPrompt />
        <BackToTop />
        <CookieConsent />
        <OnboardingModal />
      </LoginWidgetProvider>
    </SidebarProvider>
  );
};

export default App;
