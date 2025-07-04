export interface Meme {
  id: number;
  title: string;
  cloudinary_url: string;
  reddit_post_url: string;
  category: string;
  subreddit: string;
  timestamp: string;
  like_count: number;
  save_count: number;
  uploader_username?: string;
  uploader_id?: string;
  trending_score: number;
  // User interaction fields
  is_liked?: boolean;
  is_saved?: boolean;
  // Computed fields for UI
  author?: string;
  timeAgo?: string;
  isVideo?: boolean;
}

export interface Product {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  isSponsored?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export type Category = 'All' | 'Dark Humor' | 'Dank Memes' | 'Wholesome' | 'Comedy' | 'Gaming' | 'Trending';

export type AuthMode = 'login' | 'signup' | null;

export interface ApiResponse {
  memes: Meme[];
  total: number;
  page: number;
  page_size: number;
}