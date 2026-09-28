import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (
    request.headers.get("x-revalidate-secret") !== process.env.REVALIDATE_SECRET
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    tag?: unknown;
  } | null;
  if (typeof body?.tag !== "string" || !body.tag.trim())
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  revalidateTag(body.tag, "max");
  return NextResponse.json({ ok: true });
}
