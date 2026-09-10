#!/usr/bin/env bash
set -euo pipefail
_VERIFY_BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$_VERIFY_BIN_DIR/../../../.." && pwd)"
EVIDENCE_ROOT="$REPO_ROOT/test-results/verify-expo-jest-preset"

verify_require_run_id() {
  [[ -n "${VERIFY_RUN_ID:-}" ]] || { echo "set VERIFY_RUN_ID" >&2; exit 2; }
}

verify_evidence_dir() {
  mkdir -p "$EVIDENCE_ROOT/$1"
  printf '%s\n' "$EVIDENCE_ROOT/$1"
}
