import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, Search, Loader2, CheckCircle, MessageSquare, Trash2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

const AdminMessages = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] }),
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ admin_reply: reply, replied_at: new Date().toISOString(), read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      setReplyingTo(null);
      setReplyText("");
      toast.success("Réponse enregistrée");
    },
    onError: () => toast.error("Erreur lors de l'envoi"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      toast.success("Message supprimé");
    },
  });

  const filtered = search
    ? messages.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.subject.toLowerCase().includes(search.toLowerCase())
      )
    : messages;

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Messages Contact</h2>
            <p className="text-muted-foreground text-sm">
              {unreadCount > 0 ? `${unreadCount} non lu(s)` : "Tous lus"} · {messages.length} total
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Aucun message.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((msg) => (
              <Card key={msg.id} className={`transition-colors ${!msg.read ? "border-primary/30 bg-primary/5" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        {msg.name}
                        {!msg.read && <Badge variant="default" className="text-[10px] px-1.5 py-0">Nouveau</Badge>}
                        {msg.admin_reply && <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-green-600 border-green-300">Répondu</Badge>}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{msg.email} · {new Date(msg.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0"
                        onClick={() => markReadMutation.mutate({ id: msg.id, read: !msg.read })}>
                        <CheckCircle className={`h-4 w-4 ${msg.read ? "text-green-500" : "text-muted-foreground"}`} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(msg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium text-foreground">{msg.subject}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>

                  {msg.admin_reply && (
                    <div className="bg-secondary rounded-lg p-3 mt-2">
                      <p className="text-xs font-medium text-primary mb-1">Votre réponse ({msg.replied_at ? new Date(msg.replied_at).toLocaleDateString("fr-FR") : ""}) :</p>
                      <p className="text-sm text-foreground">{msg.admin_reply}</p>
                    </div>
                  )}

                  <Dialog open={replyingTo === msg.id} onOpenChange={(open) => { if (!open) { setReplyingTo(null); setReplyText(""); } }}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => { setReplyingTo(msg.id); setReplyText(msg.admin_reply ?? ""); }}>
                        <MessageSquare className="h-3 w-3 mr-1" /> {msg.admin_reply ? "Modifier la réponse" : "Répondre"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-sm">Répondre à {msg.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-secondary rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Message original :</p>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <Textarea placeholder="Votre réponse..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} />
                        <Button size="sm" onClick={() => replyMutation.mutate({ id: msg.id, reply: replyText })}
                          disabled={!replyText.trim() || replyMutation.isPending}>
                          {replyMutation.isPending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
                          Enregistrer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
