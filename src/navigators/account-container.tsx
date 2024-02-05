import React, {useLayoutEffect} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {ACCOUNT_SCREENS, AccountContainerParamList} from '../types/navigation';

import {useProfile} from 'providers/apis/profile';
import {useTabBarStyle} from './bottom-tabs-container';
import {useLoading} from 'providers/loading/loading-provider';

import AddHomeAddress from 'screens/sign-in/add-home-address';
import CreateAccount from 'screens/sign-in/create-account';
import ForgotPassword from 'screens/sign-in/forgot-password';
import ResetPassword from 'screens/sign-in/reset-password';
import SearchAddress from 'screens/sign-in/search-address';
import SignIn from 'screens/sign-in/sign-in';
import VerifyAccount from 'screens/sign-in/verify-account';
import AppSettings from 'screens/account/app-settings';
import MarketingSettings from 'screens/account/marketing-settings';
import SupportCenterScreen from 'screens/account/support-centre';
import VehicleDetailsScreen from 'screens/account/vehicle-details-screen';
import PersonalDetails from 'screens/account/personal-details';
import AccountScreen from 'screens/account/account';
import ChangePassword from 'screens/account/change-password';
import MapInfoScreen from 'screens/map/map-info';
import ChargingGuide from 'screens/account/charging-guide';
import AccountCreatedScreen from 'screens/sign-in/account-created';

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {LoadingView} from 'components/utils/loading-view';
import {PLATFORMS} from 'utils/constants';
import {Platform, StatusBar} from 'react-native';
import AdditionalOnboardingScreen from 'screens/sign-in/additional-onboarding';
import {palette} from 'providers/style/palette';
import FAQCategories from 'screens/account/faq-categories';
import FAQSelectedCategory from 'screens/account/faq-selected-category';

const tabBarShownRoutes = [
  ACCOUNT_SCREENS.ACCOUNT,
  ACCOUNT_SCREENS.PERSONAL_DETAILS,
  ACCOUNT_SCREENS.SUPPORT_CENTER,
  ACCOUNT_SCREENS.VEHICLE_DETAILS,
  ACCOUNT_SCREENS.FAQS,
  ACCOUNT_SCREENS.FAQ_SELECTED_CATEGORY,
  ACCOUNT_SCREENS.CHARGING_GUIDE,
];

export const AppStack = createStackNavigator<AccountContainerParamList>();

export function AccountContainer({navigation, route}: any) {
  const {profile} = useProfile();
  const initialRouteName = ACCOUNT_SCREENS.ACCOUNT;

  const tabBarStyle = useTabBarStyle();
  const {loading} = useLoading();

  useLayoutEffect(() => {
    const routeName =
      (getFocusedRouteNameFromRoute(route) as ACCOUNT_SCREENS) ??
      initialRouteName;

    if (tabBarShownRoutes.includes(routeName)) {
      navigation.setOptions({tabBarStyle: tabBarStyle});
    } else {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    }

    setTimeout(() => {
      if (Platform.OS === PLATFORMS.ANDROID) {
        StatusBar.setBackgroundColor(palette.transparent);
      }
    }, 750);
  }, [initialRouteName, navigation, route, tabBarStyle]);

  return (
    <>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialRouteName}>
        <AppStack.Screen
          name={ACCOUNT_SCREENS.ACCOUNT}
          component={AccountScreen}
        />
        <AppStack.Screen name={ACCOUNT_SCREENS.SIGN_IN} component={SignIn} />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.CREATE_ACCOUNT}
          component={CreateAccount}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.ADD_HOME_ADDRESS}
          component={AddHomeAddress}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.ADDITIONAL_ONBOARDING}
          component={AdditionalOnboardingScreen}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.SEARCH_ADDRESS}
          component={SearchAddress}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.FORGOT_PASSWORD}
          component={ForgotPassword}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.RESET_PASSWORD}
          component={ResetPassword}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.VERIFY_ACCOUNT}
          component={VerifyAccount}
          initialParams={{email: profile?.email || ''}}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.APP_SETTINGS}
          component={AppSettings}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.MARKETING_SETTINGS}
          component={MarketingSettings}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.PERSONAL_DETAILS}
          component={PersonalDetails}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.CHANGE_PASSWORD}
          component={ChangePassword}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.VEHICLE_DETAILS}
          component={VehicleDetailsScreen}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.MAP_INFO}
          component={MapInfoScreen}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.SUPPORT_CENTER}
          component={SupportCenterScreen}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.ACCOUNT_CREATED}
          component={AccountCreatedScreen}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.FAQS}
          component={FAQCategories}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.FAQ_SELECTED_CATEGORY}
          component={FAQSelectedCategory}
        />
        <AppStack.Screen
          name={ACCOUNT_SCREENS.CHARGING_GUIDE}
          component={ChargingGuide}
        />
      </AppStack.Navigator>

      {loading && LoadingView()}
    </>
  );
}
