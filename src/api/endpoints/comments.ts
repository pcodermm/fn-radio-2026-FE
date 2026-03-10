import { apiClient, unwrapResponse } from '../client';
import { createAppError } from '../../lib/errors';
import type { ApiSuccessResponse, PaginatedResult } from '../../types/api';
import type { Comment, CreateCommentInput } from '../../types/comment';

interface CommentListParams {
  page?: number;
}

async function getCommentList(
  path: string,
  params: CommentListParams = {}
): Promise<PaginatedResult<Comment>> {
  const response = await apiClient.get<ApiSuccessResponse<Comment[]>>(path, {
    params,
  });

  const { data, message, meta } = unwrapResponse(response);

  if (!meta) {
    throw createAppError({
      message: 'Pagination metadata is missing from the comments response.',
    });
  }

  return {
    items: data,
    message,
    meta,
  };
}

async function createComment(path: string, payload: CreateCommentInput): Promise<Comment> {
  const response = await apiClient.post<ApiSuccessResponse<Comment>>(path, payload, {
    requiresAuth: true,
  });

  return unwrapResponse(response).data;
}

export const commentsApi = {
  getBlogComments(slug: string, params: CommentListParams = {}) {
    return getCommentList(`/blogs/${slug}/comments`, params);
  },

  getPodcastComments(slug: string, params: CommentListParams = {}) {
    return getCommentList(`/podcasts/${slug}/comments`, params);
  },

  createBlogComment(slug: string, payload: CreateCommentInput) {
    return createComment(`/blogs/${slug}/comments`, payload);
  },

  createPodcastComment(slug: string, payload: CreateCommentInput) {
    return createComment(`/podcasts/${slug}/comments`, payload);
  },

  async deleteComment(commentId: number): Promise<void> {
    const response = await apiClient.delete<ApiSuccessResponse<null>>(
      `/comments/${commentId}`,
      {
        requiresAuth: true,
      }
    );

    unwrapResponse(response);
  },
};
