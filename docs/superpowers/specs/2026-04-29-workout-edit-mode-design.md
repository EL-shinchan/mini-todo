# Workout Tracker Edit Mode Design

Date: 2026-04-29
Target project: `workout-tracker/`

## Goal
Let Eddie fix mistakes in saved workouts without creating duplicate sessions.

## Approved Direction
Reuse the existing New Workout page as edit mode.

## User Flow
1. Eddie opens History.
2. Eddie selects a workout.
3. Eddie clicks **Edit workout**.
4. App opens `workout.html?edit=<id>`.
5. Workout page loads the saved workout into the existing form.
6. Page text changes to edit mode.
7. Eddie edits title, date, notes, exercises, sets, weights, reps, and notes.
8. Eddie clicks **Save changes**.
9. Backend updates the existing workout.

## Backend Design
Add `PUT /api/workouts/:id`.

The update route should:
- confirm workout exists
- validate title/date/exercises/sets like create route
- run inside a transaction
- update `workout_sessions`
- delete previous `workout_exercises` rows for that workout
- recreate exercises and set logs from the edited payload

Because `set_logs` cascades through `workout_exercises`, deleting old workout exercises removes old sets safely.

## Frontend Design
History page:
- add an **Edit workout** action in the workout detail view.
- link to `workout.html?edit=<workoutId>`.

Workout page:
- detect `edit` query param
- fetch `/api/workouts/:id`
- populate the existing form
- change heading/button/status text to edit wording
- submit `PUT /api/workouts/:id` instead of `POST /api/workouts`
- after success, show clear saved message

## Safety
- Same validation as new workout.
- Transaction prevents partial updates.
- PR/progress data recalculates from updated saved sets.
- No autosave.
