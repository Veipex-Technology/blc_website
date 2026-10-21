import { Reveal } from "@/components/reveal";

const badgePositions = [
  { x: 256, y: 35, label: "Home care" },
  { x: 412, y: 101, label: "Heart health" },
  { x: 477, y: 256, label: "Medication" },
  { x: 412, y: 411, label: "IV care" },
  { x: 256, y: 477, label: "Clinical care" },
  { x: 100, y: 411, label: "Prescription medicine" },
  { x: 35, y: 256, label: "Nursing care" },
  { x: 100, y: 101, label: "Ambulance" },
] as const;

function BadgeIcon({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <>
          <path d="m-17 1 17-14L17 1v14H6V6h-12v9h-11V1Z" />
          <path
            d="M0-3c-5-8-12-1-7 4L0 8l7-7c5-5-2-12-7-4Z"
            fill="var(--blc-gold-500)"
            stroke="none"
          />
        </>
      );
    case 1:
      return (
        <>
          <path d="M0 15C-28-3-20-18-9-18c5 0 8 3 9 7 1-4 4-7 9-7C20-18 28-3 0 15Z" />
          <path
            d="M-14-2h8l3-7 5 16 4-9h8"
            fill="none"
            stroke="var(--blc-gold-500)"
            strokeWidth="3"
          />
        </>
      );
    case 2:
      return (
        <>
          <rect x="-11" y="-14" width="22" height="29" rx="4" />
          <path
            d="M-5-14v-5h10v5M-9-5h18"
            fill="none"
            stroke="var(--blc-gold-500)"
            strokeWidth="3"
          />
          <circle
            cx="-5"
            cy="5"
            r="3"
            fill="var(--blc-gold-500)"
            stroke="none"
          />
          <circle
            cx="5"
            cy="5"
            r="3"
            fill="var(--blc-gold-500)"
            stroke="none"
          />
        </>
      );
    case 3:
      return (
        <>
          <path d="M-12-15h24v26a5 5 0 0 1-5 5H-7a5 5 0 0 1-5-5V-15Z" />
          <path
            d="M-8-21h16v6H-8z"
            fill="none"
            stroke="var(--blc-gold-500)"
            strokeWidth="3"
          />
        </>
      );
    case 4:
      return (
        <>
          <path d="M-8-18h16l-2 7v9l8 8H-14l8-8v-9l-2-7Z" />
          <path
            d="M0 7v12"
            fill="none"
            stroke="var(--blc-gold-500)"
            strokeWidth="3"
          />
          <circle
            cx="0"
            cy="23"
            r="3"
            fill="var(--blc-gold-500)"
            stroke="none"
          />
        </>
      );
    case 5:
      return (
        <>
          <path d="M-15-4h30v15a5 5 0 0 1-5 5h-20a5 5 0 0 1-5-5V-4Z" />
          <path d="M-7-14h14v4h7v6h-28v-6h7v-4Z" />
          <path
            d="M-8-7h16"
            fill="none"
            stroke="var(--blc-gold-500)"
            strokeWidth="3"
          />
          <path
            d="M-10 1h20v7h-20z"
            fill="var(--blc-white)"
            stroke="var(--blc-gold-500)"
            strokeWidth="1.5"
          />
          <path
            d="M-6 4h12M-6 7h8"
            fill="none"
            stroke="var(--blc-gold-500)"
            strokeWidth="1.5"
          />
          <path
            d="M-16 12c-3 0-4 4-1 5l5 2c3 1 5-3 2-5l-4-2c-1 0-1 0-2 0Z"
            fill="var(--blc-gold-500)"
            stroke="none"
          />
        </>
      );
    case 6:
      return (
        <>
          <rect x="-17" y="-9" width="34" height="25" rx="4" />
          <path
            d="M-8-9v-5h16v5M-17 0h34M-5-3h10v6H-5z"
            fill="var(--blc-gold-500)"
            stroke="none"
          />
        </>
      );
    default:
      return (
        <>
          <path d="M-20 10V-8h8l7-8h14l8 8v18h-37Z" />
          <path
            d="M-10-8h6l5-5h7l5 5"
            fill="none"
            stroke="var(--blc-gold-500)"
            strokeWidth="3"
          />
          <path
            d="M-5-4h10M0-9v10"
            fill="none"
            stroke="var(--blc-gold-500)"
            strokeWidth="3"
          />
          <path d="M-3-18h6v3h-6z" fill="var(--blc-gold-500)" stroke="none" />
          <circle
            cx="-11"
            cy="10"
            r="4"
            fill="var(--blc-green-900)"
            stroke="var(--blc-gold-500)"
          />
          <circle
            cx="10"
            cy="10"
            r="4"
            fill="var(--blc-green-900)"
            stroke="var(--blc-gold-500)"
          />
        </>
      );
  }
}

