import React from 'react';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';

import {View, StyleSheet, ViewStyle} from 'react-native';
import {ChildrenProps} from '../../generic-types';

interface CardContainerProps extends ChildrenProps {
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}

const CardContainer = ({
  children,
  style,
  testID = 'cardContainer',
}: CardContainerProps) => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme} = useStyle();
  const {getHeight, getRadius, getWidth} = useScale();
  const styles = StyleSheet.create({
    card: {
      backgroundColor: coloursTheme.card.backgroundColor,
      borderRadius: getRadius(10),
      width: getWidth(335),
      paddingVertical: getHeight(15),
      paddingHorizontal: getWidth(15),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};

export default CardContainer;
