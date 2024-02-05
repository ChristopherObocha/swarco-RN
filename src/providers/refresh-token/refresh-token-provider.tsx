import React, {createContext, useCallback, useEffect, useRef} from 'react';
import {useAuth} from 'providers/apis/auth';
import {useNavigation} from '@react-navigation/native';

import {AppState, AppStateStatus} from 'react-native';
import {ChildrenProps} from '../../generic-types';

import {APP_CONTAINER_SCREENS, ACCOUNT_SCREENS} from '../../types/navigation';
import {getToken} from 'utils/get-token';
import {STORAGE, TOKEN_TYPES} from 'utils/constants';
import {GlobalStorage, getObject, setObject} from 'utils/storage-utils';
import {AppContainerParamList} from '../../types/navigation';
import {StackNavigationProp} from '@react-navigation/stack';

const {IS_BIOMETRICS_ENABLED, MOVED_TO_BACKGROUND} = STORAGE;

interface RefreshTokenContextInterface {
  checkRefreshToken(): Promise<boolean>;
}
export const RefreshTokenContext =
  createContext<RefreshTokenContextInterface | null>(null);

type NavigationProp = StackNavigationProp<AppContainerParamList>;

export function useRefreshToken() {
  const context = React.useContext(RefreshTokenContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useRefreshToken` hook must be used within a `RefreshTokenProvider` component',
    );
  }
  return context;
}

const RefreshTokenProvider = ({children}: ChildrenProps) => {
  const appState = useRef(AppState.currentState);
  const {refreshToken, logout} = useAuth();
  const accessToken = getToken(TOKEN_TYPES.ACCESS_TOKEN);
  const token = getToken(TOKEN_TYPES.REFRESH_TOKEN);

  const navigation = useNavigation<NavigationProp>();
  const checkRefreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await refreshToken();

      if (!response?.success && !response?.data?.access_token) {
        if (token) {
          logout();
        }
        return false;
      }

      return true;
    } catch (e) {
      console.log('refresh token failed');
      if (token) {
        logout();
      }
      return false;
    }
  }, [refreshToken, token, logout]);

  const appStateListener = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (
        appState.current === 'active' &&
        nextAppState?.match(/inactive|background/)
      ) {
        const now = Date.now();
        setObject(MOVED_TO_BACKGROUND, now);
      }

      if (appState.current === 'background' && nextAppState === 'active') {
        //The App goes to inactive mode on iOS when Biometrics is being requested and hence creates unnecessary callbacks
        const isBiometricsEnabled =
          GlobalStorage.getBoolean(IS_BIOMETRICS_ENABLED) ?? false;
        const isLoggedIn = !!accessToken;

        if (!isBiometricsEnabled && isLoggedIn) {
          const tokenChecked = await checkRefreshToken();
          if (!tokenChecked) {
            navigation.navigate(ACCOUNT_SCREENS.SIGN_IN);
          }
        }

        const backgroundTime = await getObject(MOVED_TO_BACKGROUND);

        if (isLoggedIn && isBiometricsEnabled && backgroundTime) {
          const now = Date.now();
          const timeDiff = now - Number(backgroundTime);

          // check biometrics if app has been in background for more than 2 seconds
          if (timeDiff > 2000) {
            navigation.navigate(APP_CONTAINER_SCREENS.HOLDING_SCREEN, {
              openFromBackground: true,
            });
          }
        }
      }

      appState.current = nextAppState;
    },
    [accessToken, checkRefreshToken, navigation],
  );

  useEffect(() => {
    const listener = AppState.addEventListener('change', appStateListener);
    return () => {
      listener.remove();
    };
  }, [appStateListener]);

  return (
    <RefreshTokenContext.Provider value={{checkRefreshToken}}>
      {children}
    </RefreshTokenContext.Provider>
  );
};

export default RefreshTokenProvider;
