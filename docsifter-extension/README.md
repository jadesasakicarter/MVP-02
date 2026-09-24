# Docsifter for Dropbox — browser side panel

This is the first extension milestone. It opens Docsifter in a Chrome/Edge side panel, detects the current Dropbox URL, and displays that context above the dashboard.

## Test locally

1. Open Chrome or Edge and visit `chrome://extensions` or `edge://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select this `docsifter-extension` folder.
5. Open Dropbox in the same browser window.
6. Click the Docsifter extension icon to open the side panel.

The extension currently passes page context and loads the existing public Docsifter dashboard. Dropbox OAuth and automatic folder indexing are the next milestones.
