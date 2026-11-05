export const WHATSAPP_NUMBER = "201041166033";

export const landline = {
  display: "03 4254999",
  href: "tel:+2034254999",
} as const;

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const whatsappDisplayNumber = `+20 ${WHATSAPP_NUMBER.slice(2, 5)} ${WHATSAPP_NUMBER.slice(5, 8)} ${WHATSAPP_NUMBER.slice(8)}`;
