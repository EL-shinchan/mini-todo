# Workout Tracker iPhone PWA Design

Date: 2026-04-28
Target project: `workout-tracker/`

## Goal
Make the workout tracker feel more like a real iPhone app by supporting Home Screen installation as a Progressive Web App.

## Approved Direction
Add iPhone-first PWA support.

## User Flow
1. Eddie opens the workout tracker in Safari.
2. Eddie taps Share.
3. Eddie taps Add to Home Screen.
4. The app appears as **Iron Log** on the iPhone Home Screen.
5. Launching it opens the tracker in app-style standalone mode.

## Scope
Add:
- web app manifest
- iPhone/mobile web app meta tags
- theme color
- icons
- basic service worker
- shared head tags on all public pages

## Constraints
- This does not make the app work away from the Mac mini network yet.
- iPhone still needs network access to the Mac mini server.
- Offline support can be basic: cache shell pages/assets, but API/database work still requires server.

## Non-goals
- No App Store native app.
- No Electron/Tauri desktop app.
- No cloud deployment yet.
- No authentication changes.
