import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';
import useChargingStateSubscription from 'providers/client/apollo/subscriptions-hooks/charge-point-state-update';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import DefaultHeader from 'components/headers/default-header';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text} from '@rneui/themed';
import ScreenContainer from 'components/containers/screen-container';
import SocketCard from 'components/sockets/socket-card';
import {Spacer} from 'components/utils/spacer';
import {useCharging} from 'providers/apis/charging';
import {usePayment} from 'providers/apis/payment';
import {LoadingView} from 'components/utils/loading-view';
import {useLoading} from 'providers/loading/loading-provider';
import {getAvailableChargersCount} from 'utils/charging-utils';

const SocketsScreen = ({route}: any) => {
  const testID = 'SocketsScreen';
  const {
    dictionary: {Charging},
  } = useDictionary();
  const {chargepoint_id} = route.params;

  const {data} = useChargingStateSubscription({
    chargepoint_id: chargepoint_id,
  });

  const {getChargePoint, chargePoint} = useCharging();
  const {loading} = useLoading();
  const {initializeStripeSDK} = usePayment();

  useEffect(() => {
    getChargePoint({
      chargepoint_id: chargepoint_id,
    });
  }, [chargepoint_id, getChargePoint]);

  useEffect(() => {
    initializeStripeSDK();
  }, []);

  const chargepointState = data?.chargepoint_state;

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {textStyles} = useStyle();
  const {getHeight, getWidth} = useScale();
  const styles = StyleSheet.create({
    titleContainer: {
      alignItems: 'center',
    },
    subTitle: {
      marginTop: getHeight(5),
      ...textStyles.regular16,
    },
    container: {
      paddingHorizontal: getWidth(20),
      marginBottom: getHeight(55),
    },
  });

  if (!chargePoint && loading) {
    return <LoadingView />;
  }

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader
        title={
          <View style={styles.titleContainer} testID={`${testID}.header`}>
            <Text style={textStyles.semiBold25}>
              {chargePoint?.display_name}
            </Text>
            <Text style={styles.subTitle}>{`${getAvailableChargersCount(
              chargepointState,
            )}/${chargepointState?.length || 0} ${
              Charging.SocketsAvailable
            }`}</Text>
          </View>
        }
      />

      <ScreenContainer style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {chargePoint?.charge_point_connectors?.map((connector, index) => (
            <Fragment key={index}>
              <SocketCard
                index={index}
                connector={connector}
                chargePoint={chargePoint}
                chargePointState={chargepointState?.find(
                  (item: any) =>
                    item.connector_id ===
                    connector?.connector_state?.connector_id,
                )}
              />
              <Spacer size={getHeight(15)} vertical />
            </Fragment>
          ))}
        </ScrollView>
      </ScreenContainer>
    </>
  );
};

export default SocketsScreen;
