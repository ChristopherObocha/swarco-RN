import React from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';

interface PillProps {
  containerStyle?: ViewStyle | ViewStyle[];
  text: string;
  textStyle?: TextStyle | TextStyle[];
}

const Pill = ({containerStyle, text, textStyle}: PillProps) => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getRadius} = useScale();
  const {coloursTheme, textStyles} = useStyle();

  const styles = StyleSheet.create({
    pillContainer: {
      height: getHeight(36),
      borderRadius: getRadius(18),
      backgroundColor: coloursTheme.pill.status.available.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={[styles.pillContainer, containerStyle]}>
      <Text style={[textStyles.semiBold18, textStyle]}>{text}</Text>
    </View>
  );
};

export default Pill;
