/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Thu, 9th Nov 2023, 14:47:08 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import {
  CONNECTOR_TYPES,
  FACILITIES,
  NETWORKS,
  NETWORK_IDS,
  PAYMENT_METHODS,
  SITE_FILTERS,
  SOCIAL_ICONS,
} from 'utils/constants';
import {
  ChargePoint,
  ChargePointConnectors,
  ChargePointState,
  ChargepointTariffData,
} from '../charging';

export type Support = {
  email: string;
  is_supported: boolean;
  phone: string;
  support_socials?: [Socials];
};

//site_id can be either a string(the site uuid) or a number(the site_id) depending on the request being made
export interface SiteRequestParams {
  site_id: string | number;
}

export interface FavourSiteRequest extends SiteRequestParams {}
export interface DeleteFavouriteSiteRequest extends SiteRequestParams {}

export interface FavourSiteResponse {
  success: boolean;
  status_code: number;
  message?: string;
  favourite_sites?: SiteRequestParams[];
}
export interface FavouriteSitesAPIResponse {
  favourite_sites?: [
    {
      site: {
        site_id: number;
      };
    },
  ];
}

export interface FavouriteSitesResponse {
  sites?: number[];
}

export type createReviewParams = {
  site_uuid: string;
  rating: number;
  language: string;
};

export type ReviewAPIResponse = {
  status_code: number;
  success: boolean;
  message?: string;
  response?: ReviewResponseBody;
};

type ReviewResponseBody = {
  id: string;
  rating: string;
  site_id: string;
  created_at: Date;
};
export interface TariffData {
  code: number;
  messages?: string[];
  errors?: string[];
}

export interface SiteTariff extends TariffData {
  data?: SiteTariffData;
}

export type SiteTariffData = {
  description: string;
};

type Socials = {
  type: keyof typeof SOCIAL_ICONS;
  url: string;
};

export type SiteFilter = {
  operator_information: OperatorInformation[];
  connector_type: ConnectorType[];
  site_taxonomies: SiteTaxonomies[];
  access_type_enum: AccessTypes[];
};

type OperatorInformation = {
  operator_details: string;
  operator_id: string;
};

type ConnectorType = {
  description: string;
  value: string;
};
export type SiteTaxonomies = {
  name: string;
  type: string;
};

export interface BaseSite {
  UUID?: string;
  site_address_address_line1?: string;
  site_address_address_line2?: string;
  site_address_administrative_area?: string;
  site_address_country_code?: string;
  site_address_locality?: string;
  site_address_postal_code?: string;
  site_what3words?: string;
  site_name?: string;
  geo_coordinate?: {
    coordinates: [
      number, // longitude
      number, // latitude
    ];
  };
  site_id?: string;
  accessibility_standards?: string;
  open_24_7?: boolean;
  site_images?: SiteImages[];
  site_status?: string;
  charge_point_opening_times?: SITE_OPEN_TIMES[];
  whitelabel_domain?: (typeof NETWORK_IDS)[keyof typeof NETWORK_IDS];
}

export interface SiteAPIResponse extends BaseSite {
  taxonomy_mapping?: taxonomyToName[];
  networkProvider?: NetworkProvider;
  site_charge_points?: APISiteChargePoint[];
  access_types?: AccessTypes[];
  display_categories?: DisplayCategory[];
}

export interface MappedSiteResponse extends BaseSite {
  location_details?: LocationTaxonomyMap[]; //this maps to the value field of siteLocation retrieved from siteFilter query
  site_facility?: FaciltyTaxonomyMap[]; // this maps to the value field of siteFacilities retrieved from siteFilter query
  payment_methods?: PaymentTaxonomyMap[]; //this maps to the value field of paymentmethod retrieved from siteFilter query
  network_provider?: {
    operator_details: string;
    operator_id: string;
  }; //this maps to the value field of network retrieved from siteFilter query
  site_charge_points?: MappedSiteChargePoints[];
  open_24_7?: boolean;
  site_images?: SiteImages[];
  site_tariff?: SiteTariff;
  access_types?: AccessTypeTaxonomyMap[];
  site_type?: string[] | any;
}

