#!/usr/bin/env bash
set -euo pipefail

worktree="${1:?usage: scripts/apply-patches.sh /path/to/cherry-studio-worktree [current|v1.9]}"
patchset="${2:-current}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

case "$patchset" in
  current) patch_dir="$repo_root/patches/cur" ;;
  v1.9) patch_dir="$repo_root/patches/v1.9" ;;
  *) echo "unknown patchset: $patchset" >&2; exit 1 ;;
esac

git -C "$worktree" am --3way "$patch_dir"/*.patch
