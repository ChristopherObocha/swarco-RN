import React, {useMemo, useState} from 'react';

import {useForm} from 'react-hook-form';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useNavigation} from '@react-navigation/native';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import ScreenContainer from 'components/containers/screen-container';
import DefaultHeader from 'components/headers/default-header';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {StyleSheet, TouchableOpacity} from 'react-native';
import CustomSwitchCard from 'components/form/custom-switch-card';
import {Text} from '@rneui/themed';
import {PrimaryButton} from 'components/buttons/primary-button';
import {
  AccountContainerNavigationProp,
  ACCOUNT_SCREENS,
  AccountContainerParamList,
} from '../../types/navigation';
import {
  alphanumericRegex,
  emailRegex,
  passwordRegex,
  phoneNumberRegex,
} from 'utils/regex';
import {StackScreenProps} from '@react-navigation/stack';
import {
  getPhoneCountryCodeOptions,
  handleOpenExternalLink,
} from 'utils/general-utils';
import {PRIVACY_POLICY_LINK, TERMS_AND_CONDITIONS_LINK} from 'utils/constants';
import {dateOfBirthRestrictions} from 'utils/constants';
import {useAlert} from 'providers/alert/alert-provider';
import {useCheckActiveSession} from 'utils/hooks';

const modalTypes = {
  termsAndConditions: 1,
  privacyPolicy: 2,
} as const;

type ModalTypes = (typeof modalTypes)[keyof typeof modalTypes];

export interface CreateAccountForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phonenumber: string;
  dateofbirth: string;
  marketingmaterials: boolean;
  terms: string;
  privacy: string;
}

interface CreateAccountProps
  extends StackScreenProps<
    AccountContainerParamList,
    ACCOUNT_SCREENS.CREATE_ACCOUNT
  > {}

