/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Thu, 11th Jan 2024, 09:26:41 am
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2024 The Distance
 */

import React from 'react';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {StyleSheet, Text} from 'react-native';
import CardContainer from './card-container';
import {Spacer} from 'components/utils/spacer';

const ExclamationIcon =
  require('../../../assets/svg/exclamation-circle.svg').default;

const ContactUnavailableCard = () => {
  const {dictionary} = useDictionary();
  const {
    Account: {ContentUnavailable, ContentUnavailableDescription},
  } = dictionary;

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {textStyles} = useStyle();
  const {getHeight, getWidth} = useScale();
  const styles = StyleSheet.create({
    cardContainer: {
      alignItems: 'center',
      paddingTop: getHeight(50),
      height: getHeight(475),
    },
    headerText: {
      ...textStyles.semiBold20,
    },
    text: {
      ...textStyles.regular16,
      textAlign: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <CardContainer testID={'exclamationGraphic'} style={styles.cardContainer}>
        <ExclamationIcon
          width={getWidth(180)}
          height={getWidth(180)}
          testID={'exclamationGraphic.innerCircle.bolt'}
        />
        <Spacer vertical size={30} />
        <Text style={styles.headerText} testID={'headerText'}>
          {ContentUnavailable}
        </Text>
        <Spacer vertical size={15} />
        <Text style={styles.text} testID={'text'}>
          {ContentUnavailableDescription}
        </Text>
      </CardContainer>
      <Spacer vertical size={30} />
    </>
  );
};

export default ContactUnavailableCard;
