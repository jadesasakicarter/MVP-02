# Datumbaser

Datumbaser is a project intelligence dashboard for architecture and interior design practices. It sits over project documents and gives teams a clearer project overview plus a second set of eyes for potential inconsistencies.

## Current MVP direction

The prototype uses a fictional Walmer Street project to demonstrate four focused areas:

- **Overview** — project stage, scope, document status, and important information.
- **Check** — potential inconsistencies across drawings, FF&E, electrical information, and meeting notes, with evidence sources.
- **Decisions** — project decisions identified from project records.
- **Files** — uploaded project documents and a PDF upload interaction.

The language deliberately says **Potential inconsistency**, **Review required**, and **Not identified**. Datumbaser supports professional judgement; it does not claim that a document conflict is definitely an error.

## Scope decisions

This iteration does not include Dropbox, OneDrive, SharePoint, native Revit parsing, or autonomous cost planning. The first validation question is whether teams find a project overview and evidence-backed document checks useful before adding integrations or deeper AI interpretation.

## Run locally

This is a static prototype. Open `index.html` in a browser or deploy the repository to Vercel.
