#!/usr/bin/env bash
set -euo pipefail

worktree="${1:?usage: scripts/apply-patches.sh /path/to/cherry-studio-worktree}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

git -C "$worktree" am --3way "$repo_root"/patches/cur/*.patch
