import React from 'react';
import {useStyle} from 'providers/style/style-provider';

import {Button, ButtonProps} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import {useScale} from 'providers/style/scale-provider';

const DirectionsButton = ({onPress}: ButtonProps) => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getHeight, getWidth, getRadius} = useScale();
  const styles = StyleSheet.create({
    buttonStyle: {
      backgroundColor: coloursTheme.button.directions.backgroundColor,
      height: getHeight(36),
      width: getWidth(161),
      borderRadius: getRadius(18),
      padding: 0,
    },
    titleStyle: {
      ...textStyles.semiBold18,
      color: coloursTheme.button.directions.color,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Button
      title="Directions"
      onPress={onPress}
      buttonStyle={styles.buttonStyle}
      titleStyle={styles.titleStyle}
    />
  );
};

export default DirectionsButton;
