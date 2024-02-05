import React, {useEffect, useMemo} from 'react';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useForm} from 'react-hook-form';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ModalContainer from 'components/containers/modal-container';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {
  SESSION_DATE_VALUES,
  SESSION_FILTER_NAMES,
  getSessionDateOptions,
} from 'utils/constants';
import FilterMultiSelect from 'components/form/filter-multi-select';
import AnimatedCard from 'components/animated/animated-card';
import {Spacer} from 'components/utils/spacer';
import {PrimaryButton} from 'components/buttons/primary-button';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {endOfDay, format, sub} from 'date-fns';
import {FilterParamsState} from './sessions-screen';
import {parseDate} from 'utils/general-utils';
import CurrencyInput from 'components/utils/currency-input';
import ScreenContainer from 'components/containers/screen-container';

interface SessionFilterModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  saveFunction: (filters: FilterParamsState, skipModalClose?: boolean) => void;
  filters: FilterParamsState;
}

type FieldProp = FieldProps & {
  options?: {
    name: string;
    icon: string;
  }[];
};

const SessionFilterModal = ({
  modalVisible,
  closeModal,
  saveFunction,
  filters,
}: SessionFilterModalProps) => {
  const {
    dictionary: {
      Sessions: {FilterModal},
    },
  } = useDictionary();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme, textStyles} = useStyle();
  const {getWidth, getHeight} = useScale();
  const {bottom} = useSafeAreaInsets();
  const styles = StyleSheet.create({
    formContainer: {
      paddingHorizontal: getWidth(20),
    },
    buttonContainer: {
      marginTop: getHeight(30),
      paddingBottom: bottom + getHeight(20),
      alignItems: 'center',
    },
    form: {
      minHeight: getHeight(5),
    },
    formBottomPaddingReduction: {
      marginBottom: getHeight(-15),
    },
  });

  // ** ** ** ** ** FORM ** ** ** ** **
  const initialForm = {
    [SESSION_FILTER_NAMES.SESSION_DATE]: '',
    [SESSION_FILTER_NAMES.DATE_FROM]: '',
    [SESSION_FILTER_NAMES.DATE_TO]: format(new Date(), 'dd/MM/yyyy'),
    [SESSION_FILTER_NAMES.PRICE_FROM]: '00.00',
    [SESSION_FILTER_NAMES.PRICE_TO]: '',
  };

  const {control, setValue, watch, handleSubmit, reset} = useForm({
    defaultValues: initialForm,
  });

  const sessionDateFilterStrings = useMemo(
    () => ({
      monthString: FilterModal.LastMonth,
      threeMonthString: FilterModal.LastThreeMonths,
      sixMonthString: FilterModal.LastSixMonths,
      customString: FilterModal.CustomDateRange,
    }),
    [
      FilterModal.CustomDateRange,
      FilterModal.LastMonth,
      FilterModal.LastSixMonths,
      FilterModal.LastThreeMonths,
    ],
  );

  const dateOption = watch(SESSION_FILTER_NAMES.SESSION_DATE);

  const fieldsToRender = useMemo(() => {
    if (dateOption === SESSION_DATE_VALUES.CUSTOM) {
      const customDateFields = [
        {
          type: FIELD_TYPES.DATEPICKER,
          name: SESSION_FILTER_NAMES.DATE_FROM,
          label: FilterModal.DateFrom,
          placeholder: FilterModal.SelectDate,
          dateFormat: 'dd/MM/yyyy',
          fieldHeaderComponent: (
            <>
              <Text style={textStyles.regular16}>
                {FilterModal.CustomDateRangeDescription}
              </Text>
              <Spacer size={getHeight(20)} vertical />
            </>
          ),
          maximumDate: new Date(),
          defaultValue: filters.date_from,
        },
        {
          type: FIELD_TYPES.DATEPICKER,
          name: SESSION_FILTER_NAMES.DATE_TO,
          label: FilterModal.DateTo,
          placeholder: FilterModal.SelectDate,
          dateFormat: 'dd/MM/yyyy',
          maximumDate: new Date(),
          defaultValue: filters.date_to,
          fieldFooterComponent: (
            <View style={styles.formBottomPaddingReduction} />
          ),
        },
      ];

      return customDateFields;
    } else {
      return null;
    }
  }, [
    FilterModal.CustomDateRangeDescription,
    FilterModal.DateFrom,
    FilterModal.DateTo,
    FilterModal.SelectDate,
    dateOption,
    filters.date_from,
    filters.date_to,
    getHeight,
    styles.formBottomPaddingReduction,
    textStyles.regular16,
  ]);

  let dateFormFields: FieldProp[] = useMemo(() => {
    const baseFields = [
      {
        type: FIELD_TYPES.CUSTOM,
        name: SESSION_FILTER_NAMES.SESSION_DATE,
        options: getSessionDateOptions(sessionDateFilterStrings),
        customComponent: FilterMultiSelect,
        setValueFunc: (
          name: keyof typeof SESSION_FILTER_NAMES,
          val: string,
        ) => {
          setValue(name, val);
        },
        defaultValue: filters.dateOption,
      },
    ];

    if (!fieldsToRender) {
      return baseFields;
    }

    return [...baseFields, ...fieldsToRender];
  }, [sessionDateFilterStrings, filters.dateOption, fieldsToRender, setValue]);

  let priceFormFields: FieldProps[] = useMemo(
    () => [
      {
        type: FIELD_TYPES.CUSTOM,
        customComponent: CurrencyInput,
        name: SESSION_FILTER_NAMES.PRICE_FROM,
        label: FilterModal.PriceFrom,
        placeholder: FilterModal.PricePlaceholder,
        fieldHeaderComponent: (
          <>
            <Text style={textStyles.regular16}>
              {FilterModal.PriceDescription}
            </Text>
            <Spacer size={getHeight(20)} vertical />
          </>
        ),
        defaultValue: filters.price_from?.toString() ?? '',
      },
      {
        type: FIELD_TYPES.CUSTOM,
        customComponent: CurrencyInput,
        name: SESSION_FILTER_NAMES.PRICE_TO,
        label: FilterModal.PriceTo,
        placeholder: FilterModal.PricePlaceholder,
        defaultValue: filters.price_to?.toString() ?? '',
        fieldFooterComponent: (
          <View style={styles.formBottomPaddingReduction} />
        ),
      },
    ],
    [
      FilterModal.PriceDescription,
      FilterModal.PriceFrom,
      FilterModal.PricePlaceholder,
      FilterModal.PriceTo,
      filters.price_from,
      filters.price_to,
      getHeight,
      textStyles.regular16,
      styles.formBottomPaddingReduction,
    ],
  );

  const handleSave = handleSubmit((data: any) => {
    let dateFrom;
    let dateTo: Date | undefined = new Date();

    switch (data[SESSION_FILTER_NAMES.SESSION_DATE]) {
      case SESSION_DATE_VALUES.MONTH:
        dateFrom = dateTo && sub(dateTo, {months: 1});
        break;
      case SESSION_DATE_VALUES.THREE_MONTH:
        dateFrom = dateTo && sub(dateTo, {months: 3});
        break;
      case SESSION_DATE_VALUES.SIX_MONTH:
        dateFrom = dateTo && sub(dateTo, {months: 6});
        break;
      case SESSION_DATE_VALUES.CUSTOM:
        dateFrom = parseDate(data[SESSION_FILTER_NAMES.DATE_FROM]);
        dateTo = parseDate(data[SESSION_FILTER_NAMES.DATE_TO]);
        break;
    }

    saveFunction({
      dateOption: data[SESSION_FILTER_NAMES.SESSION_DATE],
      date_from: dateFrom?.toISOString(),
      date_to: dateFrom ? dateTo && endOfDay(dateTo)?.toISOString() : undefined,
      price_from: data[SESSION_FILTER_NAMES.PRICE_FROM],
      price_to: data[SESSION_FILTER_NAMES.PRICE_TO],
    });
  });

  const resetFunction = () => {
    reset(initialForm);
    setValue(SESSION_FILTER_NAMES.SESSION_DATE, '');
    saveFunction({
      dateOption: '',
      date_from: undefined,
      date_to: undefined,
      price_from: undefined,
      price_to: undefined,
    });
  };

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ModalContainer
      title={FilterModal.Title}
      modalVisible={modalVisible}
      closeModal={closeModal}
      backgroundColor={coloursTheme.backgroundColor}>
      <ScreenContainer enableKeyboardAvoidingView>
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}>
          <AnimatedCard
            title={FilterModal.DateTitle}
            animatedContent={
              <View style={styles.form}>
                <Form fields={dateFormFields} control={control} />
              </View>
            }
            showMoreInfoText={false}
            titleStyles={textStyles.semiBold20}
            isOpen
            headerContainerStyles={{paddingRight: getHeight(5)}}
          />
          <Spacer size={getHeight(20)} vertical />
          <AnimatedCard
            title={FilterModal.PriceTitle}
            animatedContent={
              <View style={styles.form}>
                <Form fields={priceFormFields} control={control} />
              </View>
            }
            showMoreInfoText={false}
            titleStyles={textStyles.semiBold20}
            isOpen
          />
          <View style={styles.buttonContainer}>
            <SecondaryButton
              title={FilterModal.Reset}
              onPress={() => resetFunction()}
            />
            <Spacer size={getHeight(20)} vertical />
            <PrimaryButton
              title={FilterModal.SeeResults}
              onPress={handleSave}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    </ModalContainer>
  );
};

export default SessionFilterModal;
