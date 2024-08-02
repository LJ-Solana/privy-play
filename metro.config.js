const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const defaultSourceExts = config.resolver.sourceExts;
  config.resolver.sourceExts = [...defaultSourceExts, 'cjs'];

  config.resolver.extraNodeModules = {
    crypto: require.resolve('react-native-crypto'),
  };

  return config;
})();
