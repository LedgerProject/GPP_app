/**
 * https://github.com/react-native-community/cli/blob/master/docs/configuration.md
 */
module.exports = {
  platforms: {
    ios: {},
    android: {}, 
  },
  assets: [
    "src/assets/images/*",
    "src/assets/fonts",
    "src/layouts/**/assets/*",
  ],
  dependencies: {
    'some-unsupported-package': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
