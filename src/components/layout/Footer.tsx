import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const socialIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
};

const Footer = () => {
  const { get } = useSiteContent("global");

  const email = get("footer", "email", "contact@pasteur-ministry.com");
  const phone = get("footer", "phone", "+243 XXX XXX XXX");
  const address = get("footer", "address", "Kinshasa, RD Congo");

  // Social links from site_content (keys: social_facebook, social_instagram, etc.)
  const socialLinks = [
    { key: "facebook", url: get("footer", "social_facebook", "") },
    { key: "instagram", url: get("footer", "social_instagram", "") },
    { key: "youtube", url: get("footer", "social_youtube", "") },
    { key: "twitter", url: get("footer", "social_twitter", "") },
  ].filter((s) => s.url);

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">
                  {get("navbar", "brand_initial", "P")}
                </span>
              </div>
              <span className="font-display text-lg font-semibold">
                {get("footer", "brand_name", "Pasteur Ministry")}
              </span>
            </div>
            <p className="text-sm opacity-70 font-body leading-relaxed">
              {get("footer", "brand_description", "Servir Dieu à travers la prédication, l'action sociale et l'amour du prochain.")}
            </p>
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialLinks.map((s) => {
                  const Icon = socialIcons[s.key] ?? Mail;
                  return (
                    <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary/80 transition-colors">
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider opacity-50">Navigation</h4>
            <div className="space-y-2">
              {[
                { to: "/a-propos", label: get("footer", "nav_about", "À propos") },
                { to: "/actualites", label: get("footer", "nav_news", "Actualités") },
                { to: "/orphelinat", label: get("footer", "nav_orphanage", "Orphelinat") },
                { to: "/bibliographie", label: get("footer", "nav_bibliography", "Bibliographie") },
                { to: "/medias", label: get("footer", "nav_media", "Médias") },
                { to: "/contact", label: get("footer", "nav_contact", "Contact") },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm opacity-70 hover:opacity-100 transition-opacity font-body">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact — clickable links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider opacity-50">Contact</h4>
            <div className="space-y-3">
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
                <Mail size={14} />
                <span className="font-body">{email}</span>
              </a>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
                <Phone size={14} />
                <span className="font-body">{phone}</span>
              </a>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <MapPin size={14} />
                <span className="font-body">{address}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider opacity-50">Soutenir</h4>
            <p className="text-sm opacity-70 font-body">{get("footer", "cta_text", "Votre don change des vies.")}</p>
            <Link to="/don" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary rounded-md text-primary-foreground text-sm font-medium font-body hover:bg-primary/90 transition-colors">
              <Heart size={14} /> {get("footer", "cta_button", "Faire un Don")}
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-xs opacity-50 font-body">
            © {new Date().getFullYear()} {get("footer", "copyright", "Pasteur Ministry. Tous droits réservés.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
