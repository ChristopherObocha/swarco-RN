/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 16th Oct 2023, 21:03:22 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useEffect, useState, useMemo} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useForm} from 'react-hook-form';

import {Spacer} from 'components/utils/spacer';
import {FIELD_TYPES} from 'the-core-ui-module-tdforms-v2';
import {FieldProps, Form} from 'components/utils/form';

import ModalContainer from 'components/containers/modal-container';
import {PrimaryButton} from 'components/buttons/primary-button';
import {SecondaryButton} from 'components/buttons/secondary-button';

import {
  SITE_FILTERS,
  FACILITIES_MAP,
  PAYMENT_METHODS_MAP,
  LOCATIONS_MAP,
  NETWORKS_MAP,
  ACCESS_TYPES_MAP,
  CONNECTOR_TYPE_MAP,
} from 'utils/constants';
import MapFilterCardComponent from 'components/form/filter-card';
import RangeSliderComponent from 'components/map-filters/map-range-slider';

interface FilterProps {
  searchValue: (string | number)[] | any;
  chargeSpeed?: {
    max: number;
    min: number;
  };
}
interface Props {
  modalVisible: boolean;
  closeModal: () => void;
  filterFunction: (
    val: any,
    speed?: {min: number; max: number} | undefined,
  ) => void;
  resetFunction: () => void;
  filter?: FilterProps;
}

type FieldProp = Omit<FieldProps, 'data'> & {
  data: {
    name: string;
    value?: string;
    icon?: string;
    altIcon?: string;
  }[];
};

