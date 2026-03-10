import type { Blog, BlogCategory } from './blog';
import type { Podcast, PodcastCategory } from './podcast';

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_type: 'none' | 'url' | 'blog' | 'podcast';
  link_url: string | null;
  blog_id: number | null;
  podcast_id: number | null;
  starts_at: string | null;
  ends_at: string | null;
}

export interface HomeData {
  banners: Banner[];
  featured_podcasts: Podcast[];
  latest_blogs: Blog[];
  podcast_categories: PodcastCategory[];
  blog_categories: BlogCategory[];
}
