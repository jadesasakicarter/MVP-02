# Datumbaser — base MVP

The first iteration of the MVP tests the core hypothesis: architecture practices want a fast way to find comparable completed projects and use real cost-per-square-metre evidence when preparing tenders.

## Current scope

- Tender brief form (project type, area, location)
- Comparable project cards
- Indicative cost-per-square-metre range
- Save-comparison interaction (prototype only)
- 20 fictional project records for testing different types and price ranges
- Responsive layout for desktop and mobile

## Run locally

This version is a static site and does not require Node.js. Open `index.html` in a browser, or serve the folder with any static file server.

## Next iteration

Replace the sample data in `app.js` with Supabase tables and add authentication. The planned tables are `projects`, `tenders`, and `tender_matches`; user accounts are managed by Supabase Auth.
