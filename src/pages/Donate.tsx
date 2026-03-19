import { motion } from "framer-motion";
import { Heart, CreditCard, Banknote } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Donate = () => {
  const amounts = [10, 25, 50, 100];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            <Heart size={48} className="mx-auto text-accent" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">Faire un Don</h1>
            <p className="text-primary-foreground/70 font-body text-lg">
              Votre générosité transforme des vies. Chaque contribution compte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <SectionHeader subtitle="Contribuer" title="Choisissez un Montant" />

          <motion.div {...fadeInUp} className="space-y-8">
            {/* Amount Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  className="p-4 rounded-lg border-2 border-border hover:border-primary bg-card text-card-foreground font-display text-xl font-bold transition-all duration-200 hover:shadow-elevated"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-body text-muted-foreground mb-2">
                Autre montant
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body">$</span>
                <input
                  type="number"
                  placeholder="Montant personnalisé"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-card text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Mode de paiement</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                  <CreditCard size={20} className="text-primary" />
                  <div>
                    <p className="font-body font-medium text-foreground text-sm">Carte bancaire</p>
                    <p className="font-body text-xs text-muted-foreground">Visa, Mastercard</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                  <Banknote size={20} className="text-primary" />
                  <div>
                    <p className="font-body font-medium text-foreground text-sm">Mobile Money</p>
                    <p className="font-body text-xs text-muted-foreground">M-Pesa, Airtel Money</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-body font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Heart size={16} />
              Confirmer le Don
            </button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
