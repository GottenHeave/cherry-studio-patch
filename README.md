# cherry-studio-patch

Patch-based downstream for Cherry Studio.

`patches/cur` targets `CherryHQ/cherry-studio` `main`, and `patches/v1.9` targets the latest v1.9 release line. Both patchsets accept every file type for chat attachments only.

The current patchset also registers Clewdr as an explicit supplier type. Its
Anthropic Messages adapter supports arbitrary file documents and filters
Claude Web-only stream events without changing the official Anthropic adapter.

## Apply

```sh
scripts/apply-patches.sh /path/to/cherry-studio-worktree
```

## Validate

```sh
scripts/check-patches.sh /path/to/cherry-studio-worktree
```

GitHub Actions additionally runs the focused attachment and Clewdr tests plus
Cherry Studio's `build:check` command on the current patchset.
