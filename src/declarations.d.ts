declare module 'the-core-ui-module-tdforms-v2';
declare module 'the-core-ui-utils';

declare module 'metro-config';
declare module 'obfuscator-io-metro-plugin';

declare module '*.svg' {
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '@env' {
  export const ENV_VAR: string;
  export const GRAPHQL_URL_STAGING: string;
  export const GRAPHQL_URL_PRODUCTION: string;
  export const X_API_KEY: string;
  export const REST_BASE_URL_STAGING: string;
  export const REST_BASE_URL_PRODUCTION: string;
  export const ENCRYPTION_KEY: string;
  export const CLIENT_SECRET_STAGING: string;
  export const CLIENT_SECRET_PRODUCTION: string;
  export const STRIPE_PUBLISHABLE_KEY_TEST: string;
  export const STRIPE_CLIENT_ID_TEST: string;
  export const STRIPE_PUBLISHABLE_KEY_LIVE: string;
  export const STRIPE_CLIENT_ID_LIVE: string;
  export const APPLE_PAY_MERCHANT_ID: string;
  export const INVOICE_AUTH_CLIENT_ID_STAGING: string;
  export const INVOICE_AUTH_CLIENT_ID_PRODUCTION: string;
  export const INVOICE_AUTH_CLIENT_SECRET_STAGING: string;
  export const INVOICE_AUTH_CLIENT_SECRET_PRODUCTION: string;
  export const INVOICE_AUTH_USERNAME_STAGING: string;
  export const INVOICE_AUTH_USERNAME_PRODUCTION: string;
  export const INVOICE_AUTH_PASSWORD_STAGING: string;
  export const INVOICE_AUTH_PASSWORD_PRODUCTION: string;
  export const INVOICE_API_AUTH_STAGING: string;
  export const INVOICE_API_AUTH_PRODUCTION: string;
  export const CHARGING_SESSION_AUTH_CLIENT_ID_STAGING: string;
  export const CHARGING_SESSION_AUTH_CLIENT_ID_PRODUCTION: string;
  export const CHARGING_SESSION_AUTH_CLIENT_SECRET_STAGING: string;
  export const CHARGING_SESSION_AUTH_CLIENT_SECRET_PRODUCTION: string;
  export const CHARGING_SESSION_AUTH_USERNAME_STAGING: string;
  export const CHARGING_SESSION_AUTH_USERNAME_PRODUCTION: string;
  export const CHARGING_SESSION_AUTH_PASSWORD_STAGING: string;
  export const CHARGING_SESSION_AUTH_PASSWORD_PRODUCTION: string;
  export const CHARGING_SESSION_API_AUTH_STAGING: string;
  export const CHARGING_SESSION_API_AUTH_PRODUCTION: string;
  export const TARIFF_TOKEN_STAGING: string;
  export const TARIFF_TOKEN_PRODUCTION: string;
  export const SUBSCRIPTION_URL_STAGING: string;
  export const SUBSCRIPTION_URL_PRODUCTION: string;
  export const SUBSCRIPTION_PUSH_AUTH_STAGING: string;
  export const SUBSCRIPTION_PUSH_AUTH_PRODUCTION: string;
  export const EV_LOOKUP_API_KEY: string;
}
