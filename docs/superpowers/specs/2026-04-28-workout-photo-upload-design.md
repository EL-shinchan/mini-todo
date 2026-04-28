# Workout Tracker Photo Upload Design

Date: 2026-04-28
Target project: `workout-tracker/`

## Goal
Make workout logging less annoying by letting Eddie upload or take a photo, then turn that image into an editable workout draft.

The feature should reduce typing, but it must not save incorrect AI-parsed data without review.

## Approved Direction
Use a hybrid V1:

1. Add the upload and editable-draft user flow first.
2. Mock the AI extraction response at the backend.
3. Later replace the mock extractor with real vision AI once the UX feels right.

## User Flow
On the new workout page:

1. User opens **Upload workout photo**.
2. User selects or takes a photo.
3. App shows the image preview.
4. User taps **Extract workout draft**.
5. Backend accepts the image and returns structured draft data.
6. Frontend shows an editable review panel.
7. User edits body weight, exercises, sets, and notes if needed.
8. User taps **Add to workout**.
9. Draft data fills the normal workout form.
10. User still saves the workout through the existing save flow.

Nothing should be permanently saved from the image until the user confirms through the normal workout save action.

## Draft Data Shape
The extracted draft should support:

```json
{
  "bodyWeight": 68.4,
  "bodyWeightUnit": "kg",
  "exercises": [
    {
      "name": "Bench Press",
      "sets": [
        { "weight": 40, "reps": 8, "notes": "" },
        { "weight": 45, "reps": 6, "notes": "" }
      ],
      "notes": ""
    }
  ],
  "notes": "Parsed from workout photo. Review before saving."
}
```

For V1, body weight can be shown in the review panel even if the existing database does not yet store body weight. If storing body weight requires a schema decision, keep it visible but do not persist it until a separate body-weight tracking design is approved.

## Frontend Design
Add a compact photo upload panel to `public/workout.html`.

The panel should include:

- file input with camera-friendly image selection
- selected image preview
- extraction button
- loading/error/success states
- editable draft review area
- **Add to workout** button

The review area should let the user edit:

- body weight if present
- exercise names
- set weight
- set reps
- set notes
- exercise notes

The final action should merge the draft into the existing workout form instead of bypassing the current form.

## Backend Design
Add a minimal upload endpoint, likely:

`POST /api/photo-drafts/workout`

The endpoint should:

- accept one image upload
- validate that a file exists
- reject non-image files
- limit file size
- return a mock structured draft response

For V1, do not call an external AI API. Keep the mock extractor isolated so it can later be replaced by a real vision parser.

Recommended backend units:

- route: `server/routes/photoDrafts.js`
- parser helper: `server/services/photoDraftParser.js`

The service boundary should make the future swap simple:

```js
async function parseWorkoutPhoto(file) {
  return mockDraft;
}
```

Later, that function can call a real vision API while the frontend route stays mostly unchanged.

## Data Safety
The feature must treat extracted data as untrusted.

Rules:

- never autosave parsed data
- always show editable review first
- clearly label the draft as needing review
- allow user to discard the draft
- keep normal workout validation active when saving

## Error Handling
Handle these cases clearly:

- no file selected
- unsupported file type
- file too large
- extraction failed
- returned draft has no exercises or useful values

Errors should be plain and useful, not technical dumps.

## Testing / Validation
Manual validation for V1:

1. Upload valid image and see preview.
2. Extract mock draft successfully.
3. Edit draft values.
4. Add draft to workout form.
5. Save workout normally.
6. Confirm existing PR detection still works.
7. Try unsupported file type and confirm error.
8. Try no-file submit and confirm error.
9. Confirm mobile layout remains usable.

## Non-Goals for V1
Do not add yet:

- real OpenAI/vision API integration
- automatic saving from photo
- body-weight database/history tracking
- calorie tracking
- advanced OCR correction UI
- cloud image storage

## Future V2
After V1 flow feels good:

- connect real vision AI
- add structured confidence warnings
- support body-weight history if Eddie wants it
- allow multiple photo uploads
- optionally parse handwritten workout notes
