const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround: some Android devices throw "Unable to activate keep awake" in dev startup.
// We alias expo-keep-awake to a no-op shim for this app's development flow.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'expo-keep-awake': path.resolve(__dirname, 'shims/expo-keep-awake.js'),
};

module.exports = config;
