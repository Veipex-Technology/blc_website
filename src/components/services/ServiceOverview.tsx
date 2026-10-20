"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Heart } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { Reveal } from "@/components/reveal";
import type { Locale } from "@/i18n/routing";

export type ServiceOverviewBlock = {
  title: string;
  label: string;
  body: string;
};

type ServiceOverviewProps = {
  locale: Locale;
  title: string;
  tagline: string;
  introHtml: string;
  blocks: ServiceOverviewBlock[];
  image?: string;
  ctaHref: string;
  labels: {
    home: string;
    services: string;
    breadcrumb: string;
    imageAlt: string;
    requestCare: string;
  };
};

const fallbackImage = "/images/hero-placeholder.jpg";

function splitTitle(title: string, isArabic: boolean) {
  const cleanTitle = title.trim();
  if (isArabic || !cleanTitle) {
    return { leading: cleanTitle, finalWord: "" };
  }

  const splitAt = cleanTitle.lastIndexOf(" ");
  if (splitAt === -1) {
    return { leading: "", finalWord: cleanTitle };
  }

  return {
    leading: cleanTitle.slice(0, splitAt),
    finalWord: cleanTitle.slice(splitAt + 1),
  };
}

export function ServiceOverview({
  locale,
  title,
  tagline,
  introHtml,
  blocks,
  image,
  ctaHref,
  labels,
}: ServiceOverviewProps) {
  const isArabic = locale === "ar";
  const id = useId().replace(/:/g, "");
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelVisible, setPanelVisible] = useState(true);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imageSrc = image && failedImage !== image ? image : fallbackImage;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelTimer = useRef<number | null>(null);
  const activeBlock = blocks[activeIndex];
  const { leading, finalWord } = splitTitle(title, isArabic);
  const panelId = `${id}-panel`;

  useEffect(
    () => () => {
      if (panelTimer.current !== null) {
        window.clearTimeout(panelTimer.current);
      }
    },
    [],
  );

  const activateTab = (index: number) => {
    if (index === activeIndex) return;

    if (panelTimer.current !== null) {
      window.clearTimeout(panelTimer.current);
    }

    setActiveIndex(index);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPanelVisible(true);
      return;
    }

    setPanelVisible(false);
    panelTimer.current = window.setTimeout(() => {
      setPanelVisible(true);
      panelTimer.current = null;
    }, 20);
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const nextKey = isArabic ? "ArrowLeft" : "ArrowRight";
    const previousKey = isArabic ? "ArrowRight" : "ArrowLeft";
    let nextIndex: number | undefined;

    if (event.key === nextKey) {
      nextIndex = (currentIndex + 1) % blocks.length;
    } else if (event.key === previousKey) {
      nextIndex = (currentIndex - 1 + blocks.length) % blocks.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = blocks.length - 1;
    }

    if (nextIndex === undefined) return;

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    activateTab(nextIndex);
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-[var(--blc-cream-100)] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto mb-8 max-w-7xl">
          <nav
            aria-label={labels.breadcrumb}
            className="flex items-center gap-2 overflow-hidden text-sm text-[var(--blc-green-700)]"
          >
            <Link
              href={`/${locale}`}
              className="shrink-0 font-semibold hover:text-[var(--blc-green-900)] focus-ring-light"
            >
              {labels.home}
            </Link>
            <ChevronRight
              size={15}
              aria-hidden="true"
              className="shrink-0 text-[var(--blc-gold-500)] rtl:rotate-180"
            />
            <Link
              href={`/${locale}/${isArabic ? "خدمات" : "services"}`}
              className="shrink-0 font-semibold hover:text-[var(--blc-green-900)] focus-ring-light"
            >
              {labels.services}
            </Link>
            <ChevronRight
              size={15}
              aria-hidden="true"
              className="shrink-0 text-[var(--blc-gold-500)] rtl:rotate-180"
            />
            <span className="truncate" aria-current="page">
              {title}
            </span>
          </nav>
        </Reveal>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0 text-start">
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--blc-green-700)]">
                <Heart
                  size={16}
                  className="shrink-0 text-[var(--blc-gold-500)]"
                  aria-hidden="true"
                />
                {labels.breadcrumb}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight text-[var(--blc-green-900)] sm:text-5xl">
                {isArabic ? (
                  <span className="font-bold">{title}</span>
                ) : (
                  <>
                    {leading && <span>{leading} </span>}
                    <em className="font-medium text-[var(--blc-green-700)]">
                      {finalWord}
                    </em>
                  </>
                )}
              </h1>
            </Reveal>

            {tagline && (
              <Reveal delay={160}>
                <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-[var(--blc-gold-500)]">
                  {tagline}
                </p>
              </Reveal>
            )}

            {introHtml && (
              <Reveal delay={220}>
                <div
                  className="mt-5 max-w-2xl text-base leading-8 text-[var(--blc-green-700)] [&_p+p]:mt-4"
                  dangerouslySetInnerHTML={{ __html: introHtml }}
                />
              </Reveal>
            )}

            {blocks.length > 1 && (
              <Reveal delay={280}>
              <div
                role="tablist"
                aria-label={labels.breadcrumb}
                aria-orientation="horizontal"
                className="mt-7 flex flex-wrap gap-3"
              >
                {blocks.map((block, index) => {
                  const isActive = index === activeIndex;
                  const tabId = `${id}-tab-${index}`;

                  return (
                    <button
                      key={`${block.title}-${index}`}
                      ref={(element) => {
                        tabRefs.current[index] = element;
                      }}
                      id={tabId}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={panelId}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => activateTab(index)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-sm transition-colors duration-200 focus-ring-light motion-reduce:transition-none ${
                        isActive
                          ? "bg-[var(--blc-green-900)] text-white"
                          : "bg-[var(--blc-white)] text-[var(--blc-green-900)] hover:bg-[var(--blc-sand-200)]"
                      }`}
                    >
                      {block.label}
                    </button>
                  );
                })}
              </div>
              </Reveal>
            )}

            {activeBlock && (
              <Reveal delay={340}>
                <div
                  id={panelId}
                  role={blocks.length > 1 ? "tabpanel" : undefined}
                  aria-labelledby={
                    blocks.length > 1 ? `${id}-tab-${activeIndex}` : undefined
                  }
                  tabIndex={blocks.length > 1 ? 0 : undefined}
                  className={`mt-6 ${
                    blocks.length > 1
                      ? "min-h-44 rounded-2xl bg-[var(--blc-white)]/75 p-5 shadow-sm sm:p-6"
                      : ""
                  }`}
                >
                  <div
                    className={`transition-all duration-200 ease-out motion-reduce:transition-none ${
                      panelVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-0"
                    }`}
                  >
                    {activeBlock.title && (
                      <h2 className="font-display text-2xl font-semibold leading-snug text-[var(--blc-green-900)]">
                        {activeBlock.title}
                      </h2>
                    )}
                    {activeBlock.body && (
                      <div
                        className={`${activeBlock.title ? "mt-3" : ""} text-base leading-8 text-[var(--blc-green-700)] [&_p+p]:mt-4 [&_ul]:ms-5 [&_ul]:list-disc [&_ol]:ms-5 [&_ol]:list-decimal [&_li]:mt-2`}
                        dangerouslySetInnerHTML={{ __html: activeBlock.body }}
                      />
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal delay={420}>
              <div className="mt-7 h-px w-20 bg-[var(--blc-gold-500)]" />
              <Link
                href={ctaHref}
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white hover:bg-[var(--blc-green-700)] focus-ring-dark"
              >
                {labels.requestCare}
                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                  className="rtl:rotate-180"
                />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={160} className="relative min-w-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-[var(--blc-white)] shadow-[0_24px_70px_rgb(2_56_48_/_0.14)] lg:aspect-[4/5]">
              <Image
                src={imageSrc}
                alt={labels.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover transition-transform duration-700 hover:scale-[1.02] motion-reduce:transition-none"
                onError={() => {
                  if (image && image !== fallbackImage) {
                    setFailedImage(image);
                  }
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgb(2_56_48_/_0.18))]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-16 -end-16 size-48 rounded-full border-[24px] border-white/20"
                aria-hidden="true"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
