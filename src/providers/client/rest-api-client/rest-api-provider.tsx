import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import {ChildrenProps} from '../../../generic-types';
import {ApisauceInstance, DEFAULT_HEADERS, create} from 'apisauce';
import {fetchSecrets} from 'config/fetch-secrets';
import {GlobalStorage} from 'utils/storage-utils';
import {TranslatedMapInterface} from 'providers/client/client-provider-types';
import {SESSION_TYPES, STORAGE, TOKEN_TYPES} from 'utils/constants';
import {getSessionToken, getToken} from 'utils/get-token';

// TODO: Remove all extra API work for charging and invoice once it is ready on production
interface RestApiContextInterface {
  restAPIClient: ApisauceInstance | null;
  urlEncodedRestAPIClient: ApisauceInstance | null;
  // chargingSessionRestAPIClient: ApisauceInstance | null;
  // invoiceSessionAPIClient: ApisauceInstance | null;
  // sessionAuthAPIClient: ApisauceInstance | null;
  tariffAPIClient: ApisauceInstance | null;
  setupAPI: () => void;
}

// ** ** ** ** ** CREATE ** ** ** ** **
const RestApiContext = createContext<RestApiContextInterface>({
  restAPIClient: null,
  urlEncodedRestAPIClient: null,
  // chargingSessionRestAPIClient: null,
  // invoiceSessionAPIClient: null,
  // sessionAuthAPIClient: null,
  tariffAPIClient: null,
  setupAPI: () => {},
});

