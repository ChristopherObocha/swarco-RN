import React, {useEffect} from 'react';
import {Switch, Text} from '@rneui/themed';

import {StyleSheet, View} from 'react-native';
import {useStyle} from 'providers/style/style-provider';
import {useScale} from 'providers/style/scale-provider';

const normalizeValue = {
  displayValue: (value: string) => value === 'true',
  storedValue: (value: boolean) => (value ? `${value}` : value),
};

const CustomSwitchCard = ({item, controllerProps, commonProps}: any) => {
  const {
    field: {onChange, value},
  } = controllerProps;
  const {testID = 'CustomSwitchCard'} = commonProps;

  useEffect(() => {
    onChange(normalizeValue.storedValue(!!value));
  }, [value, onChange]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {textStyles} = useStyle();
  const {getWidth, getHeight, getRadius} = useScale();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: getWidth(20),
      paddingVertical: getHeight(10),
      borderRadius: getRadius(10),
      marginBottom: getHeight(20),
    },
    labelText: {
      ...textStyles.semiBold16,
      flex: 0.9,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{item.label}</Text>

      <Switch
        {...commonProps}
        value={normalizeValue.displayValue(value)}
        onValueChange={(val: boolean) => {
          onChange(normalizeValue.storedValue(val));
        }}
        testID={testID}
      />
    </View>
  );
};

export default CustomSwitchCard;
