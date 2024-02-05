import {SESSION_TYPES, STORAGE, TOKEN_TYPES} from 'utils/constants';
import {TokenObject} from 'providers/types/auth';
import {getObject} from 'utils/storage-utils';

/**
 * Retrieve token (refresh or access) from storage
 * @param type
 * @returns string | undefined
 */
export const getToken = (type: TOKEN_TYPES): string | undefined => {
  const storedToken = getObject<TokenObject>(STORAGE.TOKEN);
  const guestToken = getObject<TokenObject>(STORAGE.GUEST_TOKEN);

  const token = storedToken ? storedToken : guestToken;

  if (token) {
    if (type === TOKEN_TYPES.ACCESS_TOKEN) {
      return token.access_token;
    }
    if (type === TOKEN_TYPES.REFRESH_TOKEN) {
      return token.refresh_token;
    }
  } else {
    return undefined;
  }
};
/**
 * Retrieve tokens for sending invoice or starting charging session
 * @param type
 * @param session_type
 * @returns
 */
export const getSessionToken = (
  type: TOKEN_TYPES,
  session_type: SESSION_TYPES,
): string | undefined => {
  const storedToken =
    session_type == SESSION_TYPES.CHARGING
      ? getObject<TokenObject>(STORAGE.CHARGING_SESSION_TOKEN)
      : getObject<TokenObject>(STORAGE.INVOICE_SESSION_TOKEN);
  if (storedToken) {
    if (type === TOKEN_TYPES.ACCESS_TOKEN) {
      return storedToken.access_token;
    }
    if (type === TOKEN_TYPES.REFRESH_TOKEN) {
      return storedToken.refresh_token;
    }
  } else {
    return undefined;
  }
};
