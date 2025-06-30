
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tiers from "./pages/Tiers";
import Propositions from "./pages/Propositions";
import Contrats from "./pages/Contrats";
import Conventions from "./pages/Conventions";
import Campagnes from "./pages/Campagnes";
import Bareme from "./pages/Bareme";
import MonCompte from "./pages/MonCompte";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tiers" element={<Tiers />} />
          <Route path="/propositions" element={<Propositions />} />
          <Route path="/contrats" element={<Contrats />} />
          <Route path="/conventions" element={<Conventions />} />
          <Route path="/campagnes" element={<Campagnes />} />
          <Route path="/bareme" element={<Bareme />} />
          <Route path="/compte" element={<MonCompte />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
