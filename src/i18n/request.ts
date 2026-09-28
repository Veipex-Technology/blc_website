import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { routing, isLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const headerLocale = (await headers()).get("x-blc-locale");
  const locale =
    (headerLocale && isLocale(headerLocale) ? headerLocale : undefined) ??
    (requestedLocale && isLocale(requestedLocale)
      ? requestedLocale
      : routing.defaultLocale);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
