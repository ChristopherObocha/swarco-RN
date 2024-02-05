import {
  ApolloClient,
  DocumentNode,
  FetchPolicy,
  WatchQueryFetchPolicy,
  TypedDocumentNode,
} from '@apollo/client';
import {ErrorBodyType} from 'providers/dictionary/dictionary-provider';
import {GRAPHQL_REQUESTS, HTTP_REQUESTS} from 'utils/constants';

export interface ClientProviderInterface {
  method: string;
  path: string;
  params?: unknown; //unknown enforces stricter type checking and forces you to perform type checks or assertions before using the value
  headers: {[key: string]: string};
  fetchPolicy: string;
  client: ApolloClient<object>;
}

export interface ErrorResponseMessage {
  [key: string]: unknown; // You can use a more specific type here if known, used unknown because format can be {success: bool, error: string} or {success: bool, status: number} etc
}
export interface ClientRequestErrorInterface {
  response: {status: number; data: unknown};
  message: ErrorResponseMessage | string;
}

export interface TranslatedMapInterface {
  [key: string]: String;
}

export interface RestAPIRequest {
  method?: HTTP_REQUESTS;
  path: string;
  body?: any;
  type: RequestTypes;
  params?: any;
}

export interface ApolloAPIRequest {
  method?: GRAPHQL_REQUESTS;
  query: DocumentNode | TypedDocumentNode<any, object>;
  variables?: object;
  fetchPolicy?: FetchPolicy | WatchQueryFetchPolicy; // Including WatchQueryFetchPolicy for cases where we need to fetch data from cache first and then network
  key?: string;
  keys?: string[];
}

type ErrorTypes = 'NETWORK_ERROR' | 'DEFAULT_ERROR' | 'CLIENT_ERROR';
// Define a generic type for the response
export type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  headers?: Record<string, string | string[]>; // Using Record to specify key-value pairs
  error?: {
    code: ErrorTypes;
    message: string;
    body: ErrorBodyType;
  };
};

export const enum RequestTypes {
  JSON = 'application/json',
  URL_ENCODED = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data',
}
