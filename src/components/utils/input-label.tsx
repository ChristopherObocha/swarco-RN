import React from 'react';

import {useStyle} from 'providers/style/style-provider';

import {View, StyleSheet} from 'react-native';
import {Text} from '@rneui/themed';

interface InputLabelProps {
  label: string;
  rightLabel?: string;
  testID?: string;
}

const InputLabel = ({
  label,
  rightLabel,
  testID = 'InputLabel',
}: InputLabelProps) => {
  const {textStyles} = useStyle();

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    labelStyle: {
      ...textStyles.semiBold16,
    },
    rightLabelStyle: {
      ...textStyles.regular16,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View style={styles.labelContainer} testID={testID}>
      <Text style={styles.labelStyle} testID={`${testID}.label`}>
        {label}
      </Text>
      <Text style={styles.rightLabelStyle} testID={`${testID}.rightLabel`}>
        {rightLabel}
      </Text>
    </View>
  );
};

export default InputLabel;
