import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Loader2, Search, Plus, Trash2 } from "lucide-react";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  field: string;
  value: string | null;
}

const PAGE_LABELS: Record<string, string> = {
  global: "Global (Navbar & Footer)",
  home: "Accueil",
  about: "À Propos",
  orphanage: "Orphelinat",
  donate: "Faire un Don",
  contact: "Contact",
  news: "Actualités",
  bibliography: "Bibliographie",
  media: "Médias",
};

const AdminCMS = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [newItem, setNewItem] = useState({ page: "", section: "", field: "", value: "" });
  const [showAdd, setShowAdd] = useState(false);

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["admin_site_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").order("page").order("section").order("field");
      if (error) throw error;
      return data as ContentItem[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase
        .from("site_content")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_site_content"] });
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: typeof newItem) => {
      const { error } = await supabase.from("site_content").insert(item);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_site_content"] });
      setNewItem({ page: "", section: "", field: "", value: "" });
      setShowAdd(false);
      toast.success("Contenu ajouté");
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_site_content"] });
      toast.success("Contenu supprimé");
    },
  });

  const handleSave = async (item: ContentItem) => {
    const newValue = editedValues[item.id];
    if (newValue === undefined || newValue === (item.value ?? "")) return;
    try {
      await updateMutation.mutateAsync({ id: item.id, value: newValue });
      setEditedValues((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      toast.success(`"${item.field}" mis à jour`);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleSaveAll = async () => {
    const entries = Object.entries(editedValues);
    if (entries.length === 0) return;
    try {
      await Promise.all(
        entries.map(([id, value]) => updateMutation.mutateAsync({ id, value }))
      );
      setEditedValues({});
      toast.success(`${entries.length} modification(s) sauvegardée(s)`);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const pages = [...new Set(content.map((c) => c.page))];

  const filterContent = (items: ContentItem[]) =>
    search
      ? items.filter(
          (c) =>
            c.section.toLowerCase().includes(search.toLowerCase()) ||
            c.field.toLowerCase().includes(search.toLowerCase()) ||
            (c.value ?? "").toLowerCase().includes(search.toLowerCase())
        )
      : items;

  const groupBySection = (items: ContentItem[]) => {
    const groups: Record<string, ContentItem[]> = {};
    for (const item of items) {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    }
    return groups;
  };

  const hasChanges = Object.keys(editedValues).length > 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Gestion du Contenu
            </h2>
            <p className="text-muted-foreground text-sm">
              Modifiez les textes du site sans toucher au code
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdd(!showAdd)}
            >
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
            {hasChanges && (
              <Button size="sm" onClick={handleSaveAll}>
                <Save className="h-4 w-4 mr-1" /> Sauvegarder tout ({Object.keys(editedValues).length})
              </Button>
            )}
          </div>
        </div>

        {showAdd && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input placeholder="Page (ex: home)" value={newItem.page} onChange={(e) => setNewItem({ ...newItem, page: e.target.value })} />
                <Input placeholder="Section (ex: hero)" value={newItem.section} onChange={(e) => setNewItem({ ...newItem, section: e.target.value })} />
                <Input placeholder="Champ (ex: title)" value={newItem.field} onChange={(e) => setNewItem({ ...newItem, field: e.target.value })} />
                <Input placeholder="Valeur" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })} />
              </div>
              <Button className="mt-3" size="sm" onClick={() => addMutation.mutate(newItem)} disabled={!newItem.page || !newItem.section || !newItem.field}>
                Ajouter
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contenu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue={pages[0] ?? "global"}>
            <TabsList className="flex-wrap h-auto gap-1">
              {pages.map((page) => (
                <TabsTrigger key={page} value={page} className="text-xs">
                  {PAGE_LABELS[page] ?? page}
                </TabsTrigger>
              ))}
            </TabsList>

            {pages.map((page) => {
              const pageContent = filterContent(content.filter((c) => c.page === page));
              const sections = groupBySection(pageContent);

              return (
                <TabsContent key={page} value={page} className="space-y-4">
                  {Object.entries(sections).map(([section, items]) => (
                    <Card key={section}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          {section}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {items.map((item) => {
                          const currentValue = editedValues[item.id] ?? item.value ?? "";
                          const isLong = currentValue.length > 80;
                          const isModified = editedValues[item.id] !== undefined && editedValues[item.id] !== (item.value ?? "");

                          return (
                            <div key={item.id} className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-foreground">
                                  {item.field}
                                  {isModified && <span className="text-primary ml-1">●</span>}
                                </label>
                                <div className="flex gap-1">
                                  {isModified && (
                                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleSave(item)}>
                                      <Save className="h-3 w-3 mr-1" /> Sauver
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(item.id)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              {isLong ? (
                                <Textarea
                                  value={currentValue}
                                  onChange={(e) => setEditedValues({ ...editedValues, [item.id]: e.target.value })}
                                  rows={3}
                                  className="text-sm"
                                />
                              ) : (
                                <Input
                                  value={currentValue}
                                  onChange={(e) => setEditedValues({ ...editedValues, [item.id]: e.target.value })}
                                  className="text-sm"
                                />
                              )}
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
                  {pageContent.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Aucun contenu trouvé.</p>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCMS;
