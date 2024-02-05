export interface VehicleId {
  vehicle_id?: string;
}

interface OptionalVehicleFields {
  year_of_vehicle_manufacture?: number;
  taxi_number?: string;
  plug_type?: string;
}
// This can be used as create vehicle request parameter and also as base vehicle response
export interface BaseVehicle extends VehicleId, OptionalVehicleFields {
  __typename?: string;
  vehicle_id?: string;
  vehicle?: {
    __typename?: string;
    model: string;
    make: string;
    insurance_provider?: string;
    colour: string;
    registration_number: string;
    taxi_number?: string;
    year_of_vehicle_manufacture?: number;
  }[];
}

export type BaseVehicleArray = BaseVehicle[];

export interface UpdateVehicleRequest extends VehicleId, OptionalVehicleFields {
  vehicle_id: string;
  registration_number?: string;
  model?: string;
  make?: string;
  colour?: string;
  insurance_provider?: string;
}

export interface CreateVehicleRequest extends VehicleId, OptionalVehicleFields {
  registration_number?: string;
  model?: string;
  make?: string;
  colour?: string;
  insurance_provider?: string;
  taxi_number?: string;
  year_of_vehicle_manufacture?: number;
}

export type FavourVehicleResponse = {
  success: boolean;
  status_code: number;
  message: string;
  favourite_vehicle?: string | string[]; // This is an array of vehicle ids or a single vehicle id
};

export interface FavouriteVehicle {
  vehicle_id: string;
}

export interface GetFavouriteVehicleIDResponse {
  favourite_vehicles?: FavouriteVehicle[]; // This is an array of vehicle ids or a single vehicle id
}

export interface UserVehiclesResponse extends VehicleId {
  vehicle?: BaseVehicle[];
}

export type GenericResponse = {
  response: string;
};

export interface CreateVehicleResponse extends VehicleId {}
export interface FavourVehicleRequest extends VehicleId {}
export interface DeleteVehicleRequest extends VehicleId {}

export interface VehicleMakeResponse {
  data: {
    ev_database: {
      vehicle_make: string;
    }[];
  };
}

export interface VehicleMakeObject {
  label: string;
  value: string;
}

export type vehicleModelRequest = {
  vehicle_make: string;
};
export interface VehicleModelResponse {
  ev_database: [
    {
      vehicle_model: string;
    },
  ];
}

export interface VehicleColourResponse {
  vehicle_colours: {
    colour: string;
  }[];
}

export interface ColorOption {
  label: string;
  value: string;
}

export type ColorOptionsArray = ColorOption[];

export interface MakeOption {
  label: string;
  value: string;
}

export type MakeOptionsArray = ColorOption[];

export type VehicleRegistrationRequest = {
  registrationNumber: string;
};

export interface VehicleInfoByRegistrationNumberResponse {
  registration_number: string;
  make: string;
  model: string;
  colour: string;
  year_of_manufacture: string;
  fuel_type: string;
}
