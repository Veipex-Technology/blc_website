export function pickLocalized<T extends Record<string, unknown>>(
  data: T,
  field: string,
  locale: string,
): string {
  const arValue = data?.[`${field}_ar`];
  const enValue = data?.[field];

  if (locale === "ar" && typeof arValue === "string" && arValue.trim()) {
    return arValue;
  }

  return typeof enValue === "string" ? enValue : "";
}
