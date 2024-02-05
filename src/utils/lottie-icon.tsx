/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 17th Oct 2023, 10:08:00 am
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useEffect, useRef} from 'react';
import {useScale} from 'the-core-ui-utils';

import Lottie from 'lottie-react-native';

interface LottieIconProps {
  animate?: boolean;
  lottieJSON: string;
  loop?: boolean;
  customWidth?: Number;
  customHeight?: Number;
  testID?: string;
}

export const LottieIcon = ({
  animate = false,
  lottieJSON,
  loop = true,
  customWidth,
  customHeight,
  testID = 'lottie-icon',
}: LottieIconProps) => {
  const {getWidth, getHeight} = useScale();

  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (animate) {
      animationRef.current?.play();
    } else {
      animationRef.current?.pause();
    }
  }, [animate]);

  return (
    <Lottie
      ref={animationRef}
      resizeMode="cover"
      source={lottieJSON}
      style={{
        width: customWidth ?? getWidth(210),
        height: customHeight ?? getHeight(210),
      }}
      loop={loop}
      testID={testID}
    />
  );
};
