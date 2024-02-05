import {StackNavigationProp} from '@react-navigation/stack';
import {RequestChargingSubscriptionParams} from 'providers/types/charging';
import {Address} from 'providers/types/user';
import {CreateAccountForm} from 'screens/sign-in/create-account';

export enum APP_CONTAINER_SCREENS {
  WALKTHROUGH = 'Walkthrough',
  BOTTOM_TABS = 'BottomTabs',
  TIMED_OUT = 'TimedOut',
  ACCOUNT_CONTAINER = 'AccountContainer',
  SIGN_IN = 'SignIn',
  HOLDING_SCREEN = 'HoldingScreen',
}

// Defined stack param list
export type AppContainerParamList = {
  Walkthrough: undefined;
  BottomTabs: RequestChargingSubscriptionParams | undefined;
  TimedOut: undefined;
  AccountContainer: undefined;
  SignIn:
    | {
        email: string;
      }
    | undefined;
  HoldingScreen: {
    initialRouteName?: string;
    email?: string;
    openFromBackground?: boolean;
    requestChargingSubscriptionParams?: RequestChargingSubscriptionParams;
  };
};

export enum BOTTOM_TABS {
  MAP_CONTAINER = 'MapContainer',
  CHARGING_CONTAINER = 'ChargingContainer',
  SESSION_CONTAINER = 'SessionContainer',
  ACCOUNT_CONTAINER = 'AccountContainer',
}

export type BottomTabsParamList = {
  MapContainer: undefined;
  ChargingContainer: undefined;
  SessionContainer: undefined;
  AccountContainer: undefined;
};

export enum MAP_SCREENS {
  MAP = 'Map',
  MAP_SEARCH = 'MapSearch',
  FAQS = 'FAQs',
  FAQ_SELECTED_CATEGORY = 'FAQSelectedCategory',
}

export type MapContainerParamList = {
  [MAP_SCREENS.MAP]: {
    position?: {
      latitude?: string | number;
      longitude?: string | number;
    };
  };
  [MAP_SCREENS.MAP_SEARCH]: {
    value?: string;
  };
  [MAP_SCREENS.FAQS]: undefined;
  [MAP_SCREENS.FAQ_SELECTED_CATEGORY]: {title: string};
};

export type MapContainerNavigationProp =
  StackNavigationProp<MapContainerParamList>;

export enum ACCOUNT_SCREENS {
  ACCOUNT = 'Account',
  SIGN_IN = 'SignIn',
  CREATE_ACCOUNT = 'CreateAccount',
  ADD_HOME_ADDRESS = 'AddHomeAddress',
  ADDITIONAL_ONBOARDING = 'AdditionalOnboarding',
  SEARCH_ADDRESS = 'SearchAddress',
  FORGOT_PASSWORD = 'ForgotPassword',
  RESET_PASSWORD = 'ResetPassword',
  VERIFY_ACCOUNT = 'VerifyAccount',
  BUSINESS_LANDING = 'BusinessLanding',
  APP_SETTINGS = 'AppSettings',
  PERSONAL_DETAILS = 'PersonalDetails',
  CHANGE_PASSWORD = 'ChangePassword',
  MAP_INFO = 'MapInfo',
  MARKETING_SETTINGS = 'MarketingSettings',
  SUPPORT_CENTER = 'SupportCenter',
  VEHICLE_DETAILS = 'VehicleDetails',
  CHARGING_GUIDE = 'ChargingGuide',
  FAQS = 'FAQs',
  FAQ_SELECTED_CATEGORY = 'FAQSelectedCategory',
  ACCOUNT_CREATED = 'AccountCreated',
}

