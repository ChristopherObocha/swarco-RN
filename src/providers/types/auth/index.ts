import {GRANT_TYPES} from 'utils/constants';

export type TokenObject = {
  refresh_token?: string;
  access_token?: string;
};

export type LoginParams = {
  username: string;
  password: string;
};

export type RefreshTokenParams = {
  grant_type: GRANT_TYPES;
  client_secret: string;
  client_id: string;
  refresh_token: string;
};

export type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': string;
  session_state: string;
  scope: string;
};

export type SessionAuthParams = {
  grant_type: GRANT_TYPES;
  client_secret: string;
  client_id: string;
  username?: string;
  password?: string;
  scope: string;
  refresh_token?: string;
};
