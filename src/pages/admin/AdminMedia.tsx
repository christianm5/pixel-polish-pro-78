import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Tables } from "@/integrations/supabase/types";

type Media = Tables<"media">;

const emptyMedia = { title: "", type: "video" as string, url: "", thumbnail_url: "", duration: "" };

export default function AdminMedia() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyMedia);
  const [uploading, setUploading] = useState(false);

  const { data: media = [], isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media-uploads").upload(path, file);
    if (error) { toast.error("Échec de l'upload"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("media-uploads").getPublicUrl(path);
    setForm({ ...form, thumbnail_url: urlData.publicUrl });
    setUploading(false);
    toast.success("Fichier uploadé");
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("media").insert(form);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-media"] }); setOpen(false); setForm(emptyMedia); toast.success("Média ajouté"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("media").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-media"] }); toast.success("Média supprimé"); },
    onError: (e: any) => toast.error(e.message),
  });

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground">Médias</h2>
          <button onClick={() => { setForm(emptyMedia); setOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : media.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 font-body">Aucun média.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((m) => (
              <div key={m.id} className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="h-32 bg-muted flex items-center justify-center">
                  {m.thumbnail_url ? <img src={m.thumbnail_url} alt={m.title} className="w-full h-full object-cover" /> : <span className="text-muted-foreground text-xs">{m.type}</span>}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.type} {m.duration && `· ${m.duration}`}</p>
                  </div>
                  <button onClick={() => deleteMutation.mutate(m.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display">Ajouter un média</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
            <input placeholder="Titre" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
              <option value="video">Vidéo</option>
              <option value="audio">Audio</option>
            </select>
            <input placeholder="URL du média (YouTube, etc.)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} />
            <input placeholder="Durée (ex: 45:00)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={inputClass} />
            <div>
              <label className="block text-sm text-muted-foreground font-body mb-1">Miniature</label>
              <div className="flex gap-2">
                <input placeholder="URL miniature" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className={`${inputClass} flex-1`} />
                <label className="flex items-center gap-1 px-3 py-2 bg-secondary text-foreground rounded-md text-sm cursor-pointer hover:bg-secondary/80">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              </div>
            </div>
            <button type="submit" disabled={saveMutation.isPending} className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
              {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Ajouter
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
