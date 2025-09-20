import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AppSidebar } from "@/components/AppSidebar";
import ConversionBar from "@/components/layout/ConversionBar";
import ExitIntentPopup from "@/components/conversion/ExitIntentPopup";
import LiveActivityTicker from "@/components/conversion/LiveActivityTicker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PromptLibrary from "./pages/PromptLibrary";
import PromptPacks from "./pages/PromptPacks";
import SubmitPrompt from "./pages/SubmitPrompt";
import Blog from "./pages/Blog";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQs from "./pages/FAQs";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Header from "@/components/layout/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import Footer from "@/components/layout/Footer";
import GlobalStructuredData from "@/components/seo/GlobalStructuredData";
import WelcomeToPromptAndGo from "./pages/blog/WelcomeToPromptAndGo";
import BestAIPromptsForSmallBusiness2025 from "./pages/blog/BestAIPromptsForSmallBusiness2025";
import HowToWriteAIPrompts from "./pages/blog/HowToWriteAIPrompts";
import AIPromptsThatSaveYouHours from "./pages/blog/AIPromptsThatSaveYouHours";
import AIPromptsForMarketingCampaigns from "./pages/blog/AIPromptsForMarketingCampaigns";
import AIPromptsForCustomerSupport from "./pages/blog/AIPromptsForCustomerSupport";
import AIPromptsForSocialMediaContent from "./pages/blog/AIPromptsForSocialMediaContent";
import AIPromptsForContentWriters from "./pages/blog/AIPromptsForContentWriters";
import AIPromptsForBusinessStrategy from "./pages/blog/AIPromptsForBusinessStrategy";
import BeginnersGuideMidjourneyPrompts from "./pages/blog/BeginnersGuideMidjourneyPrompts";
import Auth from "./pages/Auth";
import AdminBulkUpload from "./pages/AdminBulkUpload";
import AdminTools from "./pages/AdminTools";
import AdminPromptTool from "./pages/AdminPromptTool";
import AdminExport from "./pages/AdminExport";
import AdminWidgetSettings from "./pages/AdminWidgetSettings";
import AdminFeedback from "./pages/AdminFeedback";
import AdminPolls from "./pages/AdminPolls";
import AdminArticles from "./pages/AdminArticles";
import AdminArticleEditor from "./pages/AdminArticleEditor";
import AdminCountdownSettings from "./pages/AdminCountdownSettings";
import TipsIndex from "./pages/TipsIndex";
import ArticleView from "./pages/ArticleView";
import FavoritesPage from "./pages/account/Favorites";
import AccountPage from "./pages/account/Account";
import PurchasesPage from "./pages/account/Purchases";
import ProfilePage from "./pages/account/Profile";
import NotificationsPage from "./pages/account/Notifications";
import SecurityPage from "./pages/account/Security";
import AIPreferencesPage from "./pages/account/AIPreferences";

import CartPage from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCanceled from "./pages/CheckoutCanceled";
import MembershipSuccess from "./pages/MembershipSuccess";
import MembershipCanceled from "./pages/MembershipCanceled";
import EmailConfirmed from "./pages/EmailConfirmed";
import ShareRedirect from "./pages/ShareRedirect";
import AuthEffects from "@/components/auth/AuthEffects";
import ContextPopup from "@/components/ContextPopup";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { LoginWidget } from "@/components/LoginWidget";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { LoginWidgetProvider } from "@/hooks/useLoginWidget";
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";
import AIPromptGeneratorPage from "./pages/AIPromptGenerator";

import AIAssistantPage from "./pages/AIAssistant";
import ToolkitPage from "./pages/Toolkit";
import PromptStudioPage from "./pages/PromptStudio";

import AICreditsExhaustedPage from "./pages/AICreditsExhausted";
import GAListener from "@/components/analytics/GAListener";

const queryClient = new QueryClient();

const App = () => {
  return (
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
  );
};

const AppContent = () => {
  const { shouldShowPopup, dismissPopup, markContextFieldsCompleted } = usePageVisitTracker();
  const { user } = useSupabaseAuth();

  return (
    <SidebarProvider defaultOpen={false}>
      <LoginWidgetProvider>
        <GlobalStructuredData />
        <ConversionBar />
        
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          
          <main className="flex-1 flex flex-col min-w-0">
            {/* Simplified Header */}
            <Header />
            
            {/* Main content */}
            <div className="flex-1">
              <ScrollToTop />
              <GAListener />
              <AuthEffects />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/library" element={<PromptLibrary />} />
                <Route path="/packs" element={<PromptPacks />} />
                <Route path="/submit" element={<SubmitPrompt />} />
                <Route path="/submit-prompt" element={<SubmitPrompt />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/tips" element={<TipsIndex />} />
                <Route path="/tips/:slug" element={<ArticleView />} />
                {/* Legacy blog routes - keep for SEO */}
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
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/contact" element={<Contact />} />
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
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/profile" element={<ProfilePage />} />
                <Route path="/account/notifications" element={<NotificationsPage />} />
                <Route path="/account/security" element={<SecurityPage />} />
                <Route path="/account/purchases" element={<PurchasesPage />} />
                <Route path="/account/favorites" element={<FavoritesPage />} />
                <Route path="/account/ai-preferences" element={<AIPreferencesPage />} />
                
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
                <Route path="/membership/success" element={<MembershipSuccess />} />
                <Route path="/membership/canceled" element={<MembershipCanceled />} />
                <Route path="/email-confirmed" element={<EmailConfirmed />} />
                <Route path="/s/:shortCode" element={<ShareRedirect />} />
                <Route path="/scout" element={<ToolkitPage />} />
                <Route path="/ai/generator" element={<AIPromptGeneratorPage />} />
                <Route path="/ai/studio" element={<PromptStudioPage />} />
                
                <Route path="/ai/assistant" element={<AIAssistantPage />} />
                <Route path="/ai-credits-exhausted" element={<AICreditsExhaustedPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            
            {/* Footer */}
            <Footer />
          </main>
        </div>
        
        <ContextPopup
          isOpen={shouldShowPopup}
          onClose={() => dismissPopup(false)}
          onDismissPermanently={() => dismissPopup(true)}
          onComplete={markContextFieldsCompleted}
        />
        
        {/* Show feedback widget for logged in users, login widget for guests */}
        {user ? <FeedbackWidget /> : <LoginWidget />}
        
        {/* Exit intent popup for conversion */}
        <ExitIntentPopup />
        
        {/* Live activity ticker */}
        <LiveActivityTicker />
      </LoginWidgetProvider>
    </SidebarProvider>
  );
};

export default App;
