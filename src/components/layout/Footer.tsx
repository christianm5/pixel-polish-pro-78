import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">P</span>
              </div>
              <span className="font-display text-lg font-semibold">Pasteur Ministry</span>
            </div>
            <p className="text-sm opacity-70 font-body leading-relaxed">
              Servir Dieu à travers la prédication, l'action sociale et l'amour du prochain.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider opacity-50">Navigation</h4>
            <div className="space-y-2">
              {[
                { to: "/a-propos", label: "À propos" },
                { to: "/actualites", label: "Actualités" },
                { to: "/orphelinat", label: "Orphelinat" },
                { to: "/bibliographie", label: "Bibliographie" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm opacity-70 hover:opacity-100 transition-opacity font-body"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider opacity-50">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Mail size={14} />
                <span className="font-body">contact@pasteur-ministry.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Phone size={14} />
                <span className="font-body">+243 XXX XXX XXX</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <MapPin size={14} />
                <span className="font-body">Kinshasa, RD Congo</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider opacity-50">Soutenir</h4>
            <p className="text-sm opacity-70 font-body">Votre don change des vies.</p>
            <Link
              to="/don"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary rounded-md text-primary-foreground text-sm font-medium font-body hover:bg-primary/90 transition-colors"
            >
              <Heart size={14} />
              Faire un Don
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-xs opacity-50 font-body">
            © {new Date().getFullYear()} Pasteur Ministry. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
