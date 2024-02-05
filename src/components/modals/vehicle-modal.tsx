/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 11th Dec 2023, 07:06:18 am
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useState, useMemo, useEffect, useCallback} from 'react';

import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useForm} from 'react-hook-form';
import {useVehicle} from 'providers/apis/vehicle/ index';
import {useAlert} from 'providers/alert/alert-provider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import ModalContainer from 'components/containers/modal-container';
import {StyleSheet, View, Text} from 'react-native';

import {PrimaryButton} from 'components/buttons/primary-button';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {Spacer} from 'components/utils/spacer';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {alphanumericRegex} from 'utils/regex';
import {CreateVehicleRequest} from 'providers/types/vehicles';

import {TertiaryButton} from 'components/buttons/tertiary-button';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {getYearOptions} from 'utils/general-utils';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {CONNECTOR_TYPE_OPTIONS} from 'utils/constants';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
  data?: any; //will define appropriate type
}
interface FormState {
  regNumber: string;
  make: string;
  model: string;
  vColor: string;
  year: string;
  taxi: string;
  insurance: string;
  plug_type: (typeof CONNECTOR_TYPE_OPTIONS)[number]['value'];
}

const VehicleModal = ({modalVisible, closeModal, data}: Props) => {
  const {getHeight, getWidth} = useScale();
  const {textStyles, coloursTheme} = useStyle();
  const {dictionary} = useDictionary();
  const {
    Account: {Vehicle},
    Errors,
  } = dictionary;

  const vehicle = useMemo(() => data?.vehicle[0], [data?.vehicle]);
  const initialValues = useMemo(() => {
    if (vehicle) {
      const {
        colour,
        make,
        model,
        year_of_vehicle_manufacture,
        insurance_provider,
        registration_number,
        taxi_number,
        plug_type,
      } = vehicle;

      return {
        regNumber: registration_number,
        make,
        model,
        vColor: colour,
        year: year_of_vehicle_manufacture?.toString(),
        taxi: taxi_number,
        insurance: insurance_provider,
        plug_type: plug_type,
      };
    } else {
      return {
        regNumber: '',
        make: '',
        model: '',
        vColor: '',
        year: '',
        taxi: '',
        insurance: '',
        plug_type: '',
      };
    }
  }, [vehicle]);
  const {
    control,
    formState: {isValid},
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm<FormState>({
    mode: 'onBlur',
    defaultValues: initialValues,
  });

  const vehicleMake = watch('make');
  const {
    vehicleColors,
    vehicleMakes,
    getVehicleModels,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleRegistrationData,
    getVehicles,
  } = useVehicle();

  const {alert} = useAlert();

  const [modelOptions, setModelOptions] = useState<
    {label: string; value: string}[]
  >([]);

  const getModels = useCallback(
    async (make: string) => {
      const res = await getVehicleModels({vehicle_make: make});
      const transformedArray = res?.data?.ev_database.map(
        ({vehicle_model}: {vehicle_model: string}) => ({
          label: vehicle_model,
          value: vehicle_model, // You can customize the value property if needed
        }),
      );

      if (!transformedArray) {
        return;
      }

      setModelOptions(transformedArray);
    },
    [getVehicleModels],
  );

  useEffect(() => {
    if (vehicleMake) {
      getModels(vehicleMake);
    }
  }, [getModels, vehicleMake]);

  const vehicleDelete = useCallback(async () => {
    const {vehicle_id} = data;
    const res = await deleteVehicle(vehicle_id);

    if (res?.success) {
      getVehicles();
      closeModal();
    } else {
      //@ts-ignore
      const {body} = res?.error;

      const {Title, Description, CTA} = Errors[body] || Errors.unknown;

      alert(Title, Description, [{text: CTA}]);
    }
  }, [Errors, alert, closeModal, data, deleteVehicle, getVehicles]);

  const regNumber = watch('regNumber');

  const [showFullForm, setShowFullForm] = useState(!!vehicle);

  const handleSearchRegistration = useCallback(async () => {
    try {
      if (regNumber) {
        const res = await getVehicleRegistrationData({
          registrationNumber: regNumber,
        });

        if (res?.success && res.data && !!res.data.registration_number) {
          const {
            make,
            model,
            colour,
            registration_number,
            year_of_manufacture,
          } = res.data;

          setValue('make', make);
          setValue('model', model);
          setValue('vColor', colour);
          setValue('regNumber', registration_number);
          setValue('year', year_of_manufacture);

          setShowFullForm(true);
        } else {
          alert(
            Vehicle.RegistrationNotFoundTitle,
            Vehicle.RegistrationNotFoundDescription,
            [{text: Vehicle.RegistrationNotFoundCTA, onPress: () => reset()}],
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [regNumber, getVehicleRegistrationData, setValue, alert, Vehicle, reset]);

  const handleCloseModal = useCallback(() => {
    if (!vehicle) {
      setShowFullForm(false);
      reset();
    }
    closeModal();
  }, [vehicle, reset, closeModal]);

  const onSubmit = async (formState: FormState) => {
    if (!showFullForm) {
      return handleSearchRegistration();
    }

    const submissionData: CreateVehicleRequest = {
      registration_number: formState.regNumber,
      make: formState.make,
      model: formState.model,
      year_of_vehicle_manufacture: formState.year ? +formState.year : undefined,
      colour: formState.vColor,
      taxi_number: formState.taxi,
      insurance_provider: formState.insurance,
      plug_type: formState.plug_type,
    };

    try {
      const vehicle_id = data?.vehicle_id;
      const updateBody = Object.fromEntries(
        Object.entries(submissionData).filter(([, value]) => value),
      );
      const {success, error} = vehicle_id
        ? await updateVehicle({vehicle_id, ...updateBody})
        : await createVehicle(submissionData);

      if (success) {
        getVehicles();
        handleCloseModal();
      } else if (error?.body) {
        console.log(error);
        const {Title, Description, CTA} = Errors[error.body] || Errors.unknown;

        alert(Title, Description, [{text: CTA}]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {bottom} = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
      backgroundColor: coloursTheme.backgroundColor,
      height: getHeight(600),
    },
    contentContainer: {
      padding: getHeight(20),
      alignItems: 'center',
    },
    formContentContainer: {
      paddingHorizontal: getWidth(20),
    },
    titleText: {
      ...textStyles.semiBold25,
      color: coloursTheme.modal.text,
      textAlign: 'center',
      lineHeight: getHeight(30),
      marginBottom: getHeight(15),
    },
    descriptionText: {
      ...textStyles.regular16,
      color: coloursTheme.modal.text,
      textAlign: 'center',
      lineHeight: getHeight(20),
      marginBottom: getHeight(30),
    },
    prefixTextStyles: {
      ...textStyles.semiBold16,
      marginHorizontal: getWidth(10),
    },
    buttonContainer: {
      alignItems: 'center',
      paddingBottom: bottom,
      marginTop: getHeight(15),
    },
    searchIconContainer: {
      marginRight: getWidth(15),
    },
    fieldFooterContainer: {
      marginBottom: getHeight(30),
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    labelText: {
      ...textStyles.semiBold16,
    },
    optionalText: {
      ...textStyles.regular16,
    },
    calendarIcon: {
      marginRight: getWidth(15),
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **
  const renderLabel = useCallback(
    ({label, optional}: {label: string; optional?: boolean}) => (
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
        {optional && (
          <Text style={styles.optionalText}>{Vehicle.Optional}</Text>
        )}
      </View>
    ),
    [styles, Vehicle],
  );

  const fields: FieldProps[] = useMemo(() => {
    const baseFields = [
      {
        type: FIELD_TYPES.TEXT,
        name: 'regNumber',
        label: Vehicle.EnterRegNumberLabel,
        placeholder: Vehicle.EnterRegNumberPlaceholder,
        rules: {
          required: Vehicle.EnterRegRequired,
          pattern: {
            value: alphanumericRegex,
            message: Vehicle.EnterRegInvalid,
          },
        },
        fieldHeaderComponent: !showFullForm ? (
          <View style={styles.fieldFooterContainer}>
            <Text style={textStyles.regular16}>
              {Vehicle.EnterRegNumberHeader}
            </Text>
          </View>
        ) : (
          <></>
        ),
      },
    ];

    if (!showFullForm) {
      return baseFields;
    }

    return [
      ...baseFields,
      {
        type: FIELD_TYPES.DROPDOWN,
        name: 'make',
        label: Vehicle.VehicleMake,
        placeholder: Vehicle.VehicleMakePlaceholder,
        rules: {
          required: Vehicle.VehicleMakeRequired,
          pattern: {
            value: alphanumericRegex,
            message: Vehicle.VehicleMakeInvalid,
          },
        },
        data: vehicleMakes ?? [],
      },
      {
        type: FIELD_TYPES.DROPDOWN,
        name: 'vColor',
        label: Vehicle.VehicleColour,
        placeholder: Vehicle.VehicleColourPlaceholder,
        rules: {
          required: Vehicle.VehicleColourRequired,
          pattern: {
            value: alphanumericRegex,
            message: Vehicle.VehicleColourInvalid,
          },
        },
        data: vehicleColors ?? [],
      },
      {
        type: FIELD_TYPES.DROPDOWN,
        name: 'model',
        label: Vehicle.VehicleModel,
        placeholder: Vehicle.VehicleModelPlaceholder,
        rules: {
          required: Vehicle.VehicleModelRequired,
        },
        data: modelOptions ?? [],
      },
      {
        type: FIELD_TYPES.DROPDOWN,
        name: 'plug_type',
        label: Vehicle.VehicleConnectorType,
        placeholder: Vehicle.VehicleConnectorTypePlaceholder,
        rules: {
          required: Vehicle.VehicleConnectorTypeRequired,
        },
        data: CONNECTOR_TYPE_OPTIONS,
      },
      {
        type: FIELD_TYPES.DROPDOWN,
        name: 'year',
        label: renderLabel({label: Vehicle.VehicleYear, optional: true}),
        placeholder: Vehicle.VehicleYearPlaceholder,
        data: getYearOptions(),
        rightIcon: (
          <View style={styles.calendarIcon}>
            <FontAwesome5Pro name="calendar" size={getHeight(16)} />
          </View>
        ),
      },
      {
        type: FIELD_TYPES.TEXT,
        name: 'insurance',
        label: renderLabel({label: Vehicle.InsuranceProvider, optional: true}),
        placeholder: Vehicle.InsuranceProviderPlaceholder,
      },
      {
        type: FIELD_TYPES.TEXT,
        name: 'taxi',
        label: renderLabel({label: Vehicle.TaxiNumber, optional: true}),
        placeholder: Vehicle.TaxiNumberPlaceholder,
      },
    ];
  }, [
    Vehicle,
    styles.fieldFooterContainer,
    styles.calendarIcon,
    getHeight,
    showFullForm,
    textStyles.regular16,
    vehicleMakes,
    vehicleColors,
    modelOptions,
    renderLabel,
  ]);

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ModalContainer
      title={data ? Vehicle.UpdateVehicle : Vehicle.AddVehicle}
      modalVisible={modalVisible}
      closeModal={handleCloseModal}
      backgroundColor={coloursTheme.backgroundColor}>
      <Form
        control={control}
        fields={fields}
        flatListProps={{
          showsVerticalScrollIndicator: false,
          contentContainerStyle: styles.formContentContainer,
        }}
      />
      <View style={styles.buttonContainer}>
        {!showFullForm && (
          <>
            <SecondaryButton
              title={Vehicle.EnterManually}
              onPress={() => {
                clearErrors();
                setShowFullForm(true);
              }}
            />
            <Spacer vertical size={getHeight(20)} />
          </>
        )}
        <PrimaryButton
          title={
            !showFullForm
              ? Vehicle.Continue
              : data
              ? Vehicle.UpdateVehicle
              : Vehicle.AddVehicle
          }
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        />
        <Spacer vertical size={getHeight(20)} />
        {data && (
          <TertiaryButton
            title={Vehicle.DeleteVehicle}
            onPress={() => {
              alert(Vehicle.DeleteVehicle, Vehicle.DeleteVehicleConfirmation, [
                {
                  text: Vehicle.Cancel,
                  style: 'cancel',
                },
                {
                  text: Vehicle.Delete,
                  onPress: vehicleDelete,
                },
              ]);
            }}
          />
        )}
      </View>
    </ModalContainer>
  );
};

export default VehicleModal;
