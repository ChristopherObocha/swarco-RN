import React, {useEffect, useMemo, useState} from 'react';

import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useStyle} from 'providers/style/style-provider';
import {useForm} from 'react-hook-form';
import {useScale} from 'providers/style/scale-provider';

import ModalContainer from 'components/containers/modal-container';
import {StyleSheet, Text, View} from 'react-native';
import {
  IconAndDescriptionList,
  InfoListCard,
} from 'components/cards/info-list-card';

import {Spacer} from 'components/utils/spacer';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import CurrencyInput from 'components/utils/currency-input';
import EnergyInput from 'components/utils/energy-input';
import {PrimaryButton} from 'components/buttons/primary-button';
import {TertiaryButton} from 'components/buttons/tertiary-button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PlugIcon =
  require('assets/svg/connector-types/type2-mennekes-light-blue.svg').default;

interface ChargingConfigurationModalProps {
  modalVisible: boolean;
  closeModal: () => void;
}

const chargingInstructionOptions = [
  {
    value: 'Time',
    label: 'Time',
  },
  {
    value: 'Total energy',
    label: 'Total energy',
  },
  {
    value: 'Money',
    label: 'Money',
  },
];

const durationField = {
  name: 'duration',
  label: 'Select duration',
  placeholder: 'Select duration',
  type: FIELD_TYPES.DATEPICKER,
  dateMode: 'time',
  dateFormat: "HH'h' mm'm'",
  rightIcon: 'clock',
  minuteInterval: 5,
};

const energyField = {
  name: 'maxEnergy',
  label: 'Select max energy',
  placeholder: 'Select max energy',
  type: FIELD_TYPES.CUSTOM,
  customComponent: EnergyInput,
};

const costField = {
  name: 'totalCost',
  label: 'Select total cost',
  placeholder: 'Select total cost',
  type: FIELD_TYPES.CUSTOM,
  customComponent: CurrencyInput,
};

const ChargingSessionConfigurationModal = ({
  modalVisible,
  closeModal,
}: ChargingConfigurationModalProps) => {
  const {
    dictionary: {
      Charging: {Configuration},
      Account: {
        ChargingGuide: {ChargingGuideDescription1},
      },
    },
  } = useDictionary();

  const sessionDetailsContent: IconAndDescriptionList[] = [
    {
      iconName: 'mobile',
      description: '{{App payment}}',
    },
    {
      customIcon: PlugIcon,
      description: '{{TYPE 2 MENNEKES}}',
    },
    {
      iconName: 'bolt',
      description: '{{7 kW}}',
    },
  ];

  // ** ** ** ** ** FORMS ** ** ** ** **
  const {control, watch} = useForm();
  const chargingInstructions = watch('chargingInstructions');
  const [fieldToRender, setFieldToRender] = useState<any>(null);

  useEffect(() => {
    if (chargingInstructions === 'Time') {
      setFieldToRender(durationField);
    }
    if (chargingInstructions === 'Total energy') {
      setFieldToRender(energyField);
    }
    if (chargingInstructions === 'Money') {
      setFieldToRender(costField);
    }
  }, [chargingInstructions]);

  const fields: FieldProps[] = useMemo(() => {
    const baseFields = [
      {
        name: 'chargingInstructions',
        label: 'Select charging instructions',
        placeholder: 'Select instructions',
        type: FIELD_TYPES.DROPDOWN,
        data: chargingInstructionOptions,
      },
    ];

    if (!fieldToRender) {
      return baseFields;
    }

    return [...baseFields, fieldToRender];
  }, [fieldToRender]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {coloursTheme} = useStyle();
  const {getWidth, getHeight} = useScale();
  const {bottom} = useSafeAreaInsets();

  const styles = StyleSheet.create({
    modalContainer: {
      paddingHorizontal: getWidth(20),
    },
    buttonContainer: {
      alignItems: 'center',
      marginBottom: bottom,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <ModalContainer
      modalVisible={modalVisible}
      closeModal={closeModal}
      title={Configuration.Title}
      backgroundColor={coloursTheme.backgroundColor}
      containerStyle={styles.modalContainer}>
      <InfoListCard
        title={Configuration.StationDetails}
        iconAndDescriptionList={sessionDetailsContent}
      />
      <Spacer size={getHeight(15)} vertical />
      <View>
        {/* numberOfLines subject to when copy is provided */}
        <Text numberOfLines={2}>{ChargingGuideDescription1}</Text>
      </View>
      <Spacer size={getHeight(30)} vertical />
      <Form fields={fields} control={control} />

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={Configuration.CTAButton}
          onPress={() => console.log('Not implemented')}
        />
        <TertiaryButton
          title={Configuration.HelpButton}
          onPress={() => console.log('Not implemented')}
        />
      </View>
    </ModalContainer>
  );
};

export default ChargingSessionConfigurationModal;
