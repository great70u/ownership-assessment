export const dynamic = 'force-dynamic'

// Demo mode: no database configured — history lives in client state (Zustand) only.
// Messages accumulate within the session but don't persist across page reloads.
// To enable persistence, set DATABASE_URL and wire a Prisma adapter here.

export async function GET() {
  return new Response(JSON.stringify({ messages: [] }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
