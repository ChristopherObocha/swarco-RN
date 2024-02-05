export type UserCreateParams = {
  email: string;
  address1?: string;
  address2?: string;
  address3?: string;
  country?: string;
  county?: string;
  postcode?: string;
  credentials?: string;
  dateofbirth: string;
  donationsoptin?: string;
  familyname?: string;
  firstname: string;
  givenname?: string;
  lastname: string;
  marketingmaterials?: boolean;
  middlename?: string;
  password: string;
  paymentprovider?: string;
  phonenumber: string;
  registrationstatus?: string;
  requestedrfid?: string;
  title?: string;
  town?: string;
  vehicle?: string;
};

export type UserUpdateParams = {
  email?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  country?: string;
  county?: string;
  postcode?: string;
  credentials?: string;
  dateofbirth?: string;
  donationsoptin?: string;
  familyname?: string;
  firstname?: string;
  givenname?: string;
  lastname?: string;
  marketingmaterials?: boolean;
  marketingtext?: boolean;
  marketingemail?: boolean;
  middlename?: string;
  password?: string;
  paymentprovider?: string;
  phonenumber?: string;
  registrationstatus?: string;
  requestedrfid?: string;
  title?: string;
  town?: string;
  vehicle?: string;
};

export type GuestUserCreateParams = {
  username: string;
  password: string;
};

export type GuestUserCreateResponse = {
  response: string;
  generated_username: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  code: number;
  password: string;
  email: string;
};

export type VerifyUserParams = {
  verification_code: string;
};

export type VerificationResendParams = {
  email: string;
};
export type DefaultSuccessResponse = {
  success: boolean;
};

export type UserProfile = {
  email: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  dateofbirth: string;
  emailverified: boolean;
  flintstoneuser_rfids?: [CardTag];
  paymentprovider?: string;
  cardtag?: string;
  address1?: string;
  address2?: string;
  town?: string;
  postcode?: string;
  marketingemail?: boolean;
  marketingtext?: boolean;
};

type CardTag = {
  uid?: string;
};
export type AddressAutoCompleteRequestParams = {
  input: string;
};

export type AddressRequestParams = {
  id: string;
};

export type AddressAutoCompleteResponse = {
  id: string;
  address: string;
  url?: string;
};

export type Address = {
  postcode?: string;
  latitude?: Number;
  longitude?: Number;
  formattedAddress?: [string];
  building_name?: string;
  building_number?: string;
  line_1: string;
  line_2?: string;
  line_3?: string;
  line_4?: string;
  town_or_city?: string;
  county?: string;
  country?: string;
  residential?: string;
};

export type AppSettings = {
  advertNotifications?: boolean;
  analytics?: boolean;
  chargingNotifications?: boolean;
  errorReports?: boolean;
  location?: boolean;
  locationNotifications?: boolean;
  paymentNotifications?: boolean;
  tariffNotifications?: boolean;
};

export type ChargingGuideItem = {
  id: string;
  image: string;
  order_index: number;
  title: string;
  description: string;
};
