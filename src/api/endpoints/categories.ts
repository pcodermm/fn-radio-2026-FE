import { apiClient, unwrapResponse } from '../client';
import type { ApiSuccessResponse } from '../../types/api';
import type { BlogCategory } from '../../types/blog';
import type { PodcastCategory } from '../../types/podcast';

export const categoriesApi = {
  async getBlogCategories(): Promise<BlogCategory[]> {
    const response = await apiClient.get<ApiSuccessResponse<BlogCategory[]>>(
      '/blog-categories'
    );

    return unwrapResponse(response).data;
  },

  async getPodcastCategories(): Promise<PodcastCategory[]> {
    const response = await apiClient.get<ApiSuccessResponse<PodcastCategory[]>>(
      '/podcast-categories'
    );

    return unwrapResponse(response).data;
  },
};
