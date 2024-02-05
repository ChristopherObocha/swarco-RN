import {Platform} from 'react-native';
import {palette} from './palette';

/*

Provides the different colours to be used for each theme

*/

const light = {
  backgroundColor: palette.background,
  primaryColor: palette.blue,
  secondaryColor: palette.navy,
  tertiaryColor: palette.paleBlue,
  lightGrey: palette.lightGrey,
  text: {
    primary: palette.black,
    secondary: palette.darkGrey,
  },
  button: {
    primary: {
      backgroundColor: palette.blue,
      color: palette.white,
      disabled: {
        backgroundColor: palette.midGrey,
        color: palette.lightGrey,
      },
      delete: {
        backgroundColor: palette.darkRed,
        color: palette.white,
      },
    },
    secondary: {
      backgroundColor: palette.white,
      color: palette.navy,
      borderColor: palette.navy,
    },
    tertiary: {
      color: palette.black,
    },
    icon: {
      backgroundColor: palette.white,
      borderColor: palette.lightGrey,
      color: palette.black,
      selected: {
        backgroundColor: palette.blue,
        borderColor: palette.darkBlue,
        color: palette.white,
      },
      social: {
        color: palette.black,
      },
      delete: {
        backgroundColor: palette.darkRed,
        color: palette.white,
      },
    },
    directions: {
      backgroundColor: palette.navy,
      color: palette.white,
    },
    backgroundGradient: {
      transparent: palette.whiteFadeTransparent,
      translucent: palette.whiteFadeTranslucent,
      opaque: palette.whiteFadeOpaque,
    },
  },
  input: {
    background: palette.white,
    border: palette.lightGrey,
    text: palette.black,
    icon: palette.black,
    placeholder: palette.midGrey,
    disabled: {
      background: palette.midGreyHalfOpacity,
      color: palette.black,
    },
    error: {
      border: palette.darkRed,
      text: palette.brick,
    },
    active: {
      border: palette.blue,
      icon: palette.blue,
    },
  },
  checkbox: {
    active: palette.blue,
    inactive: palette.midGrey,
  },
  switch: {
    ios: {
      active: palette.blue,
      inactive: palette.midGrey,
      thumb: palette.white,
    },
    android: {
      active: palette.lightBlue,
      inactive: palette.lightGrey,
      thumb: palette.blue,
    },
  },
  modal: {
    text: palette.black,
  },
  card: {
    backgroundColor: palette.white,
  },
  carousel: {
    inactiveDot: palette.lightGrey,
    activeDot: palette.blue,
  },
  passcodeCell: {
    backgroundColor: palette.paleBlue,
    active: {
      border: palette.blue,
    },
  },
  tabBar: {
    background: palette.white,
    icon: {
      inactive: palette.midGrey,
      active: palette.blue,
    },
    label: {
      inactive: palette.midGrey,
      active: palette.blue,
    },
    shadow: Platform.select({
      ios: palette.shadowIos,
      android: palette.shadowAndroid,
    }),
  },
  map: {
    clusterTag: {
      backgroundColour: palette.white,
      borderColour: palette.blue,
      textColour: palette.blue,
    },
    stationTag: {
      darkBlue: {
        backgroundColour: palette.navy,
        textColour: palette.white,
      },
      blue: {
        backgroundColour: palette.blue,
        textColour: palette.white,
      },
      outlined: {
        backgroundColour: palette.white,
        borderColour: palette.blue,
        textColour: palette.blue,
      },
    },
    triangle: {
      backgroundColour: palette.blue,
    },
  },
  currentlyCharging: {
    headerBackground: palette.white,
    tab: {
      activeBottomBorder: palette.blue,
      inactiveBottomBorder: palette.lightGrey,
    },
  },
  pill: {
    status: {
      available: {
        backgroundColor: palette.paleGreen,
        color: palette.darkGreen,
      },
      unavailable: {
        backgroundColor: palette.paleRed,
        color: palette.darkRed,
      },
      lightBlue: {
        backgroundColor: palette.paleBlue,
        color: palette.blue,
      },
      darkBlue: {
        backgroundColor: palette.darkBlue,
        color: palette.white,
      },
    },
  },
  pin: {
    pointOfInterest: {
      backgroundColor: palette.navy,
      color: palette.white,
    },
    sitePin: {
      backgroundColor: palette.blue,
      color: palette.white,
    },
  },
  imageGallery: {
    backgroundColor: palette.fullBlack,
    image: {
      borderColor: palette.border,
    },
    imageCount: {
      backgroundColor: 'rgba(29, 29, 27, 0.67)',
      textColor: palette.white,
    },
    selectedImage: {
      borderColor: palette.orange,
    },
  },
  initiateCharging: {
    cardBackground: palette.white,
    iconBorderColour: palette.paleBlue,
    iconColour: palette.blue,
    innerIconContainerColour: palette.whiteOpacity,
  },
  mapSearch: {
    tabBorderColour: palette.blue,
  },
  divider: {
    backgroundColor: palette.midGrey,
  },
  siteDetails: {
    backgroundColor: palette.blue,
  },
  pogo: {
    siteDetails: {
      backgroundColor: palette.pogoPurple,
    },
  },
  cps: {
    siteDetails: {
      backgroundColor: palette.pureWhite,
    },
  },
  sse: {
    siteDetails: {
      backgroundColor: palette.sseDarkBlue,
    },
  },
  evcm: {
    siteDetails: {
      backgroundColor: palette.evcmBlue,
    },
  },
};

