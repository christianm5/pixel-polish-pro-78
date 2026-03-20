import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Connexion réussie !");
        navigate("/");
      } else {
        await signUp(email, password, fullName);
        toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50";

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-lg border border-border bg-card shadow-card"
          >
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {isLogin ? "Connexion" : "Inscription"}
              </h1>
              <p className="text-muted-foreground font-body text-sm mt-2">
                {isLogin ? "Accédez à votre espace administration." : "Créez votre compte pour commencer."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Nom complet"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                />
              )}
              <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              <input type="password" placeholder="Mot de passe" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-body font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                {loading ? "Chargement..." : isLogin ? "Se Connecter" : "S'inscrire"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary font-body hover:underline"
              >
                {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
