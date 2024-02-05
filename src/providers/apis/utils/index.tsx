import {
  ChargePointConnectors,
  ChargingSessionAPIResponse,
  ChargingSessionMappedResponse,
  MappedSessionResponse,
  SessionSummary,
} from 'providers/types/charging';
import {
  APISiteChargePoint,
  MapSiteFilterResponse,
  MapTaxonomyResponse,
  MappedSiteChargePoints,
  SiteFilter,
  SiteTaxonomies,
  TaxonomiesParams,
  taxonomyToName,
} from 'providers/types/site';
import {
  CHARGE_CONNECTOR_STATE,
  CHARGE_POINT_STATE,
  CONNECTOR_TYPE_MAP,
  FACILITIES_MAP,
  LOCATIONS_MAP,
  NETWORKS_MAP,
  PAYMENT_METHODS_MAP,
} from 'utils/constants';

/**
 * Map response from API to UI
 * @param data
 * @returns
 */
const mapSiteFilterData = (data: SiteFilter): MapSiteFilterResponse => {
  const connectorTypes = data?.connector_type?.map(connector => {
    const mappedItem = CONNECTOR_TYPE_MAP.find(
      item => item.value === connector.value,
    );
    return {
      name: mappedItem?.name,
      value: connector.description,
      icon: mappedItem?.icon,
      altIcon: mappedItem?.altIcon,
    };
  });
  const networks = data?.operator_information?.map(operator => {
    const mappedItem = NETWORKS_MAP.find(
      item => item.value === operator.operator_id,
    );
    return {
      name: mappedItem?.name,
      value: operator.operator_id,
      icon: mappedItem?.icon,
    };
  });
  const {locations, facilities, paymentMethods} = groupTaxonomies(
    data?.site_taxonomies,
  );
  const {siteLocations, siteFacilities, sitePaymentMethods} = mapTaxonomies({
    locations,
    facilities,
    paymentMethods,
  });

  const finalData = {
    connectorTypes: connectorTypes?.filter(val => val),
    siteFacilities,
    siteLocations,
    sitePaymentMethods,
    networks: networks?.filter(val => val),
    accessTypes: data.access_type_enum,
  };

  return finalData;
};

const mapSiteChargePoints = (
  data: APISiteChargePoint[],
): MappedSiteChargePoints[] => {
  const mappedResponse: MappedSiteChargePoints[] = [];
  data.map(siteChargePoint => {
    const mappings: MappedSiteChargePoints = {
      manufacturer: siteChargePoint?.manufacturer,
      open_247: siteChargePoint?.open_247,
      charging_type: siteChargePoint?.charging_type,
      display_name: siteChargePoint?.display_name,
    };
    if (siteChargePoint?.get_model) {
      mappings.model = siteChargePoint?.get_model;
    }
    if (siteChargePoint?.charge_point_connectors?.length) {
      const mappedConnectors: ChargePointConnectors[] = [];
      siteChargePoint?.charge_point_connectors?.map(connector => {
        if (connector?.connector_state) {
          const chargePoint = CHARGE_POINT_STATE.find(
            point =>
              point.chargepoint_state_id ===
              connector?.connector_state?.chargepoint_state_id,
          );
          connector.connector_state.chargepoint_state_description =
            chargePoint?.chargepoint_state_description || 'UKN';
          const connectorPoint = CHARGE_CONNECTOR_STATE.find(
            point =>
              point.connector_state_id ===
              connector?.connector_state?.connector_state_id,
          );
          connector.connector_state.connector_state_description =
            connectorPoint?.connector_state_description || 'UNKNOWN';
        } else {
          connector.connector_state = null;
        }
        const type = CONNECTOR_TYPE_MAP.find(conn => {
          return conn.value == connector.connector_type;
        });
        if (type) {
          connector.connector_type = type;
        }

        mappedConnectors.push(connector);
      });
      mappings.charge_point_connectors = mappedConnectors;
      mappings.max_charge_rate = getMaxChargeRate(mappedConnectors);
    }
    if (siteChargePoint?.charge_point_state) {
      const chargePoint = CHARGE_POINT_STATE.find(
        point =>
          point.chargepoint_state_id ===
          siteChargePoint.charge_point_state?.chargepoint_state_id,
      );
      mappings.charge_point_state = chargePoint?.chargepoint_state_description;
      const chargeConnector = CHARGE_CONNECTOR_STATE.find(
        point =>
          point.connector_state_id ===
          siteChargePoint.charge_point_state?.connector_state_id,
      );
      mappings.charge_connector_state =
        chargeConnector?.connector_state_description;
    } else {
      mappings.charge_point_state = CHARGE_POINT_STATE.find(
        point => point.chargepoint_state_id == 0,
      )?.chargepoint_state_description;
      mappings.charge_connector_state = CHARGE_CONNECTOR_STATE.find(
        point => point.connector_state_id == 0,
      )?.connector_state_description;
    }
    mappedResponse.push(mappings);
  });
  return mappedResponse;
};

