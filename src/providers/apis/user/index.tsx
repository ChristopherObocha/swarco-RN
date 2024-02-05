import React, {
  useMemo,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import {ChildrenProps} from '../../../generic-types';
import {useClient} from 'providers/client/client-provider';
import {
  ApiResponse,
  RequestTypes,
  RestAPIRequest,
} from 'providers/client/client-provider-types';
import {HTTP_REQUESTS} from 'utils/constants';
import {
  Address,
  AddressAutoCompleteRequestParams,
  AddressAutoCompleteResponse,
  AddressRequestParams,
  AppSettings,
  ForgotPasswordParams,
  GuestUserCreateParams,
  GuestUserCreateResponse,
  ResetPasswordParams,
  UserCreateParams,
  UserUpdateParams,
  VerificationResendParams,
  VerifyUserParams,
} from 'providers/types/user';
import {ENDPOINTS} from 'providers/client/endpoints';
import {deleteObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';

interface UserContextInterface {
  createUser(params: UserCreateParams): Promise<ApiResponse<void>>;
  createGuestUser(
    params: GuestUserCreateParams,
  ): Promise<ApiResponse<GuestUserCreateResponse>>;
  verifyUser(params: VerifyUserParams): Promise<ApiResponse<void>>;
  resendVerification(
    params: VerificationResendParams,
  ): Promise<ApiResponse<void>>;
  forgotPassword(params: ForgotPasswordParams): Promise<ApiResponse<void>>;
  resetPassword(params: ResetPasswordParams): Promise<ApiResponse<void>>;
  getAddress(params: AddressRequestParams): Promise<ApiResponse<Address>>;
  getAutocompleteAddress(
    params: AddressAutoCompleteRequestParams,
  ): Promise<ApiResponse<AddressAutoCompleteResponse[]>>;
  updateAppSettings(params: AppSettings): Promise<ApiResponse<void>>;
  updateUser(params: UserUpdateParams): Promise<ApiResponse<void>>;
  deleteUser(): Promise<ApiResponse<void>>;
}
// ** ** ** ** ** CREATE ** ** ** ** **
const UserContext = createContext<UserContextInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useUser` hook must be used within a `UserProvider` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function UserProvider({children}: ChildrenProps): JSX.Element {
  const {requestRest} = useClient();
  const {user} = ENDPOINTS;
  const {TOKEN, INVOICE_SESSION_TOKEN, CHARGING_SESSION_TOKEN} = STORAGE;
  //Create User
  const createUser = useCallback(
    async (params: UserCreateParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: user.createUser,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      console.log(
        `${requestParams.method} - ${requestParams.path} - Success:`,
        response.success,
      );
      return response;
    },
    [requestRest, user.createUser],
  );

  const createGuestUser = useCallback(
    async (params: GuestUserCreateParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: user.createGuestUser,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response: ApiResponse<GuestUserCreateResponse> = await requestRest(
        requestParams,
      );
      console.log(
        `${requestParams.method} - ${requestParams.path} - Success:`,
        response.success,
      );
      console.log(response);
      return response;
    },
    [requestRest, user.createGuestUser],
  );

  //Verify user
  const verifyUser = useCallback(
    async (params: VerifyUserParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: user.verifyUser,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      return response;
    },
    [requestRest, user.verifyUser],
  );

  //Resend Verification
  const resendVerification = useCallback(
    async (params: VerificationResendParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: user.verifyResend,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      return response;
    },
    [requestRest, user.verifyResend],
  );

  //Forgot Paasword
  const forgotPassword = useCallback(
    async (params: ForgotPasswordParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: user.forgotPassword,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);

      return response;
    },
    [requestRest, user.forgotPassword],
  );

  //Reset Password
  const resetPassword = useCallback(
    async (params: ResetPasswordParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: user.resetPassword,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      return response;
    },
    [requestRest, user.resetPassword],
  );

  const getAutocompleteAddress = useCallback(
    async (params: AddressAutoCompleteRequestParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.GET,
        path: `${user.addressAutocomplete}/${params.input}`,
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      if (response.data) {
        response.data = response.data.suggestions as [
          AddressAutoCompleteResponse,
        ];
      }
      return response;
    },
    [requestRest, user.addressAutocomplete],
  );

  const getAddress = useCallback(
    async (params: AddressRequestParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.GET,
        path: `${user.getAddress}/${params.id}`,
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      if (response.data) {
        response.data = response.data as Address;
      }
      return response;
    },
    [requestRest, user.getAddress],
  );

  const updateAppSettings = useCallback(
    async (params: AppSettings) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: user.updateAppsettings,
        type: RequestTypes.JSON,
        body: JSON.stringify(params),
      };
      const response = await requestRest(requestParams);
      return response;
    },
    [requestRest, user.updateAppsettings],
  );

  //update user
  const updateUser = useCallback(
    async (params: UserUpdateParams) => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.PUT,
        path: user.updateUser,
        type: RequestTypes.JSON,
        body: JSON.stringify(params),
      };
      const response = await requestRest(requestParams);
      return response;
    },
    [requestRest, user.updateUser],
  );

  //delete user
  const deleteUser = useCallback(async () => {
    const requestParams: RestAPIRequest = {
      method: HTTP_REQUESTS.DELETE,
      path: user.deleteUser,
      type: RequestTypes.JSON,
    };
    const response = await requestRest(requestParams);
    if (response && response.success) {
      //clear the token from storage
      [TOKEN, CHARGING_SESSION_TOKEN, INVOICE_SESSION_TOKEN].map(name =>
        deleteObject(name),
      );
    }
    return response;
  }, [requestRest, user.deleteUser]);
  //Test
  // useEffect(() => {
  //   getAutocompleteAddress({input: "york"})
  //   .then((data) => {
  //     console.log({data})
  //   })
  //   .catch((e)=> console.log({e}))
  // })
  // useEffect(() => {
  //   createGuestUser({username: 'sam+2@mail.com',password:"Test"})
  //     .then(data => {
  //       console.log({data});
  //     })
  //     .catch(e => console.log({e}));
  // });

  const values: UserContextInterface = useMemo(
    () => ({
      createUser,
      createGuestUser,
      verifyUser,
      resendVerification,
      forgotPassword,
      resetPassword,
      getAddress,
      getAutocompleteAddress,
      updateAppSettings,
      updateUser,
      deleteUser,
    }),
    [
      createUser,
      createGuestUser,
      verifyUser,
      resendVerification,
      forgotPassword,
      resetPassword,
      getAddress,
      getAutocompleteAddress,
      updateAppSettings,
      updateUser,
      deleteUser,
    ],
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
