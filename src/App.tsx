import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import News from "./pages/News";
import Orphanage from "./pages/Orphanage";
import Bibliography from "./pages/Bibliography";
import Media from "./pages/Media";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/orphelinat" element={<Orphanage />} />
            <Route path="/bibliographie" element={<Bibliography />} />
            <Route path="/medias" element={<Media />} />
            <Route path="/don" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/connexion" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
