import React from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useForm} from 'react-hook-form';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useUser} from 'providers/apis/user';
import {useAlert} from 'providers/alert/alert-provider';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from 'providers/apis/auth';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import DefaultHeader from 'components/headers/default-header';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import EmailIcon from 'assets/svg/email-icon.svg';
import PasscodeInput from 'components/form/passcode-input';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {PrimaryButton} from 'components/buttons/primary-button';
import {TertiaryButton} from 'components/buttons/tertiary-button';
import {StackScreenProps} from '@react-navigation/stack';
import {
  AccountContainerParamList,
  ACCOUNT_SCREENS,
  BOTTOM_TABS,
} from '../../types/navigation';
import {ERROR_CODES} from 'utils/constants';

interface VerifyAccountProps
  extends StackScreenProps<
    AccountContainerParamList,
    ACCOUNT_SCREENS.VERIFY_ACCOUNT
  > {}

const VerifyAccount = ({route}: VerifyAccountProps) => {
  const {email, redirect} = route.params;
  const {alert} = useAlert();
  const navigation = useNavigation<any>();

  const {logout} = useAuth();

  const {
    dictionary: {VerifyAccount, Errors},
  } = useDictionary();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {bottom} = useSafeAreaInsets();

  const {getWidth, getHeight} = useScale();
  const paddingBottom = Platform.select({
    ios: bottom,
    android: getHeight(15),
  });
  const {textStyles} = useStyle();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
      flex: 1,
    },
    card: {
      marginTop: getWidth(10),
      backgroundColor: 'white',
      borderRadius: getWidth(10),
      paddingVertical: getWidth(30),
      alignItems: 'center',
    },
    textContainer: {
      marginTop: getWidth(30),
      alignItems: 'center',
      width: getWidth(305),
    },
    text: {
      ...textStyles.regular18,
      textAlign: 'center',
      marginTop: getWidth(15),
      lineHeight: getHeight(20),
      letterSpacing: -0.4,
    },
    keyboardAvoidingViewProps: {
      height: getHeight(55),
      width: getWidth(305),
      marginTop: getWidth(30),
      marginBottom: getWidth(15),
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: paddingBottom,
    },
    primaryButton: {
      marginBottom: getWidth(20),
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **
  const {resendVerification, verifyUser} = useUser();
  const {
    control,
    formState: {isValid},
    handleSubmit,
  } = useForm({mode: 'onBlur'});

  const fields: FieldProps[] = [
    {
      type: FIELD_TYPES.CUSTOM,
      name: 'passcode',
      customComponent: PasscodeInput,
      rules: {
        required: VerifyAccount.RequiredCode,
        validate: (value: string) =>
          value.length === 6 || VerifyAccount.InvalidCode,
      },
    },
  ];

  const handleResendCode = async () => {
    try {
      const {success, error} = await resendVerification({email});

      if (success) {
        alert(
          VerifyAccount.ResendCodeSuccess,
          VerifyAccount.ResendCodeSuccessMessage,
        );
      } else {
        if (error) {
          const {body} = error;

          const {Title, Description} = Errors[body] || Errors.unknown;

          alert(Title, Description);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUserVerification = handleSubmit(async ({passcode}) => {
    try {
      const {success, error} = await verifyUser({verification_code: passcode});

      if (success) {
        navigation.navigate(ACCOUNT_SCREENS.ADDITIONAL_ONBOARDING, {
          redirect,
        });
      } else if (error) {
        const {body} = error;
        const {Title, Description, CTA} = Errors[body] || Errors.unknown;

        if (
          body === ERROR_CODES.MAX_TRIES ||
          body === ERROR_CODES.VERIFICATION_EXPIRED
        ) {
          alert(Title, Description, [{text: CTA, onPress: handleResendCode}]);
        } else {
          alert(Title, Description);
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  const handleBackAction = () => {
    logout();
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.replace(BOTTOM_TABS.ACCOUNT_CONTAINER, {
      screen: ACCOUNT_SCREENS.SIGN_IN,
    });
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader
        title={VerifyAccount.Title}
        customBackAction={() =>
          alert(
            VerifyAccount.BackToSignIn,
            VerifyAccount.BackToSignInDescription,
            [
              {
                text: VerifyAccount.Cancel,
              },
              {
                text: VerifyAccount.Continue,
                onPress: handleBackAction,
              },
            ],
          )
        }
      />

      <KeyboardAvoidingView //wrap the entire screen with KeyboardAvoidingView and specify the behavior for Android
        style={styles.container}
        enabled={false}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.card}>
          <EmailIcon width={getWidth(110)} height={getWidth(110)} />

          <View style={styles.textContainer}>
            <Text style={textStyles.semiBold20}>
              {VerifyAccount.Description}
            </Text>

            <Text style={styles.text}>
              {VerifyAccount.InfoText1}{' '}
              <Text style={textStyles.semiBold18}>{email}</Text>
              {'\n'}
              {VerifyAccount.InfoText2}
            </Text>

            <Form
              fields={fields}
              control={control}
              keyboardAvoidingViewProps={{
                style: styles.keyboardAvoidingViewProps,
              }}
            />

            <Text style={[styles.text, textStyles.regular16]}>
              {VerifyAccount.PasscodeExpirationText}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={VerifyAccount.VerifyEmail}
            disabled={!isValid}
            onPress={handleUserVerification}
            containerStyle={styles.primaryButton}
          />

          <TertiaryButton
            title={VerifyAccount.ResendEmailWithCode}
            onPress={handleResendCode}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default VerifyAccount;
