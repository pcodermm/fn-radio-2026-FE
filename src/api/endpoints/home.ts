import { apiClient, unwrapResponse } from '../client';
import type { ApiSuccessResponse } from '../../types/api';
import type { HomeData } from '../../types/home';

export const homeApi = {
  async getHome(): Promise<HomeData> {
    const response = await apiClient.get<ApiSuccessResponse<HomeData>>('/home');

    return unwrapResponse(response).data;
  },
};
