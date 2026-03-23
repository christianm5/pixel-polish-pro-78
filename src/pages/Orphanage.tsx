import { motion } from "framer-motion";
import { Heart, Users, GraduationCap, Utensils } from "lucide-react";
import Layout from "@/components/layout/Layout";
import orphanageImg from "@/assets/orphanage.jpg";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Orphanage = () => {
  const { get } = useSiteContent("orphanage");

  const stats = [
    { icon: Users, value: get("stat1", "value", "120+"), label: get("stat1", "label", "Enfants accueillis") },
    { icon: GraduationCap, value: get("stat2", "value", "95%"), label: get("stat2", "label", "Taux de scolarisation") },
    { icon: Utensils, value: get("stat3", "value", "3"), label: get("stat3", "label", "Repas par jour") },
    { icon: Heart, value: get("stat4", "value", "15"), label: get("stat4", "label", "Années d'existence") },
  ];

  return (
    <Layout>
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={orphanageImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl mx-auto space-y-4">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-primary-foreground">
              {get("hero", "title", "L'Orphelinat")}
            </h1>
            <p className="text-primary-foreground/80 font-body text-lg">
              {get("hero", "description", "Un foyer d'amour, d'espoir et de transformation pour chaque enfant.")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} {...fadeInUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="text-center p-6">
                <stat.icon size={28} className="text-primary mx-auto mb-3" />
                <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground font-body text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div {...fadeInUp} className="space-y-6 font-body text-muted-foreground leading-relaxed">
            <h2 className="font-display text-3xl font-bold text-foreground">
              {get("content", "title", "Notre Mission")}
            </h2>
            <p>{get("content", "paragraph1", "Fondé en 2010, notre orphelinat est né d'une vision profonde.")}</p>
            <p>{get("content", "paragraph2", "Nous croyons que chaque enfant est un don de Dieu.")}</p>
            <div className="pt-6">
              <Link to="/don" className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-md text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                <Heart size={16} /> Soutenir l'Orphelinat
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Orphanage;
