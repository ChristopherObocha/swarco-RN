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
import {HTTP_REQUESTS} from 'utils/constants';
import {
  BaseVehicle,
  BaseVehicleArray,
  GenericResponse,
  FavourVehicleResponse,
  VehicleColourResponse,
  VehicleId,
  VehicleInfoByRegistrationNumberResponse,
  VehicleMakeResponse,
  VehicleModelResponse,
  VehicleRegistrationRequest,
  vehicleModelRequest,
  UpdateVehicleRequest,
  CreateVehicleRequest,
  ColorOptionsArray,
  MakeOptionsArray,
  GetFavouriteVehicleIDResponse,
  FavouriteVehicle,
} from 'providers/types/vehicles';
import {ENDPOINTS} from 'providers/client/endpoints';
import {gql} from '@apollo/client';

interface VehicleContextInterface {
  getVehicles(): Promise<ApiResponse<any>>;
  getVehicleMakes(): Promise<ApiResponse<VehicleMakeResponse>>;
  getVehicleModels(
    params: vehicleModelRequest,
  ): Promise<ApiResponse<VehicleModelResponse>>;
  getVehicleColours(): Promise<ApiResponse<VehicleColourResponse>>;
  getVehicleRegistrationData(
    params: VehicleRegistrationRequest,
  ): Promise<ApiResponse<VehicleInfoByRegistrationNumberResponse>>;
  createVehicle(params: BaseVehicle): Promise<ApiResponse<VehicleId>>;
  updateVehicle(
    params: UpdateVehicleRequest,
  ): Promise<ApiResponse<GenericResponse>>;
  favourVehicle(params: VehicleId): Promise<ApiResponse<FavourVehicleResponse>>;
  deleteFavouriteVehicle(
    params: VehicleId,
  ): Promise<ApiResponse<FavourVehicleResponse>>;
  deleteVehicle(params: VehicleId): Promise<ApiResponse<GenericResponse>>;
  usersVehicles?: BaseVehicleArray;
  vehicleColors?: ColorOptionsArray;
  vehicleMakes?: MakeOptionsArray;
  getFavouriteVehicleIDs(): Promise<ApiResponse<GetFavouriteVehicleIDResponse>>;
  favouriteVehicleIDs: string[];
}
// ** ** ** ** ** CREATE ** ** ** ** **
const VehicleContext = createContext<VehicleContextInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function useVehicle() {
  const context = useContext(VehicleContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useVehicle` hook must be used within a `VehicleProvider` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function VehicleProvider({children}: ChildrenProps): JSX.Element {
  const {requestQuery, requestRest} = useClient();
  const {vehicle} = ENDPOINTS;
  const [usersVehicles, setUsersVehicles] = useState<BaseVehicleArray>();
  const [vehicleColors, setVehicleColors] = useState<ColorOptionsArray>();
  const [vehicleMakes, setVehicleMakes] = useState<MakeOptionsArray>();
  const [favouriteVehicleIDs, setFavouriteVehicleIDs] = useState<string[]>([]);
  // ** ** ** ** ** EFFECTS ** ** ** ** **
  useEffect(() => {
    if (!usersVehicles) {
      getVehicles();
    }
    if (!vehicleColors) {
      getVehicleColours();
    }
    if (!vehicleMakes) {
      getVehicleMakes();
    }
  }, []);

  // const transformArray = (arg1: any[]) => {
  //   arg1.map({item}: any) => {
  //       label: item,
  //       value: item.toLowerCase(), // You can customize the value property if needed
  //     }
  // };

  /**
   * @description Get all vehicle makes to populate the vehicle make dropdown
   */
  const getVehicleMakes = useCallback(async (): Promise<
    ApiResponse<VehicleMakeResponse>
  > => {
    const queryParams: ApolloAPIRequest = {
      query: gql`
        query Ev_database {
          ev_database(distinct_on: vehicle_make) {
            vehicle_make
          }
        }
      `,
      fetchPolicy: 'cache-and-network',
    };
    const response = await requestQuery<VehicleMakeResponse>(queryParams);

    //@ts-ignore
    const transformedMakes = (response?.data?.ev_database || []).map(
      ({vehicle_make}: vehicleModelRequest) => ({
        label: vehicle_make,
        value: vehicle_make,
        // You can customize the value property if needed
      }),
    );
    setVehicleMakes(transformedMakes);
    return response;
  }, [requestQuery]);

  /**
   * @description Get all vehicle models to populate the vehicle model dropdown when a vehicle make is selected
   * @param vehicleModelRequest
   */
  const getVehicleModels = useCallback(
    async (
      params: vehicleModelRequest,
    ): Promise<ApiResponse<VehicleModelResponse>> => {
      const queryParams: ApolloAPIRequest = {
        query: gql`
          query Ev_database($vehicle_make: String!) {
            ev_database(where: {vehicle_make: {_eq: $vehicle_make}}) {
              vehicle_model
            }
          }
        `,
        fetchPolicy: 'cache-and-network',
        variables: {
          vehicle_make: params.vehicle_make,
        },
      };
      const response = await requestQuery<VehicleModelResponse>(queryParams);
      return response;
    },
    [requestQuery],
  );
  /**
   * @description Get all vehicle colours to populate the vehicle colour dropdown
   */
  const getVehicleColours = useCallback(async (): Promise<
    ApiResponse<VehicleColourResponse>
  > => {
    const queryParams: ApolloAPIRequest = {
      query: gql`
        query VehicleColours {
          vehicle_colours {
            colour
          }
        }
      `,
      fetchPolicy: 'cache-first', //Using cache first because the colours are not expected to change often
    };
    const response = await requestQuery<VehicleColourResponse>(queryParams);

    //@ts-ignore
    const transformedArray = response?.data?.vehicle_colours.map(
      ({colour}: any) => ({
        label: colour,
        value: colour,
      }),
    );

    // console.log(`response -> ${JSON.stringify(transformedArray, null, 2)}`);
    setVehicleColors(transformedArray);
    return response;
  }, [requestQuery]);

  /**
   * @description Get vehicle registration data when a vehicle registration number is entered
   * @param VehicleRegistrationRequest
   */
  const getVehicleRegistrationData = useCallback(
    async (
      params: VehicleRegistrationRequest,
    ): Promise<ApiResponse<VehicleInfoByRegistrationNumberResponse>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.GET,
        path: `${vehicle.vehicleRegistration}/${params.registrationNumber}`,
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      return response;
    },
    [requestRest],
  );
  //Commented out this logic until vehicle fields are finalized
  const createVehicle = useCallback(
    async (params: CreateVehicleRequest): Promise<ApiResponse<VehicleId>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: vehicle.createVehicle,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      console.log(
        `${requestParams.method} - ${requestParams.path} - Success:`,
        response.success,
      );
      return response;
    },
    [requestRest],
  );

  const updateVehicle = useCallback(
    async (
      params: UpdateVehicleRequest,
    ): Promise<ApiResponse<GenericResponse>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.PUT,
        path: vehicle.updateVehicle,
        body: JSON.stringify(params),
        type: RequestTypes.JSON,
      };
      const response = await requestRest(requestParams);
      console.log(
        `${requestParams.method} - ${requestParams.path} - Success:`,
        response.success,
      );
      return response;
    },
    [requestRest],
  );

  const favourVehicle = useCallback(
    async (params: VehicleId): Promise<ApiResponse<FavourVehicleResponse>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.POST,
        path: vehicle.favourVehicle,
        body: JSON.stringify({vehicle_id: params}),
        type: RequestTypes.JSON,
      };
      const response: ApiResponse<FavourVehicleResponse> = await requestRest(
        requestParams,
      );
      return response;
    },
    [requestRest],
  );

  const deleteFavouriteVehicle = useCallback(
    async (params: VehicleId): Promise<ApiResponse<FavourVehicleResponse>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.DELETE,
        path: vehicle.deleteFavouriteVehicle,
        body: JSON.stringify({vehicle_id: params}),
        type: RequestTypes.JSON,
      };
      const response: ApiResponse<FavourVehicleResponse> = await requestRest(
        requestParams,
      );
      return response;
    },
    [requestRest],
  );

  const deleteVehicle = useCallback(
    async (params: VehicleId): Promise<ApiResponse<GenericResponse>> => {
      const requestParams: RestAPIRequest = {
        method: HTTP_REQUESTS.DELETE,
        path: vehicle.deleteVehicle,
        body: JSON.stringify({vehicle_id: params}),
        type: RequestTypes.JSON,
      };
      const response: ApiResponse<GenericResponse> = await requestRest(
        requestParams,
      );
      return response;
    },
    [requestRest, vehicle.deleteVehicle],
  );

  const getVehicles = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      query: gql`
        query User_vehicle_relationship {
          user_vehicle_relationship {
            vehicle_id
            vehicle {
              model
              make
              insurance_provider
              colour
              registration_number
              taxi_number
              year_of_vehicle_manufacture
              plug_type
            }
          }
        }
      `,
      fetchPolicy: 'cache-first', //Using cache first because the colours are not expected to change often
    };
    const response = await requestQuery<any>(queryParams); //TODO: assign type

    setUsersVehicles(response?.data?.user_vehicle_relationship);
    return response;
  }, []);

  const getFavouriteVehicleIDs = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      query: gql`
        query Favourite_vehicles {
          favourite_vehicles {
            vehicle_id
          }
        }
      `,
      fetchPolicy: 'cache-first', //Using cache first because the colours are not expected to change often
    };
    const response = await requestQuery<{
      favourite_vehicles: FavouriteVehicle[];
    }>(queryParams);

    const vehicleIDs: string[] = [];
    if (response?.data?.favourite_vehicles?.length) {
      response.data.favourite_vehicles.forEach(({vehicle_id}) => {
        vehicleIDs.push(vehicle_id);
      });
    }

    setFavouriteVehicleIDs(vehicleIDs);

    return response;
  }, []);

  // useEffect(() => {
  //   deleteVehicle({vehicle_id: 'a33dc83b-39c8-4d9a-b0f3-d43da2842357'})
  //     .then(res => {
  //       console.log({res: JSON.stringify(res)});
  //       // console.log({success: res?.success, error: res?.error})
  //     })
  //     .catch(e => {
  //       console.log('errororor', e);
  //     });
  // });

  // useEffect(() => {
  //   getVehicleColours()
  //     .then(res => {
  //       console.log({res: JSON.stringify(res)});
  //       // console.log({success: res?.success, error: res?.error})
  //     })
  //     .catch(e => {
  //       console.log('errororor', e);
  //     });
  // });
  //   useEffect(() => {
  //   getVehicleRegistrationData({registrationNumber: 'LB73AEG'})
  //     .then(res => {
  //       console.log({res: JSON.stringify(res)});
  //       // console.log({success: res?.success, error: res?.error})
  //     })
  //     .catch(e => {
  //       console.log('errororor', e);
  //     });
  // });
  // useEffect(() => {
  //   updateVehicle({vehicle_id: "ec13b765-1a3f-4851-b8a6-1d13549ccf72",colour: "Black",year_of_vehicle_manufacture: 1985})
  //   .then(res => console.log({res:JSON.stringify(res)}) )
  // })
  const values: VehicleContextInterface = useMemo(
    () => ({
      getVehicles,
      getVehicleMakes,
      getVehicleModels,
      getVehicleColours,
      getVehicleRegistrationData,
      createVehicle,
      updateVehicle,
      favourVehicle,
      deleteFavouriteVehicle,
      deleteVehicle,
      usersVehicles,
      vehicleColors,
      vehicleMakes,
      getFavouriteVehicleIDs,
      favouriteVehicleIDs,
    }),
    [
      getVehicles,
      getVehicleMakes,
      getVehicleModels,
      getVehicleColours,
      getVehicleRegistrationData,
      createVehicle,
      updateVehicle,
      favourVehicle,
      deleteFavouriteVehicle,
      deleteVehicle,
      usersVehicles,
      vehicleColors,
      vehicleMakes,
      getFavouriteVehicleIDs,
      favouriteVehicleIDs,
    ],
  );

  return (
    <VehicleContext.Provider value={values}>{children}</VehicleContext.Provider>
  );
}
