import {fetchSecrets} from 'config/fetch-secrets';

const {stripeClientId} = fetchSecrets();

// baseUrl is already set in restApiClient Provider
export const ENDPOINTS = {
  user: {
    createUser: 'create/user',
    createGuestUser: 'create/guest',
    verifyUser: 'verify/email',
    verifyResend: 'verify/resend',
    forgotPassword: 'forgot/password',
    resetPassword: 'reset/password',
    addressAutocomplete: 'autocomplete/address',
    getAddress: 'get/address',
    updateAppsettings: 'update/appsettings',
    updateUser: 'update/user',
    deleteUser: 'delete/user',
  },
  auth: {
    login: 'get/token',
    refreshToken: 'refresh/token',
    authInvoice: 'auth/invoice',
    authChargingSession: 'auth/chargingsession',
  },
  site: {
    getTariff: 'get/tariff',
    sitetariff: 'tariff_engine/get/tariff_description',
    createReview: 'create/rating',
    favourSite: 'favour/site',
  },
  charging: {
    startChargingSession: 'oauth/chargingsession/start',
    stopChargingSession: 'oauth/chargingsession/stop',
    chargepointTariff: 'tariff_engine/get/tariff_info',
  },
  payment: {
    sendInvoice: 'send/invoice/guest',
    setupIntent: 'stripe/create/setupintent',
    paymentIntent: 'stripe/create/paymentintent',
    stripeUrlScheme: ' https://link.scdevsolutions.uk',
    stripeReturnUrl: `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${stripeClientId}&scope=read_write&redirect_uri=https://link.scdevsolutions.uk/payment`,
  },
  vehicle: {
    createVehicle: 'create/vehicle',
    updateVehicle: 'update/vehicle',
    favourVehicle: 'favour/vehicle',
    deleteFavouriteVehicle: 'favour/vehicle',
    deleteVehicle: 'delete/vehicle',
    vehicleRegistration: 'vehicle_info/registration',
  },
};
