import { apiClient, unwrapResponse } from '../client';
import type { ApiSuccessResponse } from '../../types/api';
import type { SettingsMap } from '../../types/settings';

export const settingsApi = {
  async getSettings(): Promise<SettingsMap> {
    const response = await apiClient.get<ApiSuccessResponse<SettingsMap>>('/settings');

    return unwrapResponse(response).data;
  },
};
