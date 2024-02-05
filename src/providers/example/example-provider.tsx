/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Fri, 14th Jan 2022, 10:17:35 am
 * Author: Harry Crank (harry.crank@thedistance.co.uk)
 * Copyright (c) 2022 The Distance
 */

import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {ChildrenProps} from '../../generic-types';
import {useClient} from 'providers/client/client-provider';
import {RestAPIRequest} from 'providers/client/client-provider-types';
import {HTTP_REQUESTS} from 'utils/constants';

// interface ExampleContextInterface {
//   sites: StateType<Site>;
//   getSites(params: SiteRequestType): void;
// }

// ** ** ** ** ** CREATE ** ** ** ** **
// const ExampleContext = createContext<ExampleContextInterface>({
//   sites: undefined,
//   getSites: () => null,
// });

// ** ** ** ** ** USE ** ** ** ** **
// export function useExample() {
//   const context = useContext(ExampleContext);
//   if (context === undefined || context === null) {
//     throw new Error(
//       '`useExample` hook must be used within a `ExampleProvider` component',
//     );
//   }
//   return context;
// }

type Site = {};
type StateType<T> = {
  data: T | null;
  error?: {
    code: string;
    message: string;
  };
  loading: Boolean;
};

// ** ** ** ** ** PROVIDE ** ** ** ** **
// export function ExampleProvider({children}: ChildrenProps): JSX.Element {
//   const {requestRest, requestQuery} = useClient();

//   const [sites, setSites] = useState<StateType<Site>>({
//     data: [],
//     error: undefined,
//     loading: false,
//   });

//   const getSites = useCallback(
//     params => {
//       const params: RestAPIRequest = {
//         method: HTTP_REQUESTS.GET,
//         path: '/posts',
//         body: JSON.stringify(params),
//       };
//       requestRest(params).then(response => {
//         console.log(
//           `${params.method} - ${params.path} - Success:`,
//           response.success,
//         );
//         setSites({data: response.data, error: response.error, loading: false});
//       });
//     },
//     [requestRest],
//   );

//   // Test getSites
//   useEffect(() => {
//     getSites({
//       title: 'foo',
//       body: 'bar',
//       userId: 1,
//     });
//   }, []);

//   const getChargers = useCallback(() => {
//     const queryParams: ApolloAPIRequest = {
//       method: GRAPHQL_REQUESTS.QUERY,
//       query: gql`
//         query GetEvents {
//           listEvents {
//             items {
//               id
//             }
//           }
//         }
//       `,
//       variables: {},
//       fetchPolicy: 'network-only',
//       key: 'listEvents',
//     };

//     const mutationParams: ApolloAPIRequest = {
//       method: GRAPHQL_REQUESTS.MUTATION,
//       query: gql`
//         mutation DeletePet($id: ID!) {
//           createEvent(input: {id: $id}) {
//             id
//           }
//         }
//       `,
//       variables: {id: makeUniqueId('id')},
//       key: 'createEvent',
//     };
//     requestQuery(queryParams).then(response => {
//       console.log(
//         `${queryParams.method} - ${queryParams.query} - Success:`,
//         response.success,
//       );
//     });
//   });

//   const values = useMemo(() => ({getSites, sites}), [getSites, sites]);

//   // ** ** ** ** ** RENDER ** ** ** ** **
//   return (
//     <ExampleContext.Provider value={values}>{children}</ExampleContext.Provider>
//   );
// }
