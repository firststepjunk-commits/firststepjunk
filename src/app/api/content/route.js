import { ADMIN_PASSWORD, getContent, saveContent } from "@/lib/content";

// Never cache this handler — it returns live, editable content.
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return Response.json(content);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body?.password !== ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!body?.content || typeof body.content !== "object") {
    return Response.json({ ok: false, error: "Missing content" }, { status: 400 });
  }

  try {
    const result = await saveContent(body.content);
    return Response.json({ ok: true, ...result });
  } catch (err) {
    return Response.json(
      { ok: false, persisted: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
