import React, {useRef} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import {ChildrenProps} from '../../generic-types';
import {ACCOUNT_SCREENS} from '../../types/navigation';

const linking = {
  prefixes: [' https://link.scdevsolutions.uk', 'swarco://'], //Deep Link is not currently used. It's a backup in case Universal Link fails
  config: {
    screens: {
      [ACCOUNT_SCREENS.BUSINESS_LANDING]: {
        path: 'register',
        parse: {
          email: (email: string) => `${email}`,
        },
      },
      // Site: {
      //   path: 'site',
      // },
    },
  },
};

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function NavigationProvider({children}: ChildrenProps): JSX.Element {
  const navigationRef = useNavigationContainerRef<any>();
  const routeNameRef = useRef<string | undefined>();

  const onReady = () => {
    if (navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      if (currentRoute) {
        routeNameRef.current = currentRoute.name;
      }
    }
  };

  const onStateChange = async () => {
    if (navigationRef.current) {
      const previousRouteName = routeNameRef.current;
      const currentRoute = navigationRef.current.getCurrentRoute();
      if (currentRoute) {
        const currentRouteName = currentRoute.name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }
    }
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}
      linking={linking}>
      {children}
    </NavigationContainer>
  );
}
