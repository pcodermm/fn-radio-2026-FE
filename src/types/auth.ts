export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_url: string | null;
  last_login_at: string | null;
  created_at: string;
}

export interface AuthTokenData {
  token: string;
  user: User;
}

export interface DeviceMetadata {
  device_id: string;
  device_name: string;
  platform: 'web';
  app_version: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
