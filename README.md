# cherry-studio-patch

Patch-based downstream for Cherry Studio.

`patches/cur` targets `CherryHQ/cherry-studio` `main`, and `patches/v1.9` targets the latest v1.9 release line. Both patches accept every file type for chat attachments only.

## Apply

```sh
scripts/apply-patches.sh /path/to/cherry-studio-worktree
```

## Validate

```sh
scripts/check-patches.sh /path/to/cherry-studio-worktree
```
