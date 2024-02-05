/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Fri, 14th Jan 2022, 10:17:35 am
 * Author: Harry Crank (harry.crank@thedistance.co.uk)
 * Copyright (c) 2022 The Distance
 */

import React, {useMemo, createContext, useContext, useState} from 'react';
import {ChildrenProps} from '../../generic-types';

interface LoadingContextInterface {
  loading: boolean;
  setLoading(value: boolean): void;
  buttonLoading: boolean;
  setButtonLoading(value: boolean): void;
}

// ** ** ** ** ** CREATE ** ** ** ** **
const LoadingContext = createContext<LoadingContextInterface>({
  loading: false,
  setLoading: () => null,
  buttonLoading: false,
  setButtonLoading: () => null,
});

// ** ** ** ** ** USE ** ** ** ** **
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useLoading` hook must be used within a `LoadingProvider` component',
    );
  }
  return context;
}

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function LoadingProvider({children}: ChildrenProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const values = useMemo(
    () => ({loading, buttonLoading, setLoading, setButtonLoading}),
    [loading, buttonLoading, setLoading, setButtonLoading],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <LoadingContext.Provider value={values}>{children}</LoadingContext.Provider>
  );
}
