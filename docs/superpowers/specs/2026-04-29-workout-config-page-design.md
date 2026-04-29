# Workout Tracker Config Page Design

Date: 2026-04-29
Target project: `workout-tracker/`

## Goal
Add a Settings/Config page where Eddie can change when the queued workout-photo processor runs, without editing OpenClaw cron manually.

## Approved Direction
Full automatic cron control with guardrails.

## Config Shape
The app stores local JSON at `workout-tracker/data/config.json`:

```json
{
  "photoProcessor": {
    "enabled": true,
    "time": "22:00",
    "timezone": "Asia/Shanghai",
    "frequency": "daily",
    "cronJobId": "3787c796-7724-437d-afa7-daa94b3ce573"
  }
}
```

## Backend
Add config routes:

- `GET /api/config` — read current config, creating defaults if missing.
- `PUT /api/config` — validate safe fields, save config, and sync the OpenClaw cron schedule.

Safe editable fields only:

- `enabled`
- `time`
- `timezone`
- `frequency`

The app must not allow editing the cron prompt, tools, model, or shell commands from the config page.

## Cron Sync Rules
For V1, support `frequency: daily`.

- Time format: `HH:MM` 24-hour format.
- Cron expression: `MM HH * * *`.
- Timezone must be from a small allow-list.
- Enable/disable maps to OpenClaw cron enable/disable.

Use OpenClaw CLI from the backend to update the known cron job ID.

## Frontend
Add `config.html` with:

- current processor status
- enabled toggle
- daily time input
- timezone select
- save button
- JSON preview
- sync result message

Add Settings link to navigation on all pages.

## Safety
- No arbitrary JSON editing for dangerous cron fields.
- Validate all values server-side.
- Keep `data/config.json` out of git.
- If cron sync fails, show a clear error and keep the previous config unchanged.
