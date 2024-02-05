import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useForm} from 'react-hook-form';
import {useScale} from 'providers/style/scale-provider';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import ScreenContainer from 'components/containers/screen-container';
import DefaultHeader from 'components/headers/default-header';
import {PrimaryButton} from 'components/buttons/primary-button';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {
  AccountContainerParamList,
  ACCOUNT_SCREENS,
  APP_CONTAINER_SCREENS,
  AppContainerParamList,
} from '../../types/navigation';
import {useUser} from 'providers/apis/user';
import {useAlert} from 'providers/alert/alert-provider';
import {useAuth} from 'providers/apis/auth';
import {useProfile} from 'providers/apis/profile';
import {notEmptyRegex, postcodeRegex} from 'utils/regex';
import {getCountryOptions} from 'utils/general-utils';
import {deleteObject, setObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';

interface AddHomeAddressProps
  extends StackScreenProps<
    AccountContainerParamList,
    ACCOUNT_SCREENS.ADD_HOME_ADDRESS
  > {}

interface AddHomeAddressForm {
  address1: string;
  address2: string;
  town: string;
  postcode: string;
  country: string;
}

type AccountContainerNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AppContainerParamList>,
  StackNavigationProp<AccountContainerParamList>
>;

const AddHomeAddress = ({route}: AddHomeAddressProps) => {
  const {
    dictionary: {AddHomeAddress, Errors},
  } = useDictionary();
  const navigation = useNavigation<AccountContainerNavigationProp>();

  const {
    formState: userInformation,
    userAddress: address,
    isUpdate,
    isBusinessUser,
    redirect,
  } = route.params;

  useEffect(() => {
    if (!isUpdate && !userInformation) {
      navigation.replace(ACCOUNT_SCREENS.SIGN_IN);
    }
  }, [isUpdate, navigation, userInformation]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight} = useScale();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
    },
    buttonContainer: {
      alignItems: 'center',
      marginBottom: getHeight(43),
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **
  const {alert} = useAlert();

  const {
    control,
    handleSubmit,
    formState: {isValid},
  } = useForm<AddHomeAddressForm>({
    mode: 'onBlur',
  });

  const {createUser, updateUser} = useUser();
  const {login} = useAuth();
  const {getProfile, profile} = useProfile();

  const onSubmit = async (data: AddHomeAddressForm) => {
    try {
      if (isUpdate) {
        const {success, error} = await updateUser({
          address1: data.address1,
          address2: data.address2,
          town: data.town,
          postcode: data.postcode,
          country: data.country,
        });

        if (success) {
          getProfile();
          return navigation.navigate(ACCOUNT_SCREENS.PERSONAL_DETAILS);
        } else {
          if (error?.body) {
            const {Title, Description, CTA} =
              Errors[error.body] || Errors.unknown;

            alert(Title, Description, [{text: CTA}]);
          }

          return;
        }
      }

      const {success, error} = await createUser({...data, ...userInformation});

      if (success) {
        const {success: loginSuccess, error: loginError} = await login({
          username: userInformation.email,
          password: userInformation.password,
        });

        if (loginSuccess) {
          deleteObject(STORAGE.GUEST_USERNAME);
          deleteObject(STORAGE.GUEST_PASSWORD);
          deleteObject(STORAGE.GUEST_TOKEN);
          setObject(STORAGE.IS_BUSINESS_USER, isBusinessUser);
          await getProfile();

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
          } else {
            navigation.navigate(ACCOUNT_SCREENS.VERIFY_ACCOUNT, {
              email: userInformation.email,
              redirect,
            });
          }
        } else {
          if (loginError?.body) {
            const {Title, Description} =
              Errors[loginError?.body] || Errors.unknown;

            alert(Title, Description);
          }
        }
      } else {
        if (error?.body) {
          const {Title, Description, CTA} =
            Errors[error.body] || Errors.unknown;

          alert(Title, Description, [{text: CTA}]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fields: FieldProps[] = useMemo(
    () => [
      {
        type: FIELD_TYPES.TEXT,
        name: 'address1',
        label: AddHomeAddress.AddressLine1,
        placeholder: AddHomeAddress.AddressLine1Placeholder,
        rules: {
          required: AddHomeAddress.AddressLine1Required,
          pattern: {
            value: notEmptyRegex,
            message: AddHomeAddress.AddressLine1Invalid,
          },
        },
        defaultValue: address?.line_1 || '',
      },
      {
        type: FIELD_TYPES.TEXT,
        name: 'address2',
        label: AddHomeAddress.AddressLine2,
        placeholder: AddHomeAddress.AddressLine2Placeholder,
        defaultValue: address?.line_2 || '',
        rules: {
          pattern: {
            value: notEmptyRegex,
            message: AddHomeAddress.AddressLine2Invalid,
          },
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        name: 'town',
        label: AddHomeAddress.Town,
        placeholder: AddHomeAddress.TownPlaceholder,
        rules: {
          required: AddHomeAddress.TownRequired,
          pattern: {
            value: notEmptyRegex,
            message: AddHomeAddress.TownInvalid,
          },
        },
        defaultValue: address?.town_or_city || '',
      },
      {
        type: FIELD_TYPES.TEXT,
        name: 'postcode',
        label: AddHomeAddress.Postcode,
        placeholder: AddHomeAddress.PostcodePlaceholder,
        rules: {
          required: AddHomeAddress.PostcodeRequired,
          pattern: {
            value: postcodeRegex,
            message: AddHomeAddress.PostcodeInvalid,
          },
        },
        defaultValue: address?.postcode || '',
      },
      {
        type: FIELD_TYPES.DROPDOWN,
        name: 'country',
        label: AddHomeAddress.Country,
        placeholder: AddHomeAddress.CountryPlaceholder,
        data: getCountryOptions(),
        rules: {
          required: AddHomeAddress.CountryRequired,
        },
        defaultValue: address?.country || '',
      },
    ],
    [AddHomeAddress, address],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader
        title={isUpdate ? AddHomeAddress.UpdateTitle : AddHomeAddress.Title}
        customBackAction={() =>
          isUpdate
            ? navigation.navigate(ACCOUNT_SCREENS.PERSONAL_DETAILS)
            : navigation.navigate(ACCOUNT_SCREENS.CREATE_ACCOUNT)
        }
      />

      <ScreenContainer style={styles.container} enableKeyboardAvoidingView>
        <Form
          fields={fields}
          control={control}
          flatListProps={{
            showsVerticalScrollIndicator: false,
            ListHeaderComponent: (
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title={AddHomeAddress.SearchAddress}
                  onPress={() =>
                    navigation.navigate(ACCOUNT_SCREENS.SEARCH_ADDRESS, {
                      ...(userInformation && {
                        formState: userInformation,
                      }),
                      isUpdate: isUpdate,
                      redirect,
                    })
                  }
                />
              </View>
            ),
            ListFooterComponent: (
              <PrimaryButton
                title={AddHomeAddress.SubmitButton}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
              />
            ),
            ListFooterComponentStyle: {alignItems: 'center'},
          }}
        />
      </ScreenContainer>
    </>
  );
};

export default AddHomeAddress;
