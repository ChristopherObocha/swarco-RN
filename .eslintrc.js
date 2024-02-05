module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['eslint-plugin-local-rules'],
  rules: {
    'local-rules/flatlist-to-flashlist': 'error',
  },
};
