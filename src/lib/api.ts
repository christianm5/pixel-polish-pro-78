// API utility for fetching data from backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.example.com";

export async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

// Types
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  cover: string;
  year: number;
}

export interface MediaItem {
  id: string;
  title: string;
  type: "video" | "audio";
  url: string;
  thumbnail: string;
  duration: string;
  date: string;
}

// Mock data for development
export const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Grande croisade d'évangélisation à Kinshasa",
    excerpt: "Des milliers de personnes ont répondu à l'appel lors de notre dernière croisade.",
    content: "",
    image: "",
    date: "2026-03-15",
    category: "Événement",
  },
  {
    id: "2",
    title: "Inauguration du nouveau centre communautaire",
    excerpt: "Un lieu de rassemblement pour la communauté et les activités du ministère.",
    content: "",
    image: "",
    date: "2026-03-10",
    category: "Communauté",
  },
  {
    id: "3",
    title: "Mission humanitaire dans le Kasaï",
    excerpt: "Distribution de vivres et fournitures scolaires aux familles défavorisées.",
    content: "",
    image: "",
    date: "2026-03-05",
    category: "Mission",
  },
  {
    id: "4",
    title: "Conférence internationale des pasteurs",
    excerpt: "Rencontre avec des leaders spirituels du monde entier pour partager la vision.",
    content: "",
    image: "",
    date: "2026-02-28",
    category: "Conférence",
  },
];

export const mockBooks: Book[] = [
  { id: "1", title: "La Foi qui Déplace les Montagnes", description: "Un guide spirituel pour fortifier votre foi face aux épreuves de la vie.", cover: "", year: 2024 },
  { id: "2", title: "Servir avec Amour", description: "L'importance du service communautaire dans la vie chrétienne.", cover: "", year: 2022 },
  { id: "3", title: "Le Chemin de la Grâce", description: "Méditations quotidiennes pour une vie transformée par la grâce divine.", cover: "", year: 2020 },
];

export const mockMedia: MediaItem[] = [
  { id: "1", title: "Prédication : La puissance de la prière", type: "video", url: "", thumbnail: "", duration: "45:00", date: "2026-03-12" },
  { id: "2", title: "Étude biblique : Romains chapitre 8", type: "video", url: "", thumbnail: "", duration: "1:02:00", date: "2026-03-08" },
  { id: "3", title: "Louange & Adoration – Live", type: "audio", url: "", thumbnail: "", duration: "32:00", date: "2026-03-01" },
];
