# AI Nexus Consulting — Troubleshooting Log

## Issue 1: Server/Client Component Boundary Error
- **Symptom**: `Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".`
- **Cause**: Passing Lucide icon functions as props from a Server Component (`page.tsx`) to Client Components (`ServiceCard.tsx`)
- **Fix**: Changed `ServiceCard` to accept `iconName: string` instead of `icon: React.ComponentType`. Added `'use client'` to `page.tsx`. Icon lookup happens inside the client component via a map.

## Issue 2: CSS @import Order Warning
- **Symptom**: `@import must precede all other statements (besides @charset or empty @layer)`
- **Cause**: `@import url()` for Google Fonts in `globals.css` placed after Tailwind directives
- **Fix**: Removed CSS `@import url()` — fonts are loaded via `next/font` in `layout.tsx` instead.

## Issue 3: AI SDK v6 useChat Message Format
- **Symptom**: Chat messages display empty bubbles; typing indicator gets stuck; API returns 200 but content is blank.
- **Cause**: Two issues:
  1. Server used `toTextStreamResponse()` but `useChat` v6 expects `toUIMessageStreamResponse()`
  2. Client rendered `m.content` but v6 messages use `m.parts[{ type: 'text', text: '...' }]`
- **Fix**:
  1. Changed API routes (`/api/chat`, `/api/consultant-bot`) to return `result.toUIMessageStreamResponse()`
  2. Updated `ConsultantBot.tsx` to read `m.parts?.filter(p => p.type === 'text').map(p => p.text).join('')`

## Issue 4: useChat Default Endpoint
- **Symptom**: `POST /api/chat 404` in dev server logs
- **Cause**: `useChat` hook in AI SDK v6 defaults to `/api/chat`, not the custom `api` option. The `api` property was being ignored.
- **Fix**: Created `/api/chat/route.ts` as the default endpoint (mirrors consultant-bot logic).

## Issue 5: Deprecated Gemini Models
- **Symptom**: `AI_APICallError: model models/gemini-2.0-flash is no longer available to new users`
- **Cause**: `gemini-1.5-pro-latest` was retired Sept 2025; `gemini-2.0-flash` deprecated for new users Feb 2026.
- **Fix**: Updated all API routes to use `gemini-2.5-flash`.

## Issue 6: convertToModelMessages Returns Promise
- **Symptom**: `Type 'Promise<ModelMessage[]>' is missing properties from type 'ModelMessage[]'`
- **Cause**: `convertToModelMessages()` is async in AI SDK v6 but was called without `await`.
- **Fix**: `const modelMessages = await convertToModelMessages(messages);` — then pass `modelMessages` to `streamText()`.

## Issue 7: AI SDK v6 useChat Sends Parts-Based Messages
- **Symptom**: API receives `[{"parts":[{"type":"text","text":"..."}],"id":"...","role":"user"}]` instead of `[{"content":"...","role":"user"}]`
- **Cause**: AI SDK v6 `useChat` sends messages in `UIMessage` format (parts-based), not the `ModelMessage` format that `streamText` expects.
- **Fix**: Import `convertToModelMessages` from `ai` and convert messages before passing to `streamText`.
