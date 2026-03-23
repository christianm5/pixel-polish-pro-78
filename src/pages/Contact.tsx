import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";
import { submitContactMessage } from "@/lib/api";
import { useSiteContent } from "@/hooks/useSiteContent";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Contact = () => {
  const { get } = useSiteContent("contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactMessage(form);
      toast.success("Message envoyé ! Nous vous répondrons bientôt.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch { toast.error("Erreur lors de l'envoi."); }
    finally { setSubmitting(false); }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50";

  const contactInfo = [
    { icon: Mail, label: "Email", value: get("info", "email", "contact@pasteur-ministry.com") },
    { icon: Phone, label: "Téléphone", value: get("info", "phone", "+243 XXX XXX XXX") },
    { icon: MapPin, label: "Adresse", value: get("info", "address", "Kinshasa, RD Congo") },
  ];

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            subtitle={get("header", "subtitle", "Contact")}
            title={get("header", "title", "Restons en Contact")}
            description={get("header", "description", "N'hésitez pas à nous écrire.")}
          />
          <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.div {...fadeInUp} className="space-y-8">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <info.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground text-sm">{info.label}</p>
                    <p className="font-body text-muted-foreground text-sm">{info.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.form {...fadeInUp} transition={{ delay: 0.2, duration: 0.5 }} onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <input type="text" placeholder="Votre nom" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                <input type="email" placeholder="Votre email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </div>
              <input type="text" placeholder="Sujet" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} />
              <textarea placeholder="Votre message" rows={6} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} />
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-body font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? "Envoi en cours..." : "Envoyer le Message"}
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
