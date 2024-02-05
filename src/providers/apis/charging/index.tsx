import React, {
  useMemo,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {ChildrenProps} from '../../../generic-types';
import {useClient} from 'providers/client/client-provider';
import {
  ApiResponse,
  ApolloAPIRequest,
  RequestTypes,
  RestAPIRequest,
} from 'providers/client/client-provider-types';
import {
  AUTH_SCOPE,
  CHARGING_ACTIONS,
  CHARGING_TAG_STAGING,
  GRANT_TYPES,
  GRAPHQL_REQUESTS,
  HTTP_REQUESTS,
  STORAGE,
  TRANSACTION_TYPE,
} from 'utils/constants';
import {gql} from '@apollo/client';
import {Advert} from 'providers/types/advert';
import {SessionAuthParams, TokenObject} from 'providers/types/auth';
import {ENDPOINTS} from 'providers/client/endpoints';
import {setObject} from 'utils/storage-utils';
import {fetchSecrets} from 'config/fetch-secrets';
import {useRestAPIClient} from 'providers/client/rest-api-client/rest-api-provider';
import {
  CPIDRequestParams,
  ChargePointAPIResponse,
  ChargePointPartialAPIResponse,
  ChargePointRequest,
  ChargepointTariff,
  ChargingGuideResponse,
  ChargingRequestParams,
  ChargingSessionAPIResponse,
  ChargingSessionMappedResponse,
  ChargingSessionRequest,
  ChargingpointTariffRequest,
  CheckChargingSessionRequest,
  CheckChargingSessionResponse,
  SessionListRequestParams,
  SessionListResponse,
  StartChargingResponse,
} from 'providers/types/charging';
import {mapConnectorType, mapSessionData} from '../utils';
const {CHARGING_SESSION_TOKEN} = STORAGE;

interface ChargingContextInterface {
  getSessionAdvert(): Promise<ApiResponse<Advert>>;
  getChargePoint(
    params: CPIDRequestParams,
  ): Promise<ApiResponse<ChargePointAPIResponse>>;
  startChargingSession(
    params: Partial<ChargingRequestParams>,
  ): Promise<ApiResponse<StartChargingResponse>>;
  stopChargingSession(
    params: Partial<ChargingRequestParams>,
  ): Promise<ApiResponse<StartChargingResponse>>;
  getChargepointTariff(
    params: ChargingpointTariffRequest,
  ): Promise<ApiResponse<ChargepointTariff>>;
  getCurrentChargingSession(
    params: ChargingSessionRequest,
  ): Promise<ApiResponse<ChargingSessionMappedResponse>>;
  getChargingSessionById(
    params: ChargingSessionRequest,
  ): Promise<ApiResponse<ChargingSessionMappedResponse>>;
  checkActiveSession(): Promise<ApiResponse<CheckChargingSessionResponse>>;
  getChargePointPartial(
    params: CPIDRequestParams,
  ): Promise<ApiResponse<ChargePointPartialAPIResponse[]>>;
  chargePoint: ChargePointAPIResponse | undefined;
  getSessionList(
    params: SessionListRequestParams,
  ): Promise<ApiResponse<SessionListResponse>>;
  getChargingGuides(): Promise<ApiResponse<ChargingGuideResponse[]>>;
}
// ** ** ** ** ** CREATE ** ** ** ** **
const ChargingContext = createContext<ChargingContextInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function useCharging() {
  const context = useContext(ChargingContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useCharging` hook must be used within a `ChargingContext` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function ChargingProvider({children}: ChildrenProps): JSX.Element {
  const {requestQuery, requestRest} = useClient();
  const {charging} = ENDPOINTS;
  const [chargePoint, setChargePoint] = useState<
    ChargePointAPIResponse | undefined
  >(undefined);

  //Get SessionAdvert
  const getSessionAdvert = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query Advert {
          advert {
            image
            url
            uuid
          }
        }
      `,
      variables: {},
      fetchPolicy: 'network-only',
      key: 'advert',
    };
    const response = await requestQuery<any>(queryParams);
    if (response?.success && response?.data.length) {
      response.data = response.data[0] as Advert;
    }
    return response;
  }, [requestQuery]);

  const getChargepointTariff = useCallback(
    async (
      params: ChargingpointTariffRequest,
    ): Promise<ApiResponse<ChargepointTariff>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.GET,
        path: `${charging.chargepointTariff}`,
        type: RequestTypes.JSON,
        params: {charging_point: params.charging_point},
      };
      const response = await requestRest(requestParams);

      if (response?.success && response?.data) {
        response.data = response.data as ChargepointTariff;
      }
      return response;
    },
    [charging.chargepointTariff, requestRest],
  );

  const startChargingSession = useCallback(
    async (params: Partial<ChargingRequestParams>) => {
      //start charging
      const updatedParams: ChargingRequestParams = {
        action: CHARGING_ACTIONS.START,
        chargepoint: params.chargepoint!,
        connector: params.connector!,
        transaction_type: TRANSACTION_TYPE.NEW,
        tag: params.tag!,
        emp_session_id: '',
      };
      const requestObject: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: charging.startChargingSession,
        type: RequestTypes.JSON,
        body: JSON.stringify(updatedParams),
      };
      const response = await requestRest(requestObject);
      if (response?.success && response?.data) {
        response.data = response.data as StartChargingResponse;
      }
      return response;
    },
    [charging.startChargingSession, requestRest],
  );

  const stopChargingSession = useCallback(
    async (params: Partial<ChargingRequestParams>) => {
      //start charging
      const updatedParams: ChargingRequestParams = {
        action: CHARGING_ACTIONS.STOP,
        chargepoint: params.chargepoint!,
        connector: params.connector!,
        transaction_type: TRANSACTION_TYPE.NEW,
        tag: params.tag!,
        emp_session_id: params.emp_session_id!,
      };

      const requestObject: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: charging.stopChargingSession,
        type: RequestTypes.JSON,
        body: JSON.stringify(updatedParams),
      };

      const response = await requestRest(requestObject);
      if (response?.success && response?.data) {
        response.data = response.data as StartChargingResponse; //Change this once we know what the response is for stopping charge session
      }
      return response;
    },
    [charging.stopChargingSession, requestRest],
  );

  //get charge point
  const getChargePoint = useCallback(
    async (params: ChargePointRequest) => {
      let fullQuery = '';
      const sharedQuery = `charging_type
      display_name
      manufacturer
      model
      open_247
      charge_point_connectors {
        max_charge_rate
        connector_type
        connector_state {
          chargepoint_id
          chargepoint_state_description
          chargepoint_state_id
          connector_id
          connector_state_description
          connector_state_id
          device_id
        }
      }`;

      if (params.chargepoint_id) {
        fullQuery = `
        query ChargePoint($chargepoint_id: String) {
          charge_point(where: {id: {_eq: $chargepoint_id}}) {
            ${sharedQuery}
          }
        }
        `;
      }
      if (params.display_name) {
        fullQuery = `
        query ChargePoint($display_name: String) {
          charge_point(where: {display_name: {_eq: $display_name}}) {
            ${sharedQuery}
          }
        }
        `;
      }
      const queryParams: ApolloAPIRequest = {
        method: GRAPHQL_REQUESTS.QUERY,
        query: gql`
          ${fullQuery}
        `,
        variables: {
          chargepoint_id: params.chargepoint_id,
          display_name: params.display_name,
        },
        fetchPolicy: 'network-only',
        key: 'charge_point',
      };
      const response = await requestQuery<any>(queryParams);

      let responseData: ApiResponse<ChargePointAPIResponse> = {
        success: response.success,
        error: response.error,
      };

      const tariffDetails = await getChargepointTariff({
        charging_point: params.chargepoint_id!,
      });

      if (response?.success && response?.data?.length > 0) {
        if (tariffDetails?.success && tariffDetails?.data?.data) {
          responseData = {
            ...responseData,
            data: {
              ...response.data,
              charge_point_tariff: tariffDetails?.data?.data,
            },
          };
        }
        if (response.data[0]?.charge_point_connectors) {
          const connectors = mapConnectorType(
            response.data[0].charge_point_connectors,
          );
          responseData = {
            ...responseData,
            data: {
              ...response.data[0],
              ...responseData.data,
              charge_point_connectors: connectors,
            },
          };
        }
      }

      if (responseData.data) {
        setChargePoint(responseData.data);
      }

      return responseData;
    },
    [getChargepointTariff, requestQuery, setChargePoint],
  );

  //get charge point
  const getChargePointPartial = useCallback(
    async (params: ChargePointRequest) => {
      let fullQuery = '';

      if (params.chargepoint_id) {
        fullQuery = `
          query ChargePoint($chargepoint_id: String) {
            charge_point(where: {id: {_like: $chargepoint_id}}) {
              site {
                site_id
                site_address_address_line1
                site_address_address_line2
                site_address_locality
                site_address_postal_code
                geo_coordinate
              }
              charging_type
              display_name
              manufacturer
              model
              open_247
              charge_point_connectors {
                connector_type
                connector_state {
                  chargepoint_state_description
                  connector_state_description
                }
              }
            }
          }
          `;
      }

      const queryParams: ApolloAPIRequest = {
        method: GRAPHQL_REQUESTS.QUERY,
        query: gql`
          ${fullQuery}
        `,
        variables: {
          chargepoint_id: `%${params.chargepoint_id}%`,
        },
        fetchPolicy: 'network-only',
        key: 'charge_point',
      };
      const response = await requestQuery<any>(queryParams);

      let responseData: ApiResponse<ChargePointAPIResponse[]> = {
        success: response.success,
        error: response.error,
      };

      if (response?.success && response?.data?.length > 0) {
        responseData = {
          ...responseData,
          data: response.data,
        };
      }

      return responseData;
    },
    [requestQuery],
  );

  const getCurrentChargingSession = useCallback(
    async (params: ChargingSessionRequest) => {
      const queryParams: ApolloAPIRequest = {
        method: GRAPHQL_REQUESTS.QUERY,
        query: gql`
          query Session($chargepoint_id: String) {
            sdr(
              where: {
                charging_point_id: {_eq: $chargepoint_id}
                state: {_eq: running}
              }
            ) {
              id
              state
              emp_session_id
              total: amount
              chargingStation: sdr_charge_point {
                id
                display_name
                model
                manufacturer
                site {
                  site_id
                  site_name
                  site_address_address_line1
                  site_address_address_line2
                  site_address_country_code
                  site_address_locality
                  site_address_organization
                  site_address_postal_code
                  whitelabel_domain
                }
              }
              startDateTime: start_time
              endDateTime: end_time
              sessionLength: duration
              totalEnergy: consum
              paymentMethod: transaction_type
              payment_id
              payment_status
              tarrif: price_description
              connector_id
              connectorType: sdr_connector {
                connector_type
                max_charge_rate
              }
              sdr_state {
                estimated_cost
                start_meter
                end_meter
                start_time
                updated_at
              }
            }
            user_info: flintstoneuser {
              paymentType: paymentfrequency
            }
          }
        `,
        fetchPolicy: 'network-only',
        variables: {
          chargepoint_id: params.chargepoint_id,
        },
      };
      const response: ApiResponse<ChargingSessionAPIResponse> =
        await requestQuery(queryParams);
      let mappedData: ApiResponse<ChargingSessionMappedResponse> = {
        success: response?.success,
        error: response?.error,
      };
      if (response?.success && response?.data) {
        const mappedResponse = mapSessionData(response.data);
        mappedData.data = mappedResponse;
      }
      return mappedData;
    },
    [requestQuery],
  );

  const getChargingSessionById = useCallback(
    async (params: ChargingSessionRequest) => {
      const queryParams: ApolloAPIRequest = {
        method: GRAPHQL_REQUESTS.QUERY,
        query: gql`
          query Session($chargepoint_id: String, $session_id: Int) {
            sdr(
              where: {
                charging_point_id: {_eq: $chargepoint_id}
                id: {_eq: $session_id}
              }
            ) {
              id
              state
              emp_session_id
              total: amount
              chargingStation: sdr_charge_point {
                id
                display_name
                model
                manufacturer
                site {
                  site_id
                  site_name
                  site_address_address_line1
                  site_address_address_line2
                  site_address_country_code
                  site_address_locality
                  site_address_organization
                  site_address_postal_code
                  whitelabel_domain
                }
              }
              startDateTime: start_time
              endDateTime: end_time
              sessionLength: duration
              totalEnergy: consum
              paymentMethod: transaction_type
              payment_id
              payment_status
              tarrif: price_description
              connector_id
              connectorType: sdr_connector {
                connector_type
                max_charge_rate
              }
            }
            user_info: flintstoneuser {
              paymentType: paymentfrequency
            }
          }
        `,
        fetchPolicy: 'network-only',
        variables: {
          chargepoint_id: params.chargepoint_id,
          session_id: params.session_id,
        },
      };
      const response: ApiResponse<ChargingSessionAPIResponse> =
        await requestQuery(queryParams);
      let mappedData: ApiResponse<ChargingSessionMappedResponse> = {
        success: response?.success,
        error: response?.error,
      };
      if (response?.success && response?.data) {
        const mappedResponse = mapSessionData(response.data);
        mappedData.data = mappedResponse;
      }
      return mappedData;
    },
    [requestQuery],
  );

  const checkActiveSession = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query checkActiveSession {
          sdr(where: {state: {_eq: running}}) {
            id
            emp_session_id
            connector_id
            charging_point_id
          }
        }
      `,
      fetchPolicy: 'network-only',
      variables: {},
    };

    const response: ApiResponse<ChargingSessionAPIResponse> =
      await requestQuery(queryParams);

    let mappedData: ApiResponse<CheckChargingSessionResponse> = {
      success: response?.success,
      error: response?.error,
    };
    if (response?.success && response?.data?.sdr?.length) {
      const session = response?.data?.sdr[0];
      mappedData.data = {
        connector_id: Number(session.connector_id),
        emp_session_id: session.emp_session_id,
        id: session.id,
        charging_point_id: session.charging_point_id,
      };
    }
    return mappedData;
  }, [requestQuery]);

  /**
   * Use this method to get / search / filter user session list
   */
  const getSessionList = useCallback(
    async (params: SessionListRequestParams) => {
      const {limit = 10, offset = 0} = params.pagination;
      const defaultQueryArgs = `
      limit: $limit
      offset: $offset
      order_by: { end_time: desc}
    `;
      let whereClause = ''; //Update this if the client wants us to by default filter out sessions where amount is 0
      if (params.charging_point_id) {
        whereClause += 'charging_point_id: {_ilike: $charging_point_id}';
      }
      if (params.filter) {
        if (params.filter.date_from && params.filter.date_to) {
          if (whereClause !== '') {
            whereClause += ',';
          }
          whereClause += `
          end_time: {
            _gte: $date_from
            _lte: $date_to
          }
        `;
        }

        if (params.filter.price_from && params.filter.price_to) {
          if (whereClause !== '') {
            whereClause += ',';
          }
          whereClause += `
          amount: {
            _gte: $price_from
            _lte: $price_to
          }
        `;
        }
      }
      const finalQuery =
        whereClause !== ''
          ? `${defaultQueryArgs} where: { ${whereClause}}`
          : `${defaultQueryArgs}`;
      const queryParams: ApolloAPIRequest = {
        method: GRAPHQL_REQUESTS.QUERY,
        query: gql`
          query getSessionList(
            $limit: Int,
            $offset: Int,
            $date_from: timestamptz, 
            $date_to: timestamptz,
            $price_from: numeric,
            $price_to: numeric,
            $charging_point_id: String 
          ) {
            sdr(${finalQuery}) {
              charging_point_id
              endDateTime: end_time
              total: amount
              id
            }
          }
        `,
        fetchPolicy: 'network-only',
        variables: {
          limit,
          offset,
          date_from: params.filter?.date_from,
          date_to: params.filter?.date_to,
          price_from: params.filter?.price_from,
          price_to: params.filter?.price_to,
          charging_point_id: `%${params.charging_point_id}%`,
        },
      };
      const response: ApiResponse<SessionListResponse> = await requestQuery(
        queryParams,
      );
      return response;
    },
    [requestQuery],
  );

  const getChargingGuides = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query Charging_guide {
          charging_guide {
            description
            id
            image
            language
            order_index
            title
          }
        }
      `,
      fetchPolicy: 'network-only',
      variables: {},
      key: 'charging_guide',
    };
    const response: ApiResponse<ChargingGuideResponse[]> = await requestQuery(
      queryParams,
    );
    return response;
  }, [requestQuery]);
  //Test chargepointSubscription
  // useEffect(() => {
  //   console.log({data: JSON.stringify(data), loading, error});
  // }, [data, loading, error]);
  // Test start charging session
  // useEffect(() => {
  //   getChargePoint({display_name: 'SEC21004 - STAFF USE ONLY'})
  //     .then(res => {
  //       console.log({res: JSON.stringify(res)});
  //       // console.log({success: res?.success, error: res?.error})
  //     })
  //     .catch(e => {
  //       console.log('errororor', e);
  //     });
  // });
  //   useEffect(() => {
  //   startChargingSession({
  //     "chargepoint": "DEV003",
  //     "connector": "1",
  //     "emp_session_id": "",
  // }).then(res=> {
  //     console.log({res:JSON.stringify(res)});
  //     // console.log({success: res?.success, error: res?.error})
  //   })
  //   .catch(e=>{
  //     console.log("errororor", e)
  //   })
  // })
  // useEffect(() => {
  //   getSessionList({
  //     pagination: {limit: 5, offset: 5},
  //     charging_point_id: 'DEV',
  //     filter: {
  //       date_from: '2023-12-18T16:19:24+00:00',
  //       date_to: '2023-12-22T13:36:53+00:00',
  //     },
  //   }).then((res)=> {
  //     console.log({res: JSON.stringify(res)})
  //   })
  // });
  // useEffect(() => {
  //   getChargingGuides().then(res => console.log({res: JSON.stringify(res)}));
  // });

  const values: ChargingContextInterface = useMemo(
    () => ({
      getSessionAdvert,
      startChargingSession,
      getChargePoint,
      stopChargingSession,
      getChargepointTariff,
      checkActiveSession,
      getCurrentChargingSession,
      getChargingSessionById,
      getChargePointPartial,
      getSessionList,
      getChargingGuides,
      chargePoint,
    }),
    [
      getSessionAdvert,
      startChargingSession,
      getChargePoint,
      stopChargingSession,
      getChargepointTariff,
      checkActiveSession,
      getCurrentChargingSession,
      getChargingSessionById,
      getChargePointPartial,
      getSessionList,
      getChargingGuides,
      chargePoint,
    ],
  );

  return (
    <ChargingContext.Provider value={values}>
      {children}
    </ChargingContext.Provider>
  );
}
