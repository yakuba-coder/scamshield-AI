# ScamShield AI

A responsive, light-theme fintech safety website for analyzing potentially suspicious messages. Built for a hackathon MVP using Next.js, TypeScript, Tailwind CSS, and the OpenAI Responses API.

## Design system

The entire interface uses a white and light-blue theme. Global tokens live in `app/globals.css`, with Tailwind extensions in `tailwind.config.ts`. Dark mode is intentionally disabled, including for devices configured to prefer dark mode.

Palette:
- White: `#FFFFFF`
- Very light blue: `#F0F8FF`
- Primary blue: `#4A90E2`
- Light blue: `#D9ECFF`
- Text: `#243447`
- Borders: `#DCE8F2`

## Requirements

- Node.js 20.9+ recommended
- An OpenAI API key for live AI analysis

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and add your API key:
   ```bash
   cp .env.example .env.local
   ```
   Set `OPENAI_API_KEY` to your key. `OPENAI_MODEL` defaults to `gpt-4.1-mini`; change it if your account uses a different supported model.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000.

## Features

- Responsive white/light-blue dashboard and message scanner
- OpenAI Responses API integration through a server-side route
- Structured AI report with qualitative risk level, confidence label, exact evidence, explanations, actions, and limitations
- Input and response validation with Zod
- Evidence filtering so quoted evidence must be an exact substring of the submitted message
- Sample messages for quick demos
- Browser-local scan history (up to 8 scans)
- Loading, validation, and API error states
- No bank/payment account connections

## Security and limitations

- Never expose `OPENAI_API_KEY` in client code or a `NEXT_PUBLIC_` variable.
- Messages submitted for analysis are sent to the configured AI provider. Do not paste passwords, PINs, OTPs, full card details, or other sensitive credentials.
- Browser-local history stays in the user's browser unless the browser environment itself is compromised. Clearing history removes the locally stored list.
- Risk labels are qualitative, not calibrated probabilities. A low-risk or inconclusive result does not prove a message is safe.
- This MVP does not verify senders, inspect live websites, query blacklists, or connect to banks.
- The demo does not currently implement authentication, server-side rate limiting, or a production retention policy. Add these before public deployment.

## Main files

- `app/page.tsx` — interactive UI and local scan history
- `app/globals.css` — global theme tokens and responsive styles
- `app/api/analyze/route.ts` — server-side OpenAI endpoint and validation
- `lib/prompts.ts` — scam-analysis safety instructions
- `lib/types.ts` — shared result types
