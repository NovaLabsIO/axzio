# AXZIO

AXZIO v1 is a lightweight identity reading web app built with SvelteKit.

## Local setup

1. Install dependencies:
   `npm install`
2. Create a local env file from the example and set:
   `OPENAI_API_KEY=your_key_here`
   `PUBLIC_SUPABASE_URL=https://your-project.supabase.co`
   `PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here`
   `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here`
3. Start the dev server:
   `npm run dev`

## Verification

- Run type and Svelte checks:
  `npm run check`
- Run a production build:
  `npm run build`

## Vercel Deployment

- Import the repo as `NovaLabsIO/axzio`
- Framework preset: `SvelteKit`
- Root directory: `.`
- Node version: `22.x`
- Required environment variables:
  `OPENAI_API_KEY`
  `PUBLIC_SUPABASE_URL`
  `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  `SUPABASE_SERVICE_ROLE_KEY`

## Supabase persistence

- Apply the SQL in `supabase/schema.sql` to create:
  `axzio_results`
  `axzio_feedback`
  `axzio_email_submissions`
- Writes are server-side only and use `SUPABASE_SERVICE_ROLE_KEY`.
- AXZIO stores derived identity reading fields plus email or feedback metadata. Raw questionnaire answers are not persisted.

## Product flow

Landing page  
-> Start Identity Reading  
-> 10-question reflection flow  
-> Submit responses to `/api/analyze`  
-> AI-generated identity reading  
-> Results page with Identity Signal summary