const FilterModal = ({
  modalVisible,
  closeModal,
  filterFunction,
  resetFunction,
  filter,
}: Props) => {
  const {
    dictionary: {FilterModal},
  } = useDictionary();

  const [filters, setFilters] = useState<FilterProps | undefined>(filter);
  useEffect(() => {
    setFilters(filter);
  }, [filter]);

  const {coloursTheme, textStyles} = useStyle();
  const {getWidth, getHeight} = useScale();
  const {
    control,
    handleSubmit,
    setValue,
    reset: resetForm,
  } = useForm<{
    [SITE_FILTERS.SITE_PAYMENT_METHODS]: string | null;
    [SITE_FILTERS.NETWORK_FILTER]: string | null;
    [SITE_FILTERS.ACCESS_TYPES_FILTER]: string | null;
    [SITE_FILTERS.SITE_FACILITIES]: string | null;
    [SITE_FILTERS.SITE_LOCATIONS]: string | null;
    [SITE_FILTERS.CONNECTOR_TYPE]: string | null;
    [SITE_FILTERS.CHARGER_SPEED]: number | null;
  }>({
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      [SITE_FILTERS.SITE_PAYMENT_METHODS]: null,
      [SITE_FILTERS.NETWORK_FILTER]: null,
      [SITE_FILTERS.ACCESS_TYPES_FILTER]: null,
      [SITE_FILTERS.SITE_FACILITIES]: null,
      [SITE_FILTERS.SITE_LOCATIONS]: null,
      [SITE_FILTERS.CONNECTOR_TYPE]: null,
      [SITE_FILTERS.CHARGER_SPEED]: null,
    },
  });

  let fields: FieldProp[] = useMemo(
    () => [
      {
        type: FIELD_TYPES.CUSTOM,
        name: SITE_FILTERS.CONNECTOR_TYPE,
        label: SITE_FILTERS.CONNECTOR_TYPE,
        customComponent: MapFilterCardComponent,
        data: CONNECTOR_TYPE_MAP,
        setValueFunc: (val: string) => {
          setValue(SITE_FILTERS.CONNECTOR_TYPE, val);
        },
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: SITE_FILTERS.CHARGER_SPEED,
        label: 'item.question_text',
        customComponent: RangeSliderComponent,
        data: [],
        setValueFunc: (val: number) => {
          setValue(SITE_FILTERS.CHARGER_SPEED, val);
        },
        filters: filters?.chargeSpeed,
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: SITE_FILTERS.SITE_LOCATIONS,
        label: SITE_FILTERS.SITE_LOCATIONS,
        customComponent: MapFilterCardComponent,
        data: LOCATIONS_MAP,
        setValueFunc: (val: string) => {
          setValue(SITE_FILTERS.SITE_LOCATIONS, val);
        },
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: SITE_FILTERS.SITE_PAYMENT_METHODS,
        label: 'item.question_text',
        customComponent: MapFilterCardComponent,
        data: PAYMENT_METHODS_MAP,
        setValueFunc: (val: string) => {
          setValue(SITE_FILTERS.SITE_PAYMENT_METHODS, val);
        },
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: SITE_FILTERS.NETWORK_FILTER,
        label: SITE_FILTERS.NETWORK_FILTER,
        customComponent: MapFilterCardComponent,
        data: NETWORKS_MAP,
        setValueFunc: (val: string) => {
          setValue(SITE_FILTERS.NETWORK_FILTER, val);
        },
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: SITE_FILTERS.ACCESS_TYPES_FILTER,
        label: SITE_FILTERS.ACCESS_TYPES_FILTER,
        customComponent: MapFilterCardComponent,
        data: ACCESS_TYPES_MAP,
        setValueFunc: (val: string) => {
          setValue(SITE_FILTERS.ACCESS_TYPES_FILTER, val);
        },
      },
      {
        type: FIELD_TYPES.CUSTOM,
        name: SITE_FILTERS.SITE_FACILITIES,
        label: SITE_FILTERS.SITE_FACILITIES,
        customComponent: MapFilterCardComponent,
        data: FACILITIES_MAP,
        setValueFunc: (val: string) => {
          setValue(SITE_FILTERS.SITE_FACILITIES, val);
        },
      },
    ],
    [filters?.chargeSpeed, setValue],
  );

  const reset = () => {
    resetForm();
    setFilters(undefined);
    resetFunction();
  };

  const fieldsArray = useMemo(() => {
    const newFields = fields.map(field => ({
      ...field,
      data: field.data.map((item: any) => {
        return {
          ...item,
          isSelected:
            (filters &&
              filters?.searchValue.some(
                (value: any) => value?.name === item?.name,
              )) ||
            false,
        };
      }),
      showInfo: false,
    }));

    return newFields;
  }, [fields, filters]);

  const onSubmit = handleSubmit(data => {
    const paymentMethod = data[SITE_FILTERS.SITE_PAYMENT_METHODS] || '';
    const filteredNetworks = data[SITE_FILTERS.NETWORK_FILTER] || '';
    const accessTypeFilterData = data[SITE_FILTERS.ACCESS_TYPES_FILTER] || '';
    const facilitiesFilterData = data[SITE_FILTERS.SITE_FACILITIES] || '';
    const locationsFilterData = data[SITE_FILTERS.SITE_LOCATIONS] || '';
    const chargerSpeedData = data[SITE_FILTERS.CHARGER_SPEED] || '';
    const connectorType = data[SITE_FILTERS.CONNECTOR_TYPE] || '';

    const combinedData = [
      ...(paymentMethod ?? []),
      ...(filteredNetworks ?? []),
      ...(accessTypeFilterData ?? []),
      ...(facilitiesFilterData ?? []),
      ...(locationsFilterData ?? []),
      ...(connectorType ?? []),
    ].flat();

    if (combinedData.length === 0 && chargerSpeedData === '') {
      return closeModal();
    }

    let chargeSpeedData: any;
    if (chargerSpeedData !== (undefined || '')) {
      chargeSpeedData = {
        // @ts-ignore
        min: chargerSpeedData[0],
        // @ts-ignore
        max: chargerSpeedData[1],
      };
    } else {
      chargeSpeedData = undefined;
    }

    const filteredArray = combinedData.filter(
      (item: any) => item && item?.isSelected === true,
    );
    filterFunction({searchValue: filteredArray, chargeSpeed: chargeSpeedData});
  });

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
      backgroundColor: coloursTheme.backgroundColor,
      height: getHeight(600),
    },
    buttonContainer: {
      alignItems: 'center',
    },
    formContainer: {
      height: getHeight(367),
      width: getWidth(335),
    },
    text: {
      ...textStyles.regular16,
    },
    titleContainer: {
      alignItems: 'center',
    },
    subTitle: {
      marginTop: getHeight(5),
      ...textStyles.regular16,
    },
    form: {
      flex: 1,
      minHeight: getHeight(300),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ModalContainer
      title={FilterModal.Title}
      modalVisible={modalVisible}
      closeModal={closeModal}
      backgroundColor={coloursTheme.backgroundColor}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Form
            fields={fieldsArray}
            control={control}
            keyboardAvoidingViewProps={{
              enabled: false,
            }}
            flatListProps={{
              showsVerticalScrollIndicator: false,
              estimatedItemSize: 50,
            }}
          />
        </View>
        <Spacer vertical size={15} />
        <View style={styles.buttonContainer}>
          <SecondaryButton title={FilterModal.Reset} onPress={reset} />
          <Spacer vertical size={20} />
          <PrimaryButton
            title={FilterModal.SeeResults}
            onPress={onSubmit}
            showLoading
          />
        </View>
        <Spacer vertical size={75} />
      </ScrollView>
    </ModalContainer>
  );
};

export default FilterModal;
