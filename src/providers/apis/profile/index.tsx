import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {ChildrenProps} from '../../../generic-types';
import {useClient} from 'providers/client/client-provider';
import {
  ApiResponse,
  ApolloAPIRequest,
} from 'providers/client/client-provider-types';
import {GRAPHQL_REQUESTS, STORAGE} from 'utils/constants';
import {gql} from '@apollo/client';
import {AppSettings, UserProfile} from 'providers/types/user';
import {useAuth} from '../auth';
import {usePrevious} from 'utils/usePrevious';

interface ProfileContextInterface {
  getProfile(): Promise<ApiResponse<UserProfile[]>>;
  profile?: UserProfile;
  getAppSettings(): Promise<ApiResponse<AppSettings>>;
}
// ** ** ** ** ** CREATE ** ** ** ** **
const ProfileContext = createContext<ProfileContextInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useProfile` hook must be used within a `ProfileProvider` component',
    );
  }
  return context;
}

const mapToProfile = (
  data: ApiResponse<UserProfile[]>,
): UserProfile | undefined => {
  const profileData = data?.data?.[0];
  if (!profileData) {
    return;
  }
  return {
    ...profileData,
    cardtag: profileData?.flintstoneuser_rfids?.[0]?.uid,
  };
};
// ** ** ** ** ** PROVIDE ** ** ** ** **
export function ProfileProvider({children}: ChildrenProps): JSX.Element {
  const {requestQuery} = useClient();
  const [profile, setProfile] = useState<UserProfile | undefined>();
  const {tokenResponse} = useAuth();
  const prevTokenResponse = usePrevious(tokenResponse);

  useEffect(() => {
    if (!tokenResponse && prevTokenResponse) {
      setProfile(undefined);
    }
  }, [tokenResponse, prevTokenResponse]);

  //Get user profile
  const getProfile = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query Flintstoneuser {
          flintstoneuser {
            email
            firstname
            lastname
            phonenumber
            dateofbirth
            emailverified
            address1
            address2
            town
            postcode
            paymentprovider
            marketingemail
            marketingtext
            flintstoneuser_rfids {
              uid
            }
          }
        }
      `,
      variables: {},
      fetchPolicy: 'network-only',
      key: 'flintstoneuser',
    };

    const response = await requestQuery<UserProfile[]>(queryParams);

    if (response?.success && response?.data) {
      const profileData = mapToProfile(response);
      setProfile(profileData);
    }

    return response;
  }, [requestQuery]);

  //Get Appsettings
  const getAppSettings = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query Appsettings {
          appsettings {
            advertNotifications
            analytics
            chargingNotifications
            errorReports
            location
            locationNotifications
            paymentNotifications
            tariffNotifications
          }
        }
      `,
      variables: {},
      fetchPolicy: 'network-only',
      key: 'appsettings',
    };
    const response = await requestQuery<any>(queryParams);
    if (response?.success && response?.data.length) {
      response.data = response.data[0] as AppSettings;
    }
    return response;
  }, [requestQuery]);

  const values: ProfileContextInterface = useMemo(
    () => ({
      getProfile,
      profile,
      getAppSettings,
    }),
    [getProfile, profile, getAppSettings],
  );

  return (
    <ProfileContext.Provider value={values}>{children}</ProfileContext.Provider>
  );
}
