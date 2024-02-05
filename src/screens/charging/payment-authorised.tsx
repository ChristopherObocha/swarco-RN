/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Fri, 20th Oct 2023, 15:48:28 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {StyleSheet, Text} from 'react-native';
// import {useNavigation} from '@react-navigation/native';

import {Spacer} from 'components/utils/spacer';
import DefaultHeader from 'components/headers/default-header';
// import {ChargingContainerContainerNavigationProp} from '../../types/navigation';
import ScreenContainer from 'components/containers/screen-container';
import {PrimaryButton} from 'components/buttons/primary-button';
import CardContainer from 'components/cards/card-container';
const TickIcon = require('../../../assets/svg/tick-circle.svg').default;

//TODO: Navigation pressing Continue button
const PaymentAuthorised = () => {
  const testID = 'PaymentAuthorisedScreen';

  // const navigation = useNavigation<ChargingContainerContainerNavigationProp>();
  const {textStyles} = useStyle();

  const {getHeight, getWidth} = useScale();
  const {
    dictionary: {Payment, General},
  } = useDictionary();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: getWidth(20),
      alignItems: 'center',
      marginBottom: getHeight(83), //tab bar
    },
    cardContainer: {
      paddingVertical: getHeight(50),
      alignItems: 'center',
    },
    headerText: {
      ...textStyles.semiBold20,
      textAlign: 'center',
    },
    text: {
      ...textStyles.regular16,
      textAlign: 'center',
    },
    continueButtonContainer: {width: '100%'},
  });

  // ** ** ** ** ** RENDER ** ** ** ** *
  return (
    <>
      <DefaultHeader title={Payment.PaymentAuthorisedScreenHeader} hideGoBack />
      <ScreenContainer style={styles.container}>
        <Spacer vertical size={10} />

        <CardContainer style={styles.cardContainer} testID={`${testID}.card`}>
          <TickIcon
            width={getWidth(180)}
            height={getWidth(180)}
            testID={`${testID}.tickIcon`}
          />
          <Spacer vertical size={30} />
          <Text style={styles.headerText} testID={`${testID}.headerText`}>
            {Payment.PaymentAuthorisedTitle}
          </Text>
          <Spacer vertical size={15} />
          <Text style={styles.text} testID={`${testID}.text`}>
            {Payment.PaymentAuthorisedDescription}
          </Text>
          <Spacer vertical size={30} />

          <PrimaryButton
            title={General.Continue}
            testID={`${testID}.primaryButton`}
            containerStyle={styles.continueButtonContainer}
          />
        </CardContainer>
      </ScreenContainer>
    </>
  );
};

export default PaymentAuthorised;
