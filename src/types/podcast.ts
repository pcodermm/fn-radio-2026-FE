export interface PodcastCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Podcast {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  youtube_url: string;
  youtube_video_id: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  category: PodcastCategory;
}
