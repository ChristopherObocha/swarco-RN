import React from 'react';

import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'the-core-ui-utils';

import {StyleSheet} from 'react-native';
import {Button, ButtonProps} from '@rneui/themed';

export const TertiaryButton = ({
  title,
  onPress,
  containerStyle,
  testID = 'TertiaryButton',
}: ButtonProps) => {
  const {textStyles, coloursTheme} = useStyle();
  const {getHeight} = useScale();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0,
    },
    titleStyle: {
      ...textStyles.regular16,
      color: coloursTheme.button.tertiary.color,
      textDecorationLine: 'underline',
      lineHeight: getHeight(20),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Button
      onPress={onPress}
      title={title}
      type="outline"
      containerStyle={[styles.buttonContainer, containerStyle]}
      buttonStyle={styles.buttonContainer}
      titleStyle={styles.titleStyle}
      testID={testID}
    />
  );
};
