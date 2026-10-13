import { NextResponse } from "next/server";
import { addNewsletterSubscriberToERP } from "@/lib/erp/newsletter";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "A valid JSON object is required." },
        { status: 400 },
      );
    }

    const email =
      typeof body.subscriber_email === "string"
        ? body.subscriber_email.trim().toLowerCase()
        : "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // This helper creates Website Subscribers if necessary,
    // then registers the email without duplicating membership.
    const subscriber = await addNewsletterSubscriberToERP({
      email,
      email_group: "Website Subscribers",
    });

    return NextResponse.json(
      {
        success: true,
        message: subscriber.already_exists
          ? "This email is already registered."
          : "You have subscribed successfully.",
        subscriber: {
          email: subscriber.email,
          email_group: subscriber.email_group,
          already_exists: subscriber.already_exists ?? false,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Newsletter subscription API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Newsletter subscription failed.",
      },
      { status: 502 },
    );
  }
}
