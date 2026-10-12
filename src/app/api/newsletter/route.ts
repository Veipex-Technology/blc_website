import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.company) {
      return NextResponse.json({ ok: true });
    }

    if (
      typeof body?.email !== "string" ||
      !emailPattern.test(body.email.trim())
    ) {
      return NextResponse.json(
        { ok: false, error: "A valid email address is required." },
        { status: 400 },
      );
    }

    // TODO: Connect newsletter subscriptions to a provider such as Mailchimp or Brevo.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to subscribe right now." },
      { status: 400 },
    );
  }
}
