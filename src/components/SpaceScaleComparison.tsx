import { useState } from 'react';
import { Ruler } from 'lucide-react';
import { SPACE_SCALE_METRICS } from '../data/museumExperiencesData';
import { ScaleMetricItem } from '../types/equipment';

type MetricKey =
  | 'lengthMeters'
  | 'massKg'
  | 'speedKmH'
  | 'distanceKm'
  | 'powerWatts'
  | 'oneWayLightDelaySec'
  | 'durationYears';

interface MetricDefinition {
  id: MetricKey;
  label: string;
  description: string;
  formatValue: (val: number) => string;
  logScale?: boolean;
}

const METRIC_OPTIONS: MetricDefinition[] = [
  {
    id: 'lengthMeters',
    label: 'Physical Length (m)',
    description: 'Compare size from shoebox-sized Sojourner (0.65 m) to school-bus-sized Hubble (13.2 m).',
    formatValue: (v) => `${v.toLocaleString()} m`,
  },
  {
    id: 'massKg',
    label: 'Dry / Launch Mass (kg)',
    description: 'Notice how every kilogram launched past Earth requires massive rocket propellant.',
    formatValue: (v) => `${v.toLocaleString()} kg`,
  },
  {
    id: 'speedKmH',
    label: 'Peak / Cruise Speed (km/h)',
    description: 'Surface rovers crawl slowly for precision, whereas deep-space craft cross tens of thousands of km every hour.',
    formatValue: (v) => `${v.toLocaleString()} km/h`,
    logScale: true,
  },
  {
    id: 'distanceKm',
    label: 'Distance Travelled / From Earth (km)',
    description: 'Logarithmic comparison spanning 0.1 km on Mars to 25.4 billion km in interstellar space.',
    formatValue: (v) =>
      v >= 1_000_000_000
        ? `${(v / 1_000_000_000).toFixed(2)} billion km`
        : v >= 1_000_000
          ? `${(v / 1_000_000).toFixed(1)} million km`
          : `${v.toLocaleString()} km`,
    logScale: true,
  },
  {
    id: 'powerWatts',
    label: 'Electrical Power (Watts)',
    description: 'Most deep-space pioneers operate on fewer watts than a household microwave or hairdryer.',
    formatValue: (v) => `${v.toLocaleString()} W`,
  },
  {
    id: 'oneWayLightDelaySec',
    label: 'One-Way Radio Light Delay',
    description: 'How long radio signals moving at the speed of light take to travel between Earth and the machine.',
    formatValue: (v) => {
      if (v < 2) return `${v.toFixed(2)} sec`;
      if (v < 3600) return `${Math.round(v / 60)} min`;
      return `${(v / 3600).toFixed(1)} hours`;
    },
    logScale: true,
  },
  {
    id: 'durationYears',
    label: 'Operating Duration (Years)',
    description: 'From 3-day Apollo lunar drives to nearly 50 years of Voyager interstellar operation.',
    formatValue: (v) => (v < 1 ? `${Math.round(v * 365)} days` : `${v.toFixed(1)} years`),
  },
];

function computeBarPercent(
  item: ScaleMetricItem,
  all: ScaleMetricItem[],
  metric: MetricDefinition
): number {
  const val = item[metric.id];
  if (metric.logScale) {
    const logs = all.map((entry) => Math.log10(Math.max(0.01, entry[metric.id]) + 1));
    const maxLog = Math.max(...logs);
    const currentLog = Math.log10(Math.max(0.01, val) + 1);
    return Math.max(4, Math.round((currentLog / maxLog) * 100));
  }
  const maxVal = Math.max(...all.map((entry) => entry[metric.id]));
  return Math.max(3, Math.round((val / maxVal) * 100));
}

export function SpaceScaleComparison() {
  const [metricId, setMetricId] = useState<MetricKey>('lengthMeters');

  const activeMetric =
    METRIC_OPTIONS.find((m) => m.id === metricId) || METRIC_OPTIONS[0];

  const sortedItems = [...SPACE_SCALE_METRICS].sort(
    (a, b) => b[activeMetric.id] - a[activeMetric.id]
  );

  return (
    <section className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Ruler className="w-4 h-4" />
          <span>Engineering Scale &amp; Light-Time Telemetry Visualizer</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          Space Scale &amp; Distance Comparison
        </h2>
        <p className="mt-1 text-sm text-slate-400">{activeMetric.description}</p>
      </div>

      {/* Metric Picker */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select comparison metric">
        {METRIC_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMetricId(opt.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              opt.id === activeMetric.id
                ? 'bg-sky-500 text-slate-950'
                : 'border border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Scaled Bars */}
      <div className="space-y-3.5">
        {sortedItems.map((item) => {
          const pct = computeBarPercent(item, sortedItems, activeMetric);
          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-100">{item.name}</span>
                  <span className="ml-2 font-mono text-[11px] text-slate-400">
                    {item.mission}
                  </span>
                </div>
                <span className="font-mono font-semibold text-amber-300 tabular-nums">
                  {activeMetric.formatValue(item[activeMetric.id])}
                </span>
              </div>

              <div className="h-3 w-full rounded bg-[#07090E] border border-slate-800/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-amber-400 transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {activeMetric.logScale && (
        <p className="text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
          Note: Logarithmic bar scale applied so values spanning multiple orders of magnitude remain visually legible alongside exact numeric readouts.
        </p>
      )}
    </section>
  );
}
