import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Appearance,
  ColorSchemeName,
  Platform,
  StatusBarStyle,
} from 'react-native';

import {theme as DefaultElementsTheme} from 'the-core-ui-module-tdforms-v2';

import {palette} from './palette';
import {typography} from './typography';
import {dark, light} from './themes';
import {GlobalStorage} from 'utils/storage-utils';
import {STORAGE, THEME_MODES} from 'utils/constants';
import {ChildrenProps} from '../../generic-types';
import {
  DimensionConstantsInterface,
  StyleProviderInterface,
  TextStylesInterface,
} from './style-provider-types';
import {useScale} from './scale-provider';
import {ButtonProps, InputProps, ThemeMode, useTheme} from '@rneui/themed';
import {rgbToHex} from 'utils/general-utils';

/*

Provides all the styling for the app as well as handling theme change and status bar appearance

*/

// ** ** ** ** ** CREATE ** ** ** ** **
const StyleContext = createContext<StyleProviderInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function useStyle() {
  const context = useContext(StyleContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useStyle` hook must be used within a `StyleProvider` component',
    );
  }
  return context;
}

interface StyleProviderProps extends ChildrenProps {
  dimensionConstants: DimensionConstantsInterface;
}

interface ThemeComponentProps extends Partial<InputProps> {
  isFocused?: boolean;
  isError?: boolean;
  multiline?: boolean;
  disabled?: boolean;
}
// ** ** ** ** ** PROVIDE ** ** ** ** **
export function StyleProvider({
  children,
  dimensionConstants,
}: StyleProviderProps) {
  // ** ** ** ** ** SETUP ** ** ** ** **
  const {getFontSize, getRadius, getHeight, getWidth} = useScale();
  const deviceSettingColorMode: ColorSchemeName = Appearance.getColorScheme();

  const [colorMode, setColorMode] = useState<string | ColorSchemeName>(
    THEME_MODES.LIGHT,
  );

  const [mainStatusBar, setMainStatusBar] = useState<string | StatusBarStyle>(
    colorMode === THEME_MODES.LIGHT
      ? THEME_MODES.DARK_CONTENT
      : THEME_MODES.LIGHT_CONTENT,
  );

  // Colours pallete for specific theme
  const [coloursTheme, setColoursTheme] = useState<typeof light>(light);

  const {updateTheme} = useTheme();

  const stripeSheetAppearance = useMemo(() => {
    return {
      font: {
        scale: 1,
      },
      shapes: {
        borderRadius: getRadius(15),
        borderWidth: getWidth(1),
      },
      primaryButton: {
        shapes: {
          borderRadius: 25,
          paddingVertical: getHeight(20),
        },
      },
      colors: {
        //Stripe SDK recognises only 6 character Hex values
        primary: rgbToHex(coloursTheme.primaryColor)?.substring(0, 7),
        background: rgbToHex(coloursTheme.backgroundColor)?.substring(0, 7),
        primaryText: rgbToHex(coloursTheme.text.primary)?.substring(0, 7),
      },
    };
  }, [getHeight, getRadius, getWidth, coloursTheme]);

  // ** ** ** ** ** METHODS ** ** ** ** **
  const textStyles: TextStylesInterface = useMemo(() => {
    return {
      regular12: {
        fontFamily: typography.regular,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(12),
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      regular14: {
        fontFamily: typography.regular,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(14),
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      regular16: {
        fontFamily: typography.regular,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(16),
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      semiBold12: {
        fontFamily: typography.semiBold,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(12),
        fontWeight: '600',
        fontStyle: 'normal',
      },
      semiBold16: {
        fontFamily: typography.semiBold,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(16),
        fontWeight: '600',
        fontStyle: 'normal',
      },
      bold16: {
        fontFamily: typography.bold,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(16),
        fontWeight: 'bold',
        fontStyle: 'normal',
      },
      regular18: {
        fontFamily: typography.regular,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(18),
        fontWeight: 'normal',
        fontStyle: 'normal',
        letterSpacing: 0,
      },
      regular25: {
        fontFamily: typography.regular,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(25),
        fontWeight: 'normal',
        fontStyle: 'normal',
        letterSpacing: 0.1,
      },
      semiBold18: {
        fontFamily: typography.semiBold,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(18),
        fontWeight: '600',
        fontStyle: 'normal',
        letterSpacing: 0,
      },
      semiBold20: {
        fontFamily: typography.semiBold,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(20),
        fontWeight: '600',
        fontStyle: 'normal',
        letterSpacing: 0,
      },
      semiBold25: {
        fontFamily: typography.semiBold,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(25),
        fontWeight: '600',
        fontStyle: 'normal',
        letterSpacing: 0.1,
      },
      semiBold28: {
        fontFamily: typography.regular,
        color: coloursTheme.text.primary,
        fontSize: getFontSize(28),
        fontWeight: '600',
        fontStyle: 'normal',
        letterSpacing: 0.1,
      },
    };
  }, [getFontSize, coloursTheme]);

  // Initialize theme used for React Native Elements
  useEffect(() => {
    updateTheme({
      mode: THEME_MODES.LIGHT as ThemeMode,
      spacing: {
        ...DefaultElementsTheme.spacing,
      },
      lightColors: {
        ...DefaultElementsTheme.lightColors,
      },
      darkColors: {
        ...DefaultElementsTheme.darkColors,
      },
      components: {
        ...DefaultElementsTheme.components,
        Button: ({customWidth}: ButtonProps) => ({
          containerStyle: {
            height: getHeight(50),
            width: customWidth ? customWidth : getWidth(315),
            borderRadius: getRadius(25),
          },
          buttonStyle: {
            borderRadius: getRadius(25),
            height: getHeight(50),
          },
          titleStyle: {
            ...textStyles.semiBold20,
          },
        }),
        Input: ({
          isError,
          isFocused,
          multiline,
          disabled,
        }: ThemeComponentProps) => ({
          disabledInputStyle: {
            opacity: 1,
          },
          inputContainerStyle: {
            backgroundColor: coloursTheme.input.background,
            borderWidth: getWidth(1),
            borderColor: coloursTheme.input.border,
            borderRadius: getRadius(15),
            height: getHeight(45),
            marginTop: getHeight(10),
            marginBottom: 0,
            paddingLeft: getWidth(10),
            ...(multiline && {
              paddingVertical: getHeight(13),
            }),
            ...((disabled && {
              backgroundColor: coloursTheme.input.disabled.background,
              color: coloursTheme.input.disabled.color,
              borderWidth: 0,
              borderBottomWidth: 0,
            }) ||
              (isError && {
                borderColor: coloursTheme.input.error.border,
              }) ||
              (isFocused && {borderColor: coloursTheme.input.active.border})),
          },
          inputStyle: {
            ...textStyles.regular16,
            color: coloursTheme.input.text,
            height: getHeight(45),
          },
          labelContainerStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          labelStyle: {
            ...textStyles.semiBold16,
          },
          containerStyle: {
            paddingHorizontal: 0,
          },
          errorStyle: {
            ...textStyles.regular16,
            color: coloursTheme.input.error.text,
            marginLeft: 0,
            marginBottom: isError ? getHeight(10) : 0,
          },
        }),
        CheckBox: {
          size: getWidth(25),
          iconType: 'font-awesome',
          checkedIcon: 'check-circle',
          checkedColor: coloursTheme.checkbox.active,
          uncheckedIcon: 'circle-o',
          uncheckedColor: coloursTheme.checkbox.inactive,
        },
        Switch: {
          trackColor: {
            true: Platform.select({
              ios: coloursTheme.switch.ios.active,
              android: coloursTheme.switch.android.active,
            }),
            false: Platform.select({
              ios: coloursTheme.switch.ios.inactive,
              android: coloursTheme.switch.android.inactive,
            }),
          },
          color: Platform.select({
            ios: coloursTheme.switch.ios.thumb,
            android: coloursTheme.switch.android.thumb,
          }),
          ios_backgroundColor: coloursTheme.switch.ios.inactive,
        },
      },
    });
  }, [coloursTheme, getHeight, getRadius, getWidth, textStyles, updateTheme]);

  // Initial app theme load
  // Fetch the saved color mode from Storage, if it exists set the color mode to
  // the saved value, otherwise set it to the default device setting color mode
  useEffect(() => {
    const fetchSavedColorMode = async () => {
      try {
        const savedColorMode = GlobalStorage.getString(STORAGE.COLOUR_MODE);
        console.log('StyleProvider - savedColorMode: ', savedColorMode);
        if (savedColorMode) {
          setColorMode(savedColorMode);
        } else {
          setColorMode(deviceSettingColorMode);
        }
      } catch (e) {
        console.log('StyleProvider - fetchSavedColorMode - error: ', e);
        setColorMode(deviceSettingColorMode);
      }
    };

    fetchSavedColorMode();
  }, [deviceSettingColorMode]);

  useEffect(() => {
    console.log('colorMode:set:', colorMode);
    // todo: need to change the react native elements theme as well to apply onto FormsV2
    setColoursTheme(colorMode === THEME_MODES.DARK ? dark : light);
    setMainStatusBar(
      colorMode === THEME_MODES.LIGHT
        ? THEME_MODES.DARK_CONTENT
        : THEME_MODES.LIGHT_CONTENT,
    );
  }, [colorMode]);

  const spacing = useMemo(() => {
    return {
      small: getFontSize(10),
      medium: getFontSize(20),
      large: getFontSize(40),
      xLarge: getFontSize(80),
    };
  }, [getFontSize]);

  const shadow = useMemo(
    () => ({
      elevation: 4,
      shadowOpacity: 0.1,
      shadowColor: '#000',
      shadowRadius: getRadius(6),
      shadowOffset: {width: 0, height: getHeight(2)},
    }),
    [getHeight, getRadius],
  );

  // ** ** ** ** ** MEMOIZE ** ** ** ** **
  const values: StyleProviderInterface = useMemo(
    () => ({
      dimensionConstants,
      textStyles,
      spacing,
      palette,
      typography,
      coloursTheme,
      shadow,
      stripeSheetAppearance,
    }),
    [
      dimensionConstants,
      textStyles,
      spacing,
      coloursTheme,
      shadow,
      stripeSheetAppearance,
    ],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <StyleContext.Provider value={values}>{children}</StyleContext.Provider>
  );
}
