# Here are your Instructions

## Auto Drive Notes Sync

This project now supports automatic notes sync from one or many Google Drive folders.

It also supports nested folders recursively: if your main folder contains subfolders and files inside them, all files are fetched automatically.

### 1) Backend setup

In `backend/.env` set:

- `DRIVE_API_KEY` = your Google Drive API key
- `DRIVE_FOLDER_URL` = one shared Google Drive folder link (legacy/single)
- `DRIVE_FOLDER_URLS` = many folder links separated by commas or new lines
- `DRIVE_APPS_SCRIPT_URL` = optional no-billing fallback endpoint (used when `DRIVE_API_KEY` is not set)

If you do not want to add billing details for Google Cloud API key, use Google Apps Script as fallback and set only `DRIVE_APPS_SCRIPT_URL`.

### 2) Frontend setup

In `frontend/.env` set:

- `REACT_APP_DRIVE_FOLDER_URL` = one Drive folder link (legacy/single)
- `REACT_APP_DRIVE_FOLDER_URLS` = many folder links separated by commas
- `REACT_APP_NOTES_SYNC_INTERVAL_MS` = refresh interval in milliseconds (default `60000`)

### 3) API endpoint

- `GET /api/drive-notes`
- Optional query params: `folder_url`, `folder_urls`, `semester`, `subject`

Example:

`/api/drive-notes?folder_url=https://drive.google.com/drive/folders/your-folder-id`

Multi-folder example:

`/api/drive-notes?folder_urls=https://drive.google.com/drive/folders/id1,https://drive.google.com/drive/folders/id2`

### 4) Behavior

- Frontend auto-fetches notes from Drive on load.
- Frontend re-fetches every configured interval.
- New files added in any configured Drive folder appear automatically in the notes list.
- Files inside nested subfolders are also auto-fetched.

### 5) No-card fallback (Google Apps Script)

When `DRIVE_API_KEY` is missing, backend automatically tries `DRIVE_APPS_SCRIPT_URL`.

Apps Script should return JSON list (or `{ "files": [...] }`) with items like:

- `id`
- `name` or `title`
- `url` or `file_url` or `webViewLink`
- optional `modifiedTime` / `uploaded_at`
- optional `semester`, `subject`, `size`
