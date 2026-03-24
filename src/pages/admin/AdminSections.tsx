import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

interface PageSection {
  id: string;
  page: string;
  section_key: string;
  title: string | null;
  visible: boolean;
  sort_order: number;
}

const AdminSections = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newSection, setNewSection] = useState({ page: "", section_key: "", title: "" });

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["admin-page-sections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("page_sections").select("*").order("page").order("sort_order");
      if (error) throw error;
      return data as PageSection[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PageSection> }) => {
      const { error } = await supabase.from("page_sections").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-page-sections"] }),
  });

  const addMutation = useMutation({
    mutationFn: async (s: typeof newSection) => {
      const maxOrder = sections.filter((sec) => sec.page === s.page).reduce((max, sec) => Math.max(max, sec.sort_order), -1);
      const { error } = await supabase.from("page_sections").insert({ ...s, sort_order: maxOrder + 1, visible: true });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-page-sections"] });
      setNewSection({ page: "", section_key: "", title: "" });
      setShowAdd(false);
      toast.success("Section ajoutée");
    },
    onError: () => toast.error("Erreur"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("page_sections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-page-sections"] });
      toast.success("Section supprimée");
    },
  });

  const moveSection = (section: PageSection, direction: "up" | "down") => {
    const pageSections = sections.filter((s) => s.page === section.page).sort((a, b) => a.sort_order - b.sort_order);
    const idx = pageSections.findIndex((s) => s.id === section.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= pageSections.length) return;
    const other = pageSections[swapIdx];
    updateMutation.mutate({ id: section.id, updates: { sort_order: other.sort_order } });
    updateMutation.mutate({ id: other.id, updates: { sort_order: section.sort_order } });
  };

  const groupedByPage = sections.reduce<Record<string, PageSection[]>>((acc, s) => {
    if (!acc[s.page]) acc[s.page] = [];
    acc[s.page].push(s);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Gestion des Sections</h2>
            <p className="text-muted-foreground text-sm">Activer, désactiver et réordonner les sections</p>
          </div>
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>

        {showAdd && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input placeholder="Page (ex: home)" value={newSection.page} onChange={(e) => setNewSection({ ...newSection, page: e.target.value })} />
                <Input placeholder="Clé section (ex: hero)" value={newSection.section_key} onChange={(e) => setNewSection({ ...newSection, section_key: e.target.value })} />
                <Input placeholder="Titre (optionnel)" value={newSection.title} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} />
              </div>
              <Button className="mt-3" size="sm" onClick={() => addMutation.mutate(newSection)} disabled={!newSection.page || !newSection.section_key}>
                Ajouter
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : Object.keys(groupedByPage).length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Aucune section configurée.</p>
        ) : (
          Object.entries(groupedByPage).map(([page, secs]) => (
            <Card key={page}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{page}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {secs.sort((a, b) => a.sort_order - b.sort_order).map((sec, i) => (
                  <div key={sec.id} className={`flex items-center justify-between p-3 rounded-lg border ${sec.visible ? "bg-card border-border" : "bg-muted/50 border-border/50 opacity-60"}`}>
                    <div className="flex items-center gap-3">
                      {sec.visible ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                      <div>
                        <p className="text-sm font-medium text-foreground">{sec.title ?? sec.section_key}</p>
                        <p className="text-xs text-muted-foreground">{sec.section_key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => moveSection(sec, "up")} disabled={i === 0}>
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => moveSection(sec, "down")} disabled={i === secs.length - 1}>
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Switch checked={sec.visible} onCheckedChange={(v) => updateMutation.mutate({ id: sec.id, updates: { visible: v } })} />
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteMutation.mutate(sec.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSections;
