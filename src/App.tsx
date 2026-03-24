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
import Dashboard from "./pages/admin/Dashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCMS from "./pages/admin/AdminCMS";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminImages from "./pages/admin/AdminImages";
import AdminSections from "./pages/admin/AdminSections";

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
            {/* Admin routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/contenu" element={<AdminCMS />} />
            <Route path="/admin/images" element={<AdminImages />} />
            <Route path="/admin/sections" element={<AdminSections />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/medias" element={<AdminMedia />} />
            <Route path="/admin/livres" element={<AdminBooks />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/dons" element={<AdminDonations />} />
            <Route path="/admin/utilisateurs" element={<AdminUsers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
