import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {StyleSheet, Text} from 'react-native';

import DefaultHeader from 'components/headers/default-header';
import ScreenContainer from 'components/containers/screen-container';
import {PrimaryButton} from 'components/buttons/primary-button';
import CardContainer from 'components/cards/card-container';
import {useNavigation} from '@react-navigation/native';
import {APP_CONTAINER_SCREENS} from '../../types/navigation';

const Icon = require('../../../assets/svg/account-created.svg').default;

interface Props {
  route?: {
    params?: {
      redirect?: string;
    };
  };
}

const AccountCreatedScreen = ({route}: Props) => {
  const params = route?.params;
  const {textStyles} = useStyle();

  const {getHeight, getWidth, getRadius} = useScale();
  const {
    dictionary: {AccountCreated},
  } = useDictionary();

  const navigation = useNavigation<any>();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: getWidth(20),
      marginTop: getHeight(10),
      alignItems: 'center',
    },
    cardContainer: {
      paddingVertical: getHeight(50),
      alignItems: 'center',
    },
    h1: {
      ...textStyles.semiBold20,
      marginTop: getHeight(30),
      textAlign: 'center',
    },
    h2: {
      ...textStyles.regular16,
      marginTop: getHeight(15),
      marginBottom: getHeight(30),
      textAlign: 'center',
    },
    continueButtonContainer: {
      borderRadius: getRadius(25),
      height: getHeight(50),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** *
  return (
    <>
      <DefaultHeader title={AccountCreated.Title} hideGoBack />
      <ScreenContainer style={styles.container}>
        <CardContainer
          style={styles.cardContainer}
          testID={'AccountCreated.card'}>
          <Icon width={getWidth(180)} height={getWidth(180)} />
          <Text style={styles.h1} testID={'AccountCreated.h1'}>
            {AccountCreated.AccountCreatedHeader}
          </Text>
          <Text style={styles.h2} testID={'AccountCreated.h2'}>
            {AccountCreated.AccountCreatedDescription}
          </Text>
          <PrimaryButton
            title={AccountCreated.GetStarted}
            testID={'AccountCreated.primaryButton'}
            containerStyle={styles.continueButtonContainer}
            buttonStyle={styles.continueButtonContainer}
            customWidth={getWidth(295)}
            onPress={() => {
              if (params?.redirect) {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: APP_CONTAINER_SCREENS.BOTTOM_TABS,
                      params: {
                        screen: params.redirect,
                      },
                    },
                  ],
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{name: APP_CONTAINER_SCREENS.BOTTOM_TABS}],
                });
              }
            }}
          />
        </CardContainer>
      </ScreenContainer>
    </>
  );
};

export default AccountCreatedScreen;
