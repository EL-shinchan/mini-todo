# Iron Log iCloud Shared Album Import Design

Date: 2026-04-30
Target project: `workout-tracker/`
Album: `Iron Log`

## Goal
Let Eddie record workout photos/videos on iPhone and rely on iCloud Photos sync instead of manually uploading media into Iron Log.

## Approved Direction
Watch the iCloud Shared Album named **Iron Log** directly from the Mac mini Photos app.

## Flow
1. Eddie records workout media on iPhone.
2. Eddie adds/syncs it to the shared iCloud album **Iron Log**.
3. Mac mini importer checks the Photos album on a schedule.
4. New album items are exported/copied into Iron Log's existing local media queue.
5. Each imported item creates a pending queue job.
6. Existing processor analyzes queued images/videos.
7. Eddie reviews/imports processed drafts inside Iron Log.

## Safety Rules
- Only read from album exactly named `Iron Log`.
- Never delete or edit Photos/iCloud items.
- Only copy media into `workout-tracker/data/photo-drafts/uploads`.
- Keep a local seen list so old album items are not repeatedly imported.
- If Photos permission is missing, fail with a clear setup message.

## Local State
Store importer state outside git:

- `workout-tracker/data/icloud-import/seen.json`
- `workout-tracker/data/icloud-import/exports/`

## Implementation
Add script:

- `workout-tracker/scripts/import_icloud_album.py`

The script should:
- query Photos via AppleScript
- list media from album `Iron Log`
- export unseen media to a temp/export folder
- create queue job JSON compatible with the existing photo/video queue
- mark imported Photos IDs as seen only after successful queue creation

## Known Risk
macOS Photos automation may require user approval in System Settings / Photos. The first probe timed out, likely because Photos access needs permission or the app is waiting/hanging.
