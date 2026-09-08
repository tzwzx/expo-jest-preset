// Jest presets must be CommonJS.
// Fleet wrapper around jest-expo. App jest.config.cjs should only add
// app-specific pieces (coverageThreshold, collectCoverageFrom, setupFiles,
// extra testMatch).
//
// Do not put babel.config.* at a repo root — Metro will read it in production
// builds. Keep Jest-only Babel options here with babelrc:false / configFile:false:
// - unstable_transformProfile: "hermes-stable" — without it, babel-preset-expo
//   falls back to hermes-v0 and silently rewrites named capture groups to
//   numbered ones
// - babel-plugin-dynamic-import-node — Jest's VM cannot run dynamic import();
//   await import(...) in try/catch otherwise fails silently
// - react-native-worklets/plugin is added by babel-preset-expo; do not add it again
const jestExpoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...jestExpoPreset,
  // Pin the cache inside the repo so it survives sessions (.gitignore it)
  cacheDirectory: "<rootDir>/.jest-cache",
  // Patch jest-expo mocks after its setup. App setupFiles are appended after
  // the preset's (Jest's merge order), so this does not drop them.
  setupFiles: [
    ...(jestExpoPreset.setupFiles ?? []),
    require.resolve("./expo-observe-mock-patch.cjs"),
  ],
  // jest-expo's default testMatch treats everything under __tests__ as a test.
  // Restrict by extension so helpers are excluded. Apps that keep tests outside
  // src/__tests__ should override testMatch in their own jest.config.cjs.
  testMatch: ["<rootDir>/src/__tests__/**/*.test.ts?(x)"],
  // Reuse jest-expo asset transforms; replace only the JS/TS entry.
  transform: {
    ...jestExpoPreset.transform,
    "\\.[jt]sx?$": [
      "babel-jest",
      {
        babelrc: false,
        caller: { bundler: "metro", name: "metro", platform: "ios" },
        configFile: false,
        plugins: ["babel-plugin-dynamic-import-node"],
        presets: [
          ["babel-preset-expo", { unstable_transformProfile: "hermes-stable" }],
        ],
      },
    ],
  },
  // Superset of Expo's recommended pattern. The `react-native` prefix matches
  // without a boundary, so it already covers react-native-*. @gorhom/*,
  // posthog-react-native, and @shopify/flash-list do not match and must be
  // listed (harmless if an app does not use them).
  // https://docs.expo.dev/develop/unit-testing/
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|posthog-react-native|@gorhom/.*|@shopify/flash-list)",
  ],
};
