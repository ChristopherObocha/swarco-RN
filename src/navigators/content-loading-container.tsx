import React, {useEffect, useState} from 'react';

import {useProfile} from 'providers/apis/profile';
import {useRefreshToken} from 'providers/refresh-token/refresh-token-provider';
import {useRestAPIClient} from 'providers/client/rest-api-client/rest-api-provider';
import {usePrevious} from 'utils/usePrevious';
import {useUser} from 'providers/apis/user';
import {useAuth} from 'providers/apis/auth';

import {AppContainer} from 'navigators/app-container';
import {STORAGE, TOKEN_TYPES} from 'utils/constants';
import {getToken} from 'utils/get-token';
import {deleteObject, getObject, setObject} from 'utils/storage-utils';
import SimulatedSplashScreen from './simulated-splash-screen';
import {generateGuestUsername, generatePassword} from 'utils/general-utils';
import {useCharging} from 'providers/apis/charging';
import {RequestChargingSubscriptionParams} from 'providers/types/charging';

export default function ContentLoadingContainer(): React.JSX.Element {
  const [contentLoaded, setContentLoaded] = useState(false);
  const token = getToken(TOKEN_TYPES.ACCESS_TOKEN);
  const {getProfile} = useProfile();
  const {login} = useAuth();

  const {createGuestUser} = useUser();

  const {restAPIClient} = useRestAPIClient();
  const prevApiClient = usePrevious(restAPIClient);
  const {checkRefreshToken} = useRefreshToken();
  const {checkActiveSession} = useCharging();
  const [
    requestChargingSubscriptionParams,
    setRequestChargingSubscriptionParams,
  ] = useState<RequestChargingSubscriptionParams | undefined>();

  useEffect(() => {
    async function loadUserContent() {
      await getProfile();
    }

    async function handleGuestLogin(
      guestUsername: string,
      guestPassword: string,
    ) {
      const {success, data, error} = await createGuestUser({
        username: guestUsername,
        password: guestPassword,
      });

      if (success) {
        guestUsername = data?.generated_username as string;

        if (guestUsername) {
          setObject(STORAGE.GUEST_USERNAME, guestUsername);
        }
      }

      if (error) {
        deleteObject(STORAGE.GUEST_PASSWORD);
      }

      if (guestUsername && guestPassword) {
        const isGuest = true;
        await login(
          {
            username: guestUsername,
            password: guestPassword,
          },
          isGuest,
        );
      }

      await getProfile();
    }

    async function loadGuestContent() {
      let guestUsername: string | undefined = getObject(STORAGE.GUEST_USERNAME);
      let guestPassword: string | undefined = getObject(STORAGE.GUEST_PASSWORD);

      if (!guestUsername) {
        guestUsername = generateGuestUsername();
      }

      if (!guestPassword) {
        guestPassword = generatePassword();
        setObject(STORAGE.GUEST_PASSWORD, guestPassword);
      }

      await handleGuestLogin(guestUsername, guestPassword);
    }
    async function checkActiveCharge() {
      await checkActiveSession()
        .then(response => {
          if (response.success && response?.data?.charging_point_id) {
            const params = {
              chargepoint_id: response.data?.charging_point_id,
              emp_session_id: response.data?.emp_session_id,
            };
            setRequestChargingSubscriptionParams(params);
          } else {
            setRequestChargingSubscriptionParams(undefined);
          }
        })
        .catch(() => {
          setRequestChargingSubscriptionParams(undefined);
        });
    }

    async function loadAppContent() {
      try {
        if (prevApiClient === null && restAPIClient) {
          await checkRefreshToken();
        }

        if (token) {
          await loadUserContent();
        } else {
          await loadGuestContent();
        }

        await checkActiveCharge();
      } catch (e) {
        console.warn(e);
      } finally {
        setContentLoaded(true);
      }
    }

    loadAppContent();
  }, [restAPIClient]);

  if (contentLoaded) {
    return <AppContainer route={{params: requestChargingSubscriptionParams}} />;
  } else {
    return <SimulatedSplashScreen />;
  }
}