export type AccountContainerParamList = {
  [ACCOUNT_SCREENS.ACCOUNT]: undefined;
  [ACCOUNT_SCREENS.SIGN_IN]:
    | {
        email: string;
        redirect?: BOTTOM_TABS.SESSION_CONTAINER;
      }
    | undefined;
  CreateAccount:
    | {
        email?: string;
        redirect?: BOTTOM_TABS.SESSION_CONTAINER;
      }
    | undefined;
  [ACCOUNT_SCREENS.ADD_HOME_ADDRESS]: {
    formState: CreateAccountForm;
    userAddress?: Address;
    isBusinessUser?: boolean;
    isUpdate?: Boolean;
    redirect?: BOTTOM_TABS.SESSION_CONTAINER;
  };
  [ACCOUNT_SCREENS.ADDITIONAL_ONBOARDING]?: {
    redirect?: BOTTOM_TABS.SESSION_CONTAINER;
  };
  [ACCOUNT_SCREENS.SEARCH_ADDRESS]: {
    formState: CreateAccountForm;
    isUpdate?: Boolean;
    redirect?: BOTTOM_TABS.SESSION_CONTAINER;
  };
  [ACCOUNT_SCREENS.FORGOT_PASSWORD]: {
    email: string;
  };
  [ACCOUNT_SCREENS.RESET_PASSWORD]: {
    email: string;
  };
  [ACCOUNT_SCREENS.VERIFY_ACCOUNT]: {
    email: string;
    redirect?: BOTTOM_TABS.SESSION_CONTAINER;
  };
  [ACCOUNT_SCREENS.BUSINESS_LANDING]: {
    email: string;
  };
  [ACCOUNT_SCREENS.APP_SETTINGS]: undefined;
  [APP_CONTAINER_SCREENS.BOTTOM_TABS]: undefined;
  [ACCOUNT_SCREENS.PERSONAL_DETAILS]: undefined;
  [ACCOUNT_SCREENS.CHANGE_PASSWORD]: undefined;
  [ACCOUNT_SCREENS.MAP_INFO]: undefined;
  [ACCOUNT_SCREENS.MARKETING_SETTINGS]: undefined;
  [ACCOUNT_SCREENS.SUPPORT_CENTER]: undefined;
  [ACCOUNT_SCREENS.VEHICLE_DETAILS]: undefined;
  [ACCOUNT_SCREENS.CHARGING_GUIDE]: undefined;
  [ACCOUNT_SCREENS.VEHICLE_DETAILS]: undefined;
  [ACCOUNT_SCREENS.FAQS]: undefined;
  [ACCOUNT_SCREENS.FAQ_SELECTED_CATEGORY]: {title: string};
  [ACCOUNT_SCREENS.ACCOUNT_CREATED]?: {
    redirect?: BOTTOM_TABS.SESSION_CONTAINER;
  };
};

export type AccountContainerNavigationProp =
  StackNavigationProp<AccountContainerParamList>;

export enum CHARGING_SCREENS {
  CHARGING_SCREEN = 'ChargingScreen',
  CHARGING_SESSION = 'ChargingSession',
  CURRENTLY_CHARGING = 'CurrentlyCharging',
  INITIATE_CHARGING = 'InitiateCharging',
  CONNECT_EV = 'ConnectEV',
  SOCKETS = 'Sockets',
  MAP_SEARCH = 'MapSearch',
  PAYMENT_AUTHORISED = 'PaymentAuthorised',
}

export type ChargingContainerParamList = {
  ChargingScreen: undefined;
  ChargingSession: undefined;
  CurrentlyCharging: undefined;
  InitiateCharging: undefined;
  ConnectEV: undefined;
  Sockets: undefined;
  MapSearch: undefined;
  [CHARGING_SCREENS.PAYMENT_AUTHORISED]: undefined;
};

// Defined navigation prop to be used in useNavigation hook
export type AppContainerNavigationProp =
  StackNavigationProp<AppContainerParamList>;

export type ChargingContainerContainerNavigationProp =
  StackNavigationProp<ChargingContainerParamList>;

export enum SESSION_SCREENS {
  SESSIONS = 'Sessions',
  SESSION_DETAILS = 'SessionDetails',
}
