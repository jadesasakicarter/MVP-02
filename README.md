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

The Supabase project now contains a `public.projects` table with 20 fictional records. Row Level Security is enabled: authenticated users can view shared demo records and their own records, while new records must belong to the signed-in user.

Next, replace the sample data in `app.js` with Supabase queries and add authentication. The planned tables are `projects`, `tenders`, and `tender_matches`; user accounts are managed by Supabase Auth.
