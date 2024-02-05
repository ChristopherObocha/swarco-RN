import {
  CHARGING_ACTIONS,
  PAYMENT_TYPE,
  TRANSACTION_TYPE,
} from 'utils/constants';
import {
  CHARGE_CONNECTOR_STATE_DESCRIPTION,
  CHARGE_POINT_STATE_DESCRIPTION,
  ConnectorTypeTaxonomyMap,
  BaseSite,
  TariffData,
} from '../site';

export interface ChargePoint {
  manufacturer?: string;
  open_247?: boolean;
  charging_type?: string;
  display_name?: string;
}

export type ChargingRequestParams = {
  action: CHARGING_ACTIONS;
  chargepoint: string;
  connector: string;
  transaction_type: TRANSACTION_TYPE;
  emp_session_id: string;
  tag: string;
};

export type SendInvoiceRequestParams = {
  email: string;
  emp_session_id: string;
};

export type StartChargingResponse = {
  status: boolean;
  status_code: string;
  message: string;
  emp_session_id: string;
  started_timestamp: number;
};

export type SendInvoiceResponse = {
  status?: boolean;
  status_code?: boolean;
  reason: string;
  message: string;
};

export type CPIDRequestParams = {
  chargepoint_id: string;
  status?: string;
};

export type ChargePointRequest = {
  chargepoint_id?: string;
  display_name?: string;
};

export type ChargePointState = {
  chargepoint_state_id?: number;
  connector_state_id?: number;
  chargepoint_state_description?: CHARGE_POINT_STATE_DESCRIPTION;
  connector_state_description?: CHARGE_CONNECTOR_STATE_DESCRIPTION;
  connector_id?: string;
  chargepoint_id?: string;
};

export type ChargePointConnectors = {
  connector_key?: number;
  connector_type?: ConnectorTypeTaxonomyMap | null;
  max_charge_rate?: number;
  connector_state?: ChargePointState | null;
};

export interface ChargePointAPIResponse extends ChargePoint {
  charging_type?: string;
  display_name?: string;
  manufacturer?: string;
  model?: string;
  open_247?: boolean;
  charge_point_connectors?: ChargePointConnectors[];
  charge_point_tariff?: ChargepointTariffData;
}

export interface ChargePointPartialAPIResponse extends ChargePoint {
  charging_type?: string;
  display_name?: string;
  manufacturer?: string;
  model?: string;
  open_247?: boolean;
  charge_point_connectors?: ChargePointConnectors[];
  site?: {
    site_id?: string;
    UUID?: string;
    site_address_address_line1?: string;
    site_address_address_line2?: string;
    site_address_locality?: string;
    site_address_postal_code?: string;
    geo_coordinate?: {
      coordinates: [
        number, // longitude
        number, // latitude
      ];
    };
  };
}
export type ChargepointTariffData = {
  ac_price: number;
  dc_price: number;
  description: string;
};
export type ChargingpointTariffRequest = {
  charging_point: string;
};

export interface ChargepointTariff extends TariffData {
  data?: ChargepointTariffData;
}

export type ChargingSessionAPIResponse = {
  sdr?: SdrData[];
  user_info: UserInfo[];
  rfid_service?: RfidSdr[];
};

type RfidSdr = {
  rfid_sdrs?: SdrData[];
};

export type ChargingSessionMappedResponse = {
  sessionData?: MappedSessionResponse;
  paymentType?: PAYMENT_TYPE;
};

export type CheckChargingSessionResponse = {
  connector_id?: number;
  emp_session_id?: string;
  id?: number;
  charging_point_id?: string;
};

export type ChargingSessionRequest = {
  card_tag?: string;
  session_id?: number;
  chargepoint_id?: string;
  emp_session_id?: string;
};

export type CheckChargingSessionRequest = {
  card_tag?: string;
};

export type SdrData = {
  id?: number;
  state?: string;
  total?: number;
  emp_session_id?: string;
  startDateTime?: string;
  endDateTime?: string;
  sessionLength?: number;
  totalEnergy?: number;
  paymentMethod?: string;
  payment_id?: string;
  payment_status?: string;
  tarrif?: string;
  connector_id?: string;
  card_number?: string;
  charging_point_id?: string;
  chargingStation?: ChargingStationAPIResponse;
  connectorType?: ChargePointConnectors;
  sdr_state?: SdrLiveState;
};

type SdrLiveState = {
  estimated_cost: number;
  start_meter: number;
  end_meter: number;
  start_time: string;
  updated_at: string;
};

export type ChargingStationAPIResponse = {
  id: string;
  display_name?: string;
  site?: BaseSite;
};

export type MappedSessionResponse = {
  id?: number;
  state?: string;
  total?: number;
  connectorId?: string;
  connectorType?: ConnectorTypeTaxonomyMap | string | null;
  connector?: ChargePointConnectors;
  startDateTime?: Date;
  endDateTime?: Date;
  provider?: string;
  site?: BaseSite;
  sessionSummary?: SessionSummary;
};

type UserInfo = {
  paymentType?: PAYMENT_TYPE;
};

export type SessionSummary = {
  emp_session_id?: string;
  sessionLength?: number;
  totalEnergy?: number;
  totalCost?: number;
  paymentMethod?: string;
  paymentType?: PAYMENT_TYPE;
  tarrif?: string;
  connectorId?: string;
  cardNumber?: string;
  chargeStation?: ChargingStationAPIResponse;
  connectorType?: ConnectorTypeTaxonomyMap | string | null;
};

export type RequestChargingSubscriptionParams = {
  charging_point_id?: string;
  emp_session_id?: string;
};

export type SessionListRequestParams = {
  charging_point_id?: string;
  pagination: PaginationParams;
  filter?: FilterParams;
};

export type SessionListResponse = {
  sdr: SdrData[];
};

type PaginationParams = {
  limit: number;
  offset: number;
};
export type FilterParams = {
  date_from?: string;
  date_to?: string;
  price_from?: number;
  price_to?: number;
};

export type ChargingGuideResponse = {
  description: string;
  id: string;
  image?: string;
  order_index: number;
  title: string;
};
