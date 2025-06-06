module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-expo|expo-modules-core|@expo|expo|@react-native|react-native|@react-navigation|react-navigation|react-native-reanimated)/)',
  ],
  setupFiles: [
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
    '<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock',
  ],
};
