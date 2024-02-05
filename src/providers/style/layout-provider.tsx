import React, {useMemo, useState} from 'react';
import {Dimensions, View, LayoutChangeEvent} from 'react-native';

import {ChildrenProps} from '../../generic-types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleProvider} from './style-provider';
import {
  DimensionConstantsInterface,
  ScreenLayoutInterface,
} from './style-provider-types';
import {getHeightRatio} from 'utils/general-utils';

/*

Provides the true layout dimentions and header height of the device

*/

const INITIAL_DIMENSIONS = Dimensions.get('window');

const DEFAULT_DIMENSIONS_CONTEXT_VALUE: ScreenLayoutInterface = {
  width: INITIAL_DIMENSIONS.width,
  height: INITIAL_DIMENSIONS.height,
  heightRatio: getHeightRatio(INITIAL_DIMENSIONS),
};

// ** ** ** ** ** PROVIDE ** ** ** ** **
export function LayoutProvider({children}: ChildrenProps) {
  // ** ** ** ** ** SETUP ** ** ** ** **
  const insets = useSafeAreaInsets();

  const [layout, setLayout] = useState<ScreenLayoutInterface>(
    DEFAULT_DIMENSIONS_CONTEXT_VALUE,
  );

  const handleLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {width, height} = nativeEvent.layout;
    setLayout({width, height, heightRatio: getHeightRatio(nativeEvent.layout)});
  };

  // ** ** ** ** ** METHODS ** ** ** ** **
  const dimensionConstants: DimensionConstantsInterface = useMemo(() => {
    return {
      HEADER_HEIGHT: 49 + insets.top,
      SCREEN_LAYOUT: layout,
    };
  }, [insets.top, layout]);

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <View onLayout={handleLayout} style={{flex: 1}}>
      <StyleProvider dimensionConstants={dimensionConstants}>
        {children}
      </StyleProvider>
    </View>
  );
}
