import {gql, useSubscription} from '@apollo/client';
import {ChargingSessionRequest} from 'providers/types/charging';

const useChargeSessionSubscription = (params: ChargingSessionRequest) => {
  // Don't include the state in the where clause because this way we can know when the session has been closed
  const CHARGE_SESSION_SUBSCRIPTION = gql`
    subscription SessionStatusUpdate(
      $chargepoint_id: String
      $emp_session_id: String
    ) {
      sdr(
        where: {
          charging_point_id: {_eq: $chargepoint_id}
          emp_session_id: {_eq: $emp_session_id}
        }
      ) {
        id
        state
        emp_session_id
        sdr_state {
          id
          estimated_cost
          start_meter
          end_meter
          start_time
          updated_at
        }
      }
    }
  `;

  const {data, loading, error} = useSubscription(CHARGE_SESSION_SUBSCRIPTION, {
    onComplete: () => console.log('useChargeSessionSubscription COMPLETED'),
    variables: {
      chargepoint_id: params.chargepoint_id,
      emp_session_id: params.emp_session_id,
    },
    shouldResubscribe: true,
    fetchPolicy: 'no-cache',
  });

  return {
    data,
    loading,
    error,
  };
};

export default useChargeSessionSubscription;
