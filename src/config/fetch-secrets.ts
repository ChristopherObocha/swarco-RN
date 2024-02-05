import {
  GRAPHQL_URL_STAGING,
  GRAPHQL_URL_PRODUCTION,
  REST_BASE_URL_STAGING,
  REST_BASE_URL_PRODUCTION,
  CLIENT_SECRET_STAGING,
  CLIENT_SECRET_PRODUCTION,
  STRIPE_PUBLISHABLE_KEY_TEST,
  STRIPE_CLIENT_ID_TEST,
  STRIPE_PUBLISHABLE_KEY_LIVE,
  STRIPE_CLIENT_ID_LIVE,
  APPLE_PAY_MERCHANT_ID,
  INVOICE_AUTH_CLIENT_ID_STAGING,
  INVOICE_AUTH_CLIENT_ID_PRODUCTION,
  INVOICE_AUTH_CLIENT_SECRET_STAGING,
  INVOICE_AUTH_CLIENT_SECRET_PRODUCTION,
  INVOICE_AUTH_USERNAME_STAGING,
  INVOICE_AUTH_PASSWORD_STAGING,
  INVOICE_AUTH_USERNAME_PRODUCTION,
  INVOICE_AUTH_PASSWORD_PRODUCTION,
  INVOICE_API_AUTH_STAGING,
  INVOICE_API_AUTH_PRODUCTION,
  CHARGING_SESSION_AUTH_CLIENT_ID_STAGING,
  CHARGING_SESSION_AUTH_CLIENT_ID_PRODUCTION,
  CHARGING_SESSION_AUTH_CLIENT_SECRET_STAGING,
  CHARGING_SESSION_AUTH_CLIENT_SECRET_PRODUCTION,
  CHARGING_SESSION_AUTH_USERNAME_STAGING,
  CHARGING_SESSION_AUTH_USERNAME_PRODUCTION,
  CHARGING_SESSION_AUTH_PASSWORD_STAGING,
  CHARGING_SESSION_AUTH_PASSWORD_PRODUCTION,
  CHARGING_SESSION_API_AUTH_STAGING,
  CHARGING_SESSION_API_AUTH_PRODUCTION,
  ENCRYPTION_KEY,
  TARIFF_TOKEN_STAGING,
  TARIFF_TOKEN_PRODUCTION,
  SUBSCRIPTION_PUSH_AUTH_PRODUCTION,
  SUBSCRIPTION_PUSH_AUTH_STAGING,
  SUBSCRIPTION_URL_PRODUCTION,
  SUBSCRIPTION_URL_STAGING,
  EV_LOOKUP_API_KEY,
} from '@env';
import {Environment} from './environment';

// TODO: Remove the specified secrets from 1Password and update the production values
export type Secrets = {
  restUrl: string;
  graphqlUrl: string;
  clientSecret: string;
  encryptionKey: string;
  stripePublishableKey: string;
  applePayMerchantId: string;
  invoiceAuthClientId: string; // Will be removed
  invoiceAuthClientSecret: string; // Will be removed
  invoiceAuthUsername: string; // Will be removed
  invoiceAuthPassword: string; // Will be removed
  invoiceApiAuth: string; // Will be removed
  chargingSessionAuthClientId: string; // Will be removed
  chargingSessionAuthClientSecret: string; // Will be removed
  chargingSessionAuthUsername: string; // Will be removed
  chargingSessionAuthPassword: string; // Will be removed
  chargingSessionApiAuth: string; // Will be removed
  tariffToken: string;
  subscriptionUrl: string;
  subscriptionPushAuth: string; // Will be removed
  evLookupApiKey: string;
  stripeClientId: string;
};

export function fetchSecrets(): Secrets {
  let secrets: Secrets = {
    restUrl: REST_BASE_URL_STAGING,
    graphqlUrl: GRAPHQL_URL_STAGING,
    encryptionKey: ENCRYPTION_KEY,
    clientSecret: CLIENT_SECRET_STAGING,
    stripePublishableKey: STRIPE_PUBLISHABLE_KEY_TEST,
    applePayMerchantId: APPLE_PAY_MERCHANT_ID,
    invoiceAuthClientId: INVOICE_AUTH_CLIENT_ID_STAGING,
    invoiceAuthClientSecret: INVOICE_AUTH_CLIENT_SECRET_STAGING,
    invoiceAuthUsername: INVOICE_AUTH_USERNAME_STAGING,
    invoiceAuthPassword: INVOICE_AUTH_PASSWORD_STAGING,
    invoiceApiAuth: INVOICE_API_AUTH_STAGING,
    chargingSessionAuthClientId: CHARGING_SESSION_AUTH_CLIENT_ID_STAGING,
    chargingSessionAuthClientSecret:
      CHARGING_SESSION_AUTH_CLIENT_SECRET_STAGING,
    chargingSessionAuthUsername: CHARGING_SESSION_AUTH_USERNAME_STAGING, // TODO: Not needed anymore, will use user values on login
    chargingSessionAuthPassword: CHARGING_SESSION_AUTH_PASSWORD_STAGING, // TODO: Not needed anymore, will use user values on login
    chargingSessionApiAuth: CHARGING_SESSION_API_AUTH_STAGING,
    tariffToken: TARIFF_TOKEN_STAGING,
    subscriptionPushAuth: SUBSCRIPTION_PUSH_AUTH_STAGING,
    subscriptionUrl: SUBSCRIPTION_URL_STAGING,
    evLookupApiKey: EV_LOOKUP_API_KEY,
    stripeClientId: STRIPE_CLIENT_ID_TEST,
  };

  if (Environment?.toLowerCase() === 'production') {
    secrets = {
      ...secrets,
      restUrl: REST_BASE_URL_PRODUCTION,
      graphqlUrl: GRAPHQL_URL_PRODUCTION,
      clientSecret: CLIENT_SECRET_PRODUCTION,
      stripePublishableKey: STRIPE_PUBLISHABLE_KEY_LIVE,
      invoiceAuthClientId: INVOICE_AUTH_CLIENT_ID_PRODUCTION,
      invoiceAuthClientSecret: INVOICE_AUTH_CLIENT_SECRET_PRODUCTION,
      invoiceAuthUsername: INVOICE_AUTH_USERNAME_PRODUCTION,
      invoiceAuthPassword: INVOICE_AUTH_PASSWORD_PRODUCTION,
      invoiceApiAuth: INVOICE_API_AUTH_PRODUCTION,
      chargingSessionAuthClientId: CHARGING_SESSION_AUTH_CLIENT_ID_PRODUCTION,
      chargingSessionAuthClientSecret:
        CHARGING_SESSION_AUTH_CLIENT_SECRET_PRODUCTION,
      chargingSessionAuthUsername: CHARGING_SESSION_AUTH_USERNAME_PRODUCTION, // TODO: Not needed anymore, will use user values on login
      chargingSessionAuthPassword: CHARGING_SESSION_AUTH_PASSWORD_PRODUCTION, // TODO: Not needed anymore, will use user values on login
      chargingSessionApiAuth: CHARGING_SESSION_API_AUTH_PRODUCTION,
      tariffToken: TARIFF_TOKEN_PRODUCTION,
      subscriptionPushAuth: SUBSCRIPTION_PUSH_AUTH_PRODUCTION,
      subscriptionUrl: SUBSCRIPTION_URL_PRODUCTION,
      evLookupApiKey: EV_LOOKUP_API_KEY,
      stripeClientId: STRIPE_CLIENT_ID_LIVE,
    };
  }
  return secrets;
}
