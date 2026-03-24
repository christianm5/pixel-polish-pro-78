import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, BookOpen, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";
import heroBgFallback from "@/assets/hero-bg.jpg";
import pastorPortraitFallback from "@/assets/pastor-portrait.png";
import orphanageImgFallback from "@/assets/orphanage.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useSiteImages } from "@/hooks/useSiteImages";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const Index = () => {
  const { get } = useSiteContent("home");
  const { getImage, getAlt } = useSiteImages("home");

  const heroBg = getImage("hero_bg", heroBgFallback);
  const pastorPortrait = getImage("pastor_portrait", pastorPortraitFallback);
  const orphanageImg = getImage("orphanage", orphanageImgFallback);

  const pillars = [
    { icon: BookOpen, title: get("pillar1", "title", "Prédication"), desc: get("pillar1", "description", "Annoncer la Parole de Dieu avec puissance et conviction.") },
    { icon: Users, title: get("pillar2", "title", "Action Sociale"), desc: get("pillar2", "description", "Venir en aide aux orphelins, veuves et personnes démunies.") },
    { icon: Heart, title: get("pillar3", "title", "Compassion"), desc: get("pillar3", "description", "Manifester l'amour de Christ en actions concrètes.") },
  ];

  return (
    <Layout>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={getAlt("hero_bg", "")} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="relative container mx-auto px-4 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-accent font-body">
                {get("hero", "subtitle", "Ministère Pastoral")}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                {get("hero", "title_line1", "Servir Dieu,")}
                <br />
                <span className="text-accent">{get("hero", "title_line2", "Transformer")}</span> {get("hero", "title_suffix", "des Vies")}
              </h1>
              <p className="text-primary-foreground/70 font-body text-lg max-w-md leading-relaxed">
                {get("hero", "description", "Un ministère dédié à la prédication de l'Évangile, l'aide aux orphelins et le service communautaire.")}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/a-propos" className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-md text-primary-foreground text-sm font-semibold font-body hover:bg-primary/90 transition-all duration-300">
                  {get("hero", "cta_primary", "Découvrir")} <ArrowRight size={16} />
                </Link>
                <Link to="/don" className="inline-flex items-center gap-2 px-6 py-3 border border-primary-foreground/30 rounded-md text-primary-foreground text-sm font-semibold font-body hover:bg-primary-foreground/10 transition-all duration-300">
                  <Heart size={16} /> {get("hero", "cta_secondary", "Soutenir")}
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:flex justify-center">
              <img src={pastorPortrait} alt={getAlt("pastor_portrait", "Pasteur")} className="w-80 h-auto drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            subtitle={get("pillars", "subtitle", "Notre Mission")}
            title={get("pillars", "title", "Les Piliers du Ministère")}
            description={get("pillars", "description", "Trois axes fondamentaux guident notre action.")}
          />
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div key={pillar.title} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.15 }} className="group p-8 rounded-lg border border-border bg-card hover:shadow-elevated transition-all duration-300">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} className="order-2 lg:order-1 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary font-body">
                {get("orphanage", "subtitle", "Orphelinat")}
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                {get("orphanage", "title", "Chaque Enfant Mérite un Avenir")}
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed">
                {get("orphanage", "description", "Notre orphelinat accueille et prend en charge des enfants en situation de détresse.")}
              </p>
              <Link to="/orphelinat" className="inline-flex items-center gap-2 text-primary font-semibold font-body text-sm hover:gap-3 transition-all">
                En savoir plus <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="order-1 lg:order-2">
              <div className="rounded-lg overflow-hidden shadow-card">
                <img src={orphanageImg} alt={getAlt("orphanage", "Orphelinat")} className="w-full h-72 lg:h-96 object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              {get("cta", "title", "Ensemble, Faisons la Différence")}
            </h2>
            <p className="text-primary-foreground/70 font-body text-lg">
              {get("cta", "description", "Votre générosité permet de nourrir, éduquer et protéger des enfants.")}
            </p>
            <Link to="/don" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-md font-semibold font-body hover:opacity-90 transition-opacity">
              <Heart size={18} /> {get("cta", "button", "Faire un Don Maintenant")}
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
