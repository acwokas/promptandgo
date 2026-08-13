import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LoginWidgetProvider } from "@/hooks/useLoginWidget";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const qc = new QueryClient();

interface Props {
  initialPath?: string;
  children?: React.ReactNode;
  /** Render the page component for this path explicitly */
  Component?: React.ComponentType;
  /** Show header + footer chrome */
  chrome?: boolean;
}

export default function PageWrapper({ initialPath = "/", Component, children, chrome = true }: Props) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <HelmetProvider>
          <QueryClientProvider client={qc}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <MemoryRouter initialEntries={[initialPath]}>
                <SidebarProvider defaultOpen={false}>
                  <LoginWidgetProvider>
                    <div className="flex min-h-screen w-full overflow-hidden">
                      <main id="main-content" className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
                        {chrome && <Header />}
                        <div className="flex-1 w-full overflow-x-hidden max-w-full" role="main">
                          <ScrollToTop />
                          <Routes>
                            <Route
                              path="*"
                              element={Component ? <Component /> : children}
                            />
                          </Routes>
                        </div>
                        {chrome && <Footer />}
                      </main>
                    </div>
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
