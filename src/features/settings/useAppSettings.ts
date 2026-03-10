import { useEffect, useState } from 'react';

import { settingsApi } from '../../api/endpoints/settings';
import type { AppError } from '../../lib/errors';
import type { SettingsMap } from '../../types/settings';

export function useAppSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchSettings() {
      try {
        const nextSettings = await settingsApi.getSettings();

        if (isMounted) {
          setSettings(nextSettings);
          setError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError as AppError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    settings,
    isLoading,
    error,
  };
}
