import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useNavigation} from '@react-navigation/native';

import {View, StyleSheet} from 'react-native';
import {Text} from '@rneui/themed';
import {PrimaryButton} from 'components/buttons/primary-button';
import {TertiaryButton} from 'components/buttons/tertiary-button';
import {Spacer} from 'components/utils/spacer';
import DefaultHeader from 'components/headers/default-header';
import {ACCOUNT_SCREENS, BOTTOM_TABS} from '../../types/navigation';

const IconGraphic = require('assets/svg/timed-out-icon.svg').default;

const SessionTimedOut = () => {
  const {coloursTheme, textStyles} = useStyle();
  const {getHeight, getWidth, getRadius} = useScale();
  const {
    dictionary: {SessionTimedOut},
  } = useDictionary();
  const navigation = useNavigation<any>();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    },
    text: {
      ...textStyles.regular16,
      color: coloursTheme.text.primary,
      marginBottom: getHeight(30),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader hideGoBack />

      <View style={styles.container}>
        <View style={styles.card}>
          <IconGraphic />

          <Text h1 h1Style={styles.h1Text}>
            {SessionTimedOut.Title}
          </Text>

          <Text style={styles.text}>{SessionTimedOut.Description}</Text>

          <PrimaryButton
            title={SessionTimedOut.SignIn}
            customWidth={getWidth(295)}
            onPress={() => navigation.navigate(ACCOUNT_SCREENS.SIGN_IN)}
          />

          <Spacer size={getHeight(10)} vertical />

          <TertiaryButton
            title={SessionTimedOut.ContinueAsGuest}
            onPress={() => navigation.navigate(BOTTOM_TABS.MAP_CONTAINER)}
          />
        </View>
      </View>
    </>
  );
};

export default SessionTimedOut;
