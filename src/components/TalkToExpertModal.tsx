import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { INDUSTRIES } from '../data/industries';
import type { IndustryId, Tier } from '../types';

export interface TalkToExpertContext {
  /** Optional context: pre-filled industry if user came from quiz */
  industry?: IndustryId;
  /** Optional context: tier they scored, if from results page */
  tier?: Tier;
  /** Optional context: their score */
  overall?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  context?: TalkToExpertContext;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: IndustryId | '';
  message: string;
}

const initialForm: FormState = {
  name: '', email: '', phone: '', company: '', industry: '', message: '',
};

export function TalkToExpertModal({ open, onClose, context }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Pre-fill industry from context when opened
  useEffect(() => {
    if (open && context?.industry) {
      setForm(f => ({ ...f, industry: context.industry! }));
    }
  }, [open, context?.industry]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      // small delay so the close animation finishes before state resets
      const t = setTimeout(() => {
        setForm(initialForm);
        setSubmitted(false);
        setError(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC to close + focus first field on open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function isValid(): boolean {
    if (!form.name.trim()) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return false;
    if (!form.company.trim()) return false;
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      // TODO: wire to actual Airtel lead-capture endpoint when available.
      // Payload includes quiz context so leads from the assessment carry their score/tier.
      const payload = { ...form, context: context ?? null, submittedAt: new Date().toISOString() };
      // Simulate a request, replace with real fetch() when endpoint is provided
      await new Promise(res => setTimeout(res, 700));
      // eslint-disable-next-line no-console
      console.debug('[TalkToExpert] submission payload:', payload);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email enterprise@in.airtel.com.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="talk-modal-title"
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-white w-full sm:max-w-[520px] sm:rounded-2xl rounded-t-2xl shadow-lg max-h-[92vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 w-8 h-8 grid place-items-center rounded-full text-ink-mute hover:text-ink-dark hover:bg-bg-secondary transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>

            {submitted ? (
              <SuccessPanel onClose={onClose} name={form.name} />
            ) : (
              <FormPanel
                form={form}
                update={update}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
                firstFieldRef={firstFieldRef}
                context={context}
                isValid={isValid()}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── FORM PANEL ──────────────────────────────────────────
interface FormPanelProps {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  firstFieldRef: React.RefObject<HTMLInputElement>;
  context?: TalkToExpertContext;
  isValid: boolean;
}

function FormPanel({ form, update, onSubmit, submitting, error, firstFieldRef, context, isValid }: FormPanelProps) {
  return (
    <form onSubmit={onSubmit} className="p-7 sm:p-8">
      <div className="mb-5">
        <h2 id="talk-modal-title" className="text-[1.4rem] font-bold tracking-tight text-ink-dark leading-tight">
          Talk to an Airtel Secure expert
        </h2>
        <p className="text-[0.88rem] text-ink-mute mt-2 leading-relaxed">
          Tell us a bit about you. Someone from our practice team will reach out within one business day, no sales pressure.
        </p>
      </div>

      {/* Context summary if from results */}
      {context?.tier && context.overall !== undefined && (
        <div className="mb-5 p-3 rounded-lg bg-airtel-red-light border border-airtel-red/15 text-[0.8rem]">
          <span className="font-semibold text-airtel-red">Assessment context attached:</span>{' '}
          <span className="text-ink-sub">{context.tier} tier ({context.overall}/100)</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Field label="Full name" required>
          <input
            ref={firstFieldRef}
            type="text"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            required
            autoComplete="name"
            className="input"
          />
        </Field>
        <Field label="Work email" required>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            required
            autoComplete="email"
            className="input"
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="+91"
            autoComplete="tel"
            className="input"
          />
        </Field>
        <Field label="Company" required>
          <input
            type="text"
            value={form.company}
            onChange={e => update('company', e.target.value)}
            required
            autoComplete="organization"
            className="input"
          />
        </Field>
        <Field label="Industry" className="sm:col-span-2">
          <select
            value={form.industry}
            onChange={e => update('industry', e.target.value as IndustryId | '')}
            className="input"
          >
            <option value="">Select industry…</option>
            {INDUSTRIES.map(ind => (
              <option key={ind.id} value={ind.id}>{ind.label}</option>
            ))}
          </select>
        </Field>
        <Field label="What would you like to discuss?" className="sm:col-span-2">
          <textarea
            value={form.message}
            onChange={e => update('message', e.target.value)}
            rows={3}
            placeholder="Optional. A sentence or two helps us route you to the right person."
            className="input resize-none leading-relaxed"
          />
        </Field>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-airtel-red-light border border-airtel-red/20 text-[0.82rem] text-airtel-red font-medium">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
        <p className="text-[0.72rem] text-ink-light flex-1 leading-relaxed">
          By submitting, you agree to be contacted about your enquiry. We respect your privacy.
        </p>
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="inline-flex items-center justify-center gap-2 bg-airtel-navy hover:bg-airtel-navy-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[0.9rem] px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap"
        >
          {submitting ? 'Sending…' : 'Request a call'}
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #dadfe7;
          border-radius: 8px;
          background: #ffffff;
          font-family: inherit;
          font-size: 0.9rem;
          color: #141414;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .input:focus { border-color: #d40000; box-shadow: 0 0 0 3px rgba(212,0,0,0.12); }
        .input::placeholder { color: #8f8f8f; }
        select.input { appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
      `}</style>
    </form>
  );
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="block text-[0.78rem] font-semibold text-ink-sub mb-1.5">
        {label}{required && <span className="text-airtel-red ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

// ── SUCCESS PANEL ───────────────────────────────────────
function SuccessPanel({ onClose, name }: { onClose: () => void; name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-9 sm:p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 24, delay: 0.05 }}
        className="w-14 h-14 rounded-full bg-airtel-red-light border border-airtel-red/20 grid place-items-center mx-auto mb-5"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d40000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>
      <h2 className="text-[1.3rem] font-bold tracking-tight text-ink-dark mb-2">
        {name ? `Thanks, ${name.split(' ')[0]}` : 'Thanks for reaching out'}
      </h2>
      <p className="text-[0.92rem] text-ink-mute max-w-sm mx-auto leading-relaxed mb-7">
        We've got your details. Someone from the Airtel Secure practice team will reach out within one business day.
      </p>
      <button
        onClick={onClose}
        className="inline-flex items-center gap-2 bg-airtel-navy hover:bg-airtel-navy-hover text-white font-semibold text-[0.9rem] px-6 py-2.5 rounded-lg transition-colors"
      >
        Done
      </button>
    </motion.div>
  );
}
