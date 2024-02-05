/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 8th Jan 2024, 10:45:15 am
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2024 The Distance
 */

import React from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import DefaultHeader from 'components/headers/default-header';
import {Platform, StyleSheet} from 'react-native';
import ScreenContainer from 'components/containers/screen-container';
import {Spacer} from 'components/utils/spacer';
import {ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import FAQCard from 'components/cards/faq-card';
import {FAQItem} from 'providers/types/faqs';

const FAQSelectedCategory = () => {
  const route = useRoute<any>();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getFontSize} = useScale();
  const {textStyles, coloursTheme} = useStyle();
  const {bottom} = useSafeAreaInsets();

  const platformSpecificPaddingBottom = Platform.select({
    android: bottom + getHeight(100),
    ios: bottom + getHeight(50),
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: platformSpecificPaddingBottom,
      paddingHorizontal: getWidth(20),
    },
    cardContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    iconContainer: {
      backgroundColor: coloursTheme.primaryColor,
      width: getWidth(40),
      aspectRatio: 1,
      borderRadius: getWidth(40) / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...textStyles.semiBold18,
      letterSpacing: 0,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title={route?.params?.title} />

      <ScreenContainer style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}>
          {route?.params?.faqs?.map((item: FAQItem, index: Number) => (
            <>
              <FAQCard
                question={item.question}
                answer={item.answer}
                testID={`${route?.params?.title} ${index}`}
              />
              <Spacer vertical size={15} />
            </>
          ))}
        </ScrollView>
      </ScreenContainer>
    </>
  );
};

export default FAQSelectedCategory;
