import {gql, useSubscription} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {
  ChargingSessionAPIResponse,
  ChargingSessionRequest,
} from 'providers/types/charging';
import {useEffect} from 'react';
import {CHARGING_SCREENS} from '../../../../types/navigation';
import {useLoading} from 'providers/loading/loading-provider';

const useChargeSessionStartedSubscription = (
  params: ChargingSessionRequest,
) => {
  const CHARGE_SESSION_SUBSCRIPTION = gql`
    subscription SessionStatusUpdate(
      $chargepoint_id: String
      $emp_session_id: String
    ) {
      sdr(
        where: {
          state: {_eq: running}
          charging_point_id: {_eq: $chargepoint_id}
          emp_session_id: {_eq: $emp_session_id}
        }
      ) {
        id
        emp_session_id
        charging_point_id
        connector_id
        state
      }
    }
  `;

  const navigation = useNavigation<any>();
  const {setLoading, setButtonLoading} = useLoading();
  const {data, loading, error} = useSubscription(CHARGE_SESSION_SUBSCRIPTION, {
    skip: !params.chargepoint_id || !params.emp_session_id,
    variables: {
      chargepoint_id: params.chargepoint_id,
      emp_session_id: params.emp_session_id,
    },
    shouldResubscribe: true,
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    console.log('subscribedData, error: ', data, error);

    if (data && !error) {
      const subscribedData = data as ChargingSessionAPIResponse;

      if (subscribedData?.sdr?.length && subscribedData.sdr[0]) {
        setButtonLoading(false);
        setLoading(false);
        const sessionUpdate = subscribedData.sdr!![0];
        console.log('We got a session: ', sessionUpdate);
        // navigate when sdr is available
        navigation.navigate(CHARGING_SCREENS.CURRENTLY_CHARGING, {
          chargepoint_id: params.chargepoint_id,
          emp_session_id: params.emp_session_id,
        });
      }
    } else {
      if (error) {
        setButtonLoading(false);
        setLoading(false);
      }
    }
  }, [
    data,
    error,
    navigation,
    params.chargepoint_id,
    params.emp_session_id,
    setLoading,
    setButtonLoading,
  ]);

  return {
    data,
    loading,
    error,
  };
};

export default useChargeSessionStartedSubscription;
