# Workout Tracker Video Queue MVP Design

Date: 2026-04-29
Target project: `workout-tracker/`

## Goal
Let Eddie upload a short exercise video so Shinoske can use spoken/visible exercise details plus video motion to create a draft workout set.

## Approved Direction
Use both spoken/visible info and video motion. Start with one set per video.

## MVP User Flow
1. Eddie records one set.
2. At the start of the video, Eddie says or shows details such as: `bench press 20kg, 12 reps, set 1`.
3. Eddie uploads the video in Iron Log.
4. App saves the video to a local queue.
5. Scheduled OpenClaw processor checks queued media.
6. Processor extracts a one-set draft:
   - exercise
   - weight
   - reps
   - set number
   - notes/warnings
7. Eddie reviews/corrects the draft before adding it to the workout.

## Rep Counting Rule
The first version treats video rep counting as assistive, not final truth.

- Spoken/typed exercise and weight are preferred when clear.
- Video motion can confirm or challenge reps.
- If spoken reps and observed reps disagree, draft should include a warning.

## Queue Shape
Reuse the existing photo draft queue with `mediaType`:

```json
{
  "status": "pending",
  "mediaType": "video",
  "imagePath": null,
  "videoPath": "/path/to/video.mov",
  "clarification": {
    "quickNote": "bench press 20kg x 12 set 1",
    "exercise": "Bench Press",
    "weight": "20",
    "reps": "12",
    "setNumber": "1"
  },
  "draft": null
}
```

## Backend
- Keep namespace `/api/photo-drafts` for now to avoid broad rewiring.
- Add `POST /api/photo-drafts/video`.
- Accept one video file under `video`.
- Validate MIME starts with `video/`.
- Save video under `data/photo-drafts/uploads`.
- Create a pending job with `mediaType: video`.
- Extend job public response to include mediaType and clarification.

## Frontend
- Add **Upload exercise video** panel near photo upload.
- One video = one set.
- Include quick note and optional structured fields:
  - exercise
  - weight
  - reps
  - set number
- Queue button shows clear status.
- Processed video drafts appear in the existing processed drafts list.

## Processor
Update the scheduled processor prompt so it handles both image and video jobs.

For video jobs, processor should:
- inspect clarification first
- extract representative frames or use video analysis if available
- infer exercise and rep count carefully
- write draft JSON with warnings when uncertain

## Non-goals
- Whole-workout multi-set video parsing.
- Automatic saving.
- Perfect rep counting.
- Real-time processing.
