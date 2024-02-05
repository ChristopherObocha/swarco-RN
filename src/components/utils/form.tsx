import React, {ReactElement} from 'react';
import {Form as JSForm} from 'the-core-ui-module-tdforms-v2';
import {
  FlatList,
  KeyboardAvoidingViewProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {FlashListProps} from '@shopify/flash-list';
import {InputProps} from '@rneui/themed';
import {IconObject} from '@rneui/base';
import {CheckBoxIconProps} from '@rneui/base/dist/CheckBox/components/CheckBoxIcon';

export enum FIELD_TYPES {
  CHECKBOX = 'checkbox',
  CUSTOM = 'custom',
  DATEPICKER = 'datepicker',
  DROPDOWN = 'dropdown',
  EMAIL = 'email',
  MASKED = 'masked',
  NUMBER = 'number',
  PASSWORD = 'password',
  PHONE = 'phone',
  SWITCH = 'switch',
  TEXT = 'text',
}

interface MaskedInputProps {
  placeholderFillCharacter?: string; // masked input placeholder
  obfuscationCharacter?: string; // masked input
  mask?: (string | RegExp | RegExp[])[]; // masked input
}

interface MultilineInputProps {
  multiline?: boolean;
  showCounter?: boolean;
  maxLength?: number;
}

interface DropdownInputProps {
  data?: {
    label: string;
    value: string;
  }[];
  doneText?: string;
  darkTheme?: boolean;
}

interface DatePickerInputProps {
  date?: Date;
  dateMode?: string; // 'date' | 'time' \ 'datetime'
  dateFormat?: string; // 'dd/MMM/yyyy',
  minimumDate?: Date;
}

interface PhoneInputProps {
  prefixIcon?: ReactElement;
  phonePrefixTextStyle?: TextStyle;
}

interface CheckboxInputProps extends Omit<CheckBoxIconProps, 'checked'> {
  title?: string | ReactElement;
  description?: string;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

interface SwitchInputProps {
  color?: string;
}

export interface FieldProps
  extends Omit<InputProps, 'defaultValue'>,
    MaskedInputProps,
    MultilineInputProps,
    DropdownInputProps,
    DatePickerInputProps,
    PhoneInputProps,
    CheckboxInputProps,
    SwitchInputProps {
  type: FIELD_TYPES;
  name: string;
  title?: string | ReactElement;
  defaultValue?: string | Date | boolean | null;
  label?: string | ReactElement;
  placeholder?: string;
  disabled?: boolean;

  leftIcon?: ReactElement | {name: string};
  rightIcon?: ReactElement | {name: string};

  iconStyle?: ({
    isError,
    isFocused,
    multiline,
    disabled,
    showCounter,
  }: {
    isError?: boolean;
    isFocused?: boolean;
    multiline?: boolean;
    disabled?: boolean;
    showCounter?: boolean;
  }) => IconObject;

  fieldHeaderComponent?: ReactElement;
  fieldFooterComponent?: ReactElement;

  leftExternalComponent?: ReactElement;
  rightExternalComponent?: ReactElement;

  fieldContainerStyle?: ViewStyle;
  inputStyle?: ViewStyle;

  rules?: {
    required?: string;
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    min?: {
      value: number;
      message: string;
    };
    max?: {
      value: number;
      message: string;
    };
    validate?: (value: any) => true | string; // true for valid, string for error message to show
  };

  customComponent?: any;
}
export interface FlatlistProps
  extends Omit<FlashListProps<FlatList>, 'data' | 'renderItem'> {
  scrollOnFocused?: boolean;
}

export interface TDFormsProps {
  control: any;
  fields: FieldProps[];
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  flatListProps?: FlatlistProps;
}

export const Form = (props: TDFormsProps) => {
  return (
    <JSForm
      {...props}
      // fields={props.fields.map(item => ({...item, renderErrorMessage: false}))}
    />
  );
};
