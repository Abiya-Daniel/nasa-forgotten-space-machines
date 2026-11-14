import { useState } from 'react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { StatusIndicator } from './StatusIndicator';

export function MachineComparisonPanel() {
  const [slotA, setSlotA] = useState<string>('apollo-15-lrv1');
  const [slotB, setSlotB] = useState<string>('opportunity-mer-b');
  const [slotC, setSlotC] = useState<string>('voyager-1');

  const selected = [slotA, slotB, slotC]
    .map((id) => EQUIPMENT_DATA.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const slots = [
    { label: 'Machine A', value: slotA, setter: setSlotA },
    { label: 'Machine B', value: slotB, setter: setSlotB },
    { label: 'Machine C', value: slotC, setter: setSlotC },
  ];

  return (
    <section className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-sky-400">
            Engineering &amp; Mission Matrix
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Compare NASA Space Machines Side by Side
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Pick any three spacecraft across the Moon, Mars, and Deep Space to compare mass, power systems, operational status, and why they remained.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {slots.map((slot) => (
            <label key={slot.label} className="block text-xs">
              <span className="block text-slate-400 mb-1">{slot.label}</span>
              <select
                value={slot.value}
                onChange={(e) => slot.setter(e.target.value)}
                className="w-full max-w-[220px] rounded-md border border-slate-700 bg-[#07090E] px-2.5 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {EQUIPMENT_DATA.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.mission} — {eq.name.slice(0, 28)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-3 pr-4 font-semibold w-40">Specification</th>
              {selected.map((item) => (
                <th key={item.id} className="py-3 px-4 font-bold text-slate-100 min-w-[220px]">
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-400">Environment</td>
              {selected.map((item) => (
                <td key={item.id} className="py-3 px-4 capitalize font-mono">
                  {item.body === 'deep-space'
                    ? 'Deep Space / Interstellar'
                    : item.body === 'orbital'
                      ? 'Orbital / Planetary System'
                      : item.body}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-400">Current Status</td>
              {selected.map((item) => (
                <td key={item.id} className="py-3 px-4">
                  <StatusIndicator status={item.status} />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-400">Mass</td>
              {selected.map((item) => (
                <td key={item.id} className="py-3 px-4 font-mono tabular-nums">
                  {item.massKg || 'Not specified'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-400">Power Source</td>
              {selected.map((item) => (
                <td key={item.id} className="py-3 px-4">
                  {item.powerSource || 'Batteries / Solar / Expendable Stage'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-400">Launch → End / Arrival</td>
              {selected.map((item) => (
                <td key={item.id} className="py-3 px-4 font-mono tabular-nums">
                  {item.launchDate} → {item.endDate || 'Ongoing'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-400">Distance / Traverse</td>
              {selected.map((item) => (
                <td key={item.id} className="py-3 px-4 font-mono tabular-nums text-sky-300">
                  {item.distanceTravelledOrFromEarth || item.coordinates.region}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-400">Key Discovery</td>
              {selected.map((item) => (
                <td key={item.id} className="py-3 px-4 leading-relaxed">
                  {item.achievements[0]}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-slate-400">Why It Remained</td>
              {selected.map((item) => (
                <td key={item.id} className="py-3 px-4 leading-relaxed text-slate-300">
                  {item.whyLeftBehind}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
