# Iron Log Import Monitor Design

## Goal
Give Eddie one clear page that answers: did my iCloud/video upload arrive, is it being processed, is it ready to import, or did it fail?

## Scope
Add an **Imports** page to the Iron Log PWA. It displays queued media jobs from the existing `/api/photo-drafts` endpoint and automation timing from `/api/config`.

## Page layout
The page has four focused panels:

1. **Automation status**
   - Shows whether the processor is enabled.
   - Shows importer time as 5 minutes before the processor time.
   - Shows processor time and timezone.

2. **Ready drafts**
   - Shows jobs with `status: "processed"`.
   - Displays exercise summary, set summary, source media type, and import/review action.

3. **Pending**
   - Shows jobs with `status: "pending"`.
   - Explains they are waiting for scheduled processing.
   - Allows delete.

4. **Failed**
   - Shows jobs with `status: "failed"`.
   - Displays the error reason.
   - Allows delete.

## Actions
- Ready draft action links to the normal workout import/review flow already used by drafts.
- Pending and failed jobs can be deleted using the existing DELETE `/api/photo-drafts/:id` endpoint.
- Retry is intentionally out of scope for v1. If needed later, it can be added as a small backend endpoint that resets a failed job to pending.

## Data flow
- Frontend fetches `/api/photo-drafts` and groups jobs by status.
- Frontend fetches `/api/config` for automation schedule.
- No new queue format is introduced.
- No queued data is committed to git.

## Error handling
- If drafts cannot load, show a clear inline error.
- If config cannot load, show drafts anyway and mark automation status unavailable.
- If delete fails, show the backend error message.

## Testing
- Syntax check JS files.
- Start app locally and fetch `/imports.html`.
- Fetch `/api/photo-drafts` and confirm processed/pending/failed grouping works.
- Verify nav link exists.
