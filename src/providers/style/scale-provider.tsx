import {useScale as useScaleCore} from 'the-core-ui-utils';

/*

Provides the TypeScript definitions for the core utils package as its in Javascript

*/

interface ScaleProviderInterface {
  getHeight: (val: number) => number;
  getWidth: (val: number) => number;
  getFontSize: (val: number) => number;
  getRadius: (val: number) => number;
}

export const useScale = () => {
  return useScaleCore() as ScaleProviderInterface;
};
