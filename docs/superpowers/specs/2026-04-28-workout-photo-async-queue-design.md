# Workout Tracker Async Photo Queue Design

Date: 2026-04-28
Target project: `workout-tracker/`

## Goal
Avoid OpenAI API costs by changing workout photo extraction from instant API parsing to an asynchronous local queue processed by OpenClaw.

## Approved Direction
Scheduled async processing at 22:00 daily.

## User Flow
1. User uploads a workout photo in the workout tracker.
2. The app saves the image locally and creates a pending queue job.
3. The app shows: `Photo queued. Shinoske will process it at 22:00.`
4. At 22:00, OpenClaw scans pending jobs.
5. OpenClaw uses its image-reading ability to extract workout data.
6. OpenClaw writes a processed draft JSON result back to the queue.
7. The app shows processed drafts.
8. User reviews/imports a draft into the normal workout form.
9. User saves normally; no autosave.

## Data Shape
Each queue job is a JSON file with:

```json
{
  "id": "timestamp-random",
  "status": "pending",
  "uploadedAt": "ISO date",
  "originalName": "photo.jpg",
  "imagePath": "/absolute/path/to/photo.jpg",
  "draft": null,
  "error": null,
  "processedAt": null
}
```

Processed jobs set `status` to `processed` and fill `draft` with:

```json
{
  "bodyWeight": 68.4,
  "bodyWeightUnit": "kg",
  "exercises": [
    {
      "name": "Bench Press",
      "notes": "",
      "sets": [
        { "weight": 40, "reps": 8, "notes": "" }
      ]
    }
  ],
  "notes": "Review before saving."
}
```

## Backend Changes
- Keep route namespace `/api/photo-drafts`.
- `POST /api/photo-drafts/workout` queues the image instead of parsing it immediately.
- `GET /api/photo-drafts` lists jobs for the frontend.
- Queue files live under `workout-tracker/data/photo-drafts/`.
- Queue data must be gitignored.

## Frontend Changes
- Upload button text changes from instant extraction to queueing.
- Add a processed drafts panel.
- User can refresh processed drafts.
- User can load a processed draft into the existing editable review/import UI.

## Cron
Create an OpenClaw daily job at 22:00 Asia/Shanghai to process pending queue items.

## Non-goals
- No OpenAI API key.
- No direct ChatGPT subscription automation.
- No autosave.
- No cloud image storage.
