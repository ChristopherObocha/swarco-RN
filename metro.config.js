/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Fix: https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#apollo-client-355-2021-11-23
const {getDefaultConfig} = require('metro-config');
const jsoMetroPlugin = require('obfuscator-io-metro-plugin')(
  {
    compact: false,
    sourceMap: false,
    controlFlowFlattening: true, // Control flow flattening is a structure transformation of the source code that hinders program comprehension
    controlFlowFlatteningThreshold: 1, // set percentage of nodes that will affected by control flow flattening
    numbersToExpressions: true,
    simplify: true, // Enables additional code obfuscation through simplification.
    log: true,
    shuffleStringArray: true,
    splitStrings: true,
    stringArrayThreshold: 1,
  },
  {
    runInDev: true /* optional */,
    logObfuscatedFiles: true /* optional generated files will be located at ./.jso */,
  },
);
const {resolver: defaultResolver} = getDefaultConfig.getDefaultValues();

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      ...defaultResolver,
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'cjs'],
    },
    ...jsoMetroPlugin,
  };
})();
