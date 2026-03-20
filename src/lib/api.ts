import { supabase } from "@/integrations/supabase/client";

// Types
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  category: string;
  published: boolean;
}

export interface Book {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  year: number;
}

export interface MediaItem {
  id: string;
  title: string;
  type: "video" | "audio";
  url: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  created_at: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Donation {
  donor_name: string | null;
  donor_email: string | null;
  amount: number;
  currency: string;
  payment_method: string | null;
}

// API functions
export async function fetchArticles(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("year", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMedia(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MediaItem[];
}

export async function submitContactMessage(msg: ContactMessage) {
  const { error } = await supabase.from("contact_messages").insert(msg);
  if (error) throw error;
}

export async function submitDonation(donation: Donation) {
  const { error } = await supabase.from("donations").insert(donation);
  if (error) throw error;
}
