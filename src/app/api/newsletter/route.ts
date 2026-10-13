import { NextResponse } from "next/server";
import {
  addNewsletterSubscriberToERP,
  createNewsletterInERP,
  ensureNewsletterEmailGroupInERP,
  getNewslettersFromERP,
} from "@/lib/erp/newsletter";

/**
 * GET
 * Get Newsletter records from ERPNext.
 */
export async function GET() {
  try {
    const newsletters = await getNewslettersFromERP();

    return NextResponse.json({
      success: true,
      newsletters,
    });
  } catch (error) {
    console.error("Newsletter GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Newsletter records could not be loaded.",
      },
      { status: 502 },
    );
  }
}

/**
 * POST
 * Register a subscriber in Website Subscribers
 * and create a Newsletter in ERPNext.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate request body.
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "A valid JSON object is required." },
        { status: 400 },
      );
    }

    // 2. Validate subscriber email.
    const subscriberEmail =
      typeof body.subscriber_email === "string"
        ? body.subscriber_email.trim().toLowerCase()
        : "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(subscriberEmail)) {
      return NextResponse.json(
        {
          error:
            "A valid subscriber_email is required to register the subscriber.",
        },
        { status: 400 },
      );
    }

    // 3. Validate newsletter subject.
    if (typeof body.subject !== "string" || !body.subject.trim()) {
      return NextResponse.json(
        { error: "Newsletter subject is required." },
        { status: 400 },
      );
    }

    // 4. Validate sender email (mandatory in ERPNext).
    const senderEmail =
      typeof body.sender_email === "string" ? body.sender_email.trim() : "";

    if (!emailPattern.test(senderEmail)) {
      return NextResponse.json(
        { error: "A valid sender_email is required." },
        { status: 400 },
      );
    }

    // 5. Validate Newsletter audience groups.
    if (!Array.isArray(body.email_group) || body.email_group.length === 0) {
      return NextResponse.json(
        { error: "At least one Newsletter Email Group is required." },
        { status: 400 },
      );
    }

    const emailGroups: { email_group: string }[] = [];
    const seenGroups = new Set<string>();

    for (const item of body.email_group) {
      if (
        !item ||
        typeof item.email_group !== "string" ||
        !item.email_group.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "Each audience row must contain a valid email_group document name.",
          },
          { status: 400 },
        );
      }

      const emailGroup = item.email_group.trim();

      if (!seenGroups.has(emailGroup)) {
        seenGroups.add(emailGroup);
        emailGroups.push({ email_group: emailGroup });
      }
    }

    // 6. Validate content type.
    const allowedContentTypes = ["Rich Text", "Markdown", "HTML"] as const;

    const contentType = body.content_type ?? "Rich Text";

    if (
      typeof contentType !== "string" ||
      !allowedContentTypes.includes(
        contentType as (typeof allowedContentTypes)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Invalid newsletter content_type." },
        { status: 400 },
      );
    }

    // 7. Validate content for the selected editor.
    const messageField = {
      "Rich Text": "message",
      Markdown: "message_md",
      HTML: "message_html",
    }[contentType as (typeof allowedContentTypes)[number]];

    if (typeof body[messageField] !== "string" || !body[messageField].trim()) {
      return NextResponse.json(
        {
          error: `Newsletter content is required in ${messageField}.`,
        },
        { status: 400 },
      );
    }

    // 8. Validate publication settings.
    const published = body.published === true;
    const sendWebviewLink = body.send_webview_link === true;

    if (sendWebviewLink && !published) {
      return NextResponse.json(
        {
          error:
            "The Newsletter must be published when send_webview_link is enabled.",
        },
        { status: 400 },
      );
    }

    // 9. Ensure the Email Group exists first.
    const subscriberGroup = await ensureNewsletterEmailGroupInERP(
      "Website Subscribers",
    );

    // 10. Register the subscriber in that group.
    const subscriber = await addNewsletterSubscriberToERP({
      email: subscriberEmail,
      email_group: subscriberGroup.name,
    });

    // 11. Create the Newsletter.
    const newsletter = await createNewsletterInERP({
      subject: body.subject.trim(),
      email_group: emailGroups,
      sender_name:
        typeof body.sender_name === "string" ? body.sender_name.trim() : "",
      sender_email: senderEmail,
      send_from:
        typeof body.send_from === "string" ? body.send_from.trim() : "",
      content_type: contentType,
      message: typeof body.message === "string" ? body.message : "",
      message_md: typeof body.message_md === "string" ? body.message_md : "",
      message_html:
        typeof body.message_html === "string" ? body.message_html : "",
      campaign: typeof body.campaign === "string" ? body.campaign.trim() : "",
      send_unsubscribe_link: body.send_unsubscribe_link === true,
      send_webview_link: sendWebviewLink,
      published,
      route: typeof body.route === "string" ? body.route.trim() : "",
    });

    // 11. Return both results.
    return NextResponse.json(
      {
        success: true,
        message: "Subscriber processed and Newsletter created successfully.",
        subscriber: {
          email: subscriber.email,
          email_group: subscriber.email_group,
          already_exists: subscriber.already_exists ?? false,
        },
        newsletter,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Newsletter POST error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Subscriber or Newsletter could not be processed.",
      },
      { status: 502 },
    );
  }
}
