import React, {useCallback, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useCharging} from 'providers/apis/charging';
import {useNavigation} from '@react-navigation/native';

import {View, Text, StyleSheet} from 'react-native';
import {PrimaryButton} from 'components/buttons/primary-button';
import {Spacer} from 'components/utils/spacer';
import {
  ChargePointAPIResponse,
  ChargePointConnectors,
  ChargePointState,
  ChargingRequestParams,
} from 'providers/types/charging';
import {
  CHARGING_ACTIONS,
  CONNECTOR_TYPE_MAP,
  TRANSACTION_TYPE,
} from 'utils/constants';

import {CHARGING_SCREENS} from '../../types/navigation';
import {CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM} from 'providers/types/site';
import AnimatedCard from 'components/animated/animated-card';
import {useProfile} from 'providers/apis/profile';
import {useAlert} from 'providers/alert/alert-provider';
import {usePayment} from 'providers/apis/payment';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import useChargeSessionStartedSubscription from 'providers/client/apollo/subscriptions-hooks/session-started-update';
import {useLoading} from 'providers/loading/loading-provider';

const CoinCircle = require('assets/svg/coin-circle.svg').default;
const InfoCircle = require('assets/svg/info-circle.svg').default;
const BoltCircle = require('assets/svg/bolt-circle.svg').default;
const OtherConnector =
  require('assets/svg/connector-types/other-connectors.svg').default;