// ** ** ** ** ** USE ** ** ** ** **
export function useRestAPIClient() {
  const context = useContext(RestApiContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useRestAPIClient` hook must be used within a `RestProvider` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function RestApiProvider({children}: ChildrenProps): JSX.Element {
  // instances of the REST API client

  const [restAPIClient, setApi] = useState<ApisauceInstance | null>(null);
  const [urlEncodedRestAPIClient, setUrlEncodedApi] =
    useState<ApisauceInstance | null>(null);
  // const [chargingSessionRestAPIClient, setChargingSessionApi] =
  //   useState<ApisauceInstance | null>(null);
  // const [invoiceSessionAPIClient, setInvoiceSessionApi] =
  //   useState<ApisauceInstance | null>(null);
  // const [sessionAuthAPIClient, setSessionAuthApi] =
  //   useState<ApisauceInstance | null>(null);
  const [tariffAPIClient, setTariffAPI] = useState<ApisauceInstance | null>(
    null,
  );

  function setupAPI() {
    // define the api
    // Set up Link to external GraphQL endpoint
    const secrets = fetchSecrets();
    const baseUrl = secrets.restUrl ?? '';

    const storedLocale = GlobalStorage.getString(STORAGE.LANGUAGE);
    const accessToken = getToken(TOKEN_TYPES.ACCESS_TOKEN);
    const evLookupApiKey = secrets.evLookupApiKey;
    // const accessToken =
    // 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJwemY1VHpiZlhXYzg0X1hzNDZqdDdoQnlNVzBhMTdMbUJBeUxOdHJmY0hNIn0.eyJleHAiOjE3MDE2NDc4MTcsImlhdCI6MTcwMTA0MzAxNywianRpIjoiMzliMjIyMGYtYzM4Yi00MWM1LTk2ZjktMDdkMmIwZjJlNjYzIiwiaXNzIjoiaHR0cHM6Ly9jb3JlLWtleWNsb2FrLXN0YWdpbmctMS5zY2RldnNvbHV0aW9ucy51azo4NDQzL3JlYWxtcy9zdGFnaW5nX2FjY291bnRfc3dhcmNvZWNvbm5lY3Rfb3JnIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImY6NDM3MWMzODUtNTc5NS00ZGVhLWI4YjktNWFjN2UzZDcwODM2OnN0YWdpbmdfYWNjb3VudF9zd2FyY29lY29ubmVjdF9vcmdfZGV2K2Rpc3RhbmNlQHRoZWRpc3RhbmNlLmNvLnVrIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBwIiwic2Vzc2lvbl9zdGF0ZSI6ImVkMzFlMTIwLWMxYWQtNGFkMi1iM2NhLTBlZDVkYmNhOTFlOCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIiwiZGVmYXVsdC1yb2xlcy1zdGFnaW5nX2FjY291bnRfc3dhcmNvZWNvbm5lY3Rfb3JnIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIGhhc3VyYXNjb3BlIFVzZXJBdHRyaWJ1dGVzIG9wZW5pZCIsInNpZCI6ImVkMzFlMTIwLWMxYWQtNGFkMi1iM2NhLTBlZDVkYmNhOTFlOCIsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLW9yZy1pZCI6IjIiLCJ4LWhhc3VyYS1vcmciOiJzdGFnaW5nX2FjY291bnRfc3dhcmNvZWNvbm5lY3Rfb3JnIiwieC1oYXN1cmEtdXNlci1pZCI6ImY6NDM3MWMzODUtNTc5NS00ZGVhLWI4YjktNWFjN2UzZDcwODM2OnN0YWdpbmdfYWNjb3VudF9zd2FyY29lY29ubmVjdF9vcmdfZGV2K2Rpc3RhbmNlQHRoZWRpc3RhbmNlLmNvLnVrIiwieC1oYXN1cmEtdXNlciI6InN0YWdpbmdfYWNjb3VudF9zd2FyY29lY29ubmVjdF9vcmdfZGV2K2Rpc3RhbmNlQHRoZWRpc3RhbmNlLmNvLnVrIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlciIsImRlZmF1bHQtcm9sZXMtc3RhZ2luZ19hY2NvdW50X3N3YXJjb2Vjb25uZWN0X29yZyJdfSwidXNlcm5hbWUiOiJzdGFnaW5nX2FjY291bnRfc3dhcmNvZWNvbm5lY3Rfb3JnX2RlditkaXN0YW5jZUB0aGVkaXN0YW5jZS5jby51ayJ9.iQZyj9z8WAy7WFJX0OhkMYonCqSYbynOZ-rD7vCyr0Stod4EgOV8wqeami5DcLtonvcgdwM6ITmbn9M9jzVWxb8126y6Ulr2xqtoMQ2JlQo_3oUefISCSZX0DKZ441xAInHOMNoyORclO2PKmQf7Z8BmK8vfNzAmCsv7DigE1sQQeX-3yZST4GdOnjhfRCKwFdVIYW62yBTIhEvj66mwwr22njeSZwbNIXFtiVjQ2e_MPBqjOcoVatrtgA3TfIzTMGV97tvcHShkTPOwwEO3zOrEV1MsBmZgf6V6lGy6gReZOHC5uBdsHelKAYQ64wwxh6WKNnNRPfORj7CiRRGqWA'
    // const chargingSessionToken = getSessionToken(
    //   TOKEN_TYPES.ACCESS_TOKEN,
    //   SESSION_TYPES.CHARGING,
    // );
    // const invoiceSessionToken = getSessionToken(
    //   TOKEN_TYPES.ACCESS_TOKEN,
    //   SESSION_TYPES.INVOICE,
    // );
    const tariffToken = secrets.tariffToken;

    const locale = storedLocale ?? 'en-GB';
    const translateMap: TranslatedMapInterface = {
      'en-GB': 'en',
    };

    let defaultRequestHeaders: object = {
      ...DEFAULT_HEADERS,
      'Accept-Language': String(translateMap[locale]),
      access_token: evLookupApiKey,
    };

    let urlEncdodedHeader: object = {
      ...defaultRequestHeaders,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    //use this for auth request made before sending invoice or starting charge session
    // const sessionAuthRequestHeaders: object = {
    //   ...defaultRequestHeaders,
    //   'Content-Type': 'multipart/form-data',
    // };

    // let chargingSessionRequestHeader: object = {
    //   ...defaultRequestHeaders,
    //   'api-auth': secrets.chargingSessionApiAuth,
    // };

    // let invoiceSessionRequestHeader: object = {
    //   ...defaultRequestHeaders,
    //   'api-auth': secrets.invoiceApiAuth,
    // };

    let tariffRequestHeader: object = {
      ...defaultRequestHeaders,
      authorisation: tariffToken,
    };

    if (accessToken) {
      defaultRequestHeaders = {
        ...defaultRequestHeaders,
        Authorization: `Bearer ${accessToken}`,
        'keycloak-auth-token': `Bearer ${accessToken}`,
        access_token: evLookupApiKey, //This is the header required for EV Lookup API. Appending to this instance instead of creating a new instance
      };
      urlEncdodedHeader = {
        ...urlEncdodedHeader,
        Authorization: `Bearer ${accessToken}`,
        'keycloak-auth-token': `Bearer ${accessToken}`,
      };
    }

    // TODO: Will need omitting when login token is made available for use in charging API calls
    // if (chargingSessionToken) {
    //   chargingSessionRequestHeader = {
    //     ...chargingSessionRequestHeader,
    //     Authorization: `Bearer ${chargingSessionToken}`,
    //   };
    // }

    // Not valid atm
    // if (invoiceSessionToken) {
    //   invoiceSessionRequestHeader = {
    //     ...invoiceSessionRequestHeader,
    //     Authorization: `Bearer ${invoiceSessionToken}`,
    //   };
    // }

    const defaultApiInstanceParams = {
      baseURL: baseUrl,
      timeout: 10000,
    };
    const defaultApiInstance = create({
      ...defaultApiInstanceParams,
      headers: defaultRequestHeaders,
    });

    const urlEncodedApiInstance = create({
      ...defaultApiInstanceParams,
      headers: urlEncdodedHeader,
    });

    // TODO: Will need omitting when login token is made available for use in charging API calls
    // const sessionAuthApiInstance = create({
    //   ...defaultApiInstanceParams,
    //   headers: sessionAuthRequestHeaders,
    // });

    // TODO: Will need omitting when login token is made available for use in charging API calls
    // const chargingSessionApiInstance = create({
    //   ...defaultApiInstanceParams,
    //   headers: chargingSessionRequestHeader,
    // });

    // const invoiceSessionApiInstance = create({
    //   ...defaultApiInstanceParams,
    //   headers: invoiceSessionRequestHeader,
    // });

    const tariffApiInstance = create({
      ...defaultApiInstanceParams,
      headers: tariffRequestHeader,
    });

    setApi(defaultApiInstance);
    setUrlEncodedApi(urlEncodedApiInstance);
    // setChargingSessionApi(chargingSessionApiInstance);
    // setInvoiceSessionApi(invoiceSessionApiInstance);
    // setSessionAuthApi(sessionAuthApiInstance);
    setTariffAPI(tariffApiInstance);
  }

  // Modify if API client needs to be recreated
  useEffect(() => {
    if (
      !restAPIClient ||
      !urlEncodedRestAPIClient ||
      // !invoiceSessionAPIClient ||
      // !chargingSessionRestAPIClient ||
      // !sessionAuthAPIClient ||
      !tariffAPIClient
    ) {
      setupAPI();
    }
  }, []);

  const values: RestApiContextInterface = useMemo(
    () => ({
      restAPIClient,
      urlEncodedRestAPIClient,
      // chargingSessionRestAPIClient,
      // invoiceSessionAPIClient,
      // sessionAuthAPIClient,
      tariffAPIClient,
      setupAPI,
    }),
    [
      restAPIClient,
      urlEncodedRestAPIClient,
      // chargingSessionRestAPIClient,
      // invoiceSessionAPIClient,
      // sessionAuthAPIClient,
      tariffAPIClient,
    ],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <RestApiContext.Provider value={values}>{children}</RestApiContext.Provider>
  );
}
