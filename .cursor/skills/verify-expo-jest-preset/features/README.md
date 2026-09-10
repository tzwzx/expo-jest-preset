# expo-jest-preset verification map

Source contract for the shared Jest preset. Consumer `bun test:unit` is out of scope here.

## Baseline preconditions

- `bin/doctor` exits 0.
- Set `VERIFY_RUN_ID`.
- Drive `bin/inspect` only.

## Features

- [Preset contract](./preset.md) covers hermes-stable, dynamic-import-node, cache dir, testMatch, and ExpoObserve patch.
