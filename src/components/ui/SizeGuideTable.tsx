"use client";

import { useState } from "react";
import {
  sizeGuide,
  type SizeMeasure,
} from "@/content/copy";
import { cn } from "@/lib/utils";

type Tab = (typeof sizeGuide.tabs)[number];
type Unit = "in" | "cm";

const IN_TO_CM = 2.54;

function display(inches: number, unit: Unit): string {
  if (unit === "in") return String(Math.round(inches * 100) / 100);
  return String(Math.round(inches * IN_TO_CM * 10) / 10);
}

function formatMeasure(measure: SizeMeasure, unit: Unit): string {
  if (typeof measure === "number") return display(measure, unit);
  return `${display(measure[0], unit)} - ${display(measure[1], unit)}`;
}

export function SizeGuideTable() {
  const [tab, setTab] = useState<Tab>("BOTTOMS");
  const [unit, setUnit] = useState<Unit>("in");
  const table = sizeGuide.tables[tab];
  const unitLabel = unit === "in" ? "IN" : "CM";

  return (
    <div>
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mb-4 block font-label-caps text-on-surface-variant">
            {sizeGuide.eyebrow}
          </span>
          <h2 className="font-headline-md text-primary">{sizeGuide.title}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="font-body-small text-on-surface-variant">
              All measurements in {unit === "in" ? "inches" : "centimetres"}.
            </p>
            <div
              role="group"
              aria-label="Measurement unit"
              className="inline-flex border border-outline-variant"
            >
              {(["in", "cm"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setUnit(option)}
                  aria-pressed={unit === option}
                  className={cn(
                    "px-3 py-1.5 font-label-caps transition-colors",
                    unit === option
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex w-full flex-wrap gap-x-6 gap-y-2 border-b border-outline-variant md:mt-0 md:w-auto">
          {sizeGuide.tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "px-2 pb-2 font-label-caps transition-colors",
                tab === t
                  ? "border-b-2 border-primary text-primary"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="px-4 py-6 font-label-caps font-normal text-on-surface-variant">
                SIZE
              </th>
              {table.columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-6 font-label-caps font-normal text-on-surface-variant"
                >
                  {col.label} ({unitLabel})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-data-mono text-primary">
            {table.rows.map((row) => (
              <tr
                key={row.size}
                className="border-b border-outline-variant/30 transition-colors duration-300 hover:bg-surface-container"
              >
                <td className="px-4 py-6 font-label-caps">{row.size}</td>
                {table.columns.map((col) => (
                  <td key={col.key} className="px-4 py-6">
                    {formatMeasure(
                      row.values[col.key as keyof typeof row.values],
                      unit
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
