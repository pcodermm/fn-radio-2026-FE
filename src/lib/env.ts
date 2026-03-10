const fallbackApiBaseUrl = 'http://localhost:8000/api';
const fallbackAppVersion = '1.0.0';

export const env = {
  apiBaseUrl:
    (process.env.REACT_APP_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, ''),
  appVersion: process.env.REACT_APP_APP_VERSION || fallbackAppVersion,
};
