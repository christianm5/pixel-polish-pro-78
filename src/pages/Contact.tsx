import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with API call: fetch("/api/contact", { method: "POST", body: JSON.stringify(form) })
    console.log("Form submitted:", form);
    alert("Message envoyé ! Nous vous répondrons bientôt.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50";

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            subtitle="Contact"
            title="Restons en Contact"
            description="N'hésitez pas à nous écrire pour toute question ou demande d'information."
          />

          <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <motion.div {...fadeInUp} className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "contact@pasteur-ministry.com" },
                { icon: Phone, label: "Téléphone", value: "+243 XXX XXX XXX" },
                { icon: MapPin, label: "Adresse", value: "Kinshasa, RD Congo" },
              ].map((info) => (
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

            {/* Form */}
            <motion.form
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Votre nom"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                placeholder="Sujet"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={inputClass}
              />
              <textarea
                placeholder="Votre message"
                rows={6}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClass} resize-none`}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-body font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <Send size={16} />
                Envoyer le Message
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
