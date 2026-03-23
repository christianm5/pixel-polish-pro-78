import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchBooks, type Book } from "@/lib/api";
import { useSiteContent } from "@/hooks/useSiteContent";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Bibliography = () => {
  const { get } = useSiteContent("bibliography");
  const { data: books = [], isLoading } = useQuery<Book[]>({ queryKey: ["books"], queryFn: fetchBooks });

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            subtitle={get("header", "subtitle", "Bibliographie")}
            title={get("header", "title", "Ouvrages Publiés")}
            description={get("header", "description", "Découvrez les livres écrits par le Pasteur.")}
          />
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-lg border border-border animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-md mb-6" />
                  <div className="h-4 bg-muted rounded w-16 mb-2" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <p className="text-center text-muted-foreground font-body">Aucun ouvrage disponible.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {books.map((book, i) => (
                <motion.div key={book.id} {...fadeInUp} transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="group p-6 rounded-lg border border-border bg-card hover:shadow-elevated transition-all duration-300">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="w-full h-48 rounded-md object-cover mb-6" />
                  ) : (
                    <div className="w-full h-48 rounded-md bg-secondary flex items-center justify-center mb-6">
                      <BookOpen size={40} className="text-primary/30" />
                    </div>
                  )}
                  <span className="text-xs font-body text-muted-foreground">{book.year}</span>
                  <h3 className="font-display text-lg font-semibold text-card-foreground mt-1 mb-2 group-hover:text-primary transition-colors">{book.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{book.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Bibliography;
