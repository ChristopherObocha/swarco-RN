import React, {useCallback, useMemo, useState} from 'react';

import {ChildrenProps} from '../../generic-types';
import {useApolloClient} from '@apollo/client';
import {useRestAPIClient} from 'providers/client/rest-api-client/rest-api-provider';
import {GRAPHQL_REQUESTS, HTTP_REQUESTS} from 'utils/constants';
import {useNetwork} from 'providers/network/network-provider';
import {
  ApiResponse,
  ApolloAPIRequest,
  RequestTypes,
  RestAPIRequest,
} from './client-provider-types';
import {useLoading} from 'providers/loading/loading-provider';
import {useAlert} from 'providers/alert/alert-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {ENDPOINTS} from './endpoints';
import {firebaseCrashlyticsEvent} from 'utils/error-logging';
const {charging, site} = ENDPOINTS;

interface ClientContextInterface {
  requestRest(props: RestAPIRequest): Promise<ApiResponse<any>>;
  requestQuery<T>(props: ApolloAPIRequest): Promise<ApiResponse<T>>;
}

export const ClientContext = React.createContext<ClientContextInterface | null>(
  null,
);

export function useClient() {
  const context = React.useContext(ClientContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useClient` hook must be used within a `ClientProvider` component',
    );
  }
  return context;
}

export function ClientProvider({children}: ChildrenProps): JSX.Element {
  // const {tokens} = useAuth();
  const apolloClient = useApolloClient();
  const {
    restAPIClient,
    urlEncodedRestAPIClient,
    // chargingSessionRestAPIClient,
    // invoiceSessionAPIClient,
    // sessionAuthAPIClient,
    tariffAPIClient,
  } = useRestAPIClient();
  const {isConnected} = useNetwork();
  const {setLoading} = useLoading();

  const {alert} = useAlert();
  const {
    dictionary: {NoInternetAlert},
  } = useDictionary();

  const [lastAlertTime, setLastAlertTime] = useState<number | null>(null);

  const checkInternetConnection = useCallback(() => {
    if (lastAlertTime && new Date().getTime() - lastAlertTime < 5000) {
      return;
    }

    if (!isConnected) {
      setLastAlertTime(new Date().getTime());
      alert(NoInternetAlert.title, NoInternetAlert.description, [
        {text: NoInternetAlert.buttonText},
      ]);
    }
  }, [
    NoInternetAlert.buttonText,
    NoInternetAlert.description,
    NoInternetAlert.title,
    alert,
    isConnected,
    lastAlertTime,
  ]);

  const requestQuery = useCallback(
    async (requestProps: ApolloAPIRequest): Promise<ApiResponse<any>> => {
      checkInternetConnection();

      if (!apolloClient) {
        return {success: false};
      }

      const {method, query, variables = {}, fetchPolicy} = requestProps;

      // Define request based on method
      const request = () => {
        switch (method) {
          case GRAPHQL_REQUESTS.QUERY:
          case undefined:
            return apolloClient.query({
              query: query,
              variables: variables,
              fetchPolicy:
                fetchPolicy ?? isConnected ? 'network-only' : 'cache-only',
            });
          case GRAPHQL_REQUESTS.MUTATION:
            return apolloClient.mutate({
              mutation: query,
              variables: variables,
            });
          default:
            return apolloClient.query({
              query: query,
              variables: variables,
              fetchPolicy:
                fetchPolicy ?? isConnected ? 'network-only' : 'cache-only',
            });
          // case GRAPHQL_REQUESTS.SUBSCRIPTION:
          //   return apolloClient.subscribe({query, variables});
        }
      };

      // Execute request and handle exeption
      const response = await request()
        .then(res => {
          let data;

          if (requestProps.key) {
            data = res?.data?.[requestProps.key];
          } else if (requestProps.keys) {
            data = res.data;

            for (const key of requestProps.keys) {
              data = data[key][0];
            }
          } else {
            data = res?.data;
          }
          return {success: true, data: data, error: undefined};
        })
        .catch(err => {
          console.log('requestQuery - err: ', err);

          firebaseCrashlyticsEvent(`requestQuery - Error: ${err}`);

          return {
            success: false,
            data: undefined,
            headers: undefined,
            error: err,
          };
        });

      // Construct response object
      const res = {
        success: response.success,
        data: response.data,
        error: response.error,
      };

      return res;
    },
    [apolloClient, checkInternetConnection, isConnected],
  );

  const requestRest = useCallback(
    async (requestProps: RestAPIRequest): Promise<ApiResponse<any>> => {
      checkInternetConnection();
      if (
        !restAPIClient ||
        !urlEncodedRestAPIClient ||
        // !invoiceSessionAPIClient ||
        // !chargingSessionRestAPIClient ||
        // !sessionAuthAPIClient ||
        !tariffAPIClient
      ) {
        return {
          success: false,
          error: {
            code: 'CLIENT_ERROR',
            message: 'Provider not initialized',
            body: '',
          },
        };
      }

      const {method, path, body, type, params} = requestProps;

      // Define request based on method and request type
      let request;
      if (type === RequestTypes.JSON) {
        // if (
        //   path === charging.startChargingSession ||
        //   path === charging.stopChargingSession ||
        //   path === payment.sendInvoice // Invoice can use charge session token
        // ) {
        //   request = () => {
        //     return chargingSessionRestAPIClient.post(path, body);
        //   };
        // } else
        if (path === charging.chargepointTariff || path === site.sitetariff) {
          request = () => {
            return tariffAPIClient.get(path, params);
          };
        } else {
          request = () => {
            switch (method) {
              case HTTP_REQUESTS.GET:
              case undefined:
                return restAPIClient.get(path);
              case HTTP_REQUESTS.POST:
                return restAPIClient.post(path, body);
              case HTTP_REQUESTS.PUT:
              case HTTP_REQUESTS.PATCH:
                return restAPIClient.put(path, body);
              case HTTP_REQUESTS.DELETE:
                return restAPIClient.delete(path, {}, {data: body});
              default:
                throw new Error(`Unsupported method: ${method}`);
            }
          };
        }
        // } else if (type === RequestTypes.FORM_DATA) {
        //   request = () => {
        //     switch (method) {
        //       case HTTP_REQUESTS.POST:
        //         return sessionAuthAPIClient.post(path, body);
        //       default:
        //         throw new Error(`Unsupported method: ${method}`);
        //     }
        //   };
      } else {
        request = () => {
          switch (method) {
            case HTTP_REQUESTS.POST: {
              return urlEncodedRestAPIClient.post(path, body);
            }
            case HTTP_REQUESTS.PUT:
            case HTTP_REQUESTS.PATCH:
              return urlEncodedRestAPIClient.put(path, body);
            case HTTP_REQUESTS.DELETE:
              return urlEncodedRestAPIClient.delete(path, body);
            default:
              throw new Error(`Unsupported method: ${method}`);
          }
        };
      }

      // Execute request and handle exeption
      const response = await request()
        .catch(err => {
          console.log('requestRest - err: ', err);

          firebaseCrashlyticsEvent(`requestRest - Error: ${err}`);

          return {
            ok: false,
            data: undefined,
            headers: undefined,
            problem: err.code,
            originalError: {message: err.message},
          };
        })
        .finally(() => {});

      const responseData = response?.data as any;
      const errorBody =
        responseData?.message || responseData?.error_description || 'unknown';
      // Construct response object
      const res: ApiResponse<any> = {
        success: response.ok,
        data: response.data,
        headers: response.headers,
        error: response.problem
          ? {
              code: response.problem,
              message: response.originalError?.message || 'An error occurred.',
              body: errorBody,
            }
          : undefined,
      };

      return res;
    },
    [
      // chargingSessionRestAPIClient,
      checkInternetConnection,
      // invoiceSessionAPIClient,
      restAPIClient,
      // sessionAuthAPIClient,

      tariffAPIClient,
      urlEncodedRestAPIClient,
    ],
  );

  const values: ClientContextInterface = useMemo(
    () => ({requestRest, requestQuery}),
    [requestRest, requestQuery],
  );

  return (
    <ClientContext.Provider value={values}>{children}</ClientContext.Provider>
  );
}
