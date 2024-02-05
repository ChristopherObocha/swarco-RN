/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 3rd Nov 2023, 14:13:07 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useCallback, useEffect} from 'react';
import {
  ACCOUNT_SCREENS,
  APP_CONTAINER_SCREENS,
  AppContainerParamList,
} from '../types/navigation';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {getToken} from 'utils/get-token';
import {useBiometrics} from 'providers/biometrics/biometrics-provider';
import {useNavigation} from '@react-navigation/native';
import {STORAGE, TOKEN_TYPES} from 'utils/constants';
import SimulatedSplashScreen from './simulated-splash-screen';
import {useAuth} from 'providers/apis/auth';
import {getObject} from 'utils/storage-utils';

interface HoldingScreenProps
  extends StackScreenProps<AppContainerParamList, 'HoldingScreen'> {}
type NavigationProp = StackNavigationProp<AppContainerParamList>;

export default function HoldingScreen({
  route,
}: HoldingScreenProps): JSX.Element {
  const {refreshToken, logout} = useAuth();
  const token = getToken(TOKEN_TYPES.REFRESH_TOKEN);
  const accessToken = getToken(TOKEN_TYPES.ACCESS_TOKEN);
  const {checkBiometrics} = useBiometrics();

  const navigation = useNavigation<NavigationProp>();

  const checkRefreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await refreshToken();

      if (!response?.success && !response?.data?.access_token) {
        if (token && accessToken) {
          logout();
        }
        return false;
      }

      return true;
    } catch (e) {
      console.log('refresh token failed');
      logout();
      return false;
    }
  }, [refreshToken, token, accessToken, logout]);

  const biometricsLogin = useCallback(async (): Promise<void> => {
    const bioAuthenticate = await checkBiometrics();
    const isBiometricsEnabled = getObject(STORAGE.IS_BIOMETRICS_ENABLED);
    const guestToken = getObject(STORAGE.GUEST_TOKEN);

    if (guestToken) {
      navigation.replace(APP_CONTAINER_SCREENS.BOTTOM_TABS);
      return;
    }

    if (!isBiometricsEnabled || bioAuthenticate) {
      const tokenChecked = await checkRefreshToken();
      if (tokenChecked) {
        if (route?.params?.openFromBackground) {
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.replace(ACCOUNT_SCREENS.SIGN_IN);
        } else {
          switch (route?.params?.initialRouteName) {
            case APP_CONTAINER_SCREENS.WALKTHROUGH:
              navigation.replace(APP_CONTAINER_SCREENS.WALKTHROUGH);
              break;
            default:
              navigation.replace(
                APP_CONTAINER_SCREENS.BOTTOM_TABS,
                route?.params?.requestChargingSubscriptionParams,
              );
              break;
          }
        }
      } else {
        navigation.replace(ACCOUNT_SCREENS.SIGN_IN);
      }
    } else {
      const loggedOut = logout();
      if (loggedOut) {
        navigation.replace(ACCOUNT_SCREENS.SIGN_IN);
      }
    }
  }, [
    checkBiometrics,
    checkRefreshToken,
    logout,
    navigation,
    route?.params?.initialRouteName,
    route?.params?.openFromBackground,
    route?.params?.requestChargingSubscriptionParams,
  ]);

  // ** ** ** ** ** EFFECTS ** ** ** ** **
  useEffect(() => {
    biometricsLogin();
  }, [route]);

  // ** ** ** ** ** RENDER ** ** ** ** **
  return <SimulatedSplashScreen />;
}
