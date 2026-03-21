import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Tables } from "@/integrations/supabase/types";

type Book = Tables<"books">;

const emptyBook = { title: "", description: "", year: new Date().getFullYear(), cover_url: "" };

export default function AdminBooks() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyBook);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("year", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("books").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("books").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-books"] }); setOpen(false); toast.success(editing ? "Livre modifié" : "Livre ajouté"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("books").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-books"] }); toast.success("Livre supprimé"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm(emptyBook); setOpen(true); };
  const openEdit = (b: Book) => { setEditing(b); setForm({ title: b.title, description: b.description ?? "", year: b.year, cover_url: b.cover_url ?? "" }); setOpen(true); };

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground">Livres</h2>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : books.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 font-body">Aucun livre.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((b) => (
              <div key={b.id} className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="h-40 bg-muted flex items-center justify-center">
                  {b.cover_url ? <img src={b.cover_url} alt={b.title} className="w-full h-full object-cover" /> : <span className="text-muted-foreground text-xs">Pas de couverture</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground text-sm">{b.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{b.year}</p>
                  <div className="flex gap-1 mt-3">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                    <button onClick={() => deleteMutation.mutate(b.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editing ? "Modifier le livre" : "Ajouter un livre"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
            <input placeholder="Titre" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
            <input type="number" placeholder="Année" required value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })} className={inputClass} />
            <input placeholder="URL de la couverture" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} className={inputClass} />
            <button type="submit" disabled={saveMutation.isPending} className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
              {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
              {editing ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
