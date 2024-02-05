import React, {
  useMemo,
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect
} from 'react';
import {ChildrenProps} from '../../../generic-types';
import {useClient} from 'providers/client/client-provider';
import {
  ApiResponse,
  ApolloAPIRequest,
} from 'providers/client/client-provider-types';
import {GRAPHQL_REQUESTS} from 'utils/constants';
import {gql} from '@apollo/client';
import {FAQs} from 'providers/types/faqs';

interface FAQContextInterface {
  getFAQs(): Promise<ApiResponse<FAQs[]>>;
}
// ** ** ** ** ** CREATE ** ** ** ** **
const FAQContext = createContext<FAQContextInterface | null>(null);

// ** ** ** ** ** USE ** ** ** ** **
export function useFAQ() {
  const context = useContext(FAQContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useFAQ` hook must be used within a `FAQProvider` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function FAQProvider({children}: ChildrenProps): JSX.Element {
  const {requestQuery} = useClient();

  //Get FAQs
  const getFAQs = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query Faqs {
          faqs {
            id
            language
            title
            type
            items {
              answer
              id
              language
              question
            }
          }
        }
      `,
      variables: {},
      fetchPolicy: 'network-only',
      key: 'faqs',
    };
    const response = await requestQuery<FAQs[]>(queryParams);
    return response;
  }, [requestQuery]);

  //Test GetFAQs
  // useEffect(() => {
  //   getFAQs().then(res=> {
  //     console.log("getFAQs", {res: JSON.stringify(res)})
  //   })
  //   .catch(e=>{
  //     console.log("errororor", e)
  //   })
  // })

  const values: FAQContextInterface = useMemo(
    () => ({
      getFAQs,
    }),
    [getFAQs],
  );

  return <FAQContext.Provider value={values}>{children}</FAQContext.Provider>;
}
