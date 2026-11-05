import { NextResponse } from "next/server";
import {
  addNewsletterSubscriberToERP,
  createNewsletterInERP,
  ensureNewsletterEmailGroupInERP,
  getNewslettersFromERP,
} from "@/lib/erp/newsletter";

const ALLOWED_CONTENT_TYPES = ["Rich Text", "Markdown", "HTML"] as const;

type NewsletterContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

type NewsletterEmailGroup = {
  email_group: string;
};

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
    const body: unknown = await request.json();

    // 1. Validate request body.
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "A valid JSON object is required." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    // 2. Email validation helper.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 3. Validate subscriber email.
    const subscriberEmail =
      typeof data.subscriber_email === "string"
        ? data.subscriber_email.trim().toLowerCase()
        : "";

    if (!emailPattern.test(subscriberEmail)) {
      return NextResponse.json(
        {
          error:
            "A valid subscriber_email is required to register the subscriber.",
        },
        { status: 400 },
      );
    }

    // 4. Validate newsletter subject.
    if (typeof data.subject !== "string" || !data.subject.trim()) {
      return NextResponse.json(
        { error: "Newsletter subject is required." },
        { status: 400 },
      );
    }

    // 5. Validate sender email.
    const senderEmail =
      typeof data.sender_email === "string"
        ? data.sender_email.trim().toLowerCase()
        : "";

    if (!emailPattern.test(senderEmail)) {
      return NextResponse.json(
        { error: "A valid sender_email is required." },
        { status: 400 },
      );
    }

    // 6. Validate Newsletter audience groups.
    if (!Array.isArray(data.email_group) || data.email_group.length === 0) {
      return NextResponse.json(
        {
          error: "At least one Newsletter Email Group is required.",
        },
        { status: 400 },
      );
    }

    const emailGroups: NewsletterEmailGroup[] = [];
    const seenGroups = new Set<string>();

    for (const item of data.email_group) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return NextResponse.json(
          {
            error:
              "Each audience row must contain a valid email_group document name.",
          },
          { status: 400 },
        );
      }

      const groupItem = item as Record<string, unknown>;

      if (
        typeof groupItem.email_group !== "string" ||
        !groupItem.email_group.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "Each audience row must contain a valid email_group document name.",
          },
          { status: 400 },
        );
      }

      const emailGroup = groupItem.email_group.trim();

      if (!seenGroups.has(emailGroup)) {
        seenGroups.add(emailGroup);
        emailGroups.push({
          email_group: emailGroup,
        });
      }
    }

    // 7. Validate Newsletter content type.
    const rawContentType: unknown = data.content_type ?? "Rich Text";

    if (
      typeof rawContentType !== "string" ||
      !ALLOWED_CONTENT_TYPES.some((type) => type === rawContentType)
    ) {
      return NextResponse.json(
        { error: "Invalid newsletter content_type." },
        { status: 400 },
      );
    }

    const contentType = rawContentType as NewsletterContentType;

    // 8. Validate content for the selected editor.
    const messageField = {
      "Rich Text": "message",
      Markdown: "message_md",
      HTML: "message_html",
    }[contentType];

    const messageContent = data[messageField];

    if (typeof messageContent !== "string" || !messageContent.trim()) {
      return NextResponse.json(
        {
          error: `Newsletter content is required in ${messageField}.`,
        },
        { status: 400 },
      );
    }

    // 9. Validate publication settings.
    const published = data.published === true;
    const sendWebviewLink = data.send_webview_link === true;

    if (sendWebviewLink && !published) {
      return NextResponse.json(
        {
          error:
            "The Newsletter must be published when send_webview_link is enabled.",
        },
        { status: 400 },
      );
    }

    // 10. Ensure the Website Subscribers Email Group exists.
    const subscriberGroup = await ensureNewsletterEmailGroupInERP(
      "Website Subscribers",
    );

    // 11. Register the subscriber in that group.
    const subscriber = await addNewsletterSubscriberToERP({
      email: subscriberEmail,
      email_group: subscriberGroup.name,
    });

    // 12. Create the Newsletter in ERPNext.
    const newsletter = await createNewsletterInERP({
      subject: data.subject.trim(),

      email_group: emailGroups,

      sender_name:
        typeof data.sender_name === "string" ? data.sender_name.trim() : "",

      sender_email: senderEmail,

      send_from:
        typeof data.send_from === "string" ? data.send_from.trim() : "",

      content_type: contentType,

      message: typeof data.message === "string" ? data.message : "",

      message_md: typeof data.message_md === "string" ? data.message_md : "",

      message_html:
        typeof data.message_html === "string" ? data.message_html : "",

      campaign: typeof data.campaign === "string" ? data.campaign.trim() : "",

      send_unsubscribe_link: data.send_unsubscribe_link === true,

      send_webview_link: sendWebviewLink,

      published,

      route: typeof data.route === "string" ? data.route.trim() : "",
    });

    // 13. Return successful response.
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
