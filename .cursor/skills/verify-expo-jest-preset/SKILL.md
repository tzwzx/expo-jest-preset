---
name: verify-expo-jest-preset
description: "Inspect the shared jest-expo preset contract (@tzwzx/expo-jest-preset). Use when proving hermes-stable, dynamic-import-node, or the ExpoObserve patch. Live bun test in a consumer app is out of scope unless that app is already the workspace."
---

# Verify expo-jest-preset

The user surface is a Jest preset file consumed as `preset: "@tzwzx/expo-jest-preset"`. This checkout does not install `jest-expo` / `jest` (peerDependencies). `require("./jest-preset.cjs")` will fail here. The README says this repo cannot be verified alone.

This harness proves the **source contract** the fleet depends on: the strings and files a consumer will load. A live `bun test:unit` in kata / yugaku / etc. is a consumer proof and is `verified-unreachable` from this repo unless that app is already open and ready.

Read `features/README.md` before driving.

## Launch

```bash
export VERIFY_RUN_ID=verify-$(date +%Y%m%dT%H%M%S)
export PATH_VERIFY=".cursor/skills/verify-expo-jest-preset/bin"
```

No install. Do not `bun add jest-expo` in this repo for verification.

## Doctor

```bash
.cursor/skills/verify-expo-jest-preset/bin/doctor
```

Checks package name and that `jest-preset.cjs` plus `expo-observe-mock-patch.cjs` exist.

## Drive

```bash
"$PATH_VERIFY/inspect" --name preset-contract
```

## Evidence

`test-results/verify-expo-jest-preset/<name>/{jest-preset.cjs,expo-observe-mock-patch.cjs,contract.txt,exit.txt}`.

Proof standards:

- Drive the shipped files, not a rewritten preset.
- Every `OK` line is a literal substring.
- Do not treat a green test run in another app as this repo's proof unless you also captured this inspect.
- Do not install peer deps here to force a `require()`.

## Cleanup

```bash
.cursor/skills/verify-expo-jest-preset/bin/cleanup
```

No scratch. Leaves evidence.

## Helpers

```bash
.cursor/skills/verify-expo-jest-preset/bin/doctor
VERIFY_RUN_ID=<id> .cursor/skills/verify-expo-jest-preset/bin/inspect --name STEM
VERIFY_RUN_ID=<id> .cursor/skills/verify-expo-jest-preset/bin/cleanup
```

## Isolate

Read-only. Consumer jest runs belong in that app's own verify skill.
