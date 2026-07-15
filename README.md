# cherry-studio-patch

Patch-based downstream for Cherry Studio.

`patches/cur` targets `CherryHQ/cherry-studio` `main`, and `patches/v1.9` targets the latest v1.9 release line. Both patchsets accept every file type for chat attachments only.

Both patchsets also register Clewdr as an explicit supplier type. Their
Anthropic Messages adapters support arbitrary file documents and preserve
Claude Web-only or future stream events as raw chunks without changing the
official Anthropic adapter. Tool progress deltas remain available without
modifying assistant text or tool arguments, and raw chunks are emitted once
when callers request them explicitly. Focused tests also verify that a Clewdr
stream network error does not repeat the HTTP request when retries are disabled.
The v1.9 patchset seeds the model list exposed by Clewdr's `/v1/models`
endpoint.

## Apply

```sh
scripts/apply-patches.sh /path/to/cherry-studio-worktree
```

## Validate

```sh
scripts/check-patches.sh /path/to/cherry-studio-worktree
```

GitHub Actions additionally applies both patchsets, runs their focused Clewdr
tests, and runs Cherry Studio's `build:check` command for both baselines.

Every push to `patchset` that changes `patches/**` publishes new current and
v1.9.12 patch releases. Each baseline publishes as soon as its own validation
succeeds, independently of the other baseline. The release workflow also
retains manual baseline selection for one-off rebuilds.
