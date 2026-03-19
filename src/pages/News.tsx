import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";
import { mockNews, type NewsArticle } from "@/lib/api";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch — replace with real API call
    // Example: fetchAPI<NewsArticle[]>("/api/news").then(setNews)
    const timer = setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            subtitle="Actualités"
            title="Dernières Nouvelles"
            description="Restez informé des activités et événements du ministère."
          />

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border border-border p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-20 mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3 mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {news.map((article, i) => (
                <motion.article
                  key={article.id}
                  {...fadeInUp}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group rounded-lg border border-border bg-card p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary font-body bg-primary/10 px-2.5 py-1 rounded-full">
                      <Tag size={10} />
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                      <Calendar size={10} />
                      {new Date(article.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;
