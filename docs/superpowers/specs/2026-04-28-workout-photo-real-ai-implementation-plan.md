# Workout Tracker Real AI Photo Parser Implementation Plan

Date: 2026-04-28
Target project: `workout-tracker/`

## Goal
Replace the mock workout photo parser with a real OpenAI Vision parser while keeping the same safe upload → editable draft → normal save flow.

## Phase 1 — Dependencies and config
- Add `openai` for the Vision API call.
- Add `dotenv` so local `.env` can provide `OPENAI_API_KEY`.
- Ensure `.env` is ignored by git.
- Keep the app usable with a clear error if the key is missing.

## Phase 2 — Parser service
- Update `server/services/photoDraftParser.js`.
- Send uploaded image buffer to OpenAI as a data URL.
- Use a strict JSON schema-style prompt.
- Extract:
  - body weight if visible
  - body weight unit
  - exercises
  - sets with weight, reps, notes
  - draft notes
- Sanitize the model response before sending it to the frontend.

## Phase 3 — Error handling
- Missing API key returns a clear setup error.
- OpenAI failure returns a clean extraction error.
- Bad/empty JSON returns a reviewable failure message.
- Never autosave parsed data.

## Phase 4 — Validation
- Run syntax checks.
- Start server without API key and confirm upload returns clear missing-key error.
- Confirm normal routes still work.
- Commit and push.

## Manual setup after code lands
Create `workout-tracker/.env` with:

```bash
OPENAI_API_KEY=your_key_here
```

Then restart the server.
