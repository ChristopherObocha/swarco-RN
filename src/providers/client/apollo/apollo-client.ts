/*
 * Jira Ticket:
 * Created Date: Tue, 22nd Aug 2023, 11:06:00 am
 * Author: Nawaf Ibrahim
 * Email: nawaf.ibrahim@thedistance.co.uk
 * Copyright (c) 2023 The Distance
 */

import {
  HttpLink,
  InMemoryCache,
  ApolloClient as ApolloClientBase,
  ApolloLink,
  split,
  DefaultOptions,
} from '@apollo/client/';
import {persistCache, MMKVWrapper} from 'apollo3-cache-persist';
import {onError} from '@apollo/client/link/error';
import {RetryLink} from '@apollo/client/link/retry';
import {getMainDefinition} from '@apollo/client/utilities';

import {STORAGE, TOKEN_TYPES} from 'utils/constants';
import {ApolloCacheStorage, GlobalStorage} from 'utils/storage-utils';
import {fetchSecrets} from 'config/fetch-secrets';
import {TranslatedMapInterface} from '../client-provider-types';
import {getToken} from 'utils/get-token';
import {WebSocketLink} from '@apollo/client/link/ws';

// Hardcoded Token for testing to avoid using useEffect each time i need atoken
// const accessToken =
// 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJwemY1VHpiZlhXYzg0X1hzNDZqdDdoQnlNVzBhMTdMbUJBeUxOdHJmY0hNIn0.eyJleHAiOjE2OTk2MzI3NDIsImlhdCI6MTY5OTAyNzk0MiwianRpIjoiOTg1M2VhNGMtY2E2MS00ZmIzLWIxMzctYzZiOWFlZGVlODU0IiwiaXNzIjoiaHR0cHM6Ly9jb3JlLWtleWNsb2FrLXN0YWdpbmctMS5zY2RldnNvbHV0aW9ucy51azo4NDQzL3JlYWxtcy9zdGFnaW5nX2FjY291bnRfc3dhcmNvZWNvbm5lY3Rfb3JnIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImY6NDM3MWMzODUtNTc5NS00ZGVhLWI4YjktNWFjN2UzZDcwODM2OnN0YWdpbmdfYWNjb3VudF9zd2FyY29lY29ubmVjdF9vcmdfZGV2K2Rpc3RhbmNlQHRoZWRpc3RhbmNlLmNvLnVrIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBwIiwic2Vzc2lvbl9zdGF0ZSI6IjRiM2UzNmE1LWY0MTAtNDM5Yi05ZTliLTEwOGM0ZTFjNzM2ZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIiwiZGVmYXVsdC1yb2xlcy1zdGFnaW5nX2FjY291bnRfc3dhcmNvZWNvbm5lY3Rfb3JnIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIGhhc3VyYXNjb3BlIFVzZXJBdHRyaWJ1dGVzIG9wZW5pZCIsInNpZCI6IjRiM2UzNmE1LWY0MTAtNDM5Yi05ZTliLTEwOGM0ZTFjNzM2ZSIsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLW9yZy1pZCI6IjIiLCJ4LWhhc3VyYS1vcmciOiJzdGFnaW5nX2FjY291bnRfc3dhcmNvZWNvbm5lY3Rfb3JnIiwieC1oYXN1cmEtdXNlci1pZCI6ImY6NDM3MWMzODUtNTc5NS00ZGVhLWI4YjktNWFjN2UzZDcwODM2OnN0YWdpbmdfYWNjb3VudF9zd2FyY29lY29ubmVjdF9vcmdfZGV2K2Rpc3RhbmNlQHRoZWRpc3RhbmNlLmNvLnVrIiwieC1oYXN1cmEtdXNlciI6InN0YWdpbmdfYWNjb3VudF9zd2FyY29lY29ubmVjdF9vcmdfZGV2K2Rpc3RhbmNlQHRoZWRpc3RhbmNlLmNvLnVrIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlciIsImRlZmF1bHQtcm9sZXMtc3RhZ2luZ19hY2NvdW50X3N3YXJjb2Vjb25uZWN0X29yZyJdfSwidXNlcm5hbWUiOiJzdGFnaW5nX2FjY291bnRfc3dhcmNvZWNvbm5lY3Rfb3JnX2RlditkaXN0YW5jZUB0aGVkaXN0YW5jZS5jby51ayJ9.XcyTt65RxOt44KlV2mWLNF625rbjN3hvAAbpXKekmEgXpxodHRIoXWNSztSVlltIgdyo3HXaGWJB8FMmP2vjTaCge2djh_cC4cz2JSDRRIJUwpPSRIqvAW4sODTW31ODDPaD9cx_FE68e5xCwP_56UJR5rSSnez7iRx76eQH1j-yI7i2G8et1YIC7JWToJm30bBTKOxO9JEMqUebgwfg9uMK2n7oTS7GFhFmYAr9gVJ3Jsk1FWSrsJHDhrq85kk1Lg_ag4xtXoHOwV4VTMuWuxWlzSIx9igGFjkr32m4IvmuPy5KYf9Nbvo7zFs6npe69zV65zc5ExMlUp4QnFwzkg';

export const ApolloClient = async () => {
  const apolloFetch = async (uri: string, options: any) => {
    const storedLocale = GlobalStorage.getString(STORAGE.LANGUAGE);

    const locale = storedLocale ?? 'en-GB';
    const translateMap: TranslatedMapInterface = {
      'en-GB': 'en',
    };

    // User Apollo Middleware
    // const Authorization = await Authoriser();
    const updatedOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getToken(TOKEN_TYPES.ACCESS_TOKEN)}`,
        'Accept-Language': translateMap[locale],
      },
    };

    return fetch(uri, updatedOptions);
  };

  // Set up Link to external GraphQL endpoint
  const secrets = fetchSecrets();
  const graphQLUrl = secrets.graphqlUrl ?? '';

  const httpLink = new HttpLink({
    uri: graphQLUrl,
    //@ts-ignore
    fetch: apolloFetch,
  });

  const subscriptionUrl = secrets.subscriptionUrl ?? '';

  // const subscriptionAuth = secrets.subscriptionPushAuth ?? '';
  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: subscriptionUrl,
    options: {
      reconnect: true,
      lazy: true,
      inactivityTimeout: 10000,
      connectionParams: () => {
        return {
          headers: {
            Authorization: `Bearer ${getToken(TOKEN_TYPES.ACCESS_TOKEN)}`,
          },
        };
      },
    },
  });

  const splitLink = split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: (error, _operation) => !!error,
    },
  });

  const errorLink = onError(error => {
    const {graphQLErrors, networkError} = error;

    if (graphQLErrors) {
      graphQLErrors.map(({message, locations, path}) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      });
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`, networkError);
    }
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Subscription: {
        fields: {
          sdr: {
            merge(_, incoming) {
              // Replace the existing cache with the incoming data
              return incoming;
            },
          },
        },
      },
    },
  });

  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  await persistCache({
    cache,
    storage: new MMKVWrapper(ApolloCacheStorage),
  });

  const client = new ApolloClientBase({
    link: ApolloLink.from([errorLink, retryLink, splitLink]),
    cache: cache,
    connectToDevTools: true,
    defaultOptions: defaultOptions,
  });

  return client;
};
