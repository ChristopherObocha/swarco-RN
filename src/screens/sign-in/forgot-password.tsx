import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useForm} from 'react-hook-form';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';
import {useNavigation} from '@react-navigation/native';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useUser} from 'providers/apis/user';
import {useAlert} from 'providers/alert/alert-provider';

import ScreenContainer from 'components/containers/screen-container';
import DefaultHeader from 'components/headers/default-header';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {Text} from '@rneui/themed';
import {PrimaryButton} from 'components/buttons/primary-button';
import {
  AccountContainerNavigationProp,
  AccountContainerParamList,
  ACCOUNT_SCREENS,
} from '../../types/navigation';
import {emailRegex} from 'utils/regex';
import {StackScreenProps} from '@react-navigation/stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

interface ForgotPasswordProps
  extends StackScreenProps<
    AccountContainerParamList,
    ACCOUNT_SCREENS.FORGOT_PASSWORD
  > {}

const ForgotPassword = ({route}: ForgotPasswordProps) => {
  const navigation = useNavigation<AccountContainerNavigationProp>();
  const {
    dictionary: {ForgotPassword, Errors},
  } = useDictionary();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getRadius, getHeight} = useScale();
  const {coloursTheme, textStyles} = useStyle();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
    },
    iconContainer: {
      backgroundColor: coloursTheme.tertiaryColor,
      borderRadius: getRadius(50),
      paddingVertical: getHeight(10),
      paddingHorizontal: getWidth(10),
      marginRight: getWidth(10),
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: coloursTheme.card.backgroundColor,
      paddingVertical: getHeight(15),
      paddingHorizontal: getWidth(15),
      borderRadius: getRadius(10),
    },
    infoText: {
      ...textStyles.regular16,
      flexShrink: 1,
    },
    buttonContainer: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: getHeight(35),
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **
  const {forgotPassword} = useUser();
  const {alert} = useAlert();
  const {
    control,
    formState: {isValid},
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async data => {
    const {email} = data;
    try {
      const {success, error} = await forgotPassword({email});

      if (success) {
        navigation.navigate(ACCOUNT_SCREENS.RESET_PASSWORD, {email});
      } else {
        if (error) {
          const {body} = error;

          const {Title, Description, CTA} = Errors[body] || Errors.unknown;

          alert(Title, Description, [
            {
              text: CTA,
            },
          ]);
        }
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
      type: FIELD_TYPES.EMAIL,
      autoFocus: true,
      name: 'email',
      label: ForgotPassword.EmailAddress,
      placeholder: ForgotPassword.EmailAddressPlaceholder,
      autoCapitalize: 'none',
      defaultValue: route.params?.email || '',
      rules: {
        required: ForgotPassword.EmailAddressRequired,
        pattern: {
          value: emailRegex,
          message: ForgotPassword.EmailAddressInvalid,
        },
      },
      caretHidden: false,
      fieldFooterComponent: (
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <FontAwesome5Icon
              name="envelope"
              color={coloursTheme.primaryColor}
              size={20}
            />
          </View>

          <Text style={styles.infoText}>{ForgotPassword.InfoCard}</Text>
        </View>
      ),
    },
  ];

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader title={ForgotPassword.Title} />

      <ScreenContainer style={styles.container} enableKeyboardAvoidingView>
        <Form
          fields={fields}
          control={control}
          flatListProps={{
            scrollEnabled: false,
          }}
        />
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={ForgotPassword.SendCode}
            onPress={onSubmit}
            disabled={!isValid}
          />
        </View>
      </ScreenContainer>
    </>
  );
};

export default ForgotPassword;
