import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, CreditCard, Banknote, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";
import { submitDonation } from "@/lib/api";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Donate = () => {
  const amounts = [10, 25, 50, 100];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const finalAmount = selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);

  const handleDonate = async () => {
    if (!finalAmount || finalAmount <= 0) {
      toast.error("Veuillez choisir un montant.");
      return;
    }
    if (!paymentMethod) {
      toast.error("Veuillez choisir un mode de paiement.");
      return;
    }
    setSubmitting(true);
    try {
      await submitDonation({
        donor_name: null,
        donor_email: null,
        amount: finalAmount,
        currency: "USD",
        payment_method: paymentMethod,
      });
      toast.success("Merci pour votre don ! Que Dieu vous bénisse.");
      setSelectedAmount(null);
      setCustomAmount("");
      setPaymentMethod(null);
    } catch {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 lg:py-28 bg-hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl mx-auto space-y-4">
            <Heart size={48} className="mx-auto text-accent" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold">Faire un Don</h1>
            <p className="text-primary-foreground/70 font-body text-lg">Votre générosité transforme des vies. Chaque contribution compte.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <SectionHeader subtitle="Contribuer" title="Choisissez un Montant" />

          <motion.div {...fadeInUp} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                  className={`p-4 rounded-lg border-2 font-display text-xl font-bold transition-all duration-200 hover:shadow-elevated ${
                    selectedAmount === amount ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-card-foreground hover:border-primary"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-body text-muted-foreground mb-2">Autre montant</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body">$</span>
                <input
                  type="number"
                  placeholder="Montant personnalisé"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-card text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Mode de paiement</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: "card", icon: CreditCard, label: "Carte bancaire", desc: "Visa, Mastercard" },
                  { id: "mobile", icon: Banknote, label: "Mobile Money", desc: "M-Pesa, Airtel Money" },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary"
                    }`}
                  >
                    <method.icon size={20} className="text-primary" />
                    <div>
                      <p className="font-body font-medium text-foreground text-sm">{method.label}</p>
                      <p className="font-body text-xs text-muted-foreground">{method.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDonate}
              disabled={submitting}
              className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-body font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} />}
              {submitting ? "Traitement..." : "Confirmer le Don"}
            </button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
