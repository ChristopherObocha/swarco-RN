import {countries} from 'countries-list';
import {parse} from 'date-fns';
import {Linking} from 'react-native';

export function getHeightRatio(layout: {height: number; width: number}) {
  const ratio = layout.height / layout.width;
  const heightRatio = Math.round(ratio * 9 * 10) / 10;
  return heightRatio;
}

export function capitalizeFirstLetter(string: string) {
  return string
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function convertHoursToHumanReadableTime(hours: number) {
  const hoursString = Math.floor(hours / 100)
    .toString()
    .padStart(2, '0');
  const minutesString = (hours % 100).toString().padStart(2, '0');
  return `${hoursString}:${minutesString}`;
}

export function getPhoneCountryCodeOptions() {
  const phoneCodesSet = Object.entries(countries).reduce(
    (acc: Set<number>, [_, value]) => {
      value.phone.forEach(code => acc.add(code));
      return acc;
    },
    new Set<number>(),
  );

  let phoneCodes = Array.from(phoneCodesSet);

  phoneCodes.sort((a, b) => {
    if (a === 44) {
      return -1;
    }
    if (b === 44) {
      return 1;
    }

    return a - b;
  });

  const countryCodes = phoneCodes.map(code => ({
    label: `+${code}`,
    value: `+${code}`,
    color: 'black',
  }));

  return countryCodes;
}

export function getCountryOptions() {
  let countryCodes = Object.entries(countries).map(([_, value]) => ({
    label: value.name,
    value: value.name,
    color: 'black',
  }));

  countryCodes.sort((a, b) => {
    if (a.label === 'United Kingdom') {
      return -1;
    }
    if (b.label === 'United Kingdom') {
      return 1;
    }

    return a.label.localeCompare(b.label);
  });

  return countryCodes;
}

export function generatePassword(): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '@$!%*?&';
  const all = lower + upper + numbers + special;

  let password = '';
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = password.length; i < 12; i++) {
    let randomChar;
    do {
      randomChar = all[Math.floor(Math.random() * all.length)];
    } while (password.split(randomChar).length - 1 >= 2);
    password += randomChar;
  }

  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

export function generateGuestUsername(): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const all = lower;

  let username = '';

  for (let i = username.length; i < 6; i++) {
    let randomChar;
    do {
      randomChar = all[Math.floor(Math.random() * all.length)];
    } while (username.split(randomChar).length - 1 >= 2);
    username += randomChar;
  }

  return username;
}

export function convertSecondsToHoursMinutesSeconds(seconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  if (seconds < 0 || isNaN(seconds)) {
    return {hours: '00', minutes: '00', seconds: '00'};
  }

  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0'); // Format hours
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60)
    .toString()
    .padStart(2, '0'); // Format minutes
  const remainingSeconds = (remainingSecondsAfterHours % 60)
    .toString()
    .padStart(2, '0'); // Format remaining seconds

  return {hours, minutes, seconds: remainingSeconds};
}

export function convertPenceToPounds(pence: number): number {
  return pence / 100;
}

export function convertPoundsToPence(pounds: number): number {
  if (pounds === 0 || isNaN(pounds)) {
    return 0;
  }
  return pounds * 100;
}

export function rgbToHex(value: string, forceRemoveAlpha = false) {
  return value?.includes('rgba')
    ? '#' +
        value
          .replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
          .split(',') // splits them at ","
          .filter((string, index) => !forceRemoveAlpha || index !== 3)
          .map(string => parseFloat(string)) // Converts them to numbers
          .map((number, index) =>
            index === 3 ? Math.round(number * 255) : number,
          ) // Converts alpha to 255 number
          .map(number => number.toString(16)) // Converts numbers to hex
          .map(string => (string.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
          .join('') // Puts the array to together to a string
    : value;
}

export function getAppVersion(): string {
  const versionNumber = require('../../package.json').version?.toLowerCase();
  const environment = require('../../package.json').environment?.toLowerCase();

  if (environment?.toLowerCase() !== 'production') {
    return `V${versionNumber} - ${environment}`;
  }
  return `V${versionNumber}`;
}

export function removeDuplicates(array: any, key: any) {
  const newArray: any = [];

  array.forEach((item: any) => {
    if (!newArray.some((item2: any) => item[key] === item2[key])) {
      newArray.push(item);
    }
  });

  return newArray;
}

export async function handleOpenExternalLink(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  } catch (error) {
    console.log(error);
  }
}

export function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push({label: i.toString(), value: i.toString()});
  }
  return years;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
// Function to parse custom date strings into Date objects
export const parseDate = (dateString: string): Date | undefined => {
  const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};
