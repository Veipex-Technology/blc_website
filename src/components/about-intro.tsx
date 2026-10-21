import type { ReactNode } from "react";

import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { CareIllustration } from "@/components/care-illustration";

export function AboutIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <Container>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <header className="max-w-3xl">
            {eyebrow ? (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--blc-gold-500)]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-3xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg text-[var(--blc-green-700)]">
              {description}
            </p>
          </header>
        </Reveal>
        <CareIllustration />
      </div>
    </Container>
  );
}
