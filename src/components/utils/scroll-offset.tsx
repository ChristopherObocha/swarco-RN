/*
 * Jira Ticket:
 * Created Date: Thu, 21st Apr 2022, 14:18:31 pm
 * Author: Rafiul Ansari
 * Email: raf.ansari@thedistance.co.uk
 * Copyright (c) 2022 The Distance
 */

import {useStyle} from 'providers/style/style-provider';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface ScrollOffsetProps {
  testID: string;
  backgroundColour?: string;
}

export const ScrollOffset = (props: ScrollOffsetProps) => {
  const {coloursTheme} = useStyle();
  const {
    testID = 'scrollOffset',
    backgroundColour = coloursTheme.backgroundColor,
  } = props;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      height: '50%',
      width: '100%',
      top: 0,
      zIndex: -1,
      backgroundColor: backgroundColour,
    },
  });

  return <View style={styles.container} testID={testID} />;
};
