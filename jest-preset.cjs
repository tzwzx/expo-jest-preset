/* oxlint-disable unicorn/prefer-module -- Jest のプリセットは CommonJS でなければ読み込まれない */
// jest-expo をラップするフリート共通プリセット。
// 各アプリの jest.config.cjs は `preset: "@tzwzx/expo-jest-preset"` + アプリ固有分
// （coverageThreshold / collectCoverageFrom / setupFiles / 追加 testMatch 等）だけを書く。
//
// 【babel 設定について】
// 各リポのルートに babel.config.* は置かない（Metro が本番ビルドで読んでしまうため）。
// Jest 専用の babel オプションはこの transform に babelrc:false / configFile:false 付きで
// 閉じ込める。含まれるもの:
// - `unstable_transformProfile: "hermes-stable"` — 外すと babel-preset-expo が hermes-v0 に
//   フォールバックし、名前付きキャプチャグループを素の連番グループへ書き換えて静かに壊す
// - `babel-plugin-dynamic-import-node` — Jest の VM は動的 import() を実行できない。
//   try/catch に囲まれた await import(...) が「例外を握りつぶされて静かに失敗する」事故を防ぐ
// - react-native-worklets/plugin は babel-preset-expo が自動追加するため明示不要
const jestExpoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...jestExpoPreset,
  // キャッシュをリポジトリ内に固定してセッションをまたいで再利用する（.gitignore 前提）
  cacheDirectory: "<rootDir>/.jest-cache",
  // jest-expo 既定の testMatch は __tests__ 配下をすべてテスト扱いするため、
  // 拡張子で絞ってヘルパーファイルを除外する。追加ディレクトリ（store-shots 等）を
  // 持つアプリは自リポの jest.config.cjs で testMatch を上書きして拡張する
  testMatch: ["<rootDir>/src/__tests__/**/*.test.ts?(x)"],
  // jest-expo 既定の transform（アセット変換）は流用し、JS/TS 用エントリだけ差し替える
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
  // Expo 推奨パターンのスーパーセット。`react-native` プレフィックスは境界なしで
  // マッチするため react-native-* を含む。@gorhom/* / posthog-react-native /
  // @shopify/flash-list / store-shots はマッチしないので明示する
  // （使っていないアプリにあっても無害）。
  // https://docs.expo.dev/develop/unit-testing/
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|posthog-react-native|@gorhom/.*|@shopify/flash-list|store-shots)",
  ],
};
