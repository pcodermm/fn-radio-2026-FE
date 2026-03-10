export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string;
  featured_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  comments_count: number;
  meta_title: string | null;
  meta_description: string | null;
  category: BlogCategory;
}
