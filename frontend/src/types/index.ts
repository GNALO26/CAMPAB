export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "done";

export interface Appointment {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message?: string | null;
  preferredDate?: string | null;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentResponse {
  ok: boolean;
  reference: string;
  id: string;
  message: string;
}

export type ArticleCategory =
  | "vulgarisation"
  | "conseils"
  | "ethique"
  | "actualite";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: ArticleCategory;
  tags: string[];
  published: boolean;
  views: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string | null;
  category: ArticleCategory;
  tags: string[];
  publishedAt?: string | null;
  views: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type PortfolioCategory = "these" | "projet" | "publication" | "distinction";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  link?: string | null;
  category: PortfolioCategory;
  order: number;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}