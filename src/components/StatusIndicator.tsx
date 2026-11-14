import { EquipmentStatus } from '../types/equipment';

interface StatusBadgeProps {
  status: EquipmentStatus;
  className?: string;
}

const STATUS_META: Record<
  EquipmentStatus,
  { label: string; glyph: string; colorClass: string }
> = {
  active: {
    label: 'Active Mission',
    glyph: '●',
    colorClass: 'text-emerald-400',
  },
  travelling: {
    label: 'Still Travelling (Active)',
    glyph: '➤',
    colorClass: 'text-sky-400',
  },
  silent: {
    label: 'Silent & Travelling',
    glyph: '◈',
    colorClass: 'text-amber-300',
  },
  retired: {
    label: 'Completed / Retired',
    glyph: '■',
    colorClass: 'text-slate-300',
  },
  inactive: {
    label: 'Silent / Inactive',
    glyph: '○',
    colorClass: 'text-amber-300',
  },
  crashed: {
    label: 'Impacted / Lost',
    glyph: '✕',
    colorClass: 'text-rose-400',
  },
  abandoned: {
    label: 'Left Behind (Expended)',
    glyph: '◆',
    colorClass: 'text-amber-400',
  },
};

export function StatusIndicator({ status, className = '' }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium ${meta.colorClass} ${className}`}
    >
      <span aria-hidden="true">{meta.glyph}</span>
      <span>{meta.label}</span>
    </span>
  );
}
