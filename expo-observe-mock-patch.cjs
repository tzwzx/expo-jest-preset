// Jest の setupFiles は CommonJS でなければ読み込まれない。
// expo-image 57.0.2 は import 時に requireOptionalNativeModule("ExpoObserve") を呼び、
// truthy が返ると observe.getIntegrations() を続けて呼ぶ（expo-observe 連携の初期化）。
// jest 環境では globalThis.expo.modules に ExpoObserve が無いため NativeModulesProxy
// フォールバックへ落ち、jest-expo 57.0.3 の NativeUnimoduleProxy モック仕様
// （configure / dispatchEvents / setBundleDefaults のみで getIntegrations が無い）が
// truthy として返る。結果、expo-image を import する全テストスイートが
// TypeError: observe.getIntegrations is not a function で起動に失敗する
// （2026-08 に expo-image 57.0.1 → 57.0.2 の更新で実測）。
//
// requireOptionalNativeModule は globalThis.expo.modules を最優先で参照するため、
// ここへ完全なモックを置いてフォールバックより先に解決させる。
// getIntegrations が空 = 連携無効、が「expo-observe を導入していない実機」の既定動作。
// jest-expo のモック仕様（moduleMocks/expoModules.js）に getIntegrations が追加されたら
// このパッチは削除できる。
if (globalThis.expo?.modules && !globalThis.expo.modules.ExpoObserve) {
  globalThis.expo.modules.ExpoObserve = {
    addListener: () => ({ remove() {} }),
    configure: () => {},
    dispatchEvents: () => {},
    getIntegrations: () => ({}),
    removeListeners: () => {},
    setBundleDefaults: () => {},
  };
}
