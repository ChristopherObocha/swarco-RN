import React from 'react';

import {useStyle} from 'providers/style/style-provider';

import {StyleSheet} from 'react-native';
import {useLoading} from 'providers/loading/loading-provider';
import {Button, ButtonProps} from '@rneui/themed';

interface PrimaryButtonProps extends ButtonProps {
  showLoading?: boolean;
  isDelete?: boolean;
  isLoading?: boolean;
}

export const PrimaryButton = ({
  title,
  disabled,
  showLoading = false,
  onPress,
  buttonStyle,
  containerStyle = {},
  isDelete,
  customWidth,
  testID = 'PrimaryButton',
}: PrimaryButtonProps) => {
  const {buttonLoading} = useLoading();
  const {coloursTheme} = useStyle();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    button: {
      backgroundColor: isDelete
        ? coloursTheme.button.primary.delete.backgroundColor
        : coloursTheme.button.primary.backgroundColor,
    },
    disabledStyle: {
      backgroundColor: coloursTheme.button.primary.disabled.backgroundColor,
    },
    titleStyle: {
      color: isDelete
        ? coloursTheme.button.primary.delete.color
        : coloursTheme.button.primary.color,
    },
    disabledTitleStyle: {
      color: coloursTheme.button.primary.disabled.color,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Button
      onPress={onPress}
      disabled={disabled || (showLoading && buttonLoading)}
      containerStyle={containerStyle}
      buttonStyle={[styles.button, buttonStyle]}
      titleStyle={styles.titleStyle}
      title={title}
      loading={showLoading && buttonLoading}
      customWidth={customWidth}
      disabledStyle={
        disabled ? styles.disabledStyle : [styles.button, buttonStyle]
      }
      disabledTitleStyle={
        disabled ? styles.disabledTitleStyle : styles.titleStyle
      }
      testID={testID}
    />
  );
};
