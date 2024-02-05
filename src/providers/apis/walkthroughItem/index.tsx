import React, {
  useMemo,
  createContext,
  useContext,
  useCallback,
  useState,
} from 'react';
import {ChildrenProps} from '../../../generic-types';
import {useClient} from 'providers/client/client-provider';
import {
  ApiResponse,
  ApolloAPIRequest,
} from 'providers/client/client-provider-types';
import {GRAPHQL_REQUESTS} from 'utils/constants';
import {gql} from '@apollo/client';
import {WalkthroughItem} from 'providers/types/walkthroughItem';

interface WalkthroughContextInterface {
  getWalkthroughItems(): Promise<ApiResponse<WalkthroughItem[]>>;
  walkthroughItems?: WalkthroughItem[];
}
// ** ** ** ** ** CREATE ** ** ** ** **
const WalkthroughContext = createContext<WalkthroughContextInterface | null>(
  null,
);

// ** ** ** ** ** USE ** ** ** ** **
export function useWalkthroughItem() {
  const context = useContext(WalkthroughContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useWalkthroughItem` hook must be used within a `WalkthroughItemProvider` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function WalkthroughItemProvider({
  children,
}: ChildrenProps): JSX.Element {
  const {requestQuery} = useClient();
  const [walkthroughItems, setWalkthroughItems] = useState<
    WalkthroughItem[] | undefined
  >();

  //Get user profile
  const getWalkthroughItems = useCallback(async () => {
    const queryParams: ApolloAPIRequest = {
      method: GRAPHQL_REQUESTS.QUERY,
      query: gql`
        query Walkthrough_item {
          walkthrough_item {
            description
            id
            image
            language
            order_index
            title
          }
        }
      `,
      variables: {},
      fetchPolicy: 'network-only',
      key: 'walkthrough_item',
    };
    const response = await requestQuery<WalkthroughItem[]>(queryParams);
    if (response?.success && response?.data) {
      setWalkthroughItems(response?.data);
    }
    return response;
  }, [requestQuery]);

  //Test GetProfile
  // useEffect(() => {
  //   getProfile().then(res=> {
  //     console.log("getProfile", res)
  //   })
  //   .catch(e=>{
  //     console.log("errororor", e)
  //   })
  // })

  const values: WalkthroughContextInterface = useMemo(
    () => ({
      getWalkthroughItems,
      walkthroughItems,
    }),
    [walkthroughItems, getWalkthroughItems],
  );

  return (
    <WalkthroughContext.Provider value={values}>
      {children}
    </WalkthroughContext.Provider>
  );
}
