# MVP validation and delivery plan

## Problem

Small and medium architecture practices often prepare tender estimates in-house using old project files, memory, and partial cost information. This makes pricing slow and uncertain: a practice can price too high and lose the work, or price too low and create financial and delivery stress.

## Target user

The primary user is a practice director, project architect, or operations manager who prepares or reviews tender pricing. Other architects and graduates are secondary users who benefit from the shared learning and project evidence.

## MVP hypothesis

If a practice can quickly find comparable completed projects and see their actual cost per square metre, it can prepare tenders with more confidence and less manual searching.

## Scope decisions

| Feature | Decision | Reason |
| --- | --- | --- |
| Comparable project search | Build first | Directly tests the core value and is feasible in one week |
| Supabase database | Build first | Makes project evidence persistent and shareable |
| Accounts | Build first | Required for private practice data |
| Drawing/image interpretation | Defer | High complexity and accuracy risk |
| OneDrive/file-server integration | Defer | Requires permissions, connectors, and security review |
| Automatic email filing | Defer | Useful later, but not needed to validate pricing evidence |
| Automatic final tender price | Defer | AI should support judgement, not make an unreviewed financial decision |

## Milestones

1. Base interface and sample records — complete.
2. Supabase `projects` table with RLS and seed data — complete.
3. Supabase authentication and live project loading — in progress.
4. Vercel deployment and environment/configuration verification.
5. User testing with 5–10 architecture professionals; refine the scope based on feedback.

## Test evidence to capture

- A new user creates an account and signs in.
- Signed-in user sees live project records from Supabase.
- User enters a tender brief and reviews comparable projects.
- User saves a comparison.
- Vercel production URL loads the application.

## Validation questions

- How do you currently prepare tender estimates?
- How long does it take to find comparable past work?
- Which project fields are most useful for comparison?
- Would you trust cost-per-square-metre evidence from your own practice?
- What information could not be stored in an AI-connected system?
