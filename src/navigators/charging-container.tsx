/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 17th Oct 2023, 06:34:33 am
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {useStyle} from 'providers/style/style-provider';
import {Platform, StatusBar} from 'react-native';

import {
  ChargingContainerParamList,
  CHARGING_SCREENS,
} from '../types/navigation';

import CurrentlyCharging from 'screens/charging/currently-charging';
import InitiateCharging from 'screens/charging/initiate-charging';
import ConnectEV from 'screens/charging/connect-ev';
import SocketsScreen from 'screens/charging/sockets-screen';
import MapSearch from 'screens/map/map-search';
import {LoadingView} from 'components/utils/loading-view';
import {useLoading} from 'providers/loading/loading-provider';
import {PLATFORMS} from 'utils/constants';
import {palette} from 'providers/style/palette';

export const AppStack = createStackNavigator<ChargingContainerParamList>();
export function ChargingContainer({route}: any) {
  const initialRouteName = route?.params
    ? CHARGING_SCREENS.CURRENTLY_CHARGING
    : CHARGING_SCREENS.INITIATE_CHARGING;
  const {loading} = useLoading();
  const {coloursTheme} = useStyle();

  useEffect(() => {
    setTimeout(() => {
      StatusBar.setBarStyle('dark-content');
    }, 0);

    setTimeout(() => {
      if (Platform.OS === PLATFORMS.ANDROID) {
        StatusBar.setBackgroundColor(palette.transparent);
      }
    }, 750);
  }, [coloursTheme.backgroundColor]);

  return (
    <>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialRouteName}>
        <AppStack.Screen
          name={CHARGING_SCREENS.INITIATE_CHARGING}
          component={InitiateCharging}
        />
        <AppStack.Screen
          name={CHARGING_SCREENS.CURRENTLY_CHARGING}
          component={CurrentlyCharging}
          initialParams={route?.params}
        />
        <AppStack.Screen
          name={CHARGING_SCREENS.CONNECT_EV}
          component={ConnectEV}
        />
        <AppStack.Screen
          name={CHARGING_SCREENS.SOCKETS}
          component={SocketsScreen}
        />
        <AppStack.Screen
          name={CHARGING_SCREENS.MAP_SEARCH}
          component={MapSearch}
        />
      </AppStack.Navigator>

      {loading && LoadingView()}
    </>
  );
}
