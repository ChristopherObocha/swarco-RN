import React from 'react';
import {View, StyleSheet} from 'react-native';

import {useScale} from 'providers/style/scale-provider';
import {useForm} from 'react-hook-form';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useAlert} from 'providers/alert/alert-provider';
import {useAuth} from 'providers/apis/auth';

import DefaultHeader from 'components/headers/default-header';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {PrimaryButton} from 'components/buttons/primary-button';
import {TertiaryButton} from 'components/buttons/tertiary-button';
import {SecondaryButton} from 'components/buttons/secondary-button';
import ScreenContainer from 'components/containers/screen-container';
import {Text} from '@rneui/themed';

import SwarcoLogo from 'assets/svg/swarco-logo.svg';
import {
  AccountContainerParamList,
  ACCOUNT_SCREENS,
  AppContainerParamList,
  APP_CONTAINER_SCREENS,
} from '../../types/navigation';
import {emailRegex, passwordRegex} from 'utils/regex';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {useProfile} from 'providers/apis/profile';
import {clearAppSettings, clearGuestStorage} from 'utils/storage-utils';
import {useLoading} from 'providers/loading/loading-provider';
import {useCharging} from 'providers/apis/charging';
import {useCheckActiveSession} from 'utils/hooks';

interface SignInScreenProps
  extends StackScreenProps<
    AccountContainerParamList,
    ACCOUNT_SCREENS.SIGN_IN
  > {}

type AccountContainerNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AppContainerParamList>,
  StackNavigationProp<AccountContainerParamList>
>;
const SignIn = ({route}: SignInScreenProps) => {
  const navigation = useNavigation<AccountContainerNavigationProp>();
  const {dictionary} = useDictionary();
  const {SignIn, Errors} = dictionary;
  const {alert} = useAlert();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight, getFontSize} = useScale();

  const styles = StyleSheet.create({
    form: {
      paddingHorizontal: getWidth(20),
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: getHeight(45),
    },
    noAccountText: {
      marginBottom: getHeight(30),
      fontSize: getFontSize(16),
    },
    buttonsContainer: {
      alignItems: 'center',
      marginTop: getHeight(100),
    },
    tertiaryButton: {
      marginTop: getHeight(10),
    },
    signInButtonContainer: {
      marginTop: getHeight(20),
      alignItems: 'center',
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **
  const {login} = useAuth();
  const {getProfile} = useProfile();

  const {
    control,
    formState: {isValid},
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
  } = useForm({mode: 'onBlur'});

  const {setLoading} = useLoading();

  const checkIfUserIsCharging = useCheckActiveSession();

  const onSubmit = handleSubmit(async data => {
    setLoading(true);
    const {username, password} = data;
    try {
      const isCharging = await checkIfUserIsCharging();

      if (isCharging) {
        alert(Errors.ChargeLogin.Title, Errors.ChargeLogin.Description, [
          {text: Errors.ChargeLogin.CTA},
        ]);
        return;
      }

      const postBody = {
        username,
        password,
      };

      const response = await login(postBody);

      if (response?.success) {
        clearGuestStorage();
        clearAppSettings();

        const {data: profileData} = await getProfile();
        const profile = profileData?.[0];
        setLoading(false);

        if (profile?.emailverified) {
          if (route?.params?.redirect) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: APP_CONTAINER_SCREENS.BOTTOM_TABS,
                  params: {
                    screen: route.params.redirect,
                  },
                },
              ],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: APP_CONTAINER_SCREENS.BOTTOM_TABS}],
            });
          }
          clearCredentials();
        } else {
          navigation.navigate(ACCOUNT_SCREENS.VERIFY_ACCOUNT, {
            email: username,
            redirect: route?.params?.redirect,
          });
          clearCredentials();
        }
      } else {
        if (response?.error) {
          const {body} = response.error;

          const {Title, Description, CTA} = Errors[body] || Errors.unknown;

          alert(Title, Description, [
            {
              text: CTA,
            },
          ]);
        }
      }
    } catch (error) {
      setLoading(false);
      alert(Errors.unknown.Title, Errors.unknown.Description, [
        {text: Errors.unknown.CTA},
      ]);
    } finally {
      setLoading(false);
    }
  });

  const fields: FieldProps[] = [
    {
      type: FIELD_TYPES.EMAIL,
      name: 'username',
      label: SignIn.EmailAddress,
      placeholder: SignIn.EmailAddressPlaceholder,
      autoCapitalize: 'none',
      rules: {
        required: SignIn.EmailRequired,
        pattern: {
          value: emailRegex,
          message: SignIn.EmailInvalid,
        },
      },
      defaultValue: route.params?.email || '',
      caretHidden: false,
    },
    {
      type: FIELD_TYPES.PASSWORD,
      name: 'password',
      label: SignIn.Password,
      placeholder: SignIn.PasswordPlaceholder,
      containerStyle: {
        marginTop: getHeight(15),
      },
      errorStyle: {
        marginBottom: 0,
      },
      rules: {
        required: SignIn.PasswordRequired,
        pattern: {
          value: passwordRegex,
          message: SignIn.PasswordInvalid,
        },
      },
      fieldFooterComponent: (
        <View style={styles.signInButtonContainer}>
          <PrimaryButton
            title={SignIn.SignInButton}
            disabled={!isValid}
            onPress={onSubmit}
          />

          <TertiaryButton
            title={SignIn.ForgotPassword}
            containerStyle={styles.tertiaryButton}
            onPress={() => {
              navigation.navigate(ACCOUNT_SCREENS.FORGOT_PASSWORD, {
                email: getValues('username'),
              });
              clearCredentials();
            }}
          />
        </View>
      ),
    },
  ];

  // ** ** ** ** ** FUNCTIONS ** ** ** ** **

  const clearCredentials = () => {
    setTimeout(() => {
      clearErrors();
      setValue('username', '');
      setValue('password', '');
    }, 250);
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace(APP_CONTAINER_SCREENS.BOTTOM_TABS);
    }
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader customBackAction={handleBack} />

      <ScreenContainer>
        <View style={styles.logoContainer}>
          <SwarcoLogo />
        </View>
        <Form
          control={control}
          fields={fields}
          flatListProps={{
            contentContainerStyle: styles.form,
            scrollEnabled: false,
            ListFooterComponent: (
              <View style={styles.buttonsContainer}>
                <Text style={styles.noAccountText}>{SignIn.NoAccountText}</Text>
                <SecondaryButton
                  title={SignIn.CreateAccount}
                  onPress={() => {
                    navigation.navigate(ACCOUNT_SCREENS.CREATE_ACCOUNT, {
                      redirect: route?.params?.redirect,
                    });
                    clearCredentials();
                  }}
                />
              </View>
            ),
          }}
        />
      </ScreenContainer>
    </>
  );
};

export default SignIn;
