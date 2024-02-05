import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {ButtonProps, Icon} from '@rneui/themed';
import {IconType} from '@rneui/base';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

export interface IconButtonProps extends ButtonProps {
  selected?: boolean;
  showShadow?: boolean;
  name?: string;
  loading?: boolean;
  CustomIcon?: React.FC<{fill: string; size: number; width: number}>; // use [iconName].default when passing into component
  isDelete?: boolean;
  iconType?: IconType;
  isPro?: boolean;
  light?: boolean;
  solid?: boolean;
}

const IconButton = ({
  onPress,
  name = '',
  selected,
  showShadow,
  CustomIcon,
  isDelete,
  containerStyle,
  iconType = 'font-awesome-5',
  testID = 'IconButton',
  isPro,
  light,
  solid,
}: IconButtonProps) => {
  const {coloursTheme} = useStyle();
  const {getHeight, getWidth} = useScale();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    containerStyles: {
      width: getWidth(40),
      aspectRatio: 1,
      marginHorizontal: 0,
      marginVertical: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDelete
        ? coloursTheme.button.icon.delete.backgroundColor
        : coloursTheme.button.icon.backgroundColor,
      borderWidth: getWidth(1),
      borderColor: coloursTheme.button.icon.borderColor,
      paddingHorizontal: 0,
      borderRadius: getWidth(20),
    },
    selectedIconContainer: {
      backgroundColor: coloursTheme.button.icon.selected.backgroundColor,
      borderColor: coloursTheme.button.icon.selected.borderColor,
    },
    iosShadow: {
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 6,
      shadowOpacity: 1,
      elevation: 5,
    },
    androidShadow: {
      shadowColor: 'black',
      elevation: 5,
    },
  });

  const shadowStyles = Platform.select({
    ios: styles.iosShadow,
    android: styles.androidShadow,
  });

  const iconColour = isDelete
    ? coloursTheme.button.icon.delete.color
    : selected
    ? coloursTheme.button.icon.selected.color
    : coloursTheme.button.icon.color;

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <TouchableOpacity
      style={[
        styles.containerStyles,
        showShadow && shadowStyles,
        selected && styles.selectedIconContainer,
        containerStyle,
      ]}
      onPress={onPress}
      testID={testID}
      hitSlop={10}>
      {CustomIcon ? (
        <CustomIcon
          size={getHeight(20)}
          width={getWidth(20)}
          fill={iconColour}
        />
      ) : isPro ? (
        <FontAwesome5Pro
          name={name}
          size={getHeight(20)}
          color={iconColour}
          light={light}
          solid={solid}
        />
      ) : (
        <Icon
          name={name}
          type={iconType}
          size={getHeight(20)}
          color={iconColour}
        />
      )}
    </TouchableOpacity>
  );
};

export default IconButton;
