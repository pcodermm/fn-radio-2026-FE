import { apiClient, unwrapResponse } from '../client';
import { createAppError } from '../../lib/errors';
import type { ApiSuccessResponse, ListQueryParams, PaginatedResult } from '../../types/api';
import type { Podcast } from '../../types/podcast';

export const podcastsApi = {
  async getPodcasts(params: ListQueryParams = {}): Promise<PaginatedResult<Podcast>> {
    const response = await apiClient.get<ApiSuccessResponse<Podcast[]>>('/podcasts', {
      params,
    });

    const { data, message, meta } = unwrapResponse(response);

    if (!meta) {
      throw createAppError({
        message: 'Pagination metadata is missing from the podcasts response.',
      });
    }

    return {
      items: data,
      message,
      meta,
    };
  },

  async getPodcastBySlug(slug: string): Promise<Podcast> {
    const response = await apiClient.get<ApiSuccessResponse<Podcast>>(
      `/podcasts/${slug}`
    );

    return unwrapResponse(response).data;
  },
};
