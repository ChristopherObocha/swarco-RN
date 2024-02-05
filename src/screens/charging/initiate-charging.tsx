/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Fri, 20th Oct 2023, 10:43:24 am
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useEffect, useCallback} from 'react';
import {FIELD_TYPES} from 'the-core-ui-module-tdforms-v2';
import {useForm} from 'react-hook-form';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useAlert} from 'providers/alert/alert-provider';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {Spacer} from 'components/utils/spacer';

import DefaultHeader from 'components/headers/default-header';

const ChargingBolt =
  require('../../../assets/svg/bolt-circle-filled.svg').default;

import {PrimaryButton} from 'components/buttons/primary-button';
import {FieldProps, Form} from 'components/utils/form';
import {CHARGING_SCREENS, MAP_SCREENS} from '../../types/navigation';
import {useCharging} from 'providers/apis/charging';
import {PLATFORMS} from 'utils/constants';
import CardContainer from 'components/cards/card-container';
import {SafeAreaView} from 'react-native-safe-area-context';
import {usePrevious} from 'utils/usePrevious';

const InitiateCharging = ({route}: any) => {
  const {
    control,
    handleSubmit,
    formState: {isValid},
    reset,
  } = useForm({
    mode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      stationID: '',
    },
  });

  const {alert} = useAlert();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const {
    coloursTheme: {initiateCharging, text},
    textStyles,
  } = useStyle();

  const {getHeight, getWidth, getRadius} = useScale();
  const {
    dictionary: {Charging, General, Errors},
  } = useDictionary();

  const {checkActiveSession, getChargePoint} = useCharging();

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      let response = await getChargePoint({
        chargepoint_id: data.stationID,
      });

      if (response?.success && response?.data) {
        navigation.navigate(CHARGING_SCREENS.SOCKETS, {
          chargepoint_id: data.stationID,
        });
      } else {
        const {Title, Description, CTA} = Errors.IncorrectCPID;

        alert(Title, Description, [
          {
            text: CTA,
          },
        ]);
      }
    } catch (error: any) {
      alert('Error', error);
    }
  });

  // Checks for a running session on the current user tag
  useEffect(() => {
    // Only check for active session when navigating to this screen from charging complete
    if (isFocused && !route.params?.resetState) {
      checkActiveSession().then(response => {
        if (response.success && response?.data?.charging_point_id) {
          navigation.navigate(CHARGING_SCREENS.CURRENTLY_CHARGING, {
            chargepoint_id: response.data?.charging_point_id,
            emp_session_id: response.data?.emp_session_id,
          });
        }
      });
    }
  }, [checkActiveSession, isFocused, navigation, route.params?.resetState]);

  // Resets state when navigating from the charging complete modal
  const prevRouteParams = usePrevious(route.params);
  useEffect(() => {
    if (
      !!route.params?.resetState &&
      prevRouteParams?.resetState !== route.params?.resetState
    ) {
      reset();
    }
  }, [onSubmit, prevRouteParams?.resetState, reset, route.params?.resetState]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: getHeight(83),
      flex: 1,
    },
    formContainer: {
      backgroundColor: initiateCharging.cardBackground,
      paddingHorizontal: getWidth(15),
      paddingTop: getHeight(30),
      justifyContent: 'center',
      borderRadius: getRadius(10),
    },
    cardContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: getHeight(15),
    },
    stopChargingButton: {
      marginBottom: getHeight(25),
    },
    buttonsContainer: {
      justifyContent: 'space-between',
    },
    headerText: {
      ...textStyles.semiBold20,
    },
    text: {
      ...textStyles.regular18,
    },
    tertiaryButton: {
      ...textStyles.regular16,
      alignItems: 'center',
    },
    tertiaryButtonText: {
      textDecorationLine: 'underline',
      textAlign: 'center',
      color: text.primary,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** *
  let fields: FieldProps[] = [
    {
      type: FIELD_TYPES.TEXT,
      name: 'stationID',
      label: Charging.ChargingStationID,
      placeholder: Charging.EnterStationID,
      autoCapitalize: 'characters',
      rules: {
        required: Charging.StationIDRequiredText,
        maxLength: {
          value: 20,
          message: Charging.StationIDMaxLengthText,
        },
      },
    },
  ];

  const InitiateChargeCard = useCallback(
    () => (
      <>
        <View testID={'chargingInfographic'} style={styles.cardContainer}>
          <ChargingBolt
            width={getWidth(110)}
            height={getWidth(110)}
            testID={'chargingInfographic.innerCircle.bolt'}
          />
          <Spacer vertical size={30} />
          <Text style={styles.headerText} testID={'headerText'}>
            {Charging.StartChargingNow}
          </Text>
          <Spacer vertical size={15} />
          <Text style={styles.text} testID={'text'}>
            {Charging.EnterYourChargingStation}
          </Text>
        </View>
        <Spacer vertical size={30} />
      </>
    ),
    [
      styles.cardContainer,
      styles.headerText,
      styles.text,
      getWidth,
      Charging.StartChargingNow,
      Charging.EnterYourChargingStation,
    ],
  );

  return (
    <>
      <DefaultHeader title={'Charging'} hideGoBack />
      <Spacer vertical size={getHeight(10)} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <CardContainer>
          <InitiateChargeCard />
          <View
            style={{
              height: getHeight(80),
            }}>
            <Form
              fields={fields}
              control={control}
              keyboardAvoidingViewProps={{
                enabled: false,
              }}
              flatListProps={{
                scrollOnFocused: true,
                scrollEnabled: false,
                showsVerticalScrollIndicator: false,
              }}
            />
          </View>
          <Spacer vertical size={10} />
        </CardContainer>
        <View>
          <PrimaryButton
            title={General.Continue}
            disabled={!isValid}
            testID={'primaryButton'}
            onPress={onSubmit}
          />
          <Spacer vertical size={34} />
          <TouchableOpacity
            style={styles.tertiaryButton}
            testID={'tertiaryButton'}
            onPress={() => navigation.navigate(MAP_SCREENS.MAP)}>
            <Text
              style={styles.tertiaryButtonText}
              testID={'tertiaryButtonText'}>
              {Charging.HaveNotFoundStation}
            </Text>
          </TouchableOpacity>
          {Platform.OS === PLATFORMS.ANDROID && (
            <Spacer vertical size={getHeight(15)} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default InitiateCharging;
