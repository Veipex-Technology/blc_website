"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, HeartHandshake } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import styles from "./services-swiper.module.css";
import "swiper/css";

const SERVICE_IMAGE_ASPECT = "aspect-[4/5]";

export type ServiceSlide = {
  key: string;
  number: string;
  image?: string;
  title: string;
  description: string;
  href: string;
};

type ServicesSwiperProps = {
  services: ServiceSlide[];
  isRtl: boolean;
  label: string;
  exploreLabel: string;
  previousLabel: string;
  nextLabel: string;
  paginationLabel: string;
  carouselRole: string;
  slideRole: string;
  paginationStatusLabel: (current: number, total: number) => string;
  slideStatusLabel: (current: number, total: number, title: string) => string;
  goToSlideLabel: (number: number) => string;
  className?: string;
};

function ServiceImage({ image, title }: { image?: string; title: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!image || imageFailed) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[var(--blc-cream-100)] text-[var(--blc-green-700)]"
      >
        <span className="absolute -end-10 -top-12 size-44 rounded-full border-[18px] border-[var(--blc-gold-300)]/25" />
        <span className="absolute -bottom-16 -start-8 size-48 rounded-full bg-[var(--blc-green-900)]/[0.06]" />
        <HeartHandshake
          size={64}
          strokeWidth={1.35}
          className="relative z-10 text-[var(--blc-green-900)]"
        />
      </div>
    );
  }

  return (
    <Image
      src={image}
      alt={title}
      fill
      sizes="(max-width: 639px) 88vw, (max-width: 1023px) 46vw, 31vw"
      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
      onError={() => setImageFailed(true)}
    />
  );
}

export function ServicesSwiper({
  services,
  isRtl,
  label,
  exploreLabel,
  previousLabel,
  nextLabel,
  paginationLabel,
  carouselRole,
  slideRole,
  paginationStatusLabel,
  slideStatusLabel,
  goToSlideLabel,
  className = "",
}: ServicesSwiperProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(services.length <= 1);

  const syncState = (instance: SwiperInstance) => {
    setActiveIndex(instance.realIndex);
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  };

  if (services.length === 0) {
    return null;
  }

  const previousIcon = isRtl ? ArrowRight : ArrowLeft;
  const nextIcon = isRtl ? ArrowLeft : ArrowRight;
  const PreviousIcon = previousIcon;
  const NextIcon = nextIcon;
  const current = Math.min(activeIndex + 1, services.length);
  const canNavigate = services.length > 3;

  return (
    <div className={`mt-12 ${className}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[var(--blc-green-700)]">
          {label}{" "}
          <span className="text-[var(--blc-gold-500)]">{services.length}</span>
        </p>
        {canNavigate && (
          <div
            role="group"
            aria-label={paginationLabel}
            className="flex items-center gap-3"
          >
            <span
              aria-live="polite"
              aria-label={paginationStatusLabel(current, services.length)}
              className="min-w-[4.5rem] text-center text-sm font-semibold tabular-nums text-[var(--blc-green-700)]"
            >
              {String(current).padStart(2, "0")}
              <span className="mx-1 text-[var(--blc-gold-500)]">/</span>
              {String(services.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label={previousLabel}
              disabled={isBeginning}
              onClick={() => swiper?.slidePrev()}
              className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--blc-green-900)]/20 bg-white text-[var(--blc-green-900)] shadow-soft transition-colors hover:border-[var(--blc-green-900)] hover:bg-[var(--blc-green-900)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--blc-green-900)]/20 disabled:hover:bg-white disabled:hover:text-[var(--blc-green-900)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blc-gold-500)] motion-reduce:transition-none"
            >
              <PreviousIcon size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              disabled={isEnd}
              onClick={() => swiper?.slideNext()}
              className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--blc-green-900)]/20 bg-white text-[var(--blc-green-900)] shadow-soft transition-colors hover:border-[var(--blc-green-900)] hover:bg-[var(--blc-green-900)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--blc-green-900)]/20 disabled:hover:bg-white disabled:hover:text-[var(--blc-green-900)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blc-gold-500)] motion-reduce:transition-none"
            >
              <NextIcon size={19} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className={styles.servicesSwiper}>
        <Swiper
          modules={[Keyboard, Mousewheel]}
          dir={isRtl ? "rtl" : "ltr"}
          slidesPerView={Math.min(services.length, 1)}
          slidesPerGroup={1}
          spaceBetween={16}
          speed={500}
          watchOverflow
          keyboard={{ enabled: true, onlyInViewport: true }}
          mousewheel={{ forceToAxis: false, releaseOnEdges: true }}
          breakpoints={{
            641: {
              slidesPerView: Math.min(services.length, 2),
              spaceBetween: 22,
            },
            1025: {
              slidesPerView: Math.min(services.length, 3),
              spaceBetween: 28,
            },
          }}
          onSwiper={(instance) => {
            setSwiper(instance);
            syncState(instance);
          }}
          onSlideChange={syncState}
          onBreakpoint={syncState}
          onResize={syncState}
          aria-label={paginationLabel}
          aria-roledescription={carouselRole}
        >
          {services.map((service, index) => (
            <SwiperSlide
              key={service.key}
              aria-roledescription={slideRole}
              aria-label={slideStatusLabel(
                index + 1,
                services.length,
                service.title,
              )}
              className="h-auto"
            >
              <article
                className={`group h-full overflow-hidden rounded-3xl border bg-white transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  activeIndex === index
                    ? "border-[var(--blc-gold-500)]/70 shadow-[0_18px_44px_rgb(2_56_48/0.12)]"
                    : "border-[var(--blc-sand-200)] shadow-soft"
                }`}
              >
                <Link
                  href={service.href}
                  className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--blc-gold-500)]"
                >
                  <div
                    className={`relative ${SERVICE_IMAGE_ASPECT} overflow-hidden bg-[var(--blc-sand-200)]`}
                  >
                    <ServiceImage image={service.image} title={service.title} />
                    <span className="absolute start-4 top-4 z-10 inline-flex min-h-9 items-center rounded-full border border-white/70 bg-white/90 px-3 text-xs font-bold tracking-[0.12em] text-[var(--blc-green-900)] shadow-sm backdrop-blur-sm">
                      {service.number}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.17em] text-[var(--blc-gold-500)]">
                      {label}
                    </p>
                    <h3 className="mt-3 min-h-[3.5rem] text-xl font-bold leading-snug text-[var(--blc-green-900)] sm:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-7 text-[var(--blc-green-700)] sm:text-base">
                      {service.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[var(--blc-green-900)]">
                      {exploreLabel}
                      {isRtl ? (
                        <ArrowLeft
                          size={17}
                          aria-hidden="true"
                          className="transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
                        />
                      ) : (
                        <ArrowRight
                          size={17}
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      )}
                    </span>
                  </div>
                </Link>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {services.length > 1 && (
        <div
          role="group"
          aria-label={paginationLabel}
          className="mt-7 flex flex-wrap items-center justify-center gap-2"
        >
          {services.map((service, index) => (
            <button
              key={service.key}
              type="button"
              aria-label={goToSlideLabel(index + 1)}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => swiper?.slideTo(index)}
              className={`h-2.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blc-gold-500)] motion-reduce:transition-none ${
                activeIndex === index
                  ? "w-8 bg-[var(--blc-gold-500)]"
                  : "w-2.5 bg-[var(--blc-green-900)]/20 hover:bg-[var(--blc-green-900)]/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