const CreateAccount = ({route: {params}}: CreateAccountProps) => {
  const {
    dictionary: {CreateAccount, Generic, Errors},
  } = useDictionary();
  const {alert} = useAlert();

  const {email, redirect} = params || {};
  const {
    control,
    formState: {isValid},
    handleSubmit,
    watch,
  } = useForm<CreateAccountForm>({
    mode: 'onBlur',
  });

  const terms = watch('terms');
  const privacy = watch('privacy');

  const navigation = useNavigation<AccountContainerNavigationProp>();

  const checkIfUserIsCharging = useCheckActiveSession();

  const navigateToAddHomeAddress = async (props: CreateAccountForm) => {
    const isBusinessUser = !!params?.email;

    const isCharging = await checkIfUserIsCharging();
    if (isCharging) {
      alert(Errors.ChargeLogin.Title, Errors.ChargeLogin.Description, [
        {text: Errors.ChargeLogin.CTA},
      ]);
      return;
    }

    navigation.navigate(ACCOUNT_SCREENS.ADD_HOME_ADDRESS, {
      formState: props,
      isBusinessUser,
      redirect,
    });
  };

  const [modalType, setModalType] = useState<ModalTypes | null>(null);
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {textStyles} = useStyle();
  const {getWidth, getHeight} = useScale();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
      paddingBottom: getHeight(20),
    },
    textUnderlined: {
      ...textStyles.semiBold16,
      textDecorationLine: 'underline',
    },
    prefixTextStyles: {
      ...textStyles.semiBold16,
      marginHorizontal: getWidth(10),
    },
    buttonContainer: {
      marginTop: getHeight(15),
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **

  const fields: FieldProps[] = useMemo(
    () => [
      {
        type: FIELD_TYPES.TEXT,
        name: 'firstname',
        label: CreateAccount.FirstName,
        placeholder: CreateAccount.FirstNamePlaceholder,
        rules: {
          required: CreateAccount.FirstNameRequired,
          pattern: {
            value: alphanumericRegex,
            message: CreateAccount.FirstNameInvalid,
          },
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        name: 'lastname',
        label: CreateAccount.LastName,
        placeholder: CreateAccount.LastNamePlaceholder,
        rules: {
          required: CreateAccount.LastNameRequired,
          pattern: {
            value: alphanumericRegex,
            message: CreateAccount.LastNameInvalid,
          },
        },
      },
      {
        type: FIELD_TYPES.EMAIL,
        name: 'email',
        label: CreateAccount.EmailAddress,
        placeholder: CreateAccount.EmailAddressPlaceholder,
        defaultValue: email,
        disabled: !!email,
        rules: {
          required: CreateAccount.EmailAddressRequired,
          pattern: {
            value: emailRegex,
            message: CreateAccount.EmailAddressInvalid,
          },
        },
        caretHidden: false,
      },
      {
        type: FIELD_TYPES.PASSWORD,
        name: 'password',
        label: CreateAccount.Password,
        placeholder: CreateAccount.PasswordPlaceholder,
        rules: {
          required: CreateAccount.PasswordRequired,
          pattern: {
            value: passwordRegex,
            message: Generic.PasswordInvalid,
          },
        },
      },
      {
        type: FIELD_TYPES.PHONE,
        name: 'phonenumber',
        label: CreateAccount.PhoneNumber,
        placeholder: CreateAccount.PhoneNumberPlaceholder,
        phonePrefixTextStyle: styles.prefixTextStyles,
        data: getPhoneCountryCodeOptions(),
        rules: {
          required: CreateAccount.PhoneNumberRequired,
          pattern: {
            value: phoneNumberRegex,
            message: CreateAccount.PhoneNumberInvalid,
          },
        },
      },
      {
        type: FIELD_TYPES.DATEPICKER,
        name: 'dateofbirth',
        label: CreateAccount.DateOfBirth,
        placeholder: CreateAccount.DateOfBirthPlaceholder,
        dateFormat: 'dd/MM/yyyy',
        minimumDate: dateOfBirthRestrictions.minimumDate,
        maximumDate: dateOfBirthRestrictions.maximumDate,
        defaultPickerValue: dateOfBirthRestrictions.defaultDate,
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: 'terms',
        label: (
          <>
            {CreateAccount.TermsAndConditions}{' '}
            <TouchableOpacity
              onPress={() => handleOpenExternalLink(TERMS_AND_CONDITIONS_LINK)}>
              <Text style={styles.textUnderlined}>
                {CreateAccount.TermsAndConditionsLink}
              </Text>
            </TouchableOpacity>
          </>
        ),
        customComponent: CustomSwitchCard,
        rules: {
          required: CreateAccount.TermsAndConditionsRequired,
        },
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: 'privacy',
        label: (
          <>
            {CreateAccount.PrivacyPolicy}{' '}
            <TouchableOpacity
              onPress={() => handleOpenExternalLink(PRIVACY_POLICY_LINK)}>
              <Text style={styles.textUnderlined}>
                {CreateAccount.PrivacyPolicyLink}
              </Text>
            </TouchableOpacity>
          </>
        ),
        customComponent: CustomSwitchCard,
        rules: {
          required: CreateAccount.PrivacyPolicyRequired,
        },
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: 'marketingmaterials',
        label: CreateAccount.MarketingMaterials,
        customComponent: CustomSwitchCard,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  {
    /* HIDDEN BELOW UNTIL IN APP MODAL STRUCTURE IS DEFINED */
  }
  // const handleAcceptTermsAndConditions = () => {
  //   setValue('terms', 'true');
  //   setModalType(null);
  // };

  // const handleAcceptPrivacyPolicy = () => {
  //   setValue('privacy', 'true');
  //   setModalType(null);
  // };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title={CreateAccount.Title} />

      <ScreenContainer style={styles.container} enableKeyboardAvoidingView>
        <Form
          control={control}
          fields={fields}
          flatListProps={{
            ListFooterComponent: (
              <PrimaryButton
                title={CreateAccount.SubmitButton}
                onPress={handleSubmit(navigateToAddHomeAddress)}
                disabled={!isValid}
                containerStyle={styles.buttonContainer}
              />
            ),
            ListFooterComponentStyle: {alignItems: 'center'},
            showsVerticalScrollIndicator: false,
            contentContainerStyle: {paddingBottom: getHeight(60)},
            extraData: terms || privacy,
          }}
        />
      </ScreenContainer>

      {/* HIDDEN BELOW UNTIL IN APP MODAL STRUCTURE IS DEFINED */}
      {/* <ContentModal
        modalVisible={modalType === modalTypes.termsAndConditions}
        closeModal={() => setModalType(null)}
        handleAccept={handleAcceptTermsAndConditions}
        title={TermsAndConditionsModal.Title}
        description={TermsAndConditionsModal.Description}
      />

      <ContentModal
        modalVisible={modalType === modalTypes.privacyPolicy}
        closeModal={() => setModalType(null)}
        handleAccept={handleAcceptPrivacyPolicy}
        title={PrivacyPolicyModal.Title}
        description={PrivacyPolicyModal.Description}
      /> */}
    </>
  );
};

export default CreateAccount;
