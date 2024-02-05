import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import {ChildrenProps} from '../../../generic-types';
import {useClient} from 'providers/client/client-provider';
import {
  ApiResponse,
  RequestTypes,
  RestAPIRequest,
} from 'providers/client/client-provider-types';
import {
  AUTH_SCOPE,
  GRANT_TYPES,
  HTTP_REQUESTS,
  LOGIN_CONSTS,
  SESSION_TYPES,
  TOKEN_TYPES,
} from 'utils/constants';
import {
  LoginParams,
  RefreshTokenParams,
  SessionAuthParams,
  TokenObject,
} from 'providers/types/auth';
import {ENDPOINTS} from 'providers/client/endpoints';
import qs from 'qs';
import {clearStorage, deleteObject, setObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';
import {fetchSecrets} from 'config/fetch-secrets';
import {getSessionToken, getToken} from 'utils/get-token';
import {useRestAPIClient} from 'providers/client/rest-api-client/rest-api-provider';

interface AuthContextInterface {
  login(params: LoginParams, isGuest?: boolean): Promise<ApiResponse<any>>;
  refreshToken(): Promise<ApiResponse<any> | undefined>;
  logout(): boolean;
  tokenResponse?: ApiResponse<any>;
}
// ** ** ** ** ** CREATE ** ** ** ** **
const AuthContext = createContext<AuthContextInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useAuth` hook must be used within a `AuthProvider` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function AuthProvider({children}: ChildrenProps): JSX.Element {
  const {requestRest} = useClient();
  const [tokenResponse, setTokenResponse] = useState<ApiResponse<any>>();
  const {auth} = ENDPOINTS;
  const {TOKEN, GUEST_TOKEN, CHARGING_SESSION_TOKEN, INVOICE_SESSION_TOKEN} =
    STORAGE;
  const secrets = fetchSecrets();
  const storedRefreshToken = getToken(TOKEN_TYPES.REFRESH_TOKEN);
  const {setupAPI} = useRestAPIClient();
  //Login
  const login = useCallback(
    async (params: LoginParams, isGuest?: boolean) => {
      const updatedParams = {
        ...params,
        client_secret: secrets.clientSecret,
        grant_type: GRANT_TYPES.PASSWORD,
        client_id: LOGIN_CONSTS.CLIENT_ID,
      };
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: auth.login,
        body: qs.stringify(updatedParams),
        type: RequestTypes.URL_ENCODED,
      };
      const response = await requestRest(requestParams);
      console.log(
        `${requestParams.method} - ${requestParams.path} - Success:`,
        response.success,
      );
      // If response is successful, persist token in storage
      if (response?.success && response?.data?.access_token) {
        // TODO: Will need omitting when login token is made available for use in charging API calls
        // Get charging token as well before resetting API client
        // await authenticateCharging(params);
        // await authenticateInvoice(params);

        if (isGuest) {
          deleteObject(STORAGE.TOKEN);
          setObject<TokenObject>(GUEST_TOKEN, response.data);
        } else {
          deleteObject(STORAGE.GUEST_TOKEN);
          setObject<TokenObject>(TOKEN, response.data);
        }

        setupAPI();
      }

      setTokenResponse(response);
      return response;
    },
    [requestRest],
  );

  //Refresh token
  const refreshToken = useCallback(async () => {
    if (!storedRefreshToken) {
      return;
    }
    const params: RefreshTokenParams = {
      client_secret: secrets.clientSecret,
      grant_type: GRANT_TYPES.REFRESH_TOKEN,
      client_id: LOGIN_CONSTS.CLIENT_ID,
      refresh_token: storedRefreshToken,
    };
    const requestParams: RestAPIRequest = {
      method: HTTP_REQUESTS.POST,
      path: auth.refreshToken,
      body: qs.stringify(params),
      type: RequestTypes.URL_ENCODED,
    };
    const response = await requestRest(requestParams);
    console.log(
      `${requestParams.method} - ${requestParams.path} - Success:`,
      response.success,
    );
    // If response is successful, persist token in storage
    if (response?.success && response?.data?.access_token) {
      // TODO: Will need omitting when login token is made available for use in charging API calls
      // Refresh charging token as well before resetting API client
      // await refreshTokenCharging();
      // await refreshTokenInvoice();

      setObject<TokenObject>(TOKEN, response.data);
      setupAPI();
    }
    setTokenResponse(response);
    return response;
  }, [requestRest]);

  const logout = useCallback(() => {
    clearStorage();

    setTokenResponse(undefined);
    setupAPI();
    return true;
  }, []);

  /**
   * DEPRECATED
   * Charging token functions
   *
   * **/
  const chargingSessionAuth = useCallback(
    async (params: SessionAuthParams) => {
      const {
        grant_type,
        client_id,
        client_secret,
        username,
        password,
        scope,
        refresh_token,
      } = params;
      const formData = new FormData();
      formData.append('grant_type', grant_type);
      formData.append('client_id', client_id);
      formData.append('client_secret', client_secret);
      password && formData.append('password', password);
      username && formData.append('username', username);
      refresh_token && formData.append('refresh_token', refresh_token);
      formData.append('scope', scope);

      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: auth.authChargingSession,
        type: RequestTypes.FORM_DATA,
        body: formData,
      };

      const response = await requestRest(requestParams);
      console.log(
        `${requestParams.method} - ${requestParams.path} - grant_type: ${grant_type} - Success:`,
        response.success,
      );
      if (response?.success && response.data?.access_token) {
        setObject<TokenObject>(CHARGING_SESSION_TOKEN, response.data);
        //setupAPI();
        return response.data as TokenObject;
      }
      return response;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requestRest],
  );

  // Get auth/chargingsession token on login
  const authenticateCharging = async (params: LoginParams) => {
    // Username is the generated username without the domain
    let username = params.username.split('_').pop() || '';

    const authRequestObject: SessionAuthParams = {
      grant_type: GRANT_TYPES.PASSWORD,
      client_secret: secrets.chargingSessionAuthClientSecret,
      client_id: secrets.chargingSessionAuthClientId,
      username: username,
      password: params.password,
      scope: AUTH_SCOPE.DRIVER,
    };

    await chargingSessionAuth(authRequestObject);
  };

  // Refresh auth/chargingsession token
  const refreshTokenCharging = async () => {
    const chargingSessionToken = getSessionToken(
      TOKEN_TYPES.REFRESH_TOKEN,
      SESSION_TYPES.CHARGING,
    );

    const authRequestObject: SessionAuthParams = {
      grant_type: GRANT_TYPES.REFRESH_TOKEN,
      client_secret: secrets.chargingSessionAuthClientSecret,
      client_id: secrets.chargingSessionAuthClientId,
      scope: AUTH_SCOPE.DRIVER,
      refresh_token: chargingSessionToken,
    };

    await chargingSessionAuth(authRequestObject);
  };

  /**
   * DEPRECATED
   * Invoice  token functions
   *
   * **/
  const invoiceSessionAuth = async (params: SessionAuthParams) => {
    const {
      grant_type,
      client_id,
      client_secret,
      username,
      password,
      scope,
      refresh_token,
    } = params;

    const formData = new FormData();
    formData.append('grant_type', grant_type);
    formData.append('client_id', client_id);
    formData.append('client_secret', client_secret);
    password && formData.append('password', password);
    username && formData.append('username', username);
    refresh_token && formData.append('refresh_token', refresh_token);
    formData.append('scope', scope);

    const requestParams: RestAPIRequest = {
      method: HTTP_REQUESTS.POST,
      path: auth.authInvoice,
      type: RequestTypes.FORM_DATA,
      body: formData,
    };
    console.log('formData: ', formData);
    console.log('requestParams: ', requestParams);

    try {
      const response = await requestRest(requestParams);
      console.log(
        `${requestParams.method} - ${requestParams.path} - grant_type: ${grant_type} - Success:`,
        response.success,
      );
      if (response?.success && response.data?.access_token) {
        setObject<TokenObject>(INVOICE_SESSION_TOKEN, response.data);
        //setupAPI();
        return response.data as TokenObject;
      }
    } catch (e) {
      throw e;
    }
  };

  // Get auth/invoice token on login
  const authenticateInvoice = async (params: LoginParams) => {
    // Username is the generated username without the domain
    let username = params.username.split('_').pop() || '';

    const authRequestObject: SessionAuthParams = {
      grant_type: GRANT_TYPES.PASSWORD,
      client_secret: secrets.invoiceAuthClientSecret,
      client_id: secrets.invoiceAuthClientId,
      username: username,
      password: params.password,
      scope: AUTH_SCOPE.DRIVER,
    };

    await invoiceSessionAuth(authRequestObject);
  };

  // Refresh auth/invoice token
  const refreshTokenInvoice = async () => {
    const invoiceSessionToken = getSessionToken(
      TOKEN_TYPES.REFRESH_TOKEN,
      SESSION_TYPES.INVOICE,
    );

    const authRequestObject: SessionAuthParams = {
      grant_type: GRANT_TYPES.REFRESH_TOKEN,
      client_secret: secrets.invoiceAuthClientSecret,
      client_id: secrets.invoiceAuthClientId,
      scope: AUTH_SCOPE.DRIVER,
      refresh_token: invoiceSessionToken,
    };

    await invoiceSessionAuth(authRequestObject);
  };

  const values: AuthContextInterface = useMemo(
    () => ({
      login,
      refreshToken,

      logout,
      tokenResponse,
    }),
    [login, refreshToken, logout, tokenResponse],
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