export interface MappedRadiusSiteResponse {
  UUID?: string;
  site_id?: string;
  geo_coordinate?: {
    coordinates: [
      number, // longitude
      number, // latitude
    ];
  };
  site_charge_points?: MappedSiteChargePoints[];
  site_type?: string[] | any;
  display_categories?: DisplayCategory[];
}
export enum DAYS {
  MONDAY = 0,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

export type SITE_OPEN_TIMES = {
  day: DAYS;
  endhours: number;
  starthours: number;
};

//Charge point data after mapping
export interface MappedSiteChargePoints extends ChargePoint {
  model?: ChargePointModel;
  max_charge_rate?: number;
  charge_point_state?: string;
  charge_connector_state?: CHARGE_CONNECTOR_STATE_DESCRIPTION;
  charge_point_tariff?: ChargepointTariffData;
  charge_point_connectors?: ChargePointConnectors[];
}

// charge point as it's returned from the backend
export interface APISiteChargePoint extends ChargePoint {
  model?: string;
  charge_point_connectors?: ChargePointConnectors[];
  charge_point_state?: ChargePointState;
  get_model?: ChargePointModel;
}

export type SiteByCPIDAPIResponse = {
  charge_point_connectors?: ChargePointConnectors[];
  site?: MappedSiteResponse;
};

export type Connector = {
  max_charge_rate: number | null;
};

export type ChargePointModel = {
  description?: string;
  value: string;
};

export type SiteImages = {
  site_image_url: string;
};

export type taxonomyToName = {
  taxonomy_tid_to_name: SiteTaxonomies;
  __typename?: string;
};

export type TaxonomiesParams = {
  locations?: SiteTaxonomies[];
  facilities?: SiteTaxonomies[];
  paymentMethods?: SiteTaxonomies[];
};

interface TaxonomyMap {
  icon?: string;
  value?: string;
}

export interface LocationTaxonomyMap extends TaxonomyMap {
  name?: string;
}

export interface PaymentTaxonomyMap extends TaxonomyMap {
  name?: PAYMENT_METHODS;
}

export interface FaciltyTaxonomyMap extends TaxonomyMap {
  name?: FACILITIES;
}

export interface ConnectorTypeTaxonomyMap extends TaxonomyMap {
  name?: CONNECTOR_TYPES;
  value?: string;
  icon?: string;
  altIcon?: string;
}

export interface NetworkTaxonomyMap extends TaxonomyMap {
  name?: NETWORKS | SITE_FILTERS;
}

export interface AccessTypeTaxonomyMap extends TaxonomyMap {
  name?: string;
}

export type MapTaxonomyResponse = {
  siteLocations?: LocationTaxonomyMap[];
  siteFacilities?: FaciltyTaxonomyMap[];
  sitePaymentMethods?: PaymentTaxonomyMap[];
};

export type MapSiteFilterResponse = {
  connectorTypes: ConnectorTypeTaxonomyMap[];
  networks: NetworkTaxonomyMap[];
  siteLocations?: LocationTaxonomyMap[];
  siteFacilities?: FaciltyTaxonomyMap[];
  sitePaymentMethods?: PaymentTaxonomyMap[];
  accessTypes?: AccessTypes[];
};

export type RadiusSearchpParams = {
  long: number;
  lat: number;
  bound: number;
};

export type AccessTypes = {
  access_type_enum: TypeEnums;
};

export type DisplayCategory = {
  display_category_enum: TypeEnums;
};

export type NetworkProvider = {
  operator_details: string;
  operator_id: string;
};

export type TypeEnums = {
  description: string;
  value: string;
};

export enum CHARGE_POINT_STATE_DESCRIPTION_ENUM {
  UKN = 'UKN',
  OK_FREE = 'OK_FREE',
  OK_PART = 'OK_PART',
  OK_ALL = 'OK_ALL',
  ERR_FREE = 'ERR_FREE',
  ERR_PART = 'ERR_PART',
  ERR_ALL = 'ERR_ALL',
  ERR_UEB = 'ERR_UEB',
}

export type CHARGE_POINT_STATE_DESCRIPTION =
  keyof typeof CHARGE_POINT_STATE_DESCRIPTION_ENUM;

export type CHARGE_POINT_STATE_TYPE = {
  chargepoint_state_id: number;
  chargepoint_state_description: CHARGE_POINT_STATE_DESCRIPTION;
}[];

export enum CHARGE_CONNECTOR_STATE_ENUM {
  UNKNOWN = 0,
  AVAILABLE = 1,
  OCCUPIED = 2,
  FAULTED = 3,
  RESERVED = 4,
  UNAVAILABLE = 5,
  CHARGING = 6,
  PREPARING = 7,
  SUSP_EVSE = 8,
  SUSP_EV = 9,
  FINISHING = 10,
}

export enum CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM {
  // -Sometimes a chargepoint will have two connectors that have differing connector types, only one of these can be used at a time.
  // So if an EV is 6 (CHARGING) on one of the connectors, then the other connector would become 5 (UNAVAILABLE)
  UNKNOWN = 'UNKNOWN',
  AVAILABLE = 'AVAILABLE', // -No EV plugged in and no charge session started = 1 (AVAILABLE)
  OCCUPIED = 'OCCUPIED', // -EV plugged in but not charging = 2 (OCCUPIED)
  RESERVED = 'RESERVED',
  FAULTED = 'FAULTED',
  UNAVAILABLE = 'UNAVAILABLE',
  CHARGING = 'CHARGING',
  PREPARING = 'PREPARING', // -EV not plugged in but charging session started = 7 (PREPARING)
  SUSP_EVSE = 'SUSP_EVSE',
  SUSP_EV = 'SUSP_EV',
  FINISHING = 'FINISHING', // -EV has finished charging/user stops charging = 10 (FINISHING)
}

export type CHARGE_CONNECTOR_STATE_DESCRIPTION =
  keyof typeof CHARGE_CONNECTOR_STATE_DESCRIPTION_ENUM;

export type CHARGE_CONNECTOR_STATE_TYPE = {
  connector_state_id: number;
  connector_state_description: CHARGE_CONNECTOR_STATE_DESCRIPTION;
}[];
