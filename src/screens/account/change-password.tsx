import React from 'react';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useForm} from 'react-hook-form';
import {useScale} from 'providers/style/scale-provider';
import {useProfile} from 'providers/apis/profile';
import {useUser} from 'providers/apis/user';
import {useAuth} from 'providers/apis/auth';
import {useAlert} from 'providers/alert/alert-provider';
import {useNavigation} from '@react-navigation/native';

import {StyleSheet, View} from 'react-native';
import DefaultHeader from 'components/headers/default-header';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {passwordRegex} from 'utils/regex';
import {PrimaryButton} from 'components/buttons/primary-button';
import {ACCOUNT_SCREENS} from '../../types/navigation';
import ScreenContainer from 'components/containers/screen-container';
import {useLoading} from 'providers/loading/loading-provider';

const ChangePassword = () => {
  const {
    dictionary: {ChangePassword, Errors, Generic},
  } = useDictionary();

  const navigation = useNavigation<any>();
  // ** ** ** ** ** STYLE ** ** ** ** **
  const {getWidth, getHeight} = useScale();
  const styles = StyleSheet.create({
    formContainer: {
      paddingHorizontal: getWidth(20),
      paddingTop: getHeight(15),
    },
    buttonContainer: {
      alignItems: 'center',
      marginBottom: getHeight(20),
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **
  const {
    control,
    handleSubmit,
    formState: {isValid},
  } = useForm({mode: 'onBlur'});

  const fields: FieldProps[] = [
    {
      type: FIELD_TYPES.PASSWORD,
      name: 'password',
      label: ChangePassword.CurrentPassword,
      placeholder: ChangePassword.CurrentPasswordPlaceholder,
      rules: {
        required: 'Required',
        pattern: {
          value: passwordRegex,
          message: Generic.PasswordInvalid,
        },
      },
    },
    {
      type: FIELD_TYPES.PASSWORD,
      name: 'newPassword',
      label: ChangePassword.NewPassword,
      placeholder: ChangePassword.NewPasswordPlaceholder,
      rules: {
        required: 'Required',
        pattern: {
          value: passwordRegex,
          message: Generic.PasswordInvalid,
        },
      },
    },
  ];

  const {profile} = useProfile();
  const {login} = useAuth();
  const {updateUser} = useUser();
  const {alert} = useAlert();

  const {setLoading} = useLoading();

  const handleOnSubmit = handleSubmit(async (data: any) => {
    setLoading(true);
    try {
      if (profile) {
        const {email} = profile;

        const loginResponse = await login({
          username: email,
          password: data.password,
        });

        if (loginResponse.success) {
          const updatePasswordResponse = await updateUser({
            password: data.newPassword,
          });

          if (updatePasswordResponse.success) {
            alert(
              ChangePassword.SuccessTitle,
              ChangePassword.SuccessDescription,
              [
                {
                  text: ChangePassword.SuccessCTA,
                  onPress: () => {
                    navigation.navigate(ACCOUNT_SCREENS.ACCOUNT);
                  },
                },
              ],
            );
          } else if (updatePasswordResponse?.error) {
            const {body} = updatePasswordResponse.error;

            const {Title, Description, CTA} = Errors[body] || Errors.unknown;

            alert(Title, Description, [
              {
                text: CTA,
              },
            ]);
          }
        } else if (loginResponse?.error) {
          let {body} = loginResponse.error;
          if (body === 'Invalid user credentials') {
            body = 'Invalid password';
          }

          const {Title, Description, CTA} = Errors[body] || Errors.unknown;

          alert(Title, Description, [
            {
              text: CTA,
            },
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title={ChangePassword.Title} />
      <ScreenContainer enableKeyboardAvoidingView>
        <Form
          fields={fields}
          control={control}
          flatListProps={{
            contentContainerStyle: styles.formContainer,
          }}
        />
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={'Change password'}
            disabled={!isValid}
            onPress={handleOnSubmit}
          />
        </View>
      </ScreenContainer>
    </>
  );
};

export default ChangePassword;
