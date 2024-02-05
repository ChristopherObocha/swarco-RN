import {format, subYears} from 'date-fns';
import {
  CHARGE_CONNECTOR_STATE_DESCRIPTION,
  CHARGE_CONNECTOR_STATE_TYPE,
  CHARGE_POINT_STATE_TYPE,
} from 'providers/types/site';

// For Storage getters/setters.
const STORAGE = {
  ANALYTICS: '@analytics_allowed',
  COLOUR_MODE: '@colorMode',
  CRASHLYTICS: '@crashlytics_allowed',
  LANGUAGE: '@language',
  TOKEN: '@token',
  CHARGING_SESSION_TOKEN: '@charging_session_token',
  INVOICE_SESSION_TOKEN: '@invoice_session_token',
  SHOWN_WALKTHROUGH: '@shown_walkthrough',
  IS_BIOMETRICS_ENABLED: '@is_biometrics_enabled',
  SHOWN_BIOMETRICS: '@shown_biometrics',
  MOVED_TO_BACKGROUND: '@moved_to_background',
  UPDATE_LOCATION_SETTINGS_ALERT_SHOWN: '@update_location_settings_alert_shown',
  GUEST_TOKEN: '@guest_token',
  GUEST_USERNAME: '@guest_username',
  GUEST_PASSWORD: '@guest_password',
  IS_BUSINESS_USER: '@is_business_user',
  LOCATION: '@location_allowed',
};

const THEME_MODES = {
  DARK: 'dark',
  DARK_CONTENT: 'dark-content',
  LIGHT: 'light',
  LIGHT_CONTENT: 'light-content',
};

const PLATFORMS = {
  ANDROID: 'android',
  IOS: 'ios',
};

