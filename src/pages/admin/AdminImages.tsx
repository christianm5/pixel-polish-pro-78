import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SiteImage {
  id: string;
  page: string;
  section: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

const AdminImages = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newImage, setNewImage] = useState({ page: "", section: "", alt_text: "", image_url: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin-site-images"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_images").select("*").order("page").order("section").order("sort_order");
      if (error) throw error;
      return data as SiteImage[];
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `site/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media-uploads").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("media-uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFileUpload = async (file: File, imageId?: string) => {
    try {
      if (imageId) setUploadingFor(imageId);
      else setUploading(true);
      const url = await uploadFile(file);
      if (imageId) {
        await supabase.from("site_images").update({ image_url: url, updated_at: new Date().toISOString() }).eq("id", imageId);
        queryClient.invalidateQueries({ queryKey: ["admin-site-images"] });
        toast.success("Image mise à jour");
      } else {
        setNewImage((prev) => ({ ...prev, image_url: url }));
      }
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
      setUploadingFor(null);
    }
  };

  const addMutation = useMutation({
    mutationFn: async (img: typeof newImage) => {
      const { error } = await supabase.from("site_images").insert(img);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-images"] });
      setNewImage({ page: "", section: "", alt_text: "", image_url: "" });
      setShowAdd(false);
      toast.success("Image ajoutée");
    },
    onError: () => toast.error("Erreur"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-images"] });
      toast.success("Image supprimée");
    },
  });

  const groupedByPage = images.reduce<Record<string, SiteImage[]>>((acc, img) => {
    if (!acc[img.page]) acc[img.page] = [];
    acc[img.page].push(img);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Gestion des Images</h2>
            <p className="text-muted-foreground text-sm">Images du site (hero, sections, etc.)</p>
          </div>
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>

        {showAdd && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input placeholder="Page (ex: home)" value={newImage.page} onChange={(e) => setNewImage({ ...newImage, page: e.target.value })} />
                <Input placeholder="Section (ex: hero)" value={newImage.section} onChange={(e) => setNewImage({ ...newImage, section: e.target.value })} />
                <Input placeholder="Alt text" value={newImage.alt_text} onChange={(e) => setNewImage({ ...newImage, alt_text: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <Input placeholder="URL de l'image" value={newImage.image_url} onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })} className="flex-1" />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                  <Button size="sm" variant="outline" asChild disabled={uploading}>
                    <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}</span>
                  </Button>
                </label>
              </div>
              {newImage.image_url && (
                <img src={newImage.image_url} alt="preview" className="h-24 rounded-lg object-cover" />
              )}
              <Button size="sm" onClick={() => addMutation.mutate(newImage)} disabled={!newImage.page || !newImage.section || !newImage.image_url}>
                Ajouter
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : Object.keys(groupedByPage).length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Aucune image configurée.</p>
        ) : (
          Object.entries(groupedByPage).map(([page, imgs]) => (
            <div key={page} className="space-y-3">
              <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">{page}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {imgs.map((img) => (
                  <Card key={img.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-secondary">
                      <img src={img.image_url} alt={img.alt_text ?? ""} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, img.id); }} />
                          <Button size="sm" variant="secondary" className="h-7 w-7 p-0" asChild>
                            <span>{uploadingFor === img.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}</span>
                          </Button>
                        </label>
                        <Button size="sm" variant="secondary" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteMutation.mutate(img.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs font-medium text-foreground">{img.section}</p>
                      <p className="text-xs text-muted-foreground">{img.alt_text ?? "Pas d'alt text"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminImages;
