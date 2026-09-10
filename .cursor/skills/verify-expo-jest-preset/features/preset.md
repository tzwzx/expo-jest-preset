# Preset contract

Consumers set `preset: "@tzwzx/expo-jest-preset"`. The file must keep hermes-stable, dynamic-import-node, isolated Babel (`babelrc`/`configFile` false), the in-repo Jest cache path, the default testMatch, and the ExpoObserve mock patch.

## Sub-features

- `preset-contract` asserts those literals in `jest-preset.cjs` and `expo-observe-mock-patch.cjs`.

## How to get to it (user POV)

- In an app `jest.config.cjs`: `preset: "@tzwzx/expo-jest-preset"`.
- After changing this package: `bun update @tzwzx/expo-jest-preset` in each app, then that app's `bun test:unit`.

## Driving it with verify-inspect

Preconditions: `bin/doctor` has passed.

- **Contract.** Run `"$PATH_VERIFY/inspect" --name preset-contract`. `exit.txt` is `0`. `contract.txt` is all `OK` for `jest-expo/jest-preset`, `unstable_transformProfile: "hermes-stable"`, `babel-plugin-dynamic-import-node`, `babelrc: false`, `configFile: false`, `cacheDirectory: "<rootDir>/.jest-cache"`, the default `testMatch`, `expo-observe-mock-patch.cjs`, and patch `ExpoObserve` / `getIntegrations`.
- **Consumer jest.** `verified-unreachable` from this checkout (no jest-expo). If a consumer app is already the workspace and its doctor is green, drive that app's own verify skill instead of installing peers here.
- **Proof.** Keep `contract.txt` and the copied sources.

## Gotchas

- `require("./jest-preset.cjs")` throws here without `jest-expo`. That is not a product regression.
- Jest cache can hide a transform change in a consumer. That warning lives in the README; do not clear another app's cache from this repo.
