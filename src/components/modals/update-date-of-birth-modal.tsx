/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Wed, 17th Nov 2023, 11:34:26 am
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useCallback, useMemo} from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {useForm} from 'react-hook-form';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useAlert} from 'providers/alert/alert-provider';
import {useProfile} from 'providers/apis/profile';
import {useUser} from 'providers/apis/user';
import {useLoading} from 'providers/loading/loading-provider';

import {FIELD_TYPES} from 'the-core-ui-module-tdforms-v2';
import ModalContainer from 'components/containers/modal-container';
import {Spacer} from 'components/utils/spacer';
import {PrimaryButton} from 'components/buttons/primary-button';
import {FieldProps, Form} from 'components/utils/form';
import {dateOfBirthRestrictions} from 'utils/constants';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
}

const UpdateDateOfBirthModal = ({modalVisible, closeModal}: Props) => {
  const testID = 'updateDateOfBirthModal';
  const {
    dictionary: {PersonalDetails, Errors},
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
      const {dateOfBirth} = data;
      const {success, error} = await updateUser({dateofbirth: dateOfBirth});

      if (success) {
        alert(
          PersonalDetails.DateOfBirthUpdateTitle,
          PersonalDetails.DateOfBirthUpdateDescription,
          [
            {
              text: PersonalDetails.DateOfBirthUpdateCTA,
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
        PersonalDetails.DateOfBirthUpdatedErrorTitle,
        PersonalDetails.DateOfBirthUpdatedErrorDescription,
        [
          {
            text: PersonalDetails.DateOfBirthUpdateCTA,
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
    prefixTextStyles: {
      ...textStyles.semiBold16,
      marginHorizontal: getWidth(10),
    },
    primaryButtonContainer: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'flex-end',
      paddingBottom: getHeight(51),
    },
    dateOfBirthLabelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateOfBirthText: {...textStyles.semiBold16},
    optionalText: {...textStyles.regular16},
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  const DateOfBirthPlaceHolder = useCallback(
    () => (
      <View style={styles.dateOfBirthLabelContainer}>
        <Text style={styles.dateOfBirthText}>
          {PersonalDetails.DateOfBirth}
        </Text>
        <Text style={styles.optionalText}>{PersonalDetails.Optional}</Text>
      </View>
    ),
    [PersonalDetails, styles],
  );

  const fields: FieldProps[] = useMemo(
    () => [
      {
        type: FIELD_TYPES.DATEPICKER,
        name: 'dateOfBirth',
        label: <DateOfBirthPlaceHolder />,
        placeholder: PersonalDetails.DateOfBirthPlaceholder,
        dateFormat: 'dd/MM/yyyy',
        minimumDate: dateOfBirthRestrictions.minimumDate,
        maximumDate: dateOfBirthRestrictions.maximumDate,
        defaultValue: null ?? '',
        defaultPickerValue:
          profile?.dateofbirth ?? dateOfBirthRestrictions.defaultDate,
      },
    ],
    [DateOfBirthPlaceHolder, PersonalDetails, profile?.dateofbirth],
  );

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
                  {PersonalDetails.UpdateDateOfBirthModalTitle}
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

export default UpdateDateOfBirthModal;
