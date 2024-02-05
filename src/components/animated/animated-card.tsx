/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 9th Jan 2024, 18:06:31 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2024 The Distance
 */

import React, {useEffect, useRef, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {Spacer} from 'components/utils/spacer';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Icon} from '@rneui/themed';

interface AnimatedCardProps {
  title: string;
  initialContent?: React.ReactNode;
  animatedContent: React.ReactNode;
  cardFooterContent?: React.ReactNode;
  showMoreInfoText?: boolean;
  hideExpandButton?: boolean;
  titleStyles?: TextStyle;
  isOpen?: boolean;
  headerContainerStyles?: ViewStyle;
  testID?: string;
}

const AnimatedCard = ({
  title,
  initialContent,
  animatedContent,
  cardFooterContent,
  showMoreInfoText = true,
  hideExpandButton = false,
  titleStyles,
  isOpen = false,
  headerContainerStyles,
  testID = 'animatedCard',
}: AnimatedCardProps) => {
  const fromValue = useRef(isOpen ? 1 : 0).current;

  const [showInfo, setShowInfo] = useState(isOpen);
  const spinAnim = useRef(new Animated.Value(fromValue)).current; // Initial value for spin
  const infoOpacity = useRef(new Animated.Value(fromValue)).current;

  const {
    dictionary: {General},
  } = useDictionary();

  useEffect(() => {
    Animated.timing(infoOpacity, {
      toValue: showInfo ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [infoOpacity, showInfo]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const handleMoreInfoPress = () => {
    Animated.timing(spinAnim, {
      toValue: showInfo ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setShowInfo(state => !state);
  };

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getRadius, getFontSize} = useScale();
  const {coloursTheme, textStyles} = useStyle();

  const styles = StyleSheet.create({
    cardContainer: {
      borderRadius: getRadius(10),
      backgroundColor: coloursTheme.card.backgroundColor,
      padding: getWidth(15),
    },
    infoContainer: {
      display: showInfo ? 'flex' : 'none',
      // @ts-ignore
      opacity: infoOpacity,
    },
    moreInfoText: {
      ...textStyles.regular18,
      marginRight: getWidth(5),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    justifyBetween: {
      justifyContent: 'space-between',
    },
    maxWidth: {maxWidth: getWidth(269)},
  });
  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.cardContainer} testID={testID}>
      <TouchableOpacity
        style={[styles.row, styles.justifyBetween, headerContainerStyles]}
        onPress={handleMoreInfoPress}
        disabled={hideExpandButton}>
        <Text style={[textStyles.semiBold18, styles.maxWidth, titleStyles]}>
          {title}
        </Text>

        {!hideExpandButton && (
          <View style={styles.row}>
            {showMoreInfoText && (
              <Text style={styles.moreInfoText}>
                {showInfo ? General.LessInfo : General.MoreInfo}
              </Text>
            )}

            <Animated.View style={{transform: [{rotate: spin}]}}>
              <Icon
                name="chevron-down"
                type="font-awesome-5"
                size={getFontSize(20)}
              />
            </Animated.View>
          </View>
        )}
      </TouchableOpacity>

      {!!initialContent && (
        <>
          <Spacer size={getHeight(15)} vertical />
          {initialContent}
        </>
      )}

      <Animated.View style={styles.infoContainer}>
        <Spacer size={getHeight(15)} vertical />
        {animatedContent}
      </Animated.View>

      {cardFooterContent && (
        <>
          <Spacer size={getHeight(20)} vertical />
          {cardFooterContent}
        </>
      )}
    </View>
  );
};

export default AnimatedCard;
