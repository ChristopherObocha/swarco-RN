import {
  ChargePointConnectors,
  ChargePointState,
} from 'providers/types/charging';
import {
  CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM,
  MappedRadiusSiteResponse,
  SiteAPIResponse,
} from 'providers/types/site';

export const getAvailableChargersCount = (
  charge_point_connectors?: ChargePointConnectors[] | ChargePointState[],
) => {
  if (!charge_point_connectors || !charge_point_connectors.length) {
    return 0;
  }

  //@ts-ignore
  const availableConnectors = charge_point_connectors?.filter(
    (connector: any) => {
      if ('connector_state_description' in connector) {
        return (
          connector.connector_state_description ===
            CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM.AVAILABLE ||
          connector.connector_state_description ===
            CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM.PREPARING
        );
      } else if (
        'connector_state' in connector &&
        connector?.connector_state &&
        'connector_state_description' in connector.connector_state
      ) {
        return (
          connector?.connector_state?.connector_state_description ===
            CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM.AVAILABLE ||
          connector?.connector_state?.connector_state_description ===
            CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM.PREPARING
        );
      }
    },
  );

  return availableConnectors?.length || 0;
};

export const getSitesAvailableChargersCount = (
  site?: MappedRadiusSiteResponse | SiteAPIResponse,
) => {
  if (!site) {
    return 0;
  }
  //@ts-ignore
  const availableChargers = site?.site_charge_points?.filter((charger: any) => {
    return getAvailableChargersCount(charger?.charge_point_connectors || []);
  });
  return availableChargers?.length;
};
