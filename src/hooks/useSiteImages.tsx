import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteImage {
  id: string;
  page: string;
  section: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export function useSiteImages(page?: string) {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["site_images", page],
    queryFn: async () => {
      let query = supabase.from("site_images").select("*").order("sort_order");
      if (page) query = query.eq("page", page);
      const { data, error } = await query;
      if (error) throw error;
      return data as SiteImage[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const getImage = (section: string, fallback = ""): string => {
    const img = images.find((i) => i.section === section);
    return img?.image_url ?? fallback;
  };

  const getAlt = (section: string, fallback = ""): string => {
    const img = images.find((i) => i.section === section);
    return img?.alt_text ?? fallback;
  };

  return { images, getImage, getAlt, isLoading };
}
