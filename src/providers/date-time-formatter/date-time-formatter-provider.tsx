import * as React from 'react';
import {
  DateTimeFormatter,
  DateTimeFormatterInterface,
} from './date-time-formatter';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

export const DateTimeFormatContext =
  React.createContext<DateTimeFormatterInterface | null>(null);

export function useDateTimeFormatter() {
  const context = React.useContext(DateTimeFormatContext);
  if (context === undefined || context === null) {
    throw new Error(
      '`useDateTimeFormatter` hook must be used within a `DateTimeFormatterProvider` component',
    );
  }
  return context;
}

export const DateTimeFormatterProvider: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = ({children}) => {
  // Get current language from language provider context.
  const {locale} = useDictionary();

  // Memoize if needed.
  const dateTimeFormatter = new DateTimeFormatter(locale);

  return (
    <DateTimeFormatContext.Provider value={dateTimeFormatter}>
      {children}
    </DateTimeFormatContext.Provider>
  );
};
