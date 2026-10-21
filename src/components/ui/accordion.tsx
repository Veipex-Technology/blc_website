"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

function FormattedAnswer({ answer }: { answer: string }) {
  const blocks = answer
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim());
        const isUnorderedList = lines.every((line) => line.startsWith("- "));
        const isOrderedList = lines.every((line) => /^\d+\. /.test(line));

        if (isUnorderedList || isOrderedList) {
          const List = isUnorderedList ? "ul" : "ol";
          return (
            <List
              key={`${block}-${index}`}
              className={`mb-4 space-y-2 ps-5 last:mb-0 ${
                isUnorderedList ? "list-disc" : "list-decimal"
              }`}
            >
              {lines.map((line) => (
                <li key={line}>{line.replace(/^(?:- |\d+\. )/, "")}</li>
              ))}
            </List>
          );
        }

        return (
          <p key={`${block}-${index}`} className="mb-4 last:mb-0">
            {lines.map((line, lineIndex) => (
              <span key={`${line}-${lineIndex}`}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: Array<{ question: string; answer: string }>;
  defaultOpen?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const id = useId();

  return (
    <div className="divide-y divide-[var(--blc-sand-200)] rounded-card border border-[var(--blc-sand-200)] bg-white">
      {items.map((item, index) => {
        const panelId = `${id}-panel-${index}`;
        const buttonId = `${id}-button-${index}`;
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-start font-semibold text-[var(--blc-green-900)] focus-ring-light"
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-5 pb-5 text-[var(--blc-green-700)]"
              >
                <FormattedAnswer answer={item.answer} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
