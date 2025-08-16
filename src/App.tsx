import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import Auth from "./pages/Auth";
import AdminBulkUpload from "./pages/AdminBulkUpload";
import AdminTools from "./pages/AdminTools";
import AdminPromptTool from "./pages/AdminPromptTool";
import AdminExport from "./pages/AdminExport";
import AdminWidgetSettings from "./pages/AdminWidgetSettings";
import AdminFeedback from "./pages/AdminFeedback";
import FavoritesPage from "./pages/account/Favorites";
import AccountPage from "./pages/account/Account";
import PurchasesPage from "./pages/account/Purchases";
import ProfilePage from "./pages/account/Profile";
import NotificationsPage from "./pages/account/Notifications";
import SecurityPage from "./pages/account/Security";
import MyGeneratedPrompts from "./pages/account/MyGeneratedPrompts";
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
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";
import AIPromptGeneratorPage from "./pages/AIPromptGenerator";
import SmartSuggestionsPage from "./pages/SmartSuggestions";
import AIAssistantPage from "./pages/AIAssistant";
import ToolkitPage from "./pages/Toolkit";

import AICreditsExhaustedPage from "./pages/AICreditsExhausted";

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

  return (
    <>
      <GlobalStructuredData />
      <Header />
      <AuthEffects />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/library" element={<PromptLibrary />} />
        <Route path="/packs" element={<PromptPacks />} />
        <Route path="/submit" element={<SubmitPrompt />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/welcome-to-promptandgo-ai" element={<WelcomeToPromptAndGo />} />
        <Route path="/blog/best-ai-prompts-for-small-business-2025" element={<BestAIPromptsForSmallBusiness2025 />} />
        <Route path="/blog/how-to-write-ai-prompts" element={<HowToWriteAIPrompts />} />
        <Route path="/blog/ai-prompts-that-save-you-hours" element={<AIPromptsThatSaveYouHours />} />
        <Route path="/blog/ai-prompts-for-marketing-campaigns" element={<AIPromptsForMarketingCampaigns />} />
        <Route path="/blog/ai-prompts-for-customer-support" element={<AIPromptsForCustomerSupport />} />
        <Route path="/blog/ai-prompts-for-social-media-content" element={<AIPromptsForSocialMediaContent />} />
        <Route path="/blog/ai-prompts-for-content-writers" element={<AIPromptsForContentWriters />} />
        <Route path="/blog/ai-prompts-for-business-strategy" element={<AIPromptsForBusinessStrategy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminTools />} />
        <Route path="/admin/upload" element={<AdminBulkUpload />} />
        <Route path="/admin/prompts" element={<AdminPromptTool />} />
        <Route path="/admin/export" element={<AdminExport />} />
        <Route path="/admin/widgets" element={<AdminWidgetSettings />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/notifications" element={<NotificationsPage />} />
        <Route path="/account/security" element={<SecurityPage />} />
        <Route path="/account/purchases" element={<PurchasesPage />} />
        <Route path="/account/favorites" element={<FavoritesPage />} />
        <Route path="/account/generated" element={<MyGeneratedPrompts />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
        <Route path="/membership/success" element={<MembershipSuccess />} />
        <Route path="/membership/canceled" element={<MembershipCanceled />} />
        <Route path="/email-confirmed" element={<EmailConfirmed />} />
        <Route path="/s/:shortCode" element={<ShareRedirect />} />
        <Route path="/toolkit" element={<ToolkitPage />} />
        <Route path="/ai/generator" element={<AIPromptGeneratorPage />} />
        <Route path="/ai/suggestions" element={<SmartSuggestionsPage />} />
        <Route path="/ai/assistant" element={<AIAssistantPage />} />
        <Route path="/ai-credits-exhausted" element={<AICreditsExhaustedPage />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      
      <ContextPopup
        isOpen={shouldShowPopup}
        onClose={() => dismissPopup(false)}
        onDismissPermanently={() => dismissPopup(true)}
        onComplete={markContextFieldsCompleted}
      />
      
      <FeedbackWidget />
    </>
  );
};

export default App;
