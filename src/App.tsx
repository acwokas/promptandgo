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
import Refunds from "./pages/Refunds";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WelcomeToPromptAndGo from "./pages/blog/WelcomeToPromptAndGo";

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/welcome-to-promptandgo-ai" element={<WelcomeToPromptAndGo />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
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
