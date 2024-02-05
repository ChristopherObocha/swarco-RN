/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 16th Oct 2023, 14:48:20 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {StyleSheet, View, Text} from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

interface ChargeValueCardProps {
  iconName: string;
  value: string;
  valueDescription: string;
  testID?: string;
}

export const ChargeValueCard = (props: ChargeValueCardProps) => {
  const {iconName, value, valueDescription, testID = 'chargeValueCard'} = props;
  const {coloursTheme, textStyles} = useStyle();
  const {getWidth, getFontSize, getRadius} = useScale();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: coloursTheme.card.backgroundColor,
      padding: getWidth(15),
      borderRadius: getRadius(10),
    },
    iconContainer: {
      alignSelf: 'center',
      verticalAlign: 'middle',
      width: getWidth(40),
      aspectRatio: 1,
      borderRadius: getWidth(40 / 2),
      backgroundColor: coloursTheme.tertiaryColor,
      marginRight: getWidth(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      justifyContent: 'space-between',
    },
    value: {
      ...textStyles.semiBold18,
    },
    valueDescription: {
      ...textStyles.regular18,
      color: coloursTheme.text.secondary,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.iconContainer} testID={`${testID}.iconContainer`}>
        <FontAwesome5Pro
          name={iconName}
          size={getFontSize(19)}
          solid={false}
          style={{
            color: coloursTheme.primaryColor,
          }}
          testID={`${testID}.icon`}
        />
      </View>
      <View style={styles.textContainer} testID={`${testID}.textContainer`}>
        <Text style={styles.value} testID={`${testID}.value`}>
          {value ?? ' '}
        </Text>
        <Text
          style={styles.valueDescription}
          testID={`${testID}.valueDescription`}>
          {valueDescription ?? ' '}
        </Text>
      </View>
    </View>
  );
};
