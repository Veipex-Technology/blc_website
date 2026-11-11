export const landline = {
  display: "03 4254999",
  href: "tel:+2034254999",
} as const;

export const whatsappLink = (
  number: string | null | undefined,
  message: string,
) =>
  number
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : undefined;
