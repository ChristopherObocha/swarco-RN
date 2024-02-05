import React, {useLayoutEffect} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {useTabBarStyle} from './bottom-tabs-container';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {SESSION_SCREENS} from '../types/navigation';
import SessionsScreen from 'screens/sessions/sessions-screen';
import SessionDetails from 'screens/sessions/session-details';

const SessionStack = createStackNavigator<any>();

const tabBarShownRoutes = [SESSION_SCREENS.SESSIONS];

export function SessionContainer({navigation, route}: any) {
  const initialRouteName = SESSION_SCREENS.SESSIONS;

  const tabBarStyle = useTabBarStyle();

  useLayoutEffect(() => {
    const routeName =
      (getFocusedRouteNameFromRoute(route) as SESSION_SCREENS) ??
      initialRouteName;

    if (tabBarShownRoutes.includes(routeName)) {
      navigation.setOptions({tabBarStyle: tabBarStyle});
    } else {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    }
  }, [initialRouteName, navigation, route, tabBarStyle]);

  return (
    <SessionStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}>
      <SessionStack.Screen
        name={SESSION_SCREENS.SESSIONS}
        component={SessionsScreen}
      />
      <SessionStack.Screen
        name={SESSION_SCREENS.SESSION_DETAILS}
        component={SessionDetails}
      />
    </SessionStack.Navigator>
  );
}
