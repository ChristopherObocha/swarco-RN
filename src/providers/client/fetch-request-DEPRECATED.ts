/*
 * Jira Ticket:
 * Created Date: Tue, 22nd Aug 2023, 11:06:00 am
 * Author: Nawaf Ibrahim
 * Email: nawaf.ibrahim@thedistance.co.uk
 * Copyright (c) 2023 The Distance
 */

import {create} from 'apisauce';
import {GRAPHQL_REQUESTS, HTTP_REQUESTS} from 'utils/constants';
import {gql} from 'graphql-tag'; // Import the gql function
import {
  ClientProviderInterface,
  ClientRequestErrorInterface,
  ErrorResponseMessage,
} from './client-provider-types';
import {fetchSecrets} from 'config/fetch-secrets';

interface FetchResponse<T> {
  status?: number;
  data?: unknown; // Generic type parameter to be used throughout request, a replacement since it is near impossible to know exactly how data is returned
  headers?: unknown; // Replace if we know exactly how the headers will be
  title?: string;
  success?: boolean;
  message?: string;
}

interface ErrorResponse {
  success: boolean;
  error: {
    code: number;
    message: string | ErrorResponseMessage | undefined;
  };
  data?: undefined;
  headers?: undefined;
}

type AllowedFetchPolicy = 'no-cache' | 'network-only';

type FetchPolicy =
  | 'cache-first'
  // | 'cache-and-network' not valid mutation fetch policy
  | 'network-only'
  | 'cache-only'
  | 'no-cache'
  | 'standby';

function processResponse<T>(response: FetchResponse<T>) {
  if (response?.status) {
    if (response.status >= 300) {
      console.log('ERROR: getting data from fetchRequest', response);
      return {
        success: false,
        error: {
          code: response.status,
          message: response.title,
        },
      };
    }

    return {success: true, data: response.data, headers: response.headers};
  }
  return {success: true, data: response.data, headers: response.headers};
}

export const fetchRequest = async <T>({
  method,
  path,
  params,
  fetchPolicy = 'network-only',
  headers,
  client,
}: ClientProviderInterface): Promise<FetchResponse<T>> => {
  let body: any;

  if (method === HTTP_REQUESTS.GET || method === HTTP_REQUESTS.DELETE) {
    if (params) path = path + params;
  } else {
    if (params) body = JSON.stringify(params);
  }

  const requestOptions = {
    baseURL: fetchSecrets().restUrl,
    method,
    headers,
    body,
  };

  const execute = () => {
    const queryOrMutation = gql(path); // Convert the path to a DocumentNode

    // Validate that fetchPolicy is a valid FetchPolicy value
    // if (!['cache-first', 'network-only', 'cache-only', 'no-cache', 'standby'].includes(fetchPolicy)) {
    //   throw new Error('Invalid fetchPolicy value');
    // }

    switch (method) {
      //REST REQUESTS
      case HTTP_REQUESTS.GET:
        return create(requestOptions).get(path);
      case HTTP_REQUESTS.POST:
        return create(requestOptions).post(path, body);
      case HTTP_REQUESTS.PATCH:
        return create(requestOptions).patch(path, body);
      case HTTP_REQUESTS.PUT:
        return create(requestOptions).put(path, body);
      case HTTP_REQUESTS.DELETE:
        return create(requestOptions).delete(path);
      //GRAPHQL REQUESTS
      case GRAPHQL_REQUESTS.QUERY:
        return client.query({
          query: queryOrMutation, //path is the Query tag
          variables: params as Record<string, unknown>, //params are the arguments/input of the Query tag
          fetchPolicy: fetchPolicy as FetchPolicy,
        });
      case GRAPHQL_REQUESTS.MUTATION:
        return client.mutate({
          mutation: queryOrMutation, //path is the Mutation tag
          variables: params as Record<string, unknown>, //params are the arguments/input of the Mutation tag
          fetchPolicy: fetchPolicy as AllowedFetchPolicy,
        });
      //ERROR
      default:
        throw new Error('Invalid request method');
    }
  };

  return execute()
    .then((response: unknown) => {
      return processResponse(response as NonNullable<FetchResponse<T>>); // Adjust the type assertion if needed
    })
    .catch((error: ClientRequestErrorInterface) => {
      console.log(`fetchRequest - error ${path}: `, error);

      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: error?.response?.status ?? 0,
          message: error?.message ?? undefined,
        },
      };

      return errorResponse as FetchResponse<string>;
    });
};