const getMaxChargeRate = (data: ChargePointConnectors[]): number => {
  // Use the reduce method to find the highest non-null max_charge_rate value
  let maxChargeRate: number = data.reduce((max, chargeRate) => {
    if (chargeRate.max_charge_rate && chargeRate.max_charge_rate !== null) {
      return Math.max(max, chargeRate.max_charge_rate);
    }
    return max;
  }, -Infinity);

  // If all max_charge_rate values are null, set highestChargeRate to 0
  if (maxChargeRate === -Infinity) {
    maxChargeRate = 0;
  }
  return maxChargeRate;
};
const groupTaxonomies = (taxonomies: SiteTaxonomies[]) => {
  // Create an object to store arrays for each taxonomy
  const taxonomyObject: Record<string, {name: string; type: string}[]> = {};
  // Loop through the taxonomies and create separate arrays for each type
  taxonomies?.forEach(taxonomy => {
    const {name, type} = taxonomy;
    if (!taxonomyObject[type]) {
      taxonomyObject[type] = [];
    }
    taxonomyObject[type].push({name, type});
  });

  // Access the arrays using keys in the taxonomyObject object
  // console.log(taxonomyObject["site_facility"]);
  // console.log(taxonomyObject["payment_methods"]);

  return {
    locations: taxonomyObject.location_details,
    paymentMethods: taxonomyObject.payment_methods,
    facilities: taxonomyObject.site_facility,
  };
};

const parseTaxonomyIdToName = (
  taxonomy: taxonomyToName[],
): MapTaxonomyResponse => {
  const formattedTaxonomy: SiteTaxonomies[] = taxonomy.map(item => {
    return {
      name: item.taxonomy_tid_to_name?.name,
      type: item.taxonomy_tid_to_name?.type,
    };
  });
  const {locations, paymentMethods, facilities} =
    groupTaxonomies(formattedTaxonomy);
  return mapTaxonomies({locations, paymentMethods, facilities});
};

const mapTaxonomies = (params: TaxonomiesParams): MapTaxonomyResponse => {
  const {locations, facilities, paymentMethods} = params;

  const siteLocations = locations?.map(location => {
    const mappedItem = LOCATIONS_MAP.find(item => item.name === location.name);
    return {name: mappedItem?.name, icon: mappedItem?.icon};
  });

  const siteFacilities = facilities?.map(facility => {
    const mappedItem = FACILITIES_MAP.find(
      item => item.value === facility.name,
    );
    return {
      name: mappedItem?.name,
      value: facility.name,
      icon: mappedItem?.icon,
    };
  });
  const sitePaymentMethods = paymentMethods?.map(paymentMethod => {
    const mappedItem = PAYMENT_METHODS_MAP.find(
      item => item.value === paymentMethod.name,
    );
    return {
      name: mappedItem?.name,
      value: paymentMethod.name,
      icon: mappedItem?.icon,
    };
  });

  return {
    siteLocations: siteLocations?.filter(val => val),
    sitePaymentMethods: sitePaymentMethods?.filter(val => val),
    siteFacilities: siteFacilities?.filter(val => val),
  };
};

const mapConnectorType = (data?: ChargePointConnectors[]) => {
  const resp: ChargePointConnectors[] = [];

  data?.map(connector => {
    if (connector.connector_type) {
      const mappedConnector = CONNECTOR_TYPE_MAP.find(
        type => type.value === connector.connector_type,
      );
      if (mappedConnector) {
        connector.connector_type = mappedConnector;
      }
      resp.push(connector);
    }
  });

  return resp;
};

const mapSessionData = (data: ChargingSessionAPIResponse) => {
  let finalResponse: ChargingSessionMappedResponse = {};

  if (data?.user_info?.length) {
    finalResponse.paymentType = data.user_info[0].paymentType;
  }

  if (data?.sdr?.length) {
    const sessionData = data.sdr[0];

    const mappedConnector =
      sessionData.connectorType &&
      mapConnectorType([sessionData.connectorType]);

    const {sdr_state} = sessionData;
    let totalEnergy = sessionData.totalEnergy || 0;

    if (sdr_state?.end_meter && sdr_state?.start_meter) {
      totalEnergy = (sdr_state!!.end_meter - sdr_state!!.start_meter) / 1000;
    }

    let sessionLength = sessionData.sessionLength || 0;

    if (sdr_state?.updated_at || sdr_state?.start_time) {
      sessionLength =
        (new Date(sdr_state!!.updated_at).getTime() -
          new Date(sdr_state!!.start_time).getTime()) /
        1000;
    }

    let total = sessionData.total || sdr_state?.estimated_cost;

    let sessionSummary: SessionSummary = {
      emp_session_id: sessionData.emp_session_id,
      sessionLength: sessionLength,
      totalEnergy: totalEnergy,
      totalCost: total,
      paymentMethod: sessionData.paymentMethod,
      paymentType: undefined,
      tarrif: sessionData.tarrif,
      cardNumber: undefined,
      chargeStation: sessionData.chargingStation,
    };

    let mappedSession: MappedSessionResponse = {
      id: sessionData.id,
      state: sessionData.state,
      total: total,
      connectorId: sessionData.connector_id,
      connector: mappedConnector && mappedConnector[0],
      startDateTime: new Date(sessionData.startDateTime!!),
      endDateTime: new Date(sessionData.endDateTime!!),
      provider: sessionData.chargingStation?.site?.whitelabel_domain,
      sessionSummary: sessionSummary,
    };

    finalResponse.sessionData = mappedSession;
  }
  console.log('finalResponse: ', JSON.stringify(finalResponse, null, 2));

  return finalResponse;
};

export {
  mapSiteChargePoints,
  mapSiteFilterData,
  parseTaxonomyIdToName,
  mapConnectorType,
  mapSessionData,
};
