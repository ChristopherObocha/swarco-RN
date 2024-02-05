export type CreatePaymentIntentParams = {
  chargepoint: string;
  connector: number;
};

export interface IntentResponse {
  client_secret: string;
  ephemeral_key: string;
}

export interface SetupIntentResponse extends IntentResponse {
  setup_intent_id?: string;
  customer_id?: string;
  status?: string;
}

export interface PaymentIntentResponse extends IntentResponse {
  chargepoint: string;
  connector: number;
  intent_id: string;
  display_amount: string;
  account_id: string;
  price: Price;
}

export interface ShowStripeModalParams {
  chargerIds?: CreatePaymentIntentParams;
  actionOnAuthorisation?: () => any;
  actionOnError?: () => void;
}

type Price = {
  currency: string;
  value: string;
};
