/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 24th Oct 2023, 11:01:26 am
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {useForm} from 'react-hook-form';
import {useUser} from 'providers/apis/user';
import {useNavigation} from '@react-navigation/native';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useAuth} from 'providers/apis/auth';
import {useAlert} from 'providers/alert/alert-provider';
import {useProfile} from 'providers/apis/profile';

import {FIELD_TYPES} from 'the-core-ui-module-tdforms-v2';
import ModalContainer from 'components/containers/modal-container';
import {Spacer} from 'components/utils/spacer';
import {PrimaryButton} from 'components/buttons/primary-button';
import {emailRegex} from 'utils/regex';
import {FieldProps, Form} from 'components/utils/form';

import {StackNavigationProp} from '@react-navigation/stack';
import {AccountContainerParamList} from '../../types/navigation';
import {useLoading} from 'providers/loading/loading-provider';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
}

type NavigationProp = StackNavigationProp<AccountContainerParamList>;

const DeleteAccountModal = ({modalVisible, closeModal}: Props) => {
  const testID = 'deleteAccountModal';
  const {
    dictionary: {SignIn, DeleteAccount, Errors},
  } = useDictionary();
  const {getWidth} = useScale();
  const {textStyles, coloursTheme} = useStyle();
  const {logout} = useAuth();
  const {alert} = useAlert();
  const {deleteUser} = useUser();
  const {profile} = useProfile();

  const {
    control,
    formState: {isValid},
    handleSubmit,
  } = useForm({mode: 'onBlur', shouldFocusError: false});

  const navigation = useNavigation<NavigationProp>();

  const handleAcceptSuccess = () => {
    closeModal();
    navigation.popToTop();
  };
  const {setLoading} = useLoading();

  const onSubmit = handleSubmit(async () => {
    setLoading(true);
    try {
      const {success, error} = await deleteUser();

      if (success) {
        logout();

        alert(
          DeleteAccount.DeleteAccountSuccess,
          DeleteAccount.DeleteAccountSuccessMessage,
          [
            {
              text: DeleteAccount.Ok,
              onPress: () => handleAcceptSuccess(),
            },
          ],
        );
      } else if (error) {
        console.log('error', error);
        const {body} = error;

        const {Title, Description, CTA} = Errors[body] || Errors.unknown;

        alert(Title, Description, [{text: CTA}]);
      }
    } catch (error: any) {
      console.log('error', error);
      alert('Error', error);
    } finally {
      setLoading(false);
    }
  });

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
      flex: 1,
    },
    headerText: {
      ...textStyles.semiBold25,
    },
    text: {
      ...textStyles.regular16,
    },
    formContainer: {
      backgroundColor: coloursTheme.card.backgroundColor,
    },
    listFooterContainer: {
      alignItems: 'center',
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  const fields: FieldProps[] = [
    {
      type: FIELD_TYPES.EMAIL,
      name: 'email',
      label: DeleteAccount.ConfirmEmailAddress,
      placeholder: DeleteAccount.EmailPlaceholder,
      rules: {
        required: SignIn.EmailRequired,
        pattern: {
          value: emailRegex,
          message: SignIn.EmailInvalid,
        },
        validate: (value: string) =>
          value.toLowerCase() === profile?.email || SignIn.EmailInvalid,
      },
      caretHidden: false,
    },
  ];

  return (
    <ModalContainer modalVisible={modalVisible} closeModal={closeModal}>
      <View style={styles.container}>
        <Form
          fields={fields}
          control={control}
          keyboardAvoidingViewProps={{
            enabled: true,
          }}
          flatListProps={{
            scrollOnFocused: true,
            contentContainerStyle: styles.formContainer,
            ListHeaderComponent: (
              <>
                <Spacer vertical size={15} />
                <Text style={styles.headerText} testID={`${testID}.headerText`}>
                  {DeleteAccount.DeleteAccount}
                </Text>
                <Spacer vertical size={15} />
                <Text style={styles.text} testID={`${testID}.text`}>
                  {DeleteAccount.MainText}
                </Text>
              </>
            ),
            ListFooterComponentStyle: styles.listFooterContainer,
            showsVerticalScrollIndicator: false,
            ListFooterComponent: (
              <>
                <Spacer vertical size={155} />
                <PrimaryButton
                  title={DeleteAccount.Delete}
                  disabled={!isValid}
                  testID={`${testID}.button`}
                  onPress={onSubmit}
                  isDelete
                />
              </>
            ),
          }}
        />
      </View>
    </ModalContainer>
  );
};

export default DeleteAccountModal;
