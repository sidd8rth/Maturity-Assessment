import type { Tier } from '../../lib/types'

interface Props {
  active: Tier
  onChange: (t: Tier) => void
  counts: { starter: number; standard: number; advanced: number }
}

export default function TierToggle({ active, onChange, counts }: Props) {
  const tiers: { id: Tier; label: string }[] = [
    { id: 'starter', label: 'Starter' },
    { id: 'standard', label: 'Standard' },
    { id: 'advanced', label: 'Advanced' },
  ]

  return (
    <div className="inline-flex items-center gap-1 bg-white border border-[#E5E5E5] rounded-lg p-1 shadow-sm w-full sm:w-auto">
      {tiers.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-md text-[0.8rem] sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
            active === t.id
              ? 'bg-[#E40000] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#1A1A1A]'
          }`}
        >
          {t.label}
          <span className={`ml-1.5 sm:ml-2 text-[0.68rem] sm:text-xs font-normal ${active === t.id ? 'text-red-200' : 'text-gray-400'}`}>
            {counts[t.id]}
          </span>
        </button>
      ))}
    </div>
  )
}
