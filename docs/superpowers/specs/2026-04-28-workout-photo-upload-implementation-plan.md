# Workout Tracker Photo Upload Implementation Plan

Date: 2026-04-28
Target project: `workout-tracker/`
Spec: `docs/superpowers/specs/2026-04-28-workout-photo-upload-design.md`

## Goal
Build V1 of the workout photo-upload flow with mock extraction: upload image, preview it, receive editable draft data, add draft into the existing workout form, and save through the normal workout flow.

## Phase 1 — Backend upload route
- Add upload middleware dependency.
- Add `server/routes/photoDrafts.js`.
- Add `server/services/photoDraftParser.js` with isolated mock parser.
- Mount route at `/api/photo-drafts`.
- Validate file presence, image MIME type, and file size.
- Return structured draft data.

## Phase 2 — Workout page UI
- Add photo upload panel to `public/workout.html`.
- Add file input using `accept="image/*"` and camera-friendly behavior.
- Add image preview, loading state, error state, and editable review state.
- Add draft fields for body weight, exercise name, set weight/reps/notes, and exercise notes.

## Phase 3 — Draft-to-form integration
- Add JavaScript helpers to render extracted draft data.
- Let Eddie edit draft values before using them.
- Add **Add to workout** action that inserts draft exercises and sets into the existing workout form.
- Keep normal save validation and PR detection unchanged.

## Phase 4 — Styling and mobile polish
- Match the existing app style.
- Make the photo panel visually distinct but not noisy.
- Keep controls usable on phone-size screens.

## Phase 5 — Validation
- Start server.
- Check `/api/health`.
- Test upload endpoint with invalid/no file cases where possible.
- Test that workout page loads.
- Confirm existing server routes still load.
- Commit and push only after validation passes.
