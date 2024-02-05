import React from 'react';
import {useStyle} from 'providers/style/style-provider';

import {Input, Text} from '@rneui/themed';

const CurrencyInput = ({commonProps}: any) => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {textStyles} = useStyle();

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Input
      {...commonProps}
      leftIcon={<Text style={textStyles.regular16}>£</Text>}
    />
  );
};

export default CurrencyInput;
