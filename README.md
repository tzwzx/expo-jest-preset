# @tzwzx/expo-jest-preset

Expo アプリ群で共有する jest-expo ラッパープリセット。各リポの `jest.config.cjs` に散っていた共通骨格
（hermes-stable transform / dynamic-import-node / cacheDirectory / testMatch / transformIgnorePatterns）を一元化する。

設定の実体と「なぜその設定なのか」は [`jest-preset.cjs`](jest-preset.cjs) のコメントに書いてある。
**変更する前に必ずそれを読むこと。** ここには消費側の使い方と、変更時に踏む罠を書く。

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

アプリ側に書くのは **coverage 系 / setupFiles / アプリ固有の上書き**だけ。

- `testMatch` の既定は `src/__tests__/**/*.test.ts?(x)`。`src/__tests__` の外にもテストを置くアプリは
  アプリ側で上書きして拡張する
- 独自の babel プラグインが要るアプリは、アプリ側で `transform` を上書きする
  （`require("@tzwzx/expo-jest-preset")` を spread して plugins を足す）
- `moduleNameMapper` は不要（jest-expo が tsconfig.json の paths から自動生成する）
- `cacheDirectory` が `<rootDir>/.jest-cache` なので、アプリの `.gitignore` に入れておく

## 変更するときの注意（外すと静かに壊れる）

- **`unstable_transformProfile: "hermes-stable"` を外さない。** 外すと babel-preset-expo が hermes-v0 へ
  フォールバックし、**名前付きキャプチャグループを素の連番グループへ書き換える**。テストは落ちず結果だけ変わる
- **`babel-plugin-dynamic-import-node` を外さない。** Jest の VM は動的 `import()` を実行できない。
  `try/catch` に囲まれた `await import(...)` は**例外を握りつぶされてモックが一度も呼ばれない形で失敗する**
- **`babelrc: false` / `configFile: false` を外さない。** 各リポのルートに `babel.config.*` は置かない前提
  （Metro が `expo run:ios` / `eas build` でも読んでしまうため）。Jest 側の babel 設定はこのプリセットで完結させる
- **`transform` はまるごと置き換えず、`jestExpoPreset.transform` を spread する。**
  jest-expo のアセット変換を落とすと画像・フォントの import が壊れる

## 変更したときの確認

このリポジトリ単体では検証できない（jest-expo と実アプリのテストが要る）。
消費側で実測すること。

```bash
cd <消費側のアプリ>
# package.json の @tzwzx/expo-jest-preset を "file:../expo-jest-preset" へ一時的に差し替える
bun install && bun test:unit
git restore package.json bun.lock && bun install   # 復元
```

`transform` 系（`transformIgnorePatterns` / babel オプション）を触った場合は、
**キャッシュを消してから**確認する。変換結果は `cacheDirectory` に残るため、
古い変換結果のままテストが通ってしまう。

```bash
bunx jest --clearCache && bun test:unit
```

反映は各アプリで `bun update @tzwzx/expo-jest-preset`。

## 配布

npm には公開せず `github:tzwzx/expo-jest-preset` の Git URL 依存で消費する。

```jsonc
// 各アプリの package.json devDependencies
"@tzwzx/expo-jest-preset": "github:tzwzx/expo-jest-preset"
```

- バージョンを固定したい場合はタグ/コミットを付ける: `github:tzwzx/expo-jest-preset#v0.1.0`
- git 依存でも node_modules へはパッケージ名（`@tzwzx/expo-jest-preset`）で配置されるため、
  jest の `preset:` 解決はそのまま動く
- **git 依存では `package.json` の `files` が効かず、リポジトリ全体が node_modules に入る**
