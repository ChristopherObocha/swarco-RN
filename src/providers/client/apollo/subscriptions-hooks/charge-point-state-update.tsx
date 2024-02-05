import {gql, useQuery, useSubscription} from '@apollo/client';
import {CPIDRequestParams} from 'providers/types/charging';

/**
 * Use this hook to subscribe to charge point state update after succesfully starting a charge
 * The data returned would contain the field `connector_state_description` which will be used to decide what screen to display
 * The possible values of connector_state_description can be found in the utils/constants.ts file stored in variable name `CHARGE_CONNECTOR_STATE`
 * @param CPIDRequestParams
 * @returns
 * @example
 * function GetUpdatedChargePointState() {
 *  const {data, loading, error} = useChargingStateSubscription({chargepoint_id:"DEV003"})
 *  return <p>Data: {!loading && data[0].connector_state_description}</>
 * }
 *
 *
 */
const useChargingStateSubscription = (params: CPIDRequestParams) => {
  const CHARGEPOINT_STATE_SUBSCRIPTION = gql`
    subscription Chargepoint_state($chargepoint_id: String) {
      chargepoint_state(where: {chargepoint_id: {_eq: $chargepoint_id}}) {
        chargepoint_id
        chargepoint_state_description
        chargepoint_state_id
        connector_id
        connector_state_description
        connector_state_id
        device_id
      }
    }
  `;

  const CHARGEPOINT_STATE_QUERY = gql`
    query Chargepoint_state($chargepoint_id: String) {
      chargepoint_state(where: {chargepoint_id: {_eq: $chargepoint_id}}) {
        chargepoint_id
        chargepoint_state_description
        chargepoint_state_id
        connector_id
        connector_state_description
        connector_state_id
        device_id
      }
    }
  `;
  // Separated query and subscription as subscribeToMore wasn't getting called
  const {data, loading, error} = useQuery(CHARGEPOINT_STATE_QUERY, {
    variables: {
      chargepoint_id: params.chargepoint_id,
    },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache',
    defaultOptions: {
      fetchPolicy: 'no-cache',
      nextFetchPolicy: 'no-cache',
    },
  });

  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(CHARGEPOINT_STATE_SUBSCRIPTION, {
    onComplete: () => console.log('useChargingStateSubscription COMPLETED'),
    variables: {
      chargepoint_id: params.chargepoint_id,
    },
    shouldResubscribe: true,
    fetchPolicy: 'no-cache',
  });

  return {
    data: {
      ...data,
      ...subscriptionData,
    },
    loading,
    error,
  };
};

export default useChargingStateSubscription;
