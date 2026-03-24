import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/actualites", label: "Actualités" },
  { to: "/orphelinat", label: "Orphelinat" },
  { to: "/bibliographie", label: "Bibliographie" },
  { to: "/medias", label: "Médias" },
  { to: "/don", label: "Faire un Don" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { get } = useSiteContent("mondial");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">
                {get("barre de navigation", "initiale de la marque", "P")}
              </span>
            </div>
            <span className="font-display text-lg font-semibold text-foreground hidden sm:block">
              {get("barre de navigation", "nom_de_marque", "Pasteur Ministry")}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium font-body transition-colors duration-200 ${
                  location.pathname === link.to ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-md text-foreground hover:bg-secondary transition-colors" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-md text-sm font-medium font-body transition-colors ${
                    location.pathname === link.to ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
