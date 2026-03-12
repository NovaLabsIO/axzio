# AXZIO

AXZIO v1 is a lightweight identity reading web app built with SvelteKit.

## Local setup

1. Install dependencies:
   `npm install`
2. Create a local env file from the example and set your OpenAI key:
   `OPENAI_API_KEY=your_key_here`
3. Start the dev server:
   `npm run dev`

## Verification

- Run type and Svelte checks:
  `npm run check`
- Run a production build:
  `npm run build`

## Product flow

Landing page  
-> Start Identity Reading  
-> 10-question reflection flow  
-> Submit responses to `/api/analyze`  
-> AI-generated identity reading  
-> Results page with Identity Signal summary
