"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const ContactMap = dynamic(
  () => import("@/components/contact-map").then((module) => module.ContactMap),
  {
    ssr: false,
    loading: () => <div className="h-full min-h-[280px] w-full" />,
  },
);

type ContactMapLoaderProps = ComponentProps<typeof ContactMap>;

export function ContactMapLoader(props: ContactMapLoaderProps) {
  return <ContactMap {...props} />;
}
