import { apiClient, unwrapResponse } from '../client';
import { createAppError } from '../../lib/errors';
import type { ApiSuccessResponse, ListQueryParams, PaginatedResult } from '../../types/api';
import type { Blog } from '../../types/blog';

export const blogsApi = {
  async getBlogs(params: ListQueryParams = {}): Promise<PaginatedResult<Blog>> {
    const response = await apiClient.get<ApiSuccessResponse<Blog[]>>('/blogs', {
      params,
    });

    const { data, message, meta } = unwrapResponse(response);

    if (!meta) {
      throw createAppError({
        message: 'Pagination metadata is missing from the blogs response.',
      });
    }

    return {
      items: data,
      message,
      meta,
    };
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    const response = await apiClient.get<ApiSuccessResponse<Blog>>(`/blogs/${slug}`);

    return unwrapResponse(response).data;
  },
};
