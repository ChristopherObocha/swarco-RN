/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 16th Oct 2023, 16:06:26 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React from 'react';
import {useScale} from 'providers/style/scale-provider';
import {Image, Linking, StyleSheet, TouchableOpacity} from 'react-native';

interface MarketingBannerCardProps {
  imageUrl?: string;
  testID?: string;
}

export const MarketingBannerCard = (props: MarketingBannerCardProps) => {
  const {imageUrl, testID = 'marketingBannerCard'} = props;
  const {getHeight, getRadius} = useScale();
  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    marketingBanner: {
      height: getHeight(70),
      width: '100%',
      borderRadius: getRadius(10),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <TouchableOpacity
      disabled={!imageUrl}
      onPress={() => imageUrl && Linking.openURL(imageUrl)}
      testID={testID}>
      <Image
        source={
          imageUrl
            ? {uri: imageUrl}
            : require('../../../assets/images/initial-release/fallback-marketing-banner.png')
        }
        style={styles.marketingBanner}
        testID={`${testID}.marketingBannerImage`}
      />
    </TouchableOpacity>
  );
};
