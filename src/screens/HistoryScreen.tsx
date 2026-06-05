import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listMyAssessments, deleteAssessment, type AssessmentRow } from '../lib/assessments';
import { INDUSTRIES } from '../data/industries';

interface Props {
  onNewCheck: () => void;
  onOpen: (row: AssessmentRow) => void;
}

const ENV_LABEL: Record<string, string> = {
  on_prem: 'On-premises', hybrid: 'Hybrid', multi_cloud: 'Cloud-first',
};
const SIZE_LABEL: Record<string, string> = {
  small: 'Under 500', mid: '500 to 2,000', large: '2,000 to 10,000', xlarge: '10,000+',
};

function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
         ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const TIER_COLOR: Record<string, string> = {
  Basic:       'bg-red-100 text-red-700 border-red-200',
  Developing:  'bg-amber-100 text-amber-700 border-amber-200',
  Established: 'bg-sky-100 text-sky-700 border-sky-200',
  Advanced:    'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export function HistoryScreen({ onNewCheck, onOpen }: Props) {
  const [rows, setRows] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { rows, error } = await listMyAssessments();
    if (error) setError(error);
    else setRows(rows);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this assessment? This cannot be undone.')) return;
    const { error } = await deleteAssessment(id);
    if (error) { alert(error); return; }
    setRows(r => r.filter(x => x.id !== id));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <span className="inline-block text-[0.7rem] font-bold uppercase tracking-widest text-airtel-red bg-airtel-red-light border border-airtel-red/20 rounded-full px-3 py-1 mb-2.5">
            Your history
          </span>
          <h1 className="text-2xl md:text-[1.85rem] font-bold text-ink-dark tracking-tight">
            Readiness checks
          </h1>
          <p className="text-[0.88rem] text-ink-mute mt-1">
            {rows.length === 0 && !loading
              ? 'You have not taken a readiness check yet.'
              : `${rows.length} assessment${rows.length === 1 ? '' : 's'} saved to your account.`}
          </p>
        </div>
        <button
          type="button"
          onClick={onNewCheck}
          className="inline-flex items-center gap-2 bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-[0.9rem] px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          Take a new check →
        </button>
      </div>

      {loading && (
        <div className="bg-white border border-border rounded-2xl p-10 text-center text-ink-mute">
          Loading…
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="bg-white border border-dashed border-border rounded-2xl p-10 text-center">
          <p className="text-ink-sub text-[0.95rem] mb-5">Take your first readiness check to see it here.</p>
          <button
            type="button"
            onClick={onNewCheck}
            className="inline-flex items-center gap-2 bg-airtel-navy hover:bg-airtel-navy-hover text-white font-semibold text-[0.92rem] px-5 py-2.5 rounded-lg"
          >
            Start now →
          </button>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {rows.map(row => {
            const industry = INDUSTRIES.find(i => i.id === row.industry)?.label ?? row.industry;
            return (
              <div
                key={row.id}
                className="bg-white border border-border rounded-2xl p-5 hover:border-airtel-navy/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-[0.78rem] text-ink-mute">{fmtDate(row.created_at)}</div>
                    <div className="text-[1.05rem] font-bold text-ink-dark mt-0.5">{industry}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[0.72rem] font-bold uppercase tracking-wider ${TIER_COLOR[row.tier] ?? ''}`}>
                    {row.tier}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3.5">
                  <div className="text-[2.2rem] font-extrabold text-airtel-red leading-none">{row.score}</div>
                  <div className="text-[0.8rem] text-ink-mute">/ 100</div>
                </div>

                <div className="text-[0.8rem] text-ink-sub mb-4 flex flex-wrap gap-x-3 gap-y-1">
                  <span>{ENV_LABEL[row.environment] ?? row.environment}</span>
                  <span className="opacity-50">·</span>
                  <span>{SIZE_LABEL[row.org_size] ?? row.org_size} users</span>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-border">
                  <button
                    type="button"
                    onClick={() => onOpen(row)}
                    className="text-[0.85rem] font-semibold text-airtel-navy hover:text-airtel-red transition-colors"
                  >
                    View report →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(row.id)}
                    className="text-[0.78rem] font-medium text-ink-mute hover:text-airtel-red transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
