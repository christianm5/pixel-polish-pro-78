import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/ui/SectionHeader";
import { mockBooks, type Book } from "@/lib/api";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Bibliography = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Replace with: fetchAPI<Book[]>("/api/books").then(setBooks)
    setTimeout(() => setBooks(mockBooks), 400);
  }, []);

  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            subtitle="Bibliographie"
            title="Ouvrages Publiés"
            description="Découvrez les livres écrits par le Pasteur pour édifier et inspirer."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                {...fadeInUp}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group p-6 rounded-lg border border-border bg-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-full h-48 rounded-md bg-secondary flex items-center justify-center mb-6">
                  <BookOpen size={40} className="text-primary/30" />
                </div>
                <span className="text-xs font-body text-muted-foreground">{book.year}</span>
                <h3 className="font-display text-lg font-semibold text-card-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {book.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bibliography;
