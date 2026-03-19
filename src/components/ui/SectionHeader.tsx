import { motion } from "framer-motion";

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

const SectionHeader = ({ subtitle, title, description, centered = true }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} mb-12 lg:mb-16`}
    >
      {subtitle && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary font-body mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground font-body leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
