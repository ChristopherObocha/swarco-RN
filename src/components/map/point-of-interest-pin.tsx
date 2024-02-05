/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 7th Nov 2023, 12:48:54 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import {View} from 'react-native';
import {StyleSheet} from 'react-native';

import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {MapMarkerProps, Marker} from 'react-native-maps';
import {palette} from 'providers/style/palette';

interface PointOfInterestPin extends MapMarkerProps {
  value?: string;
  cluster?: boolean;
}

const PointOfInterestPin = ({coordinate}: PointOfInterestPin) => {
  const testID = 'pointOfInterestPin';

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getRadius, getFontSize} = useScale();
  const {
    coloursTheme: {
      pin: {pointOfInterest},
    },
  } = useStyle();

  const styles = StyleSheet.create({
    clusterPinContainer: {
      flexDirection: 'row',
      backgroundColor: pointOfInterest.backgroundColor,
      borderRadius: getRadius(5),
      alignItems: 'center',
      justifyContent: 'center',
      height: getHeight(28),
      width: getWidth(28),
    },
    triangleContainer: {
      alignItems: 'center',
      marginTop: getHeight(-0.5),
      marginLeft: getWidth(-3),
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: palette.transparent,
      borderStyle: 'solid',
      borderLeftWidth: getWidth(5),
      borderRightWidth: getWidth(5),
      borderBottomWidth: getHeight(8),
      borderLeftColor: palette.transparent,
      borderRightColor: palette.transparent,
      transform: [{rotate: '180deg'}],
      borderBottomColor: pointOfInterest.backgroundColor,
    },
  });
  // ** ** ** ** ** RENDER ** ** ** ** **
  const Triangle = <View style={styles.triangle} />;

  return (
    <Marker coordinate={coordinate} testID={testID} tracksViewChanges={false}>
      <View style={styles.clusterPinContainer}>
        <FontAwesome5Pro
          name={'flag'}
          color={pointOfInterest.color}
          size={getFontSize(14)}
          solid
        />
      </View>
      <View style={styles.triangleContainer}>{Triangle}</View>
    </Marker>
  );
};

export default PointOfInterestPin;
