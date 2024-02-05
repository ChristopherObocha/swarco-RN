import React from 'react';

import {useNetInfo} from '@react-native-community/netinfo';
import {ChildrenProps} from '../../generic-types';

interface NetworkProviderInterface {
  isConnected: boolean | null;
}

const NetworkContext = React.createContext<NetworkProviderInterface | null>(
  null,
);

export function useNetwork() {
  const context = React.useContext(NetworkContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useNetwork` hook must be used within a `NetworkProvider` component',
    );
  }
  return context;
}

export function NetworkProvider({children}: ChildrenProps): JSX.Element {
  const {isConnected} = useNetInfo();

  // ** ** ** ** ** Memoize ** ** ** ** **
  const values: NetworkProviderInterface = React.useMemo(
    () => ({
      isConnected,
    }),
    [isConnected],
  );

  // ** ** ** ** ** Return ** ** ** ** **
  return (
    <NetworkContext.Provider value={values}>{children}</NetworkContext.Provider>
  );
}