interface SocketCardProps {
  connector: ChargePointConnectors;
  index: number;
  chargePoint?: ChargePointAPIResponse;
  chargePointState?: ChargePointState;
  testID?: string;
}
const SocketCard = ({
  connector,
  index,
  chargePoint,
  chargePointState,
  testID = 'SocketCard',
}: SocketCardProps) => {
  const ConnectorIcon =
    CONNECTOR_TYPE_MAP.find(item => {
      if (typeof connector.connector_type !== 'string') {
        return item.value === connector.connector_type?.value;
      } else {
        return item.value === connector.connector_type;
      }
    })?.icon || OtherConnector;

  const {startChargingSession} = useCharging();
  const {profile} = useProfile();
  const {alert} = useAlert();
  const {showStripeModal} = usePayment();

  const {
    dictionary: {Errors, Charging},
  } = useDictionary();

  const navigation = useNavigation<any>();

  // TODO: do this in connect-ev screen as well
  const [empSessionId, setEmpSessionId] = useState<string>('');

  // Subscribe to sdr with emp_session_id and running state
  useChargeSessionStartedSubscription({
    chargepoint_id: chargePointState?.chargepoint_id,
    emp_session_id: empSessionId,
  });

  const {setButtonLoading} = useLoading();

  const handleStartCharging = useCallback(async () => {
    const postBody: ChargingRequestParams = {
      action: CHARGING_ACTIONS.START,
      chargepoint: chargePointState?.chargepoint_id!!,
      connector: chargePointState?.connector_id!!,
      transaction_type: TRANSACTION_TYPE.NEW,
      emp_session_id: '',
      tag: profile?.cardtag!!,
    };

    try {
      const response = await startChargingSession(postBody);

      if (response.success && response.data?.status) {
        // Subscribe to sdr with emp_session_id and running state
        setEmpSessionId(response.data?.emp_session_id); //setButtonLoading(false); is in useChargeSessionStartedSubscription definition
        return;
      } else if (response.error?.code === 'CLIENT_ERROR') {
        alert(Errors.ChargingAuth.Title, Errors.ChargingAuth.Description);
        setButtonLoading(false);
      } else {
        alert(
          Errors.ChargingAuth.Title,
          response.data?.message || response.error?.message,
        );
        setButtonLoading(false);
      }
    } catch (e) {
      console.log(e);
      setButtonLoading(false);
    }
  }, [
    Errors.ChargingAuth,
    alert,
    chargePointState?.chargepoint_id,
    chargePointState?.connector_id,
    profile?.cardtag,
    setButtonLoading,
    startChargingSession,
  ]);

  const checkChargerAndAuthorisePayment = useCallback(async () => {
    if (!profile?.cardtag) {
      alert(Charging.NoTagTitle, Charging.NoTagDescription);
      return;
    }
    if (
      chargePointState?.connector_state_description !==
      CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM.PREPARING
    ) {
      navigation.navigate(CHARGING_SCREENS.CONNECT_EV, {
        chargepoint_id: chargePointState?.chargepoint_id,
        connector_id: chargePointState?.connector_id,
      });
      return;
    }
    setButtonLoading(true);
    const showStripeModalArgs = {
      chargerIds: {
        chargepoint: chargePointState?.chargepoint_id ?? '',
        connector: Number(chargePointState?.connector_id) ?? 0,
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
    Charging,
    Errors.Stripe,
    alert,
    chargePointState,
    handleStartCharging,
    navigation,
    profile?.cardtag,
    setButtonLoading,
    showStripeModal,
  ]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getHeight, getWidth} = useScale();
  const {textStyles} = useStyle();

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    justifyBetween: {
      justifyContent: 'space-between',
    },
    infoText: {
      ...textStyles.regular16,
      width: getWidth(264),
      letterSpacing: -0.7,
    },
    infoContentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    kwhContainer: {
      width: getWidth(106),
    },
    buttonContainer: {
      alignItems: 'center',
    },
  });

  const socketUnavailable =
    chargePointState?.connector_state_description !==
      CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM.AVAILABLE &&
    chargePointState?.connector_state_description !==
      CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM.PREPARING;

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <AnimatedCard
      title={`Socket ${index + 1}`}
      initialContent={
        <>
          <View style={[styles.row, styles.justifyBetween]}>
            <View style={styles.row}>
              <ConnectorIcon />
              <Spacer size={getWidth(10)} />
              <Text style={textStyles.regular16}>
                {typeof connector.connector_type !== 'string'
                  ? connector.connector_type?.name
                  : connector.connector_type}
              </Text>
            </View>
            <View style={[styles.row, styles.kwhContainer]}>
              <BoltCircle />
              <Spacer size={getWidth(10)} />
              <Text style={textStyles.regular16}>
                {connector.max_charge_rate} kW
              </Text>
            </View>
          </View>
          {chargePoint?.charge_point_tariff && (
            <>
              <Spacer size={getHeight(15)} vertical />
              <View style={[styles.row, styles.justifyBetween]}>
                <View style={styles.row}>
                  <CoinCircle />
                  <Spacer size={getWidth(10)} />
                  <View>
                    <Text style={textStyles.semiBold16}>
                      {`£${
                        chargePoint?.charge_point_tariff.dc_price
                          ? (
                              chargePoint?.charge_point_tariff.dc_price / 100
                            ).toFixed(2)
                          : '0.00'
                      }`}
                    </Text>
                    <Text style={textStyles.regular16}>Price per DC kWh</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </>
      }
      animatedContent={
        chargePoint?.charge_point_tariff && (
          <>
            <Spacer size={getWidth(20)} />
            <Text style={textStyles.semiBold18}>
              Tariff information and fees
            </Text>
            <Spacer size={getWidth(15)} />
            <View style={styles.infoContentContainer}>
              <InfoCircle />
              <Spacer size={getWidth(10)} />
              <Text style={styles.infoText}>
                {chargePoint?.charge_point_tariff?.description}
              </Text>
            </View>
          </>
        )
      }
      /* Disable button if session started and waiting for subscription data */
      cardFooterContent={
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={Charging.StartCharging}
            onPress={checkChargerAndAuthorisePayment}
            testID={`${testID}.startChargingButton`}
            disabled={socketUnavailable}
            customWidth={getWidth(295)}
            showLoading={!socketUnavailable || !!empSessionId}
          />
        </View>
      }
      hideExpandButton={!chargePoint?.charge_point_tariff}
    />
  );
};

export default SocketCard;
