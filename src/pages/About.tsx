import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";
import pastorPortrait from "@/assets/pastor-portrait.png";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <img src={pastorPortrait} alt="Pasteur" className="w-64 mx-auto drop-shadow-xl" />
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2, duration: 0.6 }} className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary font-body">
                À Propos
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
                Un Serviteur de Dieu Dévoué
              </h1>
              <p className="text-muted-foreground font-body leading-relaxed">
                Depuis plus de 20 ans, le Pasteur consacre sa vie au service de Dieu et de son prochain. 
                Fondateur de plusieurs églises et d'un orphelinat, son ministère touche des milliers de vies 
                à travers la République Démocratique du Congo et au-delà.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                Animé par une passion pour la Parole et un cœur pour les démunis, il œuvre sans relâche 
                pour apporter espoir, guérison et transformation dans les communautés.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader subtitle="Parcours" title="Les Étapes Clés" />
          <div className="max-w-2xl mx-auto space-y-8">
            {[
              { year: "2000", event: "Début du ministère pastoral" },
              { year: "2005", event: "Fondation de la première église" },
              { year: "2010", event: "Création de l'orphelinat" },
              { year: "2015", event: "Lancement des missions humanitaires" },
              { year: "2020", event: "Publication du premier ouvrage" },
              { year: "2024", event: "Expansion internationale du ministère" },
            ].map((item, i) => (
              <motion.div
                key={item.year}
                {...fadeInUp}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="font-display text-lg font-bold text-primary">{item.year}</span>
                </div>
                <div className="flex-shrink-0 w-px bg-border relative">
                  <div className="absolute top-1 -left-1.5 w-3 h-3 rounded-full bg-primary" />
                </div>
                <p className="font-body text-foreground pt-0.5">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader subtitle="Valeurs" title="Ce Qui Nous Anime" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Foi", desc: "Une confiance inébranlable en la Parole de Dieu." },
              { title: "Amour", desc: "L'amour du prochain comme fondement de notre action." },
              { title: "Intégrité", desc: "La transparence et l'honnêteté dans tout ce que nous faisons." },
              { title: "Service", desc: "Se donner aux autres sans attendre en retour." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeInUp}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-lg bg-card border border-border"
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground font-body text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
