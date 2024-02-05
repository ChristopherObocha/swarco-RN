import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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
  ACCESS_TYPES_MAP,
  DISPLAY_CATEGORIES,
  GRAPHQL_REQUESTS,
  HTTP_REQUESTS,
} from 'utils/constants';
import {gql, useQuery} from '@apollo/client';
import {
  SiteTariff,
  SiteRequestParams,
  Support,
  MapSiteFilterResponse,
  RadiusSearchpParams,
  SiteByCPIDAPIResponse,
  MappedSiteResponse,
  SiteAPIResponse,
  BaseSite,
  AccessTypes,
  FavourSiteRequest,
  FavourSiteResponse,
  FavouriteSitesAPIResponse,
  FavouriteSitesResponse,
  createReviewParams,
  ReviewAPIResponse,
  MappedRadiusSiteResponse,
} from 'providers/types/site';
import {ENDPOINTS} from 'providers/client/endpoints';
import {
  mapSiteFilterData,
  parseTaxonomyIdToName,
  mapSiteChargePoints,
  mapConnectorType,
} from '../utils';
import {CPIDRequestParams} from 'providers/types/charging';
import {a} from 'aws-amplify';

interface SiteContextInterface {
  getSupport(): Promise<ApiResponse<Support>>;
  getSiteFilters(): Promise<ApiResponse<MapSiteFilterResponse>>;
  getSiteDetails(
    params: SiteRequestParams,
  ): Promise<ApiResponse<MappedSiteResponse>>;
  siteRadiusSearch(
    params: RadiusSearchpParams,
  ): Promise<ApiResponse<MappedRadiusSiteResponse[]>>;
  siteResponse: MappedSiteResponse | null;
  getSiteByCPID(
    params: CPIDRequestParams,
  ): Promise<ApiResponse<SiteByCPIDAPIResponse>>;
  favourSite(
    params: FavourSiteRequest,
  ): Promise<ApiResponse<FavourSiteResponse>>;
  deleteFavouriteSite(
    params: FavourSiteRequest,
  ): Promise<ApiResponse<FavourSiteResponse>>;
  getFavouriteSites(): Promise<ApiResponse<FavouriteSitesResponse>>;
  submitSiteReview(
    params: createReviewParams,
  ): Promise<ApiResponse<ReviewAPIResponse>>;
}
// ** ** ** ** ** CREATE ** ** ** ** **
const SiteContext = createContext<SiteContextInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useSite` hook must be used within a `SiteContext` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function SiteProvider({children}: ChildrenProps): JSX.Element {
  const {requestQuery, requestRest} = useClient();
  const {site} = ENDPOINTS;
  const [siteResponse, setSiteResponse] = useState<MappedSiteResponse | null>(
    null,
  );
  const siteQuery = `
  UUID
  open_24_7
  site_address_address_line1
  site_address_address_line2
  site_address_administrative_area
  site_address_country_code
  site_address_locality
  site_address_postal_code
  site_name
  site_id
  site_what3words
  geo_coordinate
  whitelabel_domain
  access_types {
    access_type_enum {
        description
    }
  }
  display_categories {
      display_category_enum {
        value
        description
      }
  }
  networkProvider: operator_information_mapping {
    operator_details
    operator_id
  }
  charge_point_opening_times {
    day
    endhours
    starthours
  }
  site_images {
    site_image_url
  }
  site_charge_points {
    charging_type
    display_name
    manufacturer
    model
    open_247
    charge_point_connectors {
      max_charge_rate
      connector_type
      connector_key
      connector_state {
          chargepoint_id
          chargepoint_state_description
          chargepoint_state_id
          connector_id
          connector_state_description
          connector_state_id
          device_id
      }
    }
    charge_point_state {
      chargepoint_state_id
      connector_state_id
      chargepoint_state_description
      connector_state_description
    }
    get_model {
      description
      value
    }
  }
  taxonomy_mapping(
    where: {
      taxonomy_tid_to_name: {
        type: {
          _in: [
            "location_details"
            "payment_methods"
            "site_facility"
          ]
        }
      }
    }
  ) {
    taxonomy_tid_to_name {
      name
      type
    }
  }`;
  //Get SessionAdvert
  const getSupport = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query Support {
          support {
            email
            is_supported
            phone
            uuid
            support_socials {
              type
              url
            }
          }
        }
      `,
      variables: {},
      fetchPolicy: 'network-only',
      key: 'support',
    };
    const response = await requestQuery<any>(queryParams);
    if (response?.success && response?.data?.length) {
      response.data = response.data[0] as Support;
    }
    return response;
  }, [requestQuery]);

  const getSiteTariff = useCallback(
    async (params: SiteRequestParams): Promise<ApiResponse<SiteTariff>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: `${site.sitetariff}`,
        type: RequestTypes.JSON,
        params: {site_id: params.site_id},
      };
      const response = await requestRest(requestParams);

      if (response?.success && response?.data) {
        response.data = response.data as SiteTariff;
      }
      return response;
    },
    [requestRest],
  );

  //Get Site filter
  const getSiteFilters = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query SiteFilters {
          site_taxonomies {
            name
            type
          }
          operator_information {
            operator_details
            operator_id
          }
          connector_type {
            description
            value
          }
          access_type_enum {
            description
            value
          }
        }
      `,
      fetchPolicy: 'network-only',
    };
    const response = await requestQuery<any>(queryParams);
    if (response?.success && response?.data) {
      response.data = mapSiteFilterData(response.data) as MapSiteFilterResponse;
    }
    return response;
  }, [requestQuery]);

  const getSiteDetails = useCallback(
    async (
      params: SiteRequestParams,
    ): Promise<ApiResponse<MappedSiteResponse>> => {
      const queryParams: ApolloAPIRequest = {
        method: GRAPHQL_REQUESTS.QUERY,
        query: gql`
          query Site($site_id: Int) {
            site(where: {site_id: {_eq: $site_id}}) { ${siteQuery}}
          }
        `,
        fetchPolicy: 'network-only',
        variables: {
          site_id: params.site_id,
        },
        key: 'site',
      };
      const siteDetail = await requestQuery<SiteAPIResponse[]>(queryParams);
      let tariffDetails = await getSiteTariff({site_id: params.site_id});
      let responseData: ApiResponse<MappedSiteResponse> = {
        success: siteDetail?.success,
        error: siteDetail.error,
      };

      if (siteDetail?.success && siteDetail.data?.length) {
        responseData = {
          ...responseData,
          data: {
            ...(siteDetail.data[0] as BaseSite),
          },
        };
        if (tariffDetails?.success && tariffDetails?.data?.data) {
          responseData = {
            ...responseData,
            data: {
              ...responseData.data,
              site_tariff: tariffDetails.data,
            },
          };
        }
        if (siteDetail.data[0]?.taxonomy_mapping?.length) {
          const locations = parseTaxonomyIdToName(
            siteDetail.data[0].taxonomy_mapping,
          )?.siteLocations;

          const paymentMethods = parseTaxonomyIdToName(
            siteDetail.data[0].taxonomy_mapping,
          )?.sitePaymentMethods;

          const siteFacilities = parseTaxonomyIdToName(
            siteDetail.data[0].taxonomy_mapping,
          )?.siteFacilities;
          responseData = {
            ...responseData,
            data: {
              ...responseData.data,
              location_details: locations,
              site_facility: siteFacilities,
              payment_methods: paymentMethods,
            },
          };
        }

        if (siteDetail.data[0]?.networkProvider) {
          responseData = {
            ...responseData,
            data: {
              ...responseData.data,
              network_provider: {
                operator_details:
                  siteDetail.data[0]?.networkProvider?.operator_details,
                operator_id: siteDetail.data[0]?.networkProvider?.operator_id,
              },
            },
          };
        }
        if (siteDetail.data[0]?.access_types) {
          const mappedAccessTypes = siteDetail.data[0]?.access_types?.map(
            access_type => access_type?.access_type_enum?.description,
          );
          const access_types_map = mappedAccessTypes.map(type => {
            const mapped = ACCESS_TYPES_MAP.filter(access_type => {
              return access_type.value == type;
            });
            return mapped[0];
          });
          if (access_types_map.length) {
            responseData = {
              ...responseData,
              data: {
                ...responseData.data,
                access_types: access_types_map,
              },
            };
          }
        }

        if (siteDetail.data[0]?.site_charge_points?.length) {
          const siteChargePoints = mapSiteChargePoints(
            siteDetail.data[0].site_charge_points,
          );
          responseData = {
            ...responseData,
            // ...siteDetail.data[0],
            data: {
              ...responseData.data,
              site_charge_points: siteChargePoints,
            },
          };
        }
      }

      if (responseData?.success && responseData?.data) {
        setSiteResponse(responseData.data);
      }
      return responseData;
    },
    [requestQuery],
  );

  const siteRadiusSearch = useCallback(
    async (
      params: RadiusSearchpParams,
    ): Promise<ApiResponse<MappedRadiusSiteResponse[]>> => {
      const queryParams: ApolloAPIRequest = {
        method: GRAPHQL_REQUESTS.QUERY,
        query: gql`
          query searchsites($long: float8, $lat: float8, $bound: Int) {
            radiussearch_sites(args: {lat: $lat, long: $long, bound: $bound}) {
              UUID
              site_id
              geo_coordinate
              access_types {
                access_type_enum {
                  description
                }
              }
              display_categories {
                display_category_enum {
                  value
                  description
                }
              }
              networkProvider: operator_information_mapping {
                operator_details
                operator_id
              }
              site_charge_points {
                charging_type
                display_name
                manufacturer
                model
                open_247
                charge_point_connectors {
                  max_charge_rate
                  connector_type
                  connector_key
                  connector_state {
                    chargepoint_id
                    chargepoint_state_description
                    chargepoint_state_id
                    connector_id
                    connector_state_description
                    connector_state_id
                    device_id
                  }
                }
                charge_point_state {
                  chargepoint_state_id
                  connector_state_id
                  chargepoint_state_description
                  connector_state_description
                }
                get_model {
                  description
                  value
                }
              }
              taxonomy_mapping(
                where: {
                  taxonomy_tid_to_name: {
                    type: {
                      _in: [
                        "location_details"
                        "payment_methods"
                        "site_facility"
                      ]
                    }
                  }
                }
              ) {
                taxonomy_tid_to_name {
                  name
                  type
                }
              }
            }
          }
        `,
        fetchPolicy: 'network-only',
        variables: {
          long: params.long,
          lat: params.lat,
          bound: params.bound,
        },
        key: 'radiussearch_sites',
      };
      const siteDetail = await requestQuery<any>(queryParams);
      let responseData: ApiResponse<MappedRadiusSiteResponse[]> = {
        success: siteDetail?.success,
        error: siteDetail.error,
      };
      let data: MappedRadiusSiteResponse[] = [];
      if (siteDetail?.success && siteDetail.data?.length > 0) {
        siteDetail.data.map((site: SiteAPIResponse) => {
          let mappedSite: MappedRadiusSiteResponse = {
            ...(site as BaseSite),
          };

          if (site?.site_charge_points?.length) {
            const siteChargePoints = mapSiteChargePoints(
              site.site_charge_points,
            );
            mappedSite = {
              ...mappedSite,
              site_charge_points: siteChargePoints,
            };
          }

          if (site?.display_categories) {
            const mappedCategory = site.display_categories?.map(category => {
              return {
                value: category.display_category_enum.value,
                description: category.display_category_enum.description,
                icon: DISPLAY_CATEGORIES[category.display_category_enum.value]
                  .icon,
              };
            })[0];

            mappedSite = {
              ...mappedSite,
              site_type: mappedCategory,
            };
          }
          data.push(mappedSite);
        });
      }
      responseData.data = data;

      return responseData;
    },
    [useQuery],
  );

  const getSiteByCPID = useCallback(
    async (params: CPIDRequestParams) => {
      const queryParams: ApolloAPIRequest = {
        method: GRAPHQL_REQUESTS.QUERY,
        query: gql`
          query ChargePoint($chargepoint_id: String) {
            charge_point(where: {id: {_eq: $chargepoint_id}}) {
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
              }
              site {
                UUID
                access_types {
                  access_type_enum {
                    description
                  }
                }
                open_24_7
                site_address_address_line1
                site_address_address_line2
                site_address_administrative_area
                site_address_country_code
                site_address_locality
                site_address_postal_code
                site_name
                site_id
                geo_coordinate
                site_what3words
                networkProvider: operator_information_mapping {
                  operator_details
                }
                charge_point_opening_times {
                  day
                  endhours
                  starthours
                }
                taxonomy_mapping(
                  where: {
                    taxonomy_tid_to_name: {
                      type: {
                        _in: [
                          "location_details"
                          "payment_methods"
                          "site_facility"
                        ]
                      }
                    }
                  }
                ) {
                  taxonomy_tid_to_name {
                    name
                    type
                  }
                }
              }
            }
          }
        `,
        variables: {chargepoint_id: params.chargepoint_id},
        fetchPolicy: 'network-only',
        key: 'charge_point',
      };
      const response = await requestQuery<any>(queryParams);
      let responseData: ApiResponse<SiteByCPIDAPIResponse> = {
        success: response?.success,
        error: response?.error,
      };
      if (response?.success && response?.data?.length > 0) {
        responseData = {
          ...responseData,
          data: {
            ...response.data[0],
          },
        };
        if (response.data[0]?.charge_point_connectors) {
          const connectors = mapConnectorType(
            response.data[0].charge_point_connectors,
          );

          responseData = {
            ...responseData,
            data: {
              ...responseData.data,
              charge_point_connectors: connectors,
            },
          };
        }
        if (response.data[0]?.site?.taxonomy_mapping?.length > 0) {
          const locations = parseTaxonomyIdToName(
            response.data[0].site.taxonomy_mapping,
          )?.siteLocations;

          const paymentMethods = parseTaxonomyIdToName(
            response.data[0].site.taxonomy_mapping,
          )?.sitePaymentMethods;

          const siteFacilities = parseTaxonomyIdToName(
            response.data[0].site.taxonomy_mapping,
          )?.siteFacilities;
          responseData = {
            ...responseData,
            data: {
              ...responseData.data,
              site: {
                ...response.data[0].site,
                location_details: locations,
                site_facility: siteFacilities,
                payment_methods: paymentMethods,
              },
            },
          };
        }
        if (response.data[0]?.site?.access_types) {
          const mappedAccessTypes = response.data[0]?.site?.access_types?.map(
            (access_type: AccessTypes) =>
              access_type?.access_type_enum?.description,
          );
          const access_types_map = mappedAccessTypes.map((type: string) => {
            const mapped = ACCESS_TYPES_MAP.filter(access_type => {
              return access_type.value == type;
            });
            return mapped[0];
          });
          if (access_types_map.length) {
            responseData = {
              ...responseData,
              data: {
                ...responseData.data,
                site: {
                  ...response.data[0].site,
                  access_types: access_types_map,
                },
              },
            };
            responseData = {
              ...responseData,
              data: {
                ...responseData.data,
              },
            };
          }
        }
      }
      return responseData;
    },

    [requestQuery],
  );

  const favourSite = useCallback(
    async (
      params: FavourSiteRequest,
    ): Promise<ApiResponse<FavourSiteResponse>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: site.favourSite,
        type: RequestTypes.JSON,
        body: JSON.stringify(params),
      };
      const response: ApiResponse<FavourSiteResponse> = await requestRest(
        requestParams,
      );
      return response;
    },
    [requestRest],
  );

  const getFavouriteSites = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query FavouriteSites {
          favourite_sites {
            site {
              site_id
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
      // key: 'favourite_sites',
    };
    const response = await requestQuery<FavouriteSitesAPIResponse>(queryParams);
    const responseData: ApiResponse<FavouriteSitesResponse> = {
      success: response?.success,
      error: response?.error,
    };

    if (response?.success && response?.data?.favourite_sites?.length) {
      responseData.data = {
        sites: response.data.favourite_sites.map(site => {
          return site.site.site_id;
        }),
      };
    }
    return responseData;
  }, [requestQuery]);

  const deleteFavouriteSite = useCallback(
    async (
      params: FavourSiteRequest,
    ): Promise<ApiResponse<FavourSiteResponse>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.DELETE,
        path: site.favourSite,
        type: RequestTypes.JSON,
        body: JSON.stringify(params),
      };
      const response: ApiResponse<FavourSiteResponse> = await requestRest(
        requestParams,
      );
      return response;
    },
    [requestRest],
  );

  const submitSiteReview = useCallback(
    async (params: createReviewParams) => {
      //remapping site_uuid to site_id to avoid confusion
      const updatedParams = {
        ...params,
        site_id: params.site_uuid,
        site_uuid: undefined,
      };
      console.log('updatedParams', updatedParams);
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: site.createReview,
        type: RequestTypes.JSON,
        body: JSON.stringify(updatedParams),
      };
      const response: ApiResponse<ReviewAPIResponse> = await requestRest(
        requestParams,
      );
      return response;
    },
    [requestRest],
  );
  //Get Support
  // useEffect(() => {
  //   getSupport()
  //     .then(data => console.log(JSON.stringify(data)))
  //     .catch(e => console.log(e));
  // });
  // Test GetTariff
  // useEffect(() => {
  //   getSiteDetails({site_id: 2745523})
  //     .then(res => {
  //       console.log('get site dets', JSON.stringify(res));
  //     })
  //     .catch(e => {
  //       console.log('errororor', e);
  //     });
  // });

  //   useEffect(() => {
  //   getFavouriteSites()
  //   .then(res=> {
  //     console.log("sitefilters", JSON.stringify(res));
  //   })
  //   .catch(e=>{
  //     console.log("errororor", e);
  //   })
  // });

  // useEffect(() => {
  //   submitSiteReview({
  //     site_uuid: '770feb8e-1851-481d-858f-3611c556eec2',
  //     rating: 5,
  //     language: 'en',
  //   })
  //     .then(res => {
  //       console.log('sitefilters', JSON.stringify(res));
  //     })
  //     .catch(e => {
  //       console.log('errororor', e);
  //     });
  // });

  // Test Radius search
  // useEffect(() => {
  //   siteRadiusSearch({lat:53.4606 , long: -2.2871478, bound: 3000})
  //     .then(res => {
  //       console.log('radius search', JSON.stringify(res.data));
  //     })
  //     .catch(e => {
  //       console.log('errororor', e);
  //     });
  // });

  // useEffect(() => {
  // getSiteByCPID({chargingpoint_id:"ARCHIVE52336"}).then(res=> {
  //   console.log({res:JSON.stringify(res)});
  //   // console.log({success: res?.success, error: res?.error})
  // })
  // .catch(e=>{
  //   console.log("errororor", e)
  // })
  // })

  // useEffect(() => {
  //   deleteFavouriteSite({site_id: '02240f4c-b77b-44ad-b6c7-889ab62eb54c'})
  //     .then(res => {
  //       console.log({res: JSON.stringify(res)});
  //       // console.log({success: res?.success, error: res?.error})
  //     })
  //     .catch(e => {
  //       console.log('errororor', e);
  //     });
  // });

  const values: SiteContextInterface = useMemo(
    () => ({
      getSupport,
      getSiteFilters,
      getSiteByCPID,
      getSiteDetails,
      siteRadiusSearch,
      siteResponse,
      favourSite,
      deleteFavouriteSite,
      getFavouriteSites,
      submitSiteReview,
    }),
    [
      getSupport,
      getSiteFilters,
      getSiteDetails,
      siteRadiusSearch,
      getSiteByCPID,
      siteResponse,
      favourSite,
      deleteFavouriteSite,
      getFavouriteSites,
      submitSiteReview,
    ],
  );

  return <SiteContext.Provider value={values}>{children}</SiteContext.Provider>;
}