export function CareIllustration() {
  return (
    <Reveal
      delay={150}
      className="care-illustration mx-auto w-full max-w-[520px]"
    >
      <div className="aspect-square w-full">
        <svg
          viewBox="0 0 512 512"
          role="img"
          aria-label="Better Life Care emblem: a home held in caring hands"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient
              id="care-stage-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0"
                stopColor="var(--blc-green-700)"
                stopOpacity=".12"
              />
              <stop
                offset="1"
                stopColor="var(--blc-green-900)"
                stopOpacity=".24"
              />
            </linearGradient>
            <linearGradient id="care-ring-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--blc-gold-300)" />
              <stop offset="1" stopColor="var(--blc-gold-500)" />
            </linearGradient>
            <linearGradient id="care-emblem-green" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--blc-green-700)" />
              <stop offset="1" stopColor="var(--blc-green-900)" />
            </linearGradient>
            <linearGradient id="care-emblem-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--blc-gold-300)" />
              <stop offset="1" stopColor="var(--blc-gold-500)" />
            </linearGradient>
            <filter
              id="care-shadow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feDropShadow
                dx="0"
                dy="12"
                stdDeviation="12"
                floodColor="var(--blc-green-900)"
                floodOpacity=".15"
              />
            </filter>
            <filter id="care-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="24" />
            </filter>
            <filter
              id="care-emblem-shadow"
              x="-30%"
              y="-30%"
              width="160%"
              height="170%"
            >
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="7"
                floodColor="var(--blc-green-900)"
                floodOpacity=".2"
              />
            </filter>
          </defs>

          <g aria-hidden="true">
            <circle
              cx="256"
              cy="256"
              r="206"
              fill="var(--blc-green-700)"
              opacity=".08"
              filter="url(#care-glow)"
            />
            <circle
              cx="256"
              cy="256"
              r="158"
              fill="url(#care-stage-gradient)"
              stroke="url(#care-ring-gradient)"
              strokeWidth="3"
              opacity=".98"
            />
            <circle
              className="care-orbit"
              cx="256"
              cy="256"
              r="221"
              fill="none"
              stroke="var(--blc-gold-500)"
              strokeWidth="1.5"
              strokeDasharray="3 9"
              opacity=".42"
            />
            <g className="care-badges">
              {badgePositions.map((badge, index) => (
                <g
                  key={badge.label}
                  transform={`translate(${badge.x} ${badge.y})`}
                >
                  <g
                    className="care-badge-float"
                    style={{ animationDelay: `${index * 0.35}s` }}
                  >
                    <g className="care-badge" aria-label={badge.label}>
                      <circle
                        r="29"
                        fill="var(--blc-white)"
                        stroke="var(--blc-gold-500)"
                        strokeWidth="1.5"
                        filter="url(#care-shadow)"
                      />
                      <g
                        fill="var(--blc-green-700)"
                        stroke="var(--blc-green-700)"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      >
                        <BadgeIcon index={index} />
                      </g>
                    </g>
                  </g>
                </g>
              ))}
            </g>

            <circle
              className="care-emblem-glow"
              cx="256"
              cy="270"
              r="84"
              fill="var(--blc-gold-500)"
              opacity=".12"
              filter="url(#care-glow)"
            />
            <g
              className="care-emblem"
              transform="translate(256 263) scale(.78)"
              filter="url(#care-emblem-shadow)"
            >
              <g className="care-emblem-hands">
                <path
                  d="M-115 73c19-25 43-32 65-18 17 11 34 25 50 25-9 21-34 28-59 19-21-7-39-14-56-2 4-9 4-17 0-24Z"
                  fill="url(#care-emblem-gold)"
                  stroke="var(--blc-gold-500)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M115 73c-19-25-43-32-65-18-17 11-34 25-50 25 9 21 34 28 59 19 21-7 39-14 56-2-4-9-4-17 0-24Z"
                  fill="url(#care-emblem-gold)"
                  stroke="var(--blc-gold-500)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M-111 94c30 10 57 17 111 17s81-7 111-17"
                  fill="none"
                  stroke="var(--blc-green-700)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity=".85"
                />
              </g>
              <g className="care-emblem-house">
                <path
                  d="M-104-31 0-122 104-31"
                  fill="none"
                  stroke="url(#care-emblem-gold)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M73-88v-28h18v12"
                  fill="none"
                  stroke="var(--blc-gold-500)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M-80-20v68c19 13 47 20 80 20s61-7 80-20v-68"
                  fill="none"
                  stroke="var(--blc-gold-500)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M-14-78h28v28h-28z"
                  fill="none"
                  stroke="var(--blc-gold-500)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
              <g className="care-emblem-figures">
                <g className="care-figure-shapes">
                  <circle
                    cx="-45"
                    cy="-28"
                    r="20"
                    fill="var(--blc-green-900)"
                  />
                  <path
                    d="M-82 42c-2-38 14-61 37-61 20 0 34 14 43 38-8-7-16-11-25-11-11 0-19 8-23 20 13 18 21 30 28 42-28 3-50-5-60-28Z"
                    fill="url(#care-emblem-green)"
                  />
                  <circle cx="45" cy="-28" r="20" fill="var(--blc-gold-500)" />
                  <path
                    d="M82 42c2-38-14-61-37-61-20 0-34 14-43 38 8-7 16-11 25-11 11 0 19 8 23 20-13 18-21 30-28 42 28 3 50-5 60-28Z"
                    fill="url(#care-emblem-gold)"
                  />
                  <path
                    d="M0 2c-18-26-47-11-38 12 7 17 26 26 38 41 12-15 31-24 38-41C47-9 18-24 0 2Z"
                    fill="url(#care-emblem-gold)"
                    stroke="var(--blc-gold-500)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </Reveal>
  );
}
