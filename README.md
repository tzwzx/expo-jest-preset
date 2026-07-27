# @tzwzx/expo-jest-preset

tazawa の Expo アプリ群で共有する jest-expo ラッパープリセット。各リポの `jest.config.cjs` に散っていた共通骨格（hermes-stable transform / dynamic-import-node / cacheDirectory / testMatch / transformIgnorePatterns）を一元化する。

## 使い方

```js
// jest.config.cjs（各アプリ）
module.exports = {
  preset: "@tzwzx/expo-jest-preset",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/__tests__/**"],
  coverageThreshold: {
    global: { branches: 83, functions: 100, lines: 100, statements: 100 },
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
```

- `testMatch` の既定は `src/__tests__/**/*.test.ts?(x)`。store-shots などの追加ディレクトリを持つアプリはアプリ側で上書きして拡張する
- 独自の babel プラグイン（yaboyo の preserve-expo-os-plugin 等）が要るアプリは、アプリ側で `transform` を上書きする（`require("@tzwzx/expo-jest-preset")` を spread して plugins を足す）
- `moduleNameMapper` は不要（jest-expo が tsconfig.json の paths から自動生成する）

## 移行時の注意

- 各リポの `jest.config.cjs` から共通部分を削除し `preset` を差し替える
- ルートに `babel.config.*` を置かない前提は変わらない（このプリセットが Jest 側を完結させる）

## 配布（npm には公開しない）

GitHub リポジトリを直接依存として消費する（`agent-session-gate` と同方式）:

```jsonc
// 各アプリの package.json devDependencies
"@tzwzx/expo-jest-preset": "github:tzwzx/expo-jest-preset"
```

- バージョンを固定したい場合はタグ/コミットを付ける: `github:tzwzx/expo-jest-preset#v0.1.0`
- git 依存でも node_modules へはパッケージ名（@tzwzx/expo-jest-preset）で配置されるため、jest の `preset:` 解決はそのまま動く
