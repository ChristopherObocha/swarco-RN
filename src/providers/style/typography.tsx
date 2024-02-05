import {Platform} from 'react-native';

export const typography = {
  regular: Platform.select({
    ios: 'System',
    android: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'System',
  }),
  semiBold: Platform.select({
    ios: 'System',
    android: 'RobotoMedium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'System',
  }),
};
