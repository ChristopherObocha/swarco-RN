/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Sat, 4th Nov 2023, 1:00:35 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2022 The Distance
 */

import React, {Fragment, useLayoutEffect} from 'react';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';

import {useStyle} from 'providers/style/style-provider';
import {Platform, StatusBar} from 'react-native';

import {
  APP_CONTAINER_SCREENS,
  ACCOUNT_SCREENS,
  CHARGING_SCREENS,
  AppContainerParamList,
  ChargingContainerParamList,
  AccountContainerParamList,
} from '../types/navigation';

import Walkthrough from 'screens/walkthrough/walkthrough';

import {GlobalStorage, getObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';
import BottomTabsContainer from './bottom-tabs-container';
import BiometricsSignInModal from 'components/modals/biometrics-sign-in-modal';
import SessionTimedOut from 'screens/sign-in/session-timed-out';
import {AccountContainer} from './account-container';
import SignIn from 'screens/sign-in/sign-in';
import HoldingScreen from './holding-screen';
import PaymentAuthorised from 'screens/charging/payment-authorised';
import {palette} from 'providers/style/palette';
import {useProfile} from 'providers/apis/profile';
import VerifyAccount from 'screens/sign-in/verify-account';

export const AppStack = createStackNavigator<
  AppContainerParamList & ChargingContainerParamList & AccountContainerParamList
>();

const transitionConfig = {
  ...TransitionPresets.SlideFromRightIOS,
  headerShown: false,
};

export function AppContainer({route}: any) {
  const hasShownWalkthrough =
    GlobalStorage.getString(STORAGE.SHOWN_WALKTHROUGH) === 'true';
  const isBiometricsEnabled =
    GlobalStorage.getBoolean(STORAGE.IS_BIOMETRICS_ENABLED) ?? false;

  const guestToken = getObject(STORAGE.GUEST_TOKEN);
  const {profile} = useProfile();
  const isUserVerified = profile?.emailverified;

  const initialRouteName = !hasShownWalkthrough
    ? APP_CONTAINER_SCREENS.WALKTHROUGH
    : !guestToken && !isUserVerified
    ? ACCOUNT_SCREENS.VERIFY_ACCOUNT
    : APP_CONTAINER_SCREENS.BOTTOM_TABS;

  const {coloursTheme} = useStyle();

  // Reset Status bar style after splash screen is gone to prevent non matching UI in splash screen
  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor(
          route?.params
            ? coloursTheme.backgroundColor
            : hasShownWalkthrough
            ? palette.transparent
            : coloursTheme.backgroundColor,
        );
      }, 250);
    }
  }, [route, hasShownWalkthrough, coloursTheme.backgroundColor]);

  return (
    <Fragment>
      <AppStack.Navigator
        screenOptions={transitionConfig}
        initialRouteName={
          isBiometricsEnabled
            ? APP_CONTAINER_SCREENS.HOLDING_SCREEN
            : initialRouteName
        }>
        {/* Entry point to the app */}
        <AppStack.Screen
          name={APP_CONTAINER_SCREENS.WALKTHROUGH}
          component={Walkthrough}
        />
        <AppStack.Screen
          name={APP_CONTAINER_SCREENS.BOTTOM_TABS}
          component={BottomTabsContainer}
          initialParams={route?.params}
        />
        <AppStack.Screen
          name={APP_CONTAINER_SCREENS.TIMED_OUT}
          component={SessionTimedOut}
        />
        <AppStack.Screen
          name={APP_CONTAINER_SCREENS.ACCOUNT_CONTAINER}
          component={AccountContainer}
        />
        <AppStack.Screen name={ACCOUNT_SCREENS.SIGN_IN} component={SignIn} />
        <AppStack.Screen
          name={CHARGING_SCREENS.PAYMENT_AUTHORISED} //Outside BottomTabsContainer > ChargingContainer as Design doesn't have Bottom Tab
          component={PaymentAuthorised}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.VERIFY_ACCOUNT}
          component={VerifyAccount}
          initialParams={{email: profile?.email || ''}}
        />
        <AppStack.Screen
          name={APP_CONTAINER_SCREENS.HOLDING_SCREEN}
          component={HoldingScreen}
          options={{
            ...TransitionPresets.ScaleFromCenterAndroid,
          }}
          initialParams={{
            initialRouteName: initialRouteName,
            requestChargingSubscriptionParams: route?.params,
          }}
        />
      </AppStack.Navigator>

      <BiometricsSignInModal />
    </Fragment>
  );
}
