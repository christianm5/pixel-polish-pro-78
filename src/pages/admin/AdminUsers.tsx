import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { Tables } from "@/integrations/supabase/types";

type UserRole = Tables<"user_roles">;
type Profile = Tables<"profiles">;

export default function AdminUsers() {
  const { isAdmin } = useAdminAuth();
  const qc = useQueryClient();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-user-roles"] }); toast.success("Rôle supprimé"); },
    onError: (e: any) => toast.error(e.message),
  });

  const getProfileName = (userId: string) => {
    const p = profiles.find((p) => p.id === userId);
    return p?.full_name || userId.slice(0, 8) + "…";
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Accès réservé aux administrateurs.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Utilisateurs & Rôles</h2>
          <p className="text-muted-foreground font-body text-sm mt-1">Gérez les rôles des utilisateurs (admin / éditeur).</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : roles.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 font-body">Aucun rôle assigné.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Utilisateur</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rôle</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roles.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground">{getProfileName(r.user_id)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.role === "admin" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                        {r.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteMutation.mutate(r.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
