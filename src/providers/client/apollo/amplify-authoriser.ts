/*
 * Jira Ticket:
 * Created Date: Tue, 22nd Aug 2023, 11:06:00 am
 * Author: Nawaf Ibrahim
 * Email: nawaf.ibrahim@thedistance.co.uk
 * Copyright (c) 2023 The Distance
 */

import {Auth} from 'aws-amplify';
import {subMinutes} from 'date-fns';

/*
 * Alter this function to add authorisation to apollo endpoint.
 *
 * This file is designed to add a bearer token to 'Authorization' header
 */

export async function Authoriser() {
  // Get Current User Session &  JWT Token
  const cognitoUser = await Auth.currentAuthenticatedUser().catch(() => {
    return null;
  });
  if (!cognitoUser) {
    // No Authorization
    return null;
  }
  // Refresh Token if Expired
  const expirationDate =
    cognitoUser.signInUserSession.idToken.payload.exp * 1000;
  if (subMinutes(new Date(expirationDate), 15) < new Date()) {
    const currentSession = await Auth.currentSession();
    return cognitoUser.refreshSession(
      currentSession.getRefreshToken,
      (err: any, session: any) => {
        if (err) {
          // Return no authorization for error
          return null;
        } else {
          const {idToken} = session;
          // return new token
          return idToken.jwtToken;
        }
      },
    );
  }

  // return current token
  return cognitoUser.signInUserSession.idToken.jwtToken;
}
