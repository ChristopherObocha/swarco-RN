/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 16th Oct 2023, 14:48:20 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {Fragment, useCallback, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {StyleSheet, View, Text} from 'react-native';
import {Spacer} from 'components/utils/spacer';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

export interface IconAndDescriptionList {
  iconName?: string;
  customIcon?: React.FC<{size: number; testID: string}>; // use [iconName].default when passing into component
  description: string | undefined;  //fixes type error in currently-charging.tsx
}
interface InfoListCardProps {
  title?: string;
  iconAndDescriptionList?: IconAndDescriptionList[] | undefined;
  testID?: string;
  chargePoint?: boolean;
}

export const InfoListCard = (props: InfoListCardProps) => {
  const {
    title,
    iconAndDescriptionList,
    testID = 'infoListCard',
    chargePoint = false,
  } = props;
  const {coloursTheme, textStyles} = useStyle();
  const {getWidth, getFontSize, getRadius, getHeight} = useScale();

  const [descriptionIsMultilineArray, setDescriptionIsMultilineArray] =
    useState(new Array(iconAndDescriptionList?.length ?? 1).fill(false));

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      backgroundColor: coloursTheme.card.backgroundColor,
      padding: getWidth(15),
      borderRadius: getRadius(10),
    },
    title: {
      ...textStyles.semiBold18,
      marginBottom: getHeight(15),
    },
    infoRow: {
      flexDirection: 'row',
    },
    iconContainer: {
      verticalAlign: 'middle',
      width: getWidth(30),
      aspectRatio: 1,
      borderRadius: getWidth(30 / 2),
      backgroundColor: coloursTheme.tertiaryColor,
      marginRight: getWidth(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    descriptionContainer: {
      flexShrink: 1,
      justifyContent: 'center',
    },
    description: {
      ...textStyles.regular16,
    },
  });

  const renderIconAndDescription = useCallback(
    (item: IconAndDescriptionList, index: number) => {
      const CustomIcon = item?.customIcon;
      return (
        <View
          style={styles.infoRow}
          testID={`${testID}.${item?.description}Row`}>
          <View
            style={styles.iconContainer}
            testID={`${testID}.${item?.description}Row.iconContainer`}>
            {CustomIcon ? (
              <CustomIcon
                size={getFontSize(30)}
                testID={`${testID}.${item?.description}Row.customIcon`}
              />
            ) : (
              item?.iconName && (
                <FontAwesome5Pro
                  name={item?.iconName}
                  size={getFontSize(16)}
                  solid={false}
                  style={{
                    color: coloursTheme.primaryColor,
                  }}
                  testID={`${testID}.${item?.description}Row.fontAwesomeIcon`}
                />
              )
            )}
          </View>
          <View
            style={[
              styles.descriptionContainer,
              {
                justifyContent: descriptionIsMultilineArray[index]
                  ? 'flex-start'
                  : 'center',
              },
            ]}>
            <Text
              style={styles.description}
              testID={`${testID}.${item?.description}Row.description`}
              onTextLayout={e => {
                const tempArray = descriptionIsMultilineArray;
                tempArray[index] = e?.nativeEvent?.lines?.length > 1;
                setDescriptionIsMultilineArray(tempArray);
              }}>
              {item?.description}
            </Text>
          </View>
        </View>
      );
    },
    [
      styles,
      testID,
      getFontSize,
      coloursTheme,
      descriptionIsMultilineArray,
      setDescriptionIsMultilineArray,
    ],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.container} testID={testID}>
      {title && (
        <Text style={styles.title} testID={`${testID}.title`}>
          {title}
        </Text>
      )}

      {iconAndDescriptionList?.map((item, index) => (
        <Fragment key={index}>
          {renderIconAndDescription(item, index)}
          {index !== iconAndDescriptionList.length - 1 && (
            <Spacer
              vertical
              size={15}
              testID={`${testID}.infoRowSeparatorBelow.${index}`}
            />
          )}
        </Fragment>
      ))}
    </View>
  );
};
