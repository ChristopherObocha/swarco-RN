import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useScale} from 'the-core-ui-utils';

import {DIRECTIONS} from '../../utils/constants';
import {useStyle} from 'providers/style/style-provider';

const {VERTICAL, HORIZONTAL} = DIRECTIONS;

interface SpacerProps {
  size: number | string;
  vertical?: boolean;
  horizontal?: boolean;
  useScaling?: boolean;
  style?: any;
  testID?: string;
}

export const Spacer = ({
  size,
  vertical = false,
  horizontal = false,
  useScaling = true,
  style = {},
  testID = 'spacer',
}: SpacerProps) => {
  const {spacing} = useStyle();
  const {getFontSize, getWidth, getHeight} = useScale();

  const axis = vertical ? VERTICAL : horizontal ? HORIZONTAL : null;

  // ** ** ** ** ** FUNCTIONS ** ** ** ** **
  function sizer(direction: string) {
    return axis === direction
      ? 1
      : typeof size === 'string'
      ? spacing[size]
      : useScaling
      ? getFontSize(size)
      : axis === VERTICAL
      ? getHeight(size)
      : axis === HORIZONTAL
      ? getWidth(size)
      : size;
  }

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      width: sizer(VERTICAL),
      minWidth: sizer(VERTICAL),
      height: sizer(HORIZONTAL),
      minHeight: sizer(HORIZONTAL),
      alignSelf: 'center',
      ...style,
      // backgroundColor: 'red', // Use this to test out your spacing
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return <View style={styles.container} testID={testID} />;
};
