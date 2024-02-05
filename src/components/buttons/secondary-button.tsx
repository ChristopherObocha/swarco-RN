import React from 'react';

import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'the-core-ui-utils';
import {useLoading} from 'providers/loading/loading-provider';

import {StyleSheet} from 'react-native';
import {Button, ButtonProps} from '@rneui/themed';

interface SecondaryButtonProps extends ButtonProps {
  showLoading?: boolean;
}

export const SecondaryButton = ({
  title,
  onPress,
  showLoading = false,
  containerStyle = {},
  customWidth,
  testID = 'SecondaryButton',
}: SecondaryButtonProps) => {
  const {buttonLoading} = useLoading();
  const {coloursTheme} = useStyle();
  const {getWidth} = useScale();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    button: {
      borderWidth: getWidth(2),
      borderColor: coloursTheme.button.secondary.borderColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleStyle: {
      color: coloursTheme.button.secondary.color,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Button
      onPress={onPress}
      title={title}
      type="outline"
      containerStyle={containerStyle}
      buttonStyle={styles.button}
      titleStyle={styles.titleStyle}
      loading={showLoading && buttonLoading}
      customWidth={customWidth}
      testID={testID}
    />
  );
};
