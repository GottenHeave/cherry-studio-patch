# cherry-studio-patch

Patch-based downstream for Cherry Studio.

`patches/cur` contains replayable changes on top of `CherryHQ/cherry-studio` `main`. The current patch accepts every file type for chat attachments only.

## Apply

```sh
scripts/apply-patches.sh /path/to/cherry-studio-worktree
```

## Validate

```sh
scripts/check-patches.sh /path/to/cherry-studio-worktree
```
