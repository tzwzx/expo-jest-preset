// Jest setupFiles must be CommonJS.
// expo-image 57.0.2 calls requireOptionalNativeModule("ExpoObserve") on import
// and, if truthy, immediately calls observe.getIntegrations(). In Jest,
// ExpoObserve is missing from globalThis.expo.modules, so the call falls
// through to NativeModulesProxy. jest-expo 57.0.3's NativeUnimoduleProxy mock
// (configure / dispatchEvents / setBundleDefaults only) is truthy but has no
// getIntegrations, so every suite that imports expo-image dies with
// TypeError: observe.getIntegrations is not a function
// (reproduced 2026-08 on expo-image 57.0.1 → 57.0.2).
//
// requireOptionalNativeModule checks globalThis.expo.modules first, so a
// complete mock here wins over the fallback. Empty getIntegrations matches a
// device that never installed expo-observe. Delete this patch once jest-expo's
// moduleMocks/expoModules.js grows getIntegrations.
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
