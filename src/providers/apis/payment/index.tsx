import React, {useMemo, createContext, useContext, useCallback} from 'react';
import {ChildrenProps} from '../../../generic-types';
import {useClient} from 'providers/client/client-provider';
import {
  ApiResponse,
  RequestTypes,
  RestAPIRequest,
} from 'providers/client/client-provider-types';
import {HTTP_REQUESTS, STRIPE_SDK} from 'utils/constants';
import {ENDPOINTS} from 'providers/client/endpoints';
import {fetchSecrets} from 'config/fetch-secrets';
import {
  CreatePaymentIntentParams,
  PaymentIntentResponse,
  SetupIntentResponse,
  ShowStripeModalParams,
} from 'providers/types/payment/payment';
import {initStripe, useStripe} from '@stripe/stripe-react-native';
import {Result} from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentMethod';
import {IntentCreationCallbackParams} from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {Environment} from 'config/environment';
import {
  SendInvoiceRequestParams,
  SendInvoiceResponse,
} from 'providers/types/charging';
import {useLoading} from 'providers/loading/loading-provider';
const {payment} = ENDPOINTS;

interface PaymentContextInterface {
  sendInvoice(
    params: SendInvoiceRequestParams,
  ): Promise<ApiResponse<SendInvoiceResponse>>;
  setupIntent(): Promise<ApiResponse<SetupIntentResponse>>;
  createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<ApiResponse<PaymentIntentResponse>>;
  initializeStripeSDK(): Promise<void>;
  showStripeModal(params: ShowStripeModalParams): Promise<void>;
}
// ** ** ** ** ** CREATE ** ** ** ** **
const PaymentContext = createContext<PaymentContextInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`usePayment` hook must be used within a `PaymentContext` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function PaymentProvider({children}: ChildrenProps): JSX.Element {
  const {requestRest} = useClient();

  const secrets = fetchSecrets();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {stripeSheetAppearance} = useStyle();
  const {
    dictionary: {Payment},
  } = useDictionary();
  const {setButtonLoading} = useLoading();

  const sendInvoice = useCallback(
    async (params: SendInvoiceRequestParams) => {
      //send invoice
      const requestObject: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: payment.sendInvoice,
        type: RequestTypes.JSON,
        body: JSON.stringify(params),
      };
      console.log('requestObject: ', requestObject);

      const response = await requestRest(requestObject);
      console.log('response: ', response);

      return response;
    },
    [requestRest],
  );

  const setupIntent = useCallback(async (): Promise<
    ApiResponse<SetupIntentResponse>
  > => {
    const requestParams: RestAPIRequest = {
      method: HTTP_REQUESTS.GET,
      path: payment.setupIntent,
      type: RequestTypes.JSON,
    };
    const response: ApiResponse<SetupIntentResponse> = await requestRest(
      requestParams,
    );
    return response;
  }, [requestRest]);

  const createPaymentIntent = useCallback(
    async (params: CreatePaymentIntentParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: payment.paymentIntent,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      if (response?.success && response?.data) {
        response.data = response.data as PaymentIntentResponse;
      }
      return response;
    },
    [requestRest],
  );

  const initializeStripeSDK = useCallback(async () => {
    await initStripe({
      publishableKey: secrets.stripePublishableKey,
      merchantIdentifier: secrets.applePayMerchantId,
      urlScheme: payment.stripeUrlScheme,
    }).catch(err => console.log('initializeStripeSDK error', err));
  }, [secrets.applePayMerchantId, secrets.stripePublishableKey]);

  const showStripeModal = useCallback(
    async (showStripeModalParams: ShowStripeModalParams) => {
      const {chargerIds, actionOnAuthorisation, actionOnError} =
        showStripeModalParams;
      const intentRes = chargerIds
        ? await createPaymentIntent(chargerIds) //Payment Intent for Charging Payment
        : await setupIntent(); //Setup Intent for Saving Card

      const initPaymentSheetRes = await initPaymentSheet({
        appearance: stripeSheetAppearance,
        style: 'alwaysLight',
        primaryButtonLabel: Payment.AuthorisePaymentButton,
        returnURL: payment.stripeReturnUrl,
        merchantDisplayName: Payment.MerchantDisplayName,
        defaultBillingDetails: {
          address: {country: STRIPE_SDK.MERCHANT_COUNTRY_CODE},
        },
        applePay: {merchantCountryCode: STRIPE_SDK.MERCHANT_COUNTRY_CODE},
        googlePay: {
          merchantCountryCode: STRIPE_SDK.MERCHANT_COUNTRY_CODE,
          currencyCode:
            intentRes?.data?.price?.currency?.toUpperCase() ??
            STRIPE_SDK.MERCHANT_DEFAULT_CURRENCY_CODE,
          testEnv: Environment?.toLowerCase() !== 'production',
        },
        ...(intentRes?.data && {
          customerId: intentRes.data.customer_id,
          customerEphemeralKeySecret: intentRes.data.ephemeral_key,
          ...(chargerIds
            ? {paymentIntentClientSecret: intentRes.data.client_secret}
            : {setupIntentClientSecret: intentRes.data.client_secret}),
        }),
        intentConfiguration: {
          mode: {
            currencyCode:
              intentRes?.data?.price?.currency?.toUpperCase() ??
              STRIPE_SDK.MERCHANT_DEFAULT_CURRENCY_CODE,
            setupFutureUsage: STRIPE_SDK.OFF_SESSION_PAYMENT_COLLECTION,
            ...(chargerIds && {
              amount: Number(intentRes?.data?.price?.value ?? 0),
              captureMethod: undefined,
            }),
          },
          confirmHandler: async function (
            _paymentMethod: Result,
            _shouldSavePaymentMethod: boolean,
            _intentCreationCallback: (
              result: IntentCreationCallbackParams,
            ) => void,
          ): Promise<void> {
            throw new Error('Function not implemented.');
          },
        },
      }).then(
        async () =>
          await presentPaymentSheet()
            .then(async res => {
              console.log('presentPaymentSheet res: ', res);
              if (!res?.error && actionOnAuthorisation) {
                await actionOnAuthorisation();
              } else {
                setButtonLoading(false);
              }
            })
            .catch(err => {
              console.log('presentPaymentSheet error: ', err);
              if (actionOnError) {
                actionOnError();
              }
            }),
      );
      console.log('initPaymentSheetRes', initPaymentSheetRes); //To log errors
    },
    [
      Payment,
      createPaymentIntent,
      setupIntent,
      initPaymentSheet,
      presentPaymentSheet,
      setButtonLoading,
      stripeSheetAppearance,
    ],
  );

  const values: PaymentContextInterface = useMemo(
    () => ({
      sendInvoice,
      setupIntent,
      createPaymentIntent,
      initializeStripeSDK,
      showStripeModal,
    }),
    [
      sendInvoice,
      setupIntent,
      createPaymentIntent,
      initializeStripeSDK,
      showStripeModal,
    ],
  );

  return (
    <PaymentContext.Provider value={values}>{children}</PaymentContext.Provider>
  );
}
