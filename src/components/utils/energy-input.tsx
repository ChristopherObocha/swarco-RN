import React from 'react';
import {useStyle} from 'providers/style/style-provider';

import {Input, Text} from '@rneui/themed';
import {StyleSheet} from 'react-native';

const EnergyInput = ({commonProps}: any) => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {textStyles} = useStyle();
  const styles = StyleSheet.create({
    rightIcon: {
      marginRight: 10,
    },
  });

  return (
    <Input
      {...commonProps}
      rightIcon={
        <Text style={[textStyles.regular16, styles.rightIcon]}>kWh</Text>
      }
    />
  );
};

export default EnergyInput;
