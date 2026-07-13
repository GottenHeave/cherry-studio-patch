#!/usr/bin/env bash
set -euo pipefail

worktree="${1:?usage: scripts/check-patches.sh /path/to/cherry-studio-worktree [current|v1.9]}"
patchset="${2:-current}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"$repo_root/scripts/apply-patches.sh" "$worktree" "$patchset"
