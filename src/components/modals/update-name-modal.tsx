/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Wed, 15th Nov 2023, 5:01:26 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {useForm} from 'react-hook-form';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useAlert} from 'providers/alert/alert-provider';

import {FIELD_TYPES} from 'the-core-ui-module-tdforms-v2';
import ModalContainer from 'components/containers/modal-container';
import {Spacer} from 'components/utils/spacer';
import {PrimaryButton} from 'components/buttons/primary-button';
import {FieldProps, Form} from 'components/utils/form';
import {useUser} from 'providers/apis/user';
import {useProfile} from 'providers/apis/profile';
import {useLoading} from 'providers/loading/loading-provider';
import {notEmptyRegex} from 'utils/regex';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
}

const UpdateNameModal = ({modalVisible, closeModal}: Props) => {
  const testID = 'updateNameModal';
  const {
    dictionary: {PersonalDetails, Errors, CreateAccount},
  } = useDictionary();
  const {getWidth, getHeight} = useScale();
  const {textStyles, coloursTheme} = useStyle();
  const {alert} = useAlert();
  const {updateUser} = useUser();
  const {profile} = useProfile();
  const {setButtonLoading} = useLoading();

  const {
    control,
    formState: {isValid},
    handleSubmit,
  } = useForm({mode: 'onBlur', shouldFocusError: false});

  const onSubmit = handleSubmit(async data => {
    try {
      setButtonLoading(true);
      const {firstName, lastName} = data;
      const {success, error} = await updateUser({
        firstname: firstName,
        lastname: lastName,
      });

      if (success) {
        alert(
          PersonalDetails.NameUpdateTitle,
          PersonalDetails.NameUpdateDescription,
          [
            {
              text: PersonalDetails.NameUpdateCTA,
              onPress: closeModal,
            },
          ],
        );
      } else if (error) {
        const {body} = error;

        const {Title, Description, CTA} = Errors[body] || Errors.unknown;

        alert(Title, Description, [{text: CTA}]);
      }
    } catch (error) {
      console.log(error);
      alert(
        PersonalDetails.NameUpdatedErrorTitle,
        PersonalDetails.NameUpdatedErrorDescription,
        [
          {
            text: PersonalDetails.NameUpdateCTA,
            onPress: closeModal,
          },
        ],
      );
    } finally {
      setButtonLoading(false);
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
    primaryButtonContainer: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'flex-end',
      paddingBottom: getHeight(51),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **

  const fields: FieldProps[] = [
    {
      type: FIELD_TYPES.TEXT,
      name: 'firstName',
      label: PersonalDetails.FirstName,
      placeholder: PersonalDetails.FirstNamePlaceholder,
      defaultValue: profile?.firstname,
      rules: {
        required: CreateAccount.FirstNameRequired,
        pattern: {
          value: notEmptyRegex,
          message: CreateAccount.FirstNameInvalid,
        },
      },
    },
    {
      type: FIELD_TYPES.TEXT,
      name: 'lastName',
      label: PersonalDetails.LastName,
      placeholder: PersonalDetails.LastNamePlaceholder,
      errorStyle: {
        marginBottom: getHeight(0),
      },
      defaultValue: profile?.lastname,
      rules: {
        required: CreateAccount.LastNameRequired,
        pattern: {
          value: notEmptyRegex,
          message: CreateAccount.LastNameInvalid,
        },
      },
    },
  ];

  return (
    <ModalContainer
      modalVisible={modalVisible}
      closeModal={closeModal}
      backgroundColor={coloursTheme.backgroundColor}>
      <View style={styles.container}>
        <Form
          fields={fields}
          control={control}
          keyboardAvoidingViewProps={{
            enabled: true,
          }}
          flatListProps={{
            scrollOnFocused: true,
            ListHeaderComponent: (
              <>
                <Spacer vertical size={15} />
                <Text style={styles.headerText} testID={`${testID}.headerText`}>
                  {PersonalDetails.UpdateNameModalTitle}
                </Text>
                <Spacer vertical size={30} />
              </>
            ),
            showsVerticalScrollIndicator: false,
          }}
        />
      </View>
      <PrimaryButton
        title={PersonalDetails.ConfirmButton}
        testID={`${testID}.button`}
        onPress={onSubmit}
        disabled={!isValid}
        containerStyle={styles.primaryButtonContainer}
        showLoading
      />
    </ModalContainer>
  );
};

export default UpdateNameModal;
