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
import WelcomeToPromptAndGo from "./pages/blog/WelcomeToPromptAndGo";
import Auth from "./pages/Auth";
import AdminBulkUpload from "./pages/AdminBulkUpload";
import FavoritesPage from "./pages/account/Favorites";
import AccountPage from "./pages/account/Account";
import PurchasesPage from "./pages/account/Purchases";
import ProfilePage from "./pages/account/Profile";
import NotificationsPage from "./pages/account/Notifications";
import SecurityPage from "./pages/account/Security";
import CartPage from "./pages/Cart";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/library" element={<PromptLibrary />} />
            <Route path="/packs" element={<PromptPacks />} />
            <Route path="/submit" element={<SubmitPrompt />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/welcome-to-promptandgo-ai" element={<WelcomeToPromptAndGo />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/upload" element={<AdminBulkUpload />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/profile" element={<ProfilePage />} />
            <Route path="/account/notifications" element={<NotificationsPage />} />
            <Route path="/account/security" element={<SecurityPage />} />
            <Route path="/account/purchases" element={<PurchasesPage />} />
            <Route path="/account/favorites" element={<FavoritesPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);


export default App;
