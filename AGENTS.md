# Repository Instructions

## Repository Role

This repository is a patch-based downstream of `CherryHQ/cherry-studio`. It
stores replayable patch series and the automation that validates and releases
them; it does not contain a maintained copy of the upstream source tree.

Treat the upstream project as the read-only source of baseline code. Make
downstream source changes in a disposable upstream worktree, then export the
resulting commits into this repository's patch series. Do not commit an
upstream source tree, generated build output, or dependencies here.

## Downstream Scope

The downstream behavior changes currently maintained are:

- Chat attachments selected with the file picker, added by drag and drop, or
  added from the clipboard accept every file type.
- The current patchset registers an explicit `clewdr` supplier type whose
  Anthropic Messages adapter supports arbitrary file documents and normalizes
  Claude Web stream events. Clewdr compatibility must not change the official
  Anthropic supplier behavior.

Keep that behavior limited to chat attachments. Do not relax restrictions for
knowledge bases, avatars, plugins, or any other upload flow. Do not add
unrelated Cherry Studio changes to these patch series.

## Baselines and Layout

- `patches/cur/` targets the current `CherryHQ/cherry-studio` `main` branch.
- `patches/v1.9/` targets the v1.9 release line. The release workflow currently
  maps this patchset to upstream tag `v1.9.12`.
- `scripts/apply-patches.sh` applies a selected patch series with
  `git am --3way`. Its accepted patchset names are `current` and `v1.9`.
- `scripts/check-patches.sh` currently verifies only that the selected series
  applies. Despite its name, it does not run upstream tests or builds.
- `.github/workflows/validate-patches.yml` validates the `current` series
  against a fresh shallow clone of upstream `main`, runs focused chat attachment
  and Clewdr tests, and runs upstream `build:check`. After a successful push
  that changes `patches/**`, it releases both maintained baselines.
- `.github/workflows/release.yml` applies the selected series to a fresh
  upstream checkout, builds desktop installers, and publishes only packaged
  release assets. It supports both manual dispatch and calls from the validation
  workflow.

## Patch Maintenance Workflow

1. Start from a clean checkout or worktree at the exact upstream baseline for
   the patchset being changed. Read the upstream repository instructions and
   the local documentation for every source area you touch.
2. Configure a Git identity before applying patches; `git am` requires one.
3. Apply the existing series from this repository:

   ```sh
   scripts/apply-patches.sh /path/to/cherry-studio-worktree current
   scripts/apply-patches.sh /path/to/cherry-studio-worktree v1.9
   ```

   Run only the command for the baseline being changed. If application fails,
   investigate the upstream conflict and abort the incomplete operation with
   `git am --abort` before retrying.
4. Modify the applied upstream source and its focused tests. Follow that
   baseline's package manager, formatting, naming, and test conventions.
5. Keep each downstream concern in a focused commit. Export the commit series
   with `git format-patch` and replace the matching files under the appropriate
   `patches/` directory. Preserve numeric ordering and mail-formatted patch
   metadata; do not hand-edit hunk offsets as a substitute for regeneration.
6. Review the exported patch itself. Every changed hunk must implement or test
   the downstream scope above.

When upstream changes cause conflicts, adapt the downstream commit to the new
upstream API and regenerate the patch. Do not add compatibility code for an
obsolete upstream implementation unless the maintained v1.9 patchset requires
it.

## Verification

Use a fresh, clean upstream checkout for each patchset because applying a
series creates commits and mutates the target repository.

At minimum, verify application for every changed series:

```sh
scripts/check-patches.sh /path/to/clean-current-worktree current
scripts/check-patches.sh /path/to/clean-v1.9-worktree v1.9
```

Then run the focused upstream tests that exercise each changed attachment and
Clewdr compatibility path in the patched worktree. For changes to release or
validation automation, also review the workflow's baseline-to-patchset mapping,
artifact paths, and command syntax. Do not claim `check-patches.sh` ran tests or
a build.

Before committing patch content, confirm:

- both maintained patch series still express the same downstream behavior
  where their upstream code permits it;
- tests cover the affected picker, drag-and-drop, and clipboard paths;
- non-chat upload restrictions remain unchanged.
- Clewdr compatibility is selected by supplier type and official Anthropic
  request and stream validation behavior remains unchanged.

For every commit, confirm `git status` contains only the requested patch,
documentation, script, or workflow changes.

## Change Discipline

- Keep the `patchset` branch as the repository's integration branch.
- Keep commits focused and use Conventional Commit subjects.
- Do not modify CI action versions, release packaging, supported baselines, or
  downstream product behavior unless the task explicitly requires it.
- Update `README.md`, this file, scripts, and workflows together when their
  user-facing commands or baseline mappings change.
