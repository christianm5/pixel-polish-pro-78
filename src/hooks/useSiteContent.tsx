import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContentItem {
  id: string;
  page: string;
  section: string;
  field: string;
  value: string | null;
}

async function fetchSiteContent(page?: string): Promise<SiteContentItem[]> {
  let query = supabase.from("site_content").select("*");
  if (page) {
    query = query.or(`page.eq.${page},page.eq.global`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SiteContentItem[];
}

export function useSiteContent(page?: string) {
  const { data: content = [], isLoading } = useQuery({
    queryKey: ["site_content", page],
    queryFn: () => fetchSiteContent(page),
    staleTime: 5 * 60 * 1000,
  });

  const get = (section: string, field: string, fallback = ""): string => {
    const item = content.find((c) => c.section === section && c.field === field);
    return item?.value ?? fallback;
  };

  return { content, get, isLoading };
}

export function useAllSiteContent() {
  const { data: content = [], isLoading, refetch } = useQuery({
    queryKey: ["site_content_all"],
    queryFn: () => fetchSiteContent(),
    staleTime: 0,
  });

  return { content, isLoading, refetch };
}
