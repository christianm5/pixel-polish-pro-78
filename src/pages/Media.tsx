import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Headphones, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchMedia, type MediaItem } from "@/lib/api";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Media = () => {
  const { data: media = [] } = useQuery<MediaItem[]>({
    queryKey: ["media"],
    queryFn: fetchMedia,
  });
  const [filter, setFilter] = useState<"all" | "video" | "audio">("all");

  const filtered = filter === "all" ? media : media.filter((m) => m.type === filter);

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            subtitle="Espace Médias"
            title="Prédications & Louanges"
            description="Retrouvez nos vidéos, prédications et moments de louange."
          />

          <div className="flex justify-center gap-2 mb-12">
            {(["all", "video", "audio"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Tout" : f === "video" ? "Vidéos" : "Audio"}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground font-body">Aucun média disponible.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  {...fadeInUp}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-elevated transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-44 bg-secondary flex items-center justify-center">
                    {item.thumbnail_url ? (
                      <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover absolute inset-0" />
                    ) : null}
                    <div className="relative w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {item.type === "video" ? (
                        <Play size={22} className="text-primary-foreground ml-1" />
                      ) : (
                        <Headphones size={22} className="text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                      {item.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {item.duration}
                        </span>
                      )}
                      <span>
                        {new Date(item.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Media;
