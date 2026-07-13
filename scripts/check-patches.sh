#!/usr/bin/env bash
set -euo pipefail

worktree="${1:?usage: scripts/check-patches.sh /path/to/cherry-studio-worktree}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"$repo_root/scripts/apply-patches.sh" "$worktree"
