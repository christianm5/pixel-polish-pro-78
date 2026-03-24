import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, DollarSign, TrendingUp } from "lucide-react";

interface Donation {
  id: string;
  donor_name: string | null;
  donor_email: string | null;
  amount: number;
  currency: string;
  country: string | null;
  payment_method: string | null;
  status: string;
  created_at: string;
}

const AdminDonations = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Donation[];
    },
  });

  const filtered = donations.filter((d) => {
    const matchSearch = !search || 
      (d.donor_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (d.donor_email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = donations.filter((d) => d.status === "pending").length;

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Gestion des Dons</h2>
          <p className="text-muted-foreground text-sm">{donations.length} don(s) enregistré(s)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">${totalAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total reçu</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{donations.length}</p>
                <p className="text-xs text-muted-foreground">Nombre de dons</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un donateur..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="completed">Complété</SelectItem>
              <SelectItem value="failed">Échoué</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Aucun don trouvé.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Donateur</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Montant</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Méthode</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Pays</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-secondary/50">
                    <td className="p-3">
                      <p className="font-medium text-foreground">{d.donor_name ?? "Anonyme"}</p>
                      <p className="text-xs text-muted-foreground">{d.donor_email ?? "—"}</p>
                    </td>
                    <td className="p-3 font-display font-bold text-foreground">
                      {d.amount} {d.currency}
                    </td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{d.payment_method ?? "—"}</td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{d.country ?? "—"}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={`text-[10px] ${statusColor[d.status] ?? ""}`}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs hidden sm:table-cell">
                      {new Date(d.created_at).toLocaleDateString("fr-FR")}
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
};

export default AdminDonations;
