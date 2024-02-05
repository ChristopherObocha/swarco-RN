import React from 'react';
import {useForm} from 'react-hook-form';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useUser} from 'providers/apis/user';
import {useAlert} from 'providers/alert/alert-provider';
import {useNavigation} from '@react-navigation/native';

import ScreenContainer from 'components/containers/screen-container';
import DefaultHeader from 'components/headers/default-header';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {StyleSheet, View} from 'react-native';
import {useScale} from 'providers/style/scale-provider';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {PrimaryButton} from 'components/buttons/primary-button';
import {Spacer} from 'components/utils/spacer';
import {passwordRegex} from 'utils/regex';
import {openInbox} from 'react-native-email-link';

import {StackScreenProps} from '@react-navigation/stack';
import {
  AccountContainerNavigationProp,
  AccountContainerParamList,
  ACCOUNT_SCREENS,
} from '../../types/navigation';

interface ResetPasswordProps
  extends StackScreenProps<
    AccountContainerParamList,
    ACCOUNT_SCREENS.RESET_PASSWORD
  > {}

const ResetPassword = ({route}: ResetPasswordProps) => {
  const {alert} = useAlert();
  const navigation = useNavigation<AccountContainerNavigationProp>();
  const {
    dictionary: {ResetPassword, Errors, Generic},
  } = useDictionary();
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight} = useScale();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: getHeight(35),
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **
  const {resetPassword} = useUser();
  const {
    control,
    formState: {isValid},
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async data => {
    const {email} = route.params;
    const {code, password} = data;
    const {SuccessModal} = ResetPassword;

    try {
      const postBody = {
        email,
        code,
        password,
      };
      const {success, error} = await resetPassword(postBody);

      if (success) {
        alert(SuccessModal.Title, SuccessModal.Description, [
          {
            text: SuccessModal.SubmitButton,
            onPress: () => {
              navigation.navigate(ACCOUNT_SCREENS.SIGN_IN, {
                email,
              });
            },
          },
        ]);
      } else if (error) {
        const {body} = error;

        const {Title, Description, CTA} = Errors[body] || Errors.unknown;

        alert(Title, Description, [{text: CTA}]);
      }
    } catch (e) {
      console.log(e);
      alert(Errors.unknown.Title, Errors.unknown.Description, [
        {text: Errors.unknown.CTA},
      ]);
    }
  });

  const fields: FieldProps[] = [
    {
      type: FIELD_TYPES.TEXT,
      autoFocus: true,
      name: 'code',
      label: ResetPassword.VerificationCodeLabel,
      placeholder: ResetPassword.VerificationCodePlaceholder,
      rules: {
        required: ResetPassword.VerificationCodeRequired,
        pattern: {
          value: /^\d{8}$/,
          message: ResetPassword.VerificationCodeInvalid,
        },
      },
    },
    {
      type: FIELD_TYPES.PASSWORD,
      name: 'password',
      label: ResetPassword.PasswordLabel,
      placeholder: ResetPassword.PasswordPlaceholder,
      rules: {
        required: ResetPassword.PasswordRequired,
        pattern: {
          value: passwordRegex,
          message: Generic.PasswordInvalid,
        },
      },
    },
  ];

  const handleOpenMail = async () => {
    try {
      await openInbox();
    } catch (e) {
      alert(
        ResetPassword.ErrorModal.Title,
        ResetPassword.ErrorModal.Description,
      );
    }
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title={ResetPassword.Title} />

      <ScreenContainer style={styles.container} enableKeyboardAvoidingView>
        <Form control={control} fields={fields} />

        <View style={styles.buttonContainer}>
          <SecondaryButton
            title={ResetPassword.OpenMail}
            onPress={handleOpenMail}
          />

          <Spacer vertical size={15} />

          <PrimaryButton
            title={ResetPassword.SubmitButton}
            disabled={!isValid}
            onPress={onSubmit}
          />
        </View>
      </ScreenContainer>
    </>
  );
};

export default ResetPassword;
