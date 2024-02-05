import {
  DateFormatType,
  DateTimeFormats,
  TimeFormatType,
} from './date-time-formats';

export interface DateTimeFormatterInterface {
  formatDateTime: (
    date: Date,
    dateFormat?: DateFormatType,
    timeFormat?: TimeFormatType,
    extraOptions?: Intl.DateTimeFormatOptions,
  ) => string;
}

/*
TODO: Can use https://github.com/steffenagger/react-native-device-time-format for getting 24h setting from device
*/
export class DateTimeFormatter implements DateTimeFormatterInterface {
  private language;

  constructor(lang: string) {
    this.language = lang;
  }

  // TODO: Can add a currency formatting

  public formatDateTime = (
    date: Date,
    dateFormatType?: DateFormatType,
    timeFormatType?: TimeFormatType,
    extraOptions?: Intl.DateTimeFormatOptions,
  ) => {
    if (!dateFormatType && !timeFormatType && !extraOptions) {
      return Intl.DateTimeFormat(this.language, {
        ...DateTimeFormats.MEDIUM_DATE,
        ...DateTimeFormats.SHORT_TIME,
      }).format(date);
    }

    return Intl.DateTimeFormat(this.language, {
      ...(dateFormatType && DateTimeFormats[dateFormatType]),
      ...(timeFormatType && DateTimeFormats[timeFormatType]),
      ...extraOptions,
    }).format(date);
  };
}
