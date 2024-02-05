/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Fri, 20th Oct 2023, 15:48:28 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useCallback, useState} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {View, StyleSheet, Text} from 'react-native';

import {Spacer} from 'components/utils/spacer';
import DefaultHeader from 'components/headers/default-header';
import ScreenContainer from 'components/containers/screen-container';
import {PrimaryButton} from 'components/buttons/primary-button';
import useChargingStateSubscription from 'providers/client/apollo/subscriptions-hooks/charge-point-state-update';
import {CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM} from 'providers/types/site';
import {CHARGING_ACTIONS, TRANSACTION_TYPE} from 'utils/constants';
import {ChargingRequestParams} from 'providers/types/charging';
import {useProfile} from 'providers/apis/profile';
import {useAlert} from 'providers/alert/alert-provider';
import {useCharging} from 'providers/apis/charging';
import {usePayment} from 'providers/apis/payment';
import {useAuth} from 'providers/apis/auth';
import useChargeSessionStartedSubscription from 'providers/client/apollo/subscriptions-hooks/session-started-update';
import {useLoading} from 'providers/loading/loading-provider';
const PlugIcon = require('../../../assets/svg/plug-icon.svg').default;

const ConnectEV = ({route}: any) => {
  const testID = 'ConnectEVScreen';

  const {
    coloursTheme: {initiateCharging},
    textStyles,
  } = useStyle();

  const {getHeight, getWidth, getRadius} = useScale();
  const {
    dictionary: {Charging, Errors},
  } = useDictionary();

  const {ConnectEV} = Charging;

  const {chargepoint_id, connector_id} = route?.params;

  const {startChargingSession} = useCharging();

  const {profile} = useProfile();
  const {alert} = useAlert();

  const {data} = useChargingStateSubscription({
    chargepoint_id: chargepoint_id,
  });

  const {showStripeModal} = usePayment();

  const {logout} = useAuth();

  const connectorState = data?.chargepoint_state?.find(
    (item: any) => item.connector_id === connector_id,
  );

  console.log({connectorState, data});

  const [empSessionId, setEmpSessionId] = useState<string>('');

  // Subscribe to sdr with emp_session_id and running state
  useChargeSessionStartedSubscription({
    chargepoint_id: chargepoint_id,
    emp_session_id: empSessionId,
  });

  const {setButtonLoading} = useLoading();

  const handleStartCharging = useCallback(async () => {
    const postBody: ChargingRequestParams = {
      action: CHARGING_ACTIONS.START,
      chargepoint: chargepoint_id,
      connector: connector_id,
      transaction_type: TRANSACTION_TYPE.NEW,
      emp_session_id: '',
      tag: profile?.cardtag!!,
    };

    try {
      const response = await startChargingSession(postBody);

      if (response.success && response.data?.status) {
        // Subscribe to sdr with emp_session_id and running state
        setEmpSessionId(response.data?.emp_session_id);
        return;
      } else if (response.error?.code === 'CLIENT_ERROR') {
        alert(Errors.ChargingAuth.Title, Errors.ChargingAuth.Description);
      } else {
        alert(
          Errors.ChargingAuth.Title,
          response.data?.message || response.error?.message,
        );
      }
      setButtonLoading(false);
    } catch (e) {
      console.log(e);
      setButtonLoading(false);
    }
  }, [
    Errors.ChargingAuth.Description,
    Errors.ChargingAuth.Title,
    alert,
    chargepoint_id,
    connector_id,
    profile?.cardtag,
    setButtonLoading,
    startChargingSession,
  ]);

  const checkChargerAndAuthorisePayment = useCallback(async () => {
    if (!profile?.cardtag) {
      alert('Oops!!', 'No tag associated with this user.');
      return;
    }
    setButtonLoading(true);
    const showStripeModalArgs = {
      chargerIds: {
        chargepoint: chargepoint_id ?? '',
        connector: Number(connector_id) ?? 0,
      },
      actionOnAuthorisation: handleStartCharging,
      actionOnError: () => {
        alert(Errors.Stripe.Title, Errors.Stripe.Description, [
          {text: Errors.Stripe.CTA},
        ]);
        setButtonLoading(false);
      },
    };
    await showStripeModal(showStripeModalArgs);
  }, [
    Errors.Stripe,
    alert,
    chargepoint_id,
    connector_id,
    handleStartCharging,
    profile?.cardtag,
    setButtonLoading,
    showStripeModal,
  ]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: getWidth(20),
      alignItems: 'center',
      marginBottom: getHeight(83), //tab bar
    },
    cardContainer: {
      backgroundColor: initiateCharging.cardBackground,
      paddingHorizontal: getWidth(15),
      paddingTop: getHeight(50),
      paddingBottom: getHeight(43),
      alignItems: 'center',
      borderRadius: getRadius(10),
      overflow: 'hidden',
    },
    headerText: {
      ...textStyles.semiBold20,
      textAlign: 'center',
    },
    text: {
      ...textStyles.regular16,
      textAlign: 'center',
    },
    tertiaryButton: {
      alignItems: 'center',
    },
  });
  console.log('state: ', connectorState);
  // ** ** ** ** ** RENDER ** ** ** ** *
  return (
    <>
      <DefaultHeader title={ConnectEV.ConnectEV} />
      <ScreenContainer style={styles.container}>
        <Spacer vertical size={10} />

        <View testID={`${testID}.card`} style={styles.cardContainer}>
          <PlugIcon
            width={getWidth(180)}
            height={getHeight(180)}
            testID={`${testID}.plug-icon`}
          />
          <Spacer vertical size={30} />
          <Text style={styles.headerText} testID={`${testID}.headerText`}>
            {ConnectEV.NotPlugged}
          </Text>
          <Spacer vertical size={15} />
          <Text style={styles.text} testID={`${testID}.text`}>
            {ConnectEV.InOrderToCharge}
          </Text>
          <Spacer vertical size={30} />
          {/* Disable button if session started and waiting for subscription data */}
          <PrimaryButton
            title={ConnectEV.PlugConnected}
            testID={`${testID}.primaryButton`}
            disabled={
              connectorState?.connector_state_description !==
              CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM.PREPARING
            }
            onPress={checkChargerAndAuthorisePayment}
            showLoading
          />
          {/*
            HIDE UNTIL SUPPORT CENTER IS RELEASED
          <Spacer vertical size={30} />
          <TertiaryButton title={Charging.NeedHelpOrSupportTitle} /> */}
        </View>
      </ScreenContainer>
    </>
  );
};

export default ConnectEV;
