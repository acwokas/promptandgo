import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import { LoginWidgetProvider } from "@/hooks/useLoginWidget";
import { ScrollToTop } from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy-load every legacy page component
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Auth = lazy(() => import("@/pages/Auth"));
const PromptLibrary = lazy(() => import("@/pages/PromptLibrary"));
const PromptPacks = lazy(() => import("@/pages/PromptPacks"));
const SubmitPrompt = lazy(() => import("@/pages/SubmitPrompt"));
const Cart = lazy(() => import("@/pages/Cart"));
const CheckoutSuccess = lazy(() => import("@/pages/CheckoutSuccess"));
const CheckoutCanceled = lazy(() => import("@/pages/CheckoutCanceled"));
const MembershipSuccess = lazy(() => import("@/pages/MembershipSuccess"));
const MembershipCanceled = lazy(() => import("@/pages/MembershipCanceled"));
const EmailConfirmed = lazy(() => import("@/pages/EmailConfirmed"));
const ShareRedirect = lazy(() => import("@/pages/ShareRedirect"));
const PromptOptimizer = lazy(() => import("@/pages/PromptOptimizer"));
const PromptStudio = lazy(() => import("@/pages/PromptStudio"));
const AIAssistant = lazy(() => import("@/pages/AIAssistant"));
const AIPromptGenerator = lazy(() => import("@/pages/AIPromptGenerator"));
const AICreditsExhausted = lazy(() => import("@/pages/AICreditsExhausted"));
const AskScout = lazy(() => import("@/pages/AskScout"));
const Toolkit = lazy(() => import("@/pages/Toolkit"));
const Certification = lazy(() => import("@/pages/Certification"));
const SavedPrompts = lazy(() => import("@/pages/SavedPrompts"));
const PromptHistory = lazy(() => import("@/pages/PromptHistory"));
const PromptTemplates = lazy(() => import("@/pages/PromptTemplates"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const Account = lazy(() => import("@/pages/account/Account"));
const Profile = lazy(() => import("@/pages/account/Profile"));
const Notifications = lazy(() => import("@/pages/account/Notifications"));
const Security = lazy(() => import("@/pages/account/Security"));
const Purchases = lazy(() => import("@/pages/account/Purchases"));
const Favorites = lazy(() => import("@/pages/account/Favorites"));
const AIPreferences = lazy(() => import("@/pages/account/AIPreferences"));
const XPDashboard = lazy(() => import("@/pages/account/XPDashboard"));
const Search = lazy(() => import("@/pages/Search"));
const Referral = lazy(() => import("@/pages/Referral"));
const HelpCenter = lazy(() => import("@/pages/HelpCenter"));
const Community = lazy(() => import("@/pages/Community"));
const Testimonials = lazy(() => import("@/pages/Testimonials"));
const Tutorial = lazy(() => import("@/pages/Tutorial"));
const Careers = lazy(() => import("@/pages/Careers"));
const Partners = lazy(() => import("@/pages/Partners"));
const Enterprise = lazy(() => import("@/pages/Enterprise"));
const ApiDocs = lazy(() => import("@/pages/ApiDocs"));
const Integrations = lazy(() => import("@/pages/Integrations"));
const Changelog = lazy(() => import("@/pages/Changelog"));
const StatusPage = lazy(() => import("@/pages/StatusPage"));
const HtmlSitemap = lazy(() => import("@/pages/HtmlSitemap"));
const KeyboardShortcuts = lazy(() => import("@/pages/KeyboardShortcuts"));
const PlatformComparison = lazy(() => import("@/pages/PlatformComparison"));
const SmallBusiness = lazy(() => import("@/pages/SmallBusiness"));
const SingaporeStartups = lazy(() => import("@/pages/SingaporeStartups"));
const LanguageLearning = lazy(() => import("@/pages/LanguageLearning"));
const NewsletterArchive = lazy(() => import("@/pages/NewsletterArchive"));
const UseCases = lazy(() => import("@/pages/UseCases"));

const queryClient = new QueryClient();

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
  </div>
);

interface Props { initialPath?: string }
export default function LegacyApp({ initialPath = "/" }: Props) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <MemoryRouter initialEntries={[initialPath]}>
                <SidebarProvider defaultOpen={false}>
                  <LoginWidgetProvider>
                    <ScrollToTop />
                    <Suspense fallback={<Spinner />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/library" element={<PromptLibrary />} />
                        <Route path="/packs" element={<PromptPacks />} />
                        <Route path="/saved" element={<SavedPrompts />} />
                        <Route path="/submit" element={<SubmitPrompt />} />
                        <Route path="/submit-prompt" element={<SubmitPrompt />} />
                        <Route path="/templates" element={<PromptTemplates />} />
                        <Route path="/history" element={<PromptHistory />} />
                        <Route path="/optimize" element={<PromptOptimizer />} />
                        <Route path="/ai/studio" element={<PromptStudio />} />
                        <Route path="/ai/assistant" element={<AIAssistant />} />
                        <Route path="/ai/generator" element={<AIPromptGenerator />} />
                        <Route path="/ai-credits-exhausted" element={<AICreditsExhausted />} />
                        <Route path="/ask-scout" element={<AskScout />} />
                        <Route path="/scout" element={<Toolkit />} />
                        <Route path="/certification" element={<Certification />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout/success" element={<CheckoutSuccess />} />
                        <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
                        <Route path="/membership/success" element={<MembershipSuccess />} />
                        <Route path="/membership/canceled" element={<MembershipCanceled />} />
                        <Route path="/email-confirmed" element={<EmailConfirmed />} />
                        <Route path="/s/:shortCode" element={<ShareRedirect />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/account/profile" element={<Profile />} />
                        <Route path="/account/notifications" element={<Notifications />} />
                        <Route path="/account/security" element={<Security />} />
                        <Route path="/account/purchases" element={<Purchases />} />
                        <Route path="/account/favorites" element={<Favorites />} />
                        <Route path="/account/ai-preferences" element={<AIPreferences />} />
                        <Route path="/account/xp" element={<XPDashboard />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/referral" element={<Referral />} />
                        <Route path="/help" element={<HelpCenter />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/testimonials" element={<Testimonials />} />
                        <Route path="/tutorial" element={<Tutorial />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/partners" element={<Partners />} />
                        <Route path="/enterprise" element={<Enterprise />} />
                        <Route path="/api-docs" element={<ApiDocs />} />
                        <Route path="/integrations" element={<Integrations />} />
                        <Route path="/changelog" element={<Changelog />} />
                        <Route path="/status" element={<StatusPage />} />
                        <Route path="/sitemap" element={<HtmlSitemap />} />
                        <Route path="/shortcuts" element={<KeyboardShortcuts />} />
                        <Route path="/compare" element={<PlatformComparison />} />
                        <Route path="/small-business" element={<SmallBusiness />} />
                        <Route path="/singapore-startups" element={<SingaporeStartups />} />
                        <Route path="/language-learning" element={<LanguageLearning />} />
                        <Route path="/newsletter" element={<NewsletterArchive />} />
                        <Route path="/use-cases" element={<UseCases />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </LoginWidgetProvider>
                </SidebarProvider>
              </MemoryRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
