import React from 'react';

import {StyleSheet, View} from 'react-native';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import DefaultHeader from 'components/headers/default-header';
import ScreenContainer from 'components/containers/screen-container';
import {Text} from '@rneui/themed';
import {PrimaryButton} from 'components/buttons/primary-button';
import {Spacer} from 'components/utils/spacer';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {StackScreenProps} from '@react-navigation/stack';
import {
  ACCOUNT_SCREENS,
  AccountContainerNavigationProp,
  AccountContainerParamList,
} from '../../types/navigation';
import {useNavigation} from '@react-navigation/native';
const IconGraphic = require('assets/svg/business-icon.svg').default;
interface BusinessLandingProps
  extends StackScreenProps<
    AccountContainerParamList,
    ACCOUNT_SCREENS.BUSINESS_LANDING
  > {}

const BusinessLanding = ({
  route: {
    params: {email},
  },
}: BusinessLandingProps) => {
  const {
    dictionary: {BusinessLanding},
  } = useDictionary();
  const navigation = useNavigation<AccountContainerNavigationProp>();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth, getRadius} = useScale();
  const {coloursTheme, textStyles} = useStyle();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: getHeight(10),
    },
    card: {
      backgroundColor: coloursTheme.card.backgroundColor,
      height: getHeight(550),
      width: getWidth(335),
      borderRadius: getRadius(10),
      alignItems: 'center',
      paddingTop: getHeight(50),
    },
    h1Text: {
      ...textStyles.semiBold20,
      color: coloursTheme.text.primary,
      marginTop: getHeight(30),
      marginBottom: getHeight(15),
      textAlign: 'center',
    },
    text: {
      ...textStyles.regular16,
      color: coloursTheme.text.primary,
      marginBottom: getHeight(30),
      textAlign: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title="Company invite" />

      <ScreenContainer style={styles.container}>
        <View style={styles.card}>
          <IconGraphic />

          <Text h1 h1Style={styles.h1Text}>
            {`${BusinessLanding.Title} {{Example Company}}`}
          </Text>

          <Text style={styles.text}>{BusinessLanding.Description}</Text>

          <PrimaryButton
            title={BusinessLanding.PrimaryText}
            customWidth={getWidth(295)}
            onPress={() =>
              navigation.navigate(ACCOUNT_SCREENS.CREATE_ACCOUNT, {email})
            }
          />

          <Spacer size={getHeight(10)} vertical />

          <SecondaryButton
            title={BusinessLanding.SecondaryText}
            customWidth={getWidth(295)}
            onPress={() => console.log('Continue as guest')}
          />
        </View>
      </ScreenContainer>
    </>
  );
};

export default BusinessLanding;
