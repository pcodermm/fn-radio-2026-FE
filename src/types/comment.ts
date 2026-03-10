export interface CommentAuthor {
  id: number | null;
  name: string | null;
  avatar_url: string | null;
}

export interface Comment {
  id: number;
  parent_id: number | null;
  body: string;
  created_at: string | null;
  updated_at: string | null;
  replies_count: number;
  can_delete: boolean;
  user: CommentAuthor;
  replies: Comment[];
}

export interface CreateCommentInput {
  body: string;
  parent_id?: number;
}
