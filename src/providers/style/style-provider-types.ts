import {TextStyle} from 'react-native';
import {palette} from './palette';
import {light} from './themes';
import {typography} from './typography';

export interface ScreenLayoutInterface {
  height: number;
  width: number;
  heightRatio: number;
}

export interface DimensionConstantsInterface {
  HEADER_HEIGHT: number;
  SCREEN_LAYOUT: ScreenLayoutInterface;
}

export type TextStylesKeys =
  | 'regular12'
  | 'regular14'
  | 'regular16'
  | 'semiBold12'
  | 'semiBold16'
  | 'bold16'
  | 'regular18'
  | 'regular25'
  | 'semiBold18'
  | 'semiBold20'
  | 'semiBold25'
  | 'semiBold28';

export type TextStylesInterface = {
  [key in TextStylesKeys]: TextStyle;
};

export interface StyleProviderInterface {
  dimensionConstants: DimensionConstantsInterface;
  textStyles: TextStylesInterface;
  spacing: any;
  shadow: {
    elevation: number;
    shadowOpacity: number;
    shadowColor: string;
    shadowRadius: number;
    shadowOffset: {width: number; height: number};
  };
  palette: typeof palette;
  typography: typeof typography;
  coloursTheme: typeof light;

  stripeSheetAppearance: {
    font: {
      scale: number;
    };
    shapes: {
      borderRadius: number;
      borderWidth: number;
    };
    primaryButton: {
      shapes: {
        borderRadius: number;
        paddingVertical: number;
      };
    };
    colors: {
      primary: string;
      background: string;
      primaryText: string;
    };
  };
}
