import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useProfile} from 'providers/apis/profile';

import AccountCard, {AccountItemType} from 'components/cards/account-card';
import ScreenContainer from 'components/containers/screen-container';
import {Spacer} from 'components/utils/spacer';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Text} from '@rneui/themed';
import DefaultHeader from 'components/headers/default-header';
import {TertiaryButton} from 'components/buttons/tertiary-button';
import {ACCOUNT_SCREENS, APP_CONTAINER_SCREENS} from '../../types/navigation';
import {getObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';
import {usePayment} from 'providers/apis/payment';
import {useAlert} from 'providers/alert/alert-provider';
import {useVehicle} from 'providers/apis/vehicle/ index';
import VehicleModal from 'components/modals/vehicle-modal';
import {usePrevious} from 'utils/usePrevious';

const Icon = require('../../../assets/svg/additional-onboarding.svg').default;

interface Props {
  route?: {
    params?: {
      redirect?: string;
    };
  };
}

const AdditionalOnboardingScreen = ({route}: Props) => {
  const params = route?.params;
  // ** ** ** ** ** STATE ** ** ** ** **
  const [addVehicleModalVisible, setShowAddVehicleModal] = useState(false);
  const prevAddVehicleModalVisible = usePrevious(addVehicleModalVisible);

  const {getProfile, profile} = useProfile();

  const isBusinessUser = !!getObject(STORAGE.IS_BUSINESS_USER);

  const {initializeStripeSDK, showStripeModal} = usePayment();
  const {alert} = useAlert();
  const {
    dictionary: {Errors},
  } = useDictionary();
  const {getVehicles, usersVehicles} = useVehicle();

  const [paymentHasBeenSetup, setPaymentHasBeenSetup] =
    useState<boolean>(false); //State instead of BE value or App Storage value because this Screen is shown only ONCE
  const [vehicleHasBeenSetup, setVehicleHasBeenSetup] = useState<boolean>(
    (usersVehicles && usersVehicles.length > 0) ?? false,
  );

  // ** ** ** ** ** EFFECTS ** ** ** ** **
  useEffect(() => {
    if (!profile) {
      getProfile();
    }
  }, [getProfile, profile]);

  useEffect(() => {
    initializeStripeSDK();
  }, []);

  useEffect(() => {
    if (
      addVehicleModalVisible === false &&
      prevAddVehicleModalVisible === true
    ) {
      getVehicles();
    }
  }, [getVehicles, addVehicleModalVisible, prevAddVehicleModalVisible]);

  useEffect(() => {
    if (usersVehicles && usersVehicles.length > 0) {
      setVehicleHasBeenSetup(true);
    }
  }, [addVehicleModalVisible, prevAddVehicleModalVisible, usersVehicles]);

  const navigation = useNavigation<any>();

  useEffect(() => {
    if (vehicleHasBeenSetup && paymentHasBeenSetup) {
      return navigation.navigate(ACCOUNT_SCREENS.ACCOUNT_CREATED, {
        redirect: params?.redirect,
      });
    }
  }, [
    vehicleHasBeenSetup,
    paymentHasBeenSetup,
    usersVehicles,
    navigation,
    params?.redirect,
  ]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth} = useScale();
  const {textStyles, coloursTheme} = useStyle();

  const {
    dictionary: {AdditionalOnboarding},
  } = useDictionary();

  const styles = StyleSheet.create({
    contentContainerStyle: {
      paddingTop: getHeight(30),
      paddingLeft: getWidth(20),
      paddingRight: getWidth(10),
    },
    headerContainer: {
      width: '100%',
      backgroundColor: coloursTheme.card.backgroundColor,
      borderBottomWidth: getHeight(2),
      borderBottomColor: coloursTheme.input.border,
      alignItems: 'center',
      paddingHorizontal: getWidth(20),
      paddingTop: getHeight(10),
    },
    h1: {
      ...textStyles.semiBold20,
      marginTop: getHeight(30),
    },
    h2: {
      ...textStyles.regular16,
      marginTop: getHeight(15),
      marginBottom: getHeight(30),
      textAlign: 'center',
    },
    tertiaryButton: {
      marginTop: getHeight(40),
      alignSelf: 'center',
      textAlign: 'center',
    },
    container: {
      flex: 1,
    },
  });

  const items = useMemo(
    () => [
      {
        type: AccountItemType.SETUP_PAYMENTS,
        required: true,
        completed: isBusinessUser || paymentHasBeenSetup,
        disabled: isBusinessUser,
        onPress: () =>
          showStripeModal({
            actionOnAuthorisation: () => setPaymentHasBeenSetup(true),
            actionOnError: () =>
              alert(Errors.Stripe.Title, Errors.Stripe.Description, [
                {text: Errors.Stripe.CTA},
              ]),
          }),
      },
      {
        type: AccountItemType.ADD_E_VEHICLE,
        required: usersVehicles ? usersVehicles.length <= 0 : true,
        completed: vehicleHasBeenSetup,
        onPress: () => setShowAddVehicleModal(true),
      },
    ],
    [
      Errors.Stripe.CTA,
      Errors.Stripe.Description,
      Errors.Stripe.Title,
      alert,
      isBusinessUser,
      paymentHasBeenSetup,
      showStripeModal,
      usersVehicles,
      vehicleHasBeenSetup,
    ],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **

  const renderItem = ({
    item: {type, disabled, required, completed, onPress},
  }: any) => (
    <AccountCard
      type={type}
      disabled={disabled}
      required={required}
      completed={completed}
      onPress={onPress}
      titleNumberOfLines={2}
    />
  );

  const renderDivider = () => <Spacer size={15} />;

  const renderFooter = () => (
    <TertiaryButton
      title={AdditionalOnboarding.SetupLater}
      containerStyle={styles.tertiaryButton}
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
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <View style={styles.container}>
        <ScreenContainer>
          <DefaultHeader
            title={AdditionalOnboarding.Title}
            hideGoBack
            backgroundColor={coloursTheme.card.backgroundColor}
          />
          <View style={styles.headerContainer}>
            <Icon width={getWidth(110)} height={getWidth(110)} />
            <Text style={styles.h1} testID={'AdditionalOnboarding.h1'}>
              {AdditionalOnboarding.AdditionalOnboardingHeader}
            </Text>
            <Text style={styles.h2} testID={'AdditionalOnboarding.h2'}>
              {AdditionalOnboarding.AdditionalOnboardingDescription}
            </Text>
          </View>
          <FlashList
            data={items}
            numColumns={2}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderDivider}
            ListFooterComponent={renderFooter}
            keyExtractor={(item, index) => `${index}`}
            renderItem={renderItem}
          />
        </ScreenContainer>
      </View>

      <VehicleModal
        modalVisible={addVehicleModalVisible}
        closeModal={() => setShowAddVehicleModal(false)}
      />
    </>
  );
};

export default AdditionalOnboardingScreen;