const enum HTTP_REQUESTS {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

const enum GRAPHQL_REQUESTS {
  QUERY = 'QUERY',
  MUTATION = 'MUTATION',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

const enum TOKEN_TYPES {
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}

export const enum SESSION_TYPES {
  INVOICE = 'INVOICE',
  CHARGING = 'CHARGING',
}

const enum GRANT_TYPES {
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
}

const APP_RESTRICTIONS = {
  JAIL_BROKEN: 'JAIL_BROKEN',
  SUSPICIOUS_APP: 'SUSPICIOUS_APP',
  IS_EMULATOR: 'IS_EMULATOR',
};

const IPHONE_X = {
  height: 812,
  width: 375,
};

const DIRECTIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

const LOGIN_CONSTS = {
  CLIENT_ID: 'app',
};

const enum AUTH_SCOPE {
  DRIVER = 'driver',
}

const enum CHARGING_ACTIONS {
  START = 'START',
  STOP = 'STOP',
}
const enum TRANSACTION_TYPE {
  NEW = 'NEW',
}

const enum SITE_FILTERS {
  CONNECTOR_TYPE = 'Connector Types',
  SITE_FACILITIES = 'Facilities',
  SITE_LOCATIONS = 'Locations',
  SITE_PAYMENT_METHODS = 'Payment Methods',
  NETWORK_FILTER = 'Networks',
  ACCESS_TYPES_FILTER = 'Access Types Filters',
  OTHERS = 'Others',
  CHARGER_SPEED = 'Charger Speed',
}

export const enum PAYMENT_METHODS {
  WEBPAY = 'WEBPAY',
  RFID_CARD = 'RFID card',
  CARD_PAYMENT = 'Card payment',
  APP_PAYMENT = 'App payment',
  PLUG_AND_CHARGE = 'Plug and charge',
  FREE_OF_CHARGE = 'Free of charge',
}

const enum CONNECTOR_TYPES {
  TYPE2_MENNEKES = 'TYPE 2 MENNEKES',
  CHADEMO = 'CHAdeMO',
  CCS_COMBO_TYPE2 = 'CCS COMBO TYPE 2',
  OTHERS = 'Others',
}

export const CONNECTOR_TYPE_OPTIONS = [
  {
    label: CONNECTOR_TYPES.TYPE2_MENNEKES,
    value: CONNECTOR_TYPES.TYPE2_MENNEKES,
  },
  {
    label: CONNECTOR_TYPES.CHADEMO,
    value: CONNECTOR_TYPES.CHADEMO,
  },
  {
    label: CONNECTOR_TYPES.CCS_COMBO_TYPE2,
    value: CONNECTOR_TYPES.CCS_COMBO_TYPE2,
  },
  {
    label: CONNECTOR_TYPES.OTHERS,
    value: CONNECTOR_TYPES.OTHERS,
  },
];

export const enum NETWORKS {
  SWARCO = 'Swarco E.Connect',
  CPS = 'Chargeplacescotland',
  POGO = 'PoGo Charge',
  EVCM = 'EVChargeMe',
  SSE = 'SSE',
  OTHERS = 'Others',
}

export enum NETWORK_IDS {
  SWARCO = 'account_swarcoeconnect_org',
  CPS = 'account_chargeplacescotland_org',
  POGO = 'account_pogocharge_com',
  EVCM = 'account_evcharge_me_uk',
  SSE = 'account_sse_co_uk',
  OTHERS = 'others',
}

export const NETWORK_VALUES: {
  [key in NETWORK_IDS]: string;
} = {
  [NETWORK_IDS.SWARCO]: 'Swarco E.Connect',
  [NETWORK_IDS.CPS]: 'Chargeplacescotland',
  [NETWORK_IDS.POGO]: 'PoGo Charge',
  [NETWORK_IDS.EVCM]: 'EVChargeMe',
  [NETWORK_IDS.SSE]: 'SSE',
  [NETWORK_IDS.OTHERS]: 'Others',
};

export const enum FACILITIES {
  ATM = 'ATM',
  CARWASH = 'Carwash',
  PLAY_AREA = 'Play Area',
  PUBLIC_TOILET = 'Public Toilet',
  RESTAURANT = 'Restaurant',
  SHOPPING_CENTER = 'Shopping Centre',
  SUPERMARKET = 'Supermarket',
  ACCOMODATION = 'Accomodation',
}

export const enum CONNECTOR_STATE {
  AVAILABLE = 'AVAILABLE',
  FAULTED = 'FAULTED',
  OCCUPIED = 'OCCUPIED',
  OTHERS = 'OTHERS',
}

export const enum ACCESS_TYPES {
  HRS_24 = '24 Hours Access',
  RESTRICTED_ACCESS = 'Restricted Access',
  ACCESSIBILITY_STANDARDS = 'Accessibility Standards',
}

export const CHARGE_POINT_STATE: CHARGE_POINT_STATE_TYPE = [
  {
    chargepoint_state_description: 'UKN',
    chargepoint_state_id: 0,
  },
  {
    chargepoint_state_description: 'OK_FREE',
    chargepoint_state_id: 1,
  },
  {
    chargepoint_state_description: 'OK_PART',
    chargepoint_state_id: 2,
  },
  {
    chargepoint_state_description: 'OK_ALL',
    chargepoint_state_id: 3,
  },
  {
    chargepoint_state_description: 'ERR_FREE',
    chargepoint_state_id: 7,
  },
  {
    chargepoint_state_description: 'ERR_PART',
    chargepoint_state_id: 8,
  },
  {
    chargepoint_state_description: 'ERR_ALL',
    chargepoint_state_id: 9,
  },
  {
    chargepoint_state_description: 'ERR_UEB',
    chargepoint_state_id: 10,
  },
];

export const CHARGE_CONNECTOR_STATE: CHARGE_CONNECTOR_STATE_TYPE = [
  {
    connector_state_id: 0,
    connector_state_description: 'UNKNOWN',
  },
  {
    connector_state_id: 1,
    connector_state_description: 'AVAILABLE',
  },
  {
    connector_state_id: 2,
    connector_state_description: 'OCCUPIED',
  },
  {
    connector_state_id: 3,
    connector_state_description: 'FAULTED',
  },
  {
    connector_state_id: 5,
    connector_state_description: 'UNAVAILABLE',
  },
  {
    connector_state_id: 6,
    connector_state_description: 'CHARGING',
  },
  {
    connector_state_id: 7,
    connector_state_description: 'PREPARING',
  },
  {
    connector_state_id: 9,
    connector_state_description: 'SUSP_EV',
  },
  {
    connector_state_id: 10,
    connector_state_description: 'FINISHING',
  },
];

/**
 * description -
 *  name corressponds to what is displayed in the UI
 *  value corresponds to what is returned from the api
 */
const PAYMENT_METHODS_MAP = [
  {
    name: PAYMENT_METHODS.WEBPAY,
    value: 'WebPay',
    icon: 'browser',
  },
  {
    name: PAYMENT_METHODS.CARD_PAYMENT,
    value: 'Card Payment',
    icon: 'credit-card',
  },
  {
    name: PAYMENT_METHODS.RFID_CARD,
    value: 'RFID Card',
    icon: 'credit-card-front',
  },
  {
    name: PAYMENT_METHODS.APP_PAYMENT,
    value: 'App Payment',
    icon: 'mobile',
  },
  {
    name: PAYMENT_METHODS.PLUG_AND_CHARGE,
    value: 'Plug and Charge',
    icon: 'plug',
  },
  {
    name: PAYMENT_METHODS.FREE_OF_CHARGE,
    value: 'Free',
    icon: 'gift',
  },
];
/**
 * description -
 *  name corressponds to what is displayed in the UI
 *  value corresponds to what is returned from the api
 */
const CONNECTOR_TYPE_MAP = [
  {
    name: CONNECTOR_TYPES.TYPE2_MENNEKES,
    value: 'type_2',
    icon: require('assets/svg/connector-types/type2-mennekes-light-blue.svg')
      .default,
    altIcon: require('assets/svg/connector-types/type2-mennekes-dark-blue.svg')
      .default,
  },
  {
    name: CONNECTOR_TYPES.CHADEMO,
    value: 'chademo',
    icon: require('assets/svg/connector-types/chademo-light-blue.svg').default,
    altIcon: require('assets/svg/connector-types/chademo-dark-blue.svg')
      .default,
  },
  {
    name: CONNECTOR_TYPES.CCS_COMBO_TYPE2,
    value: 'ccs',
    icon: require('assets/svg/connector-types/type2-ccs-light-blue.svg')
      .default,
    altIcon: require('assets/svg/connector-types/type2-ccs-dark-blue.svg')
      .default,
  },
  {
    name: CONNECTOR_TYPES.OTHERS,
    value: 'Other',
    icon: require('assets/svg/connector-types/other-connectors.svg').default,
    altIcon: require('assets/svg/connector-types/other-connectors.svg').default,
  },
];

type CHARGE_CONNECTOR_STATE_DESCRIPTION_TYPES =
  | {
      name: 'Available';
      color: 'green';
    }
  | {
      name: 'InUse';
      color: 'lightBlue';
    }
  | {
      name: 'Unavailable';
      color: 'red';
    }
  | {
      name: 'Unknown';
      color: 'red';
    }
  | {
      name: 'Reserved';
      color: 'darkBlue';
    };

const CHARGE_CONNECTOR_STATES: {
  [key in CHARGE_CONNECTOR_STATE_DESCRIPTION]: CHARGE_CONNECTOR_STATE_DESCRIPTION_TYPES;
} = {
  AVAILABLE: {
    name: 'Available',
    color: 'green',
  },
  OCCUPIED: {
    name: 'InUse',
    color: 'lightBlue',
  },
  RESERVED: {
    name: 'Reserved',
    color: 'darkBlue',
  },
  FAULTED: {
    name: 'Unavailable',
    color: 'red',
  },
  UNAVAILABLE: {
    name: 'Unavailable',
    color: 'red',
  },
  CHARGING: {
    name: 'InUse',
    color: 'lightBlue',
  },
  PREPARING: {
    name: 'InUse',
    color: 'lightBlue',
  },
  SUSP_EV: {
    name: 'Unknown',
    color: 'red',
  },
  SUSP_EVSE: {
    name: 'Unknown',
    color: 'red',
  },
  FINISHING: {
    name: 'InUse',
    color: 'lightBlue',
  },
  UNKNOWN: {
    name: 'Unknown',
    color: 'red',
  },
};

/**
 * description -
 *  name corressponds to what is displayed in the UI
 *  value corresponds to what is returned from the api
 */

const NETWORKS_MAP = [
  {
    name: NETWORKS.SWARCO,
    value: 'account_swarcoeconnect_org',
    icon: 'charging-station',
  },
  {
    name: NETWORKS.CPS,
    value: 'account_chargeplacescotland_org',
    icon: 'charging-station',
  },
  {
    name: NETWORKS.POGO,
    value: 'account_pogocharge_com',
    icon: 'charging-station',
  },
  {
    name: NETWORKS.EVCM,
    value: 'account_evcharge_me_uk',
    icon: 'charging-station',
  },
  {
    name: NETWORKS.SSE,
    value: 'account_sse_co_uk',
    icon: 'charging-station',
  },
  {
    name: SITE_FILTERS.OTHERS,
    value: 'others',
    icon: 'ellipsis-h',
  },
];

const NETWORK_LOGOS = {
  [NETWORK_IDS.SWARCO]: require('assets/images/logos/swarco-logo-white.png'),
  [NETWORK_IDS.CPS]: require('assets/images/logos/cps-logo.png'),
  [NETWORK_IDS.POGO]: require('assets/images/logos/pogo-logo.png'),
  [NETWORK_IDS.EVCM]: require('assets/images/logos/rontech-logo.png'),
  [NETWORK_IDS.SSE]: require('assets/images/logos/sse-logo.png'),
  [NETWORK_IDS.OTHERS]: require('assets/images/logos/others-icon.png'),
};

/**
 * description -
 *  name corressponds to what is displayed in the UI
 *  value corresponds to what is returned from the api
 */
const FACILITIES_MAP = [
  {
    name: FACILITIES.ATM,
    value: 'ATM',
    icon: 'cash-register',
  },
  {
    name: FACILITIES.CARWASH,
    value: 'Car wash',
    icon: 'car-wash',
  },
  {
    name: FACILITIES.PLAY_AREA,
    value: 'Play area',
    icon: 'trees',
  },
  {
    name: FACILITIES.PUBLIC_TOILET,
    value: 'Public toilet',
    icon: 'restroom',
  },
  {
    name: FACILITIES.RESTAURANT,
    value: 'Restaurant',
    icon: 'utensils-alt',
  },
  {
    name: FACILITIES.SHOPPING_CENTER,
    value: 'Shopping centre',
    icon: 'shopping-cart',
  },
  {
    name: FACILITIES.SUPERMARKET,
    value: 'Supermarket',
    icon: 'shopping-basket',
  },
  {
    name: FACILITIES.ACCOMODATION,
    value: 'Accomodation',
    icon: 'hotel',
  },
];

export const DISPLAY_CATEGORY_VALUES = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  UNKNOWN: 'UNKNOWN',
  ACCESSIBLE: 'ACCESSIBLE',
  HOME: 'HOME',
  UNDER_CONSTRUCTION: 'UNDER_CONSTRUCTION',
  TAXI_ONLY: 'TAXI_ONLY',
  CAR_PARK: 'CAR_PARK',
  IN_MAINTENANCE: 'IN_MAINTENANCE',
};

export const DISPLAY_CATEGORIES: any = {
  [DISPLAY_CATEGORY_VALUES.UNDER_CONSTRUCTION]: {
    name: 'Under Construction',
    icon: 'construction',
  },
  [DISPLAY_CATEGORY_VALUES.TAXI_ONLY]: {
    name: 'Taxi Only',
    icon: 'taxi',
  },
  [DISPLAY_CATEGORY_VALUES.CAR_PARK]: {
    name: 'Car Park',
    icon: 'parking',
  },
  [DISPLAY_CATEGORY_VALUES.IN_MAINTENANCE]: {
    name: 'In Maintenance',
    icon: 'tools',
  },
  [DISPLAY_CATEGORY_VALUES.UNKNOWN]: {
    name: 'Unknown',
    icon: 'question-circle',
  },
  [DISPLAY_CATEGORY_VALUES.ACCESSIBLE]: {
    name: 'Accessible',
    icon: 'wheelchair',
  },
  [DISPLAY_CATEGORY_VALUES.HOME]: {
    name: 'Home',
    icon: 'home',
  },
  [DISPLAY_CATEGORY_VALUES.PRIVATE]: {
    name: 'Private',
    icon: 'home',
  },
  [DISPLAY_CATEGORY_VALUES.PUBLIC]: {
    name: 'Public',
    icon: 'bolt',
  },
};

const LOCATIONS_MAP = [
  {
    name: 'Public Charging Stations',
    icon: 'bolt',
    value: DISPLAY_CATEGORY_VALUES.PUBLIC,
  },
  {
    name: 'Taxi only Charging Stations',
    icon: 'taxi',
    value: DISPLAY_CATEGORY_VALUES.TAXI_ONLY,
  },
  {
    name: 'Home Charging Stations',
    icon: 'home',
    value: DISPLAY_CATEGORY_VALUES.HOME,
  },
  {
    name: 'Accessibility Charging Stations',
    icon: 'wheelchair',
    value: DISPLAY_CATEGORY_VALUES.ACCESSIBLE,
  },
  {
    name: 'Unknown Status Charging station',
    icon: 'question-circle',
    value: DISPLAY_CATEGORY_VALUES.UNKNOWN,
  },
  {
    name: 'Car Park Charging Stations',
    icon: 'parking',
    value: DISPLAY_CATEGORY_VALUES.CAR_PARK,
  },
  {
    name: 'Charging Station in Maintenance',
    icon: 'tools',
    value: DISPLAY_CATEGORY_VALUES.IN_MAINTENANCE,
  },
  {
    name: 'Under Construction Charging Station',
    icon: 'construction',
    value: DISPLAY_CATEGORY_VALUES.UNDER_CONSTRUCTION,
  },
];

const ACCESS_TYPES_MAP = [
  {
    name: ACCESS_TYPES.HRS_24,
    value: '24 hours access',
    icon: 'clock',
  },
  {
    name: ACCESS_TYPES.RESTRICTED_ACCESS,
    value: 'Restricted Access',
    icon: 'do-not-enter',
  },
  {
    name: ACCESS_TYPES.ACCESSIBILITY_STANDARDS,
    value: 'Accessibility Standards',
    icon: 'universal-access',
  },
];

const enum PAYMENT_TYPE {
  SINGLE_PAYMENT = 'SINGLE_PAYMENT',
  OTHER = 'SINGLE_PAYMENT',
}

const enum STRIPE_SDK {
  MERCHANT_COUNTRY_CODE = 'GB',
  MERCHANT_DEFAULT_CURRENCY_CODE = 'GBP',
  OFF_SESSION_PAYMENT_COLLECTION = 'OffSession',
}
const CHARGING_TAG_STAGING = 'VSTAGINGSWARCOCARD';

const SOCIAL_ICONS = {
  Twitter: require('assets/svg/socials/x-icon.svg').default,
  Facebook: require('assets/svg/socials/facebook-icon.svg').default,
  Instagram: require('assets/svg/socials/instagram-icon.svg').default,
  LinkedIn: require('assets/svg/socials/linkedin-icon.svg').default,
  YouTube: require('assets/svg/socials/youtube-icon.svg').default,
};

const ERROR_CODES = {
  MAX_TRIES: 'Max tries reached.',
  INVALID_CREDENTIALS: 'Invalid user credentials',
  VERIFICATION_EXPIRED: 'Verification code expired',
  INVALID_PASSWORD: 'Invalid password',
};

const oneDegreeOfLatitudeInMeters = 111000; // 1 degree of latitude is approximately 111 kilometers (or 111,000 meters)
const maxMeterRadius = 100000; // 100 kilometers

const sliderMapping: {[key: number]: number} = {
  0: 7,
  1: 22,
  2: 50,
  3: 150,
  4: 300,
};

const SEGEMENTED_CONTROL = {
  STATIONS: 'Stations',
  TARIFF: 'Tariff',
  INFO: 'Info',
  SUPPORT: 'Support',
};

const TERMS_AND_CONDITIONS_LINK = 'https://account.swarcoeconnect.org/terms/';
const PRIVACY_POLICY_LINK =
  'https://account.swarcoeconnect.org/privacy-notice/';

const WHAT3WORDS = (val: string | undefined) => `https://what3words.com/${val}`;

const dateOfBirthRestrictions = {
  minimumDate: new Date(
    new Date().getFullYear() - 100,
    new Date().getMonth(),
    new Date().getDate(),
  ),
  maximumDate: new Date(),
  defaultDate: format(subYears(new Date(), 18), 'dd/MM/yyyy'),
};

// Session filter options

enum SESSION_DATE_VALUES {
  MONTH = 'month',
  THREE_MONTH = 'three_month',
  SIX_MONTH = 'six_month',
  CUSTOM = 'custom',
}
const getSessionDateOptions = (copyObject: {
  monthString: string;
  threeMonthString: string;
  sixMonthString: string;
  customString: string;
}): {
  name: string;
  value: string;
  icon: string;
}[] => {
  return [
    {
      name: copyObject.monthString,
      value: SESSION_DATE_VALUES.MONTH,
      icon: 'calendar-day',
    },
    {
      name: copyObject.threeMonthString,
      value: SESSION_DATE_VALUES.THREE_MONTH,
      icon: 'calendar-week',
    },
    {
      name: copyObject.sixMonthString,
      value: SESSION_DATE_VALUES.SIX_MONTH,
      icon: 'calendar-alt',
    },
    {
      name: copyObject.customString,
      value: SESSION_DATE_VALUES.CUSTOM,
      icon: 'calendar-edit',
    },
  ];
};

const SESSION_FILTER_NAMES = {
  SESSION_DATE: 'session_date',
  DATE_FROM: 'date_from',
  DATE_TO: 'date_to',
  PRICE_FROM: 'price_from',
  PRICE_TO: 'price_to',
};

const FAQ_TYPES = {
  HEADSET: 'HEADSET',
  USER_COG: 'USER_COG',
  CHARGING_STATION: 'CHARGING_STATION',
  COINS: 'COINS',
  MAP: 'MAP',
  OTHER: 'OTHER',
};

export {
  SITE_FILTERS,
  STORAGE,
  THEME_MODES,
  PLATFORMS,
  HTTP_REQUESTS,
  GRAPHQL_REQUESTS,
  APP_RESTRICTIONS,
  IPHONE_X,
  DIRECTIONS,
  TOKEN_TYPES,
  GRANT_TYPES,
  LOGIN_CONSTS,
  AUTH_SCOPE,
  CHARGING_ACTIONS,
  TRANSACTION_TYPE,
  CONNECTOR_TYPES,
  CHARGING_TAG_STAGING,
  PAYMENT_METHODS_MAP,
  CONNECTOR_TYPE_MAP,
  NETWORKS_MAP,
  FACILITIES_MAP,
  LOCATIONS_MAP,
  ACCESS_TYPES_MAP,
  PAYMENT_TYPE,
  CHARGE_CONNECTOR_STATES,
  SOCIAL_ICONS,
  ERROR_CODES,
  oneDegreeOfLatitudeInMeters,
  sliderMapping,
  SEGEMENTED_CONTROL,
  STRIPE_SDK,
  maxMeterRadius,
  NETWORK_LOGOS,
  TERMS_AND_CONDITIONS_LINK,
  PRIVACY_POLICY_LINK,
  WHAT3WORDS,
  dateOfBirthRestrictions,
  SESSION_DATE_VALUES,
  getSessionDateOptions,
  SESSION_FILTER_NAMES,
  FAQ_TYPES,
};