const dark = {
  backgroundColor: palette.background,
  primaryColor: palette.blue,
  secondaryColor: palette.navy,
  tertiaryColor: palette.paleBlue,
  lightGrey: palette.lightGrey,
  text: {
    primary: palette.black,
    secondary: palette.darkGrey,
  },
  button: {
    primary: {
      backgroundColor: palette.blue,
      color: palette.white,
      disabled: {
        backgroundColor: palette.midGrey,
        color: palette.lightGrey,
      },
      delete: {
        backgroundColor: palette.darkRed,
        color: palette.white,
      },
    },
    secondary: {
      backgroundColor: palette.white,
      color: palette.navy,
      borderColor: palette.navy,
    },
    tertiary: {
      color: palette.black,
    },
    icon: {
      backgroundColor: palette.white,
      borderColor: palette.lightGrey,
      color: palette.black,
      selected: {
        backgroundColor: palette.blue,
        borderColor: palette.darkBlue,
        color: palette.white,
      },
      social: {
        color: palette.black,
      },
      delete: {
        backgroundColor: palette.darkRed,
        color: palette.white,
      },
    },
    directions: {
      backgroundColor: palette.navy,
      color: palette.white,
    },
    backgroundGradient: {
      transparent: palette.whiteFadeTransparent,
      translucent: palette.whiteFadeTranslucent,
      opaque: palette.whiteFadeOpaque,
    },
  },
  input: {
    background: palette.white,
    border: palette.lightGrey,
    text: palette.black,
    icon: palette.black,
    placeholder: palette.midGrey,
    disabled: {
      background: palette.midGreyHalfOpacity,
      color: palette.black,
    },
    error: {
      border: palette.darkRed,
      text: palette.brick,
    },
    active: {
      border: palette.blue,
      icon: palette.blue,
    },
  },
  checkbox: {
    active: palette.blue,
    inactive: palette.midGrey,
  },
  switch: {
    ios: {
      active: palette.blue,
      inactive: palette.midGrey,
      thumb: palette.white,
    },
    android: {
      active: palette.lightBlue,
      inactive: palette.lightGrey,
      thumb: palette.blue,
    },
  },
  modal: {
    text: palette.black,
  },
  card: {
    backgroundColor: palette.white,
  },
  carousel: {
    inactiveDot: palette.lightGrey,
    activeDot: palette.blue,
  },
  passcodeCell: {
    backgroundColor: palette.paleBlue,
    active: {
      border: palette.blue,
    },
  },
  tabBar: {
    background: palette.white,
    icon: {
      inactive: palette.midGrey,
      active: palette.blue,
    },
    label: {
      inactive: palette.midGrey,
      active: palette.blue,
    },
    shadow: Platform.select({
      ios: palette.shadowIos,
      android: palette.shadowAndroid,
    }),
  },
  map: {
    clusterTag: {
      backgroundColour: palette.white,
      borderColour: palette.blue,
      textColour: palette.blue,
    },
    stationTag: {
      darkBlue: {
        backgroundColour: palette.navy,
        textColour: palette.white,
      },
      blue: {
        backgroundColour: palette.blue,
        textColour: palette.white,
      },
      outlined: {
        backgroundColour: palette.white,
        borderColour: palette.blue,
        textColour: palette.blue,
      },
    },
    triangle: {
      backgroundColour: palette.blue,
    },
  },
  currentlyCharging: {
    headerBackground: palette.white,
    tab: {
      activeBottomBorder: palette.blue,
      inactiveBottomBorder: palette.lightGrey,
    },
  },
  pill: {
    status: {
      available: {
        backgroundColor: palette.paleGreen,
        color: palette.darkGreen,
      },
      unavailable: {
        backgroundColor: palette.paleRed,
        color: palette.darkRed,
      },
      lightBlue: {
        backgroundColor: palette.paleBlue,
        color: palette.blue,
      },
      darkBlue: {
        backgroundColor: palette.darkBlue,
        color: palette.white,
      },
    },
  },
  pin: {
    pointOfInterest: {
      backgroundColor: palette.navy,
      color: palette.white,
    },
    sitePin: {
      backgroundColor: palette.blue,
      color: palette.white,
    },
  },
  imageGallery: {
    backgroundColor: palette.fullBlack,
    image: {
      borderColor: palette.border,
    },
    imageCount: {
      backgroundColor: 'rgba(29, 29, 27, 0.67)',
      textColor: palette.white,
    },
    selectedImage: {
      borderColor: palette.orange,
    },
  },
  initiateCharging: {
    cardBackground: palette.white,
    iconBorderColour: palette.paleBlue,
    iconColour: palette.blue,
    innerIconContainerColour: palette.whiteOpacity,
  },
  mapSearch: {
    tabBorderColour: palette.blue,
  },
  divider: {
    backgroundColor: palette.midGrey,
  },
  siteDetails: {
    backgroundColor: palette.blue,
  },
  pogo: {
    siteDetails: {
      backgroundColor: palette.pogoPurple,
    },
  },
  cps: {
    siteDetails: {
      backgroundColor: palette.pureWhite,
    },
  },
  sse: {
    siteDetails: {
      backgroundColor: palette.sseDarkBlue,
    },
  },
  evcm: {
    siteDetails: {
      backgroundColor: palette.evcmBlue,
    },
  },
};

export {light, dark};
