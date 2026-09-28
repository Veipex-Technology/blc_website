import { z } from "zod";

export type InquiryValidationMessages = {
  required: string;
  phone: string;
  email: string;
  message: string;
  consent: string;
};

export const inquirySchemaShape = {
  full_name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim(),
  service: z.string().trim(),
  preferred_language: z.enum(["Arabic", "English"]),
  message: z.string().trim().max(1000),
  consent: z.boolean(),
  website: z.string().trim(),
  locale: z.enum(["ar", "en"]),
};

export function createInquirySchema(messages: InquiryValidationMessages) {
  return z.object({
    ...inquirySchemaShape,
    full_name: inquirySchemaShape.full_name.min(1, messages.required),
    phone: inquirySchemaShape.phone
      .min(1, messages.required)
      .refine(
        (value) =>
          /^(?:\+?20|0)?1[0125]\d{8}$/.test(value.replace(/[\s()-]/g, "")),
        messages.phone,
      ),
    email: inquirySchemaShape.email.refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      messages.email,
    ),
    message: inquirySchemaShape.message.max(1000, messages.message),
    consent: inquirySchemaShape.consent.refine(Boolean, messages.consent),
  });
}

export type InquiryPayload = z.infer<ReturnType<typeof createInquirySchema>>;
