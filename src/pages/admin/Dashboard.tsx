import { useQuery } from "@tanstack/react-query";
import { FileText, Film, BookOpen, Mail } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground font-body">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: articles = [] } = useQuery({ queryKey: ["admin-articles"], queryFn: async () => { const { data } = await supabase.from("articles").select("id"); return data ?? []; } });
  const { data: media = [] } = useQuery({ queryKey: ["admin-media"], queryFn: async () => { const { data } = await supabase.from("media").select("id"); return data ?? []; } });
  const { data: books = [] } = useQuery({ queryKey: ["admin-books"], queryFn: async () => { const { data } = await supabase.from("books").select("id"); return data ?? []; } });
  const { data: messages = [] } = useQuery({ queryKey: ["admin-messages"], queryFn: async () => { const { data } = await supabase.from("contact_messages").select("id"); return data ?? []; } });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Tableau de bord</h2>
          <p className="text-muted-foreground font-body mt-1">Vue d'ensemble de votre contenu.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Articles" value={articles.length} color="bg-primary" />
          <StatCard icon={Film} label="Médias" value={media.length} color="bg-accent" />
          <StatCard icon={BookOpen} label="Livres" value={books.length} color="bg-primary/80" />
          <StatCard icon={Mail} label="Messages" value={messages.length} color="bg-muted-foreground" />
        </div>
      </div>
    </AdminLayout>
  );
}
