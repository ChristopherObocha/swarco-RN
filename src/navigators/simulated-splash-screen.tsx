/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 4th Sep 2023, 14:13:07 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';
const image = require('assets/images/logos/swarco-logo-white.png');

export default function SimulatedSplashScreen(): JSX.Element {
  const {palette} = useStyle();
  const {getHeight, getWidth} = useScale();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      backgroundColor: palette.blue,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      width: getWidth(269),
      height: getHeight(68.5),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FastImage
          source={image}
          resizeMode={'contain'}
          style={styles.imageContainer}
        />
      </View>
    </SafeAreaView>
  );
}
