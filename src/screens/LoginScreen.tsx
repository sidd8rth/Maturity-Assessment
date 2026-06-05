import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth';

export function LoginScreen() {
  const { signIn, signUp, configured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setNotice(null);

    if (!email.trim() || password.length < 6) {
      setError('Enter a valid email and a password of at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim(), password);
        if (error) setError(error);
      } else {
        const { error } = await signUp(email.trim(), password, {
          full_name: fullName.trim() || undefined,
          company: company.trim() || undefined,
        });
        if (error) setError(error);
        else setNotice('Account created. Check your email if confirmation is enabled, then sign in.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-white border border-border rounded-2xl shadow-md p-7 sm:p-10 md:p-12 max-w-[460px] mx-auto"
    >
      <span className="inline-block text-[0.72rem] font-semibold uppercase tracking-widest text-airtel-red bg-airtel-red-light border border-airtel-red/20 rounded-full px-3 py-1 mb-5">
        {mode === 'signin' ? 'Sign in' : 'Create an account'}
      </span>

      <h1 className="text-[1.55rem] sm:text-[1.85rem] font-extrabold leading-tight tracking-tight text-ink-dark mb-2">
        {mode === 'signin' ? 'Welcome back' : 'Save your readiness checks'}
      </h1>
      <p className="text-ink-mute text-[0.92rem] mb-6 leading-relaxed">
        {mode === 'signin'
          ? 'Sign in to take a new readiness check and view your history.'
          : 'Create an account to take the readiness check and save every report you generate.'}
      </p>

      {!configured && (
        <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-[0.82rem] text-amber-900">
          Supabase is not configured. Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env.local</code> and add your project URL and anon key, then restart the dev server.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'signup' && (
          <>
            <Field label="Full name (optional)">
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Riya Sharma"
                autoComplete="name"
                className="input"
              />
            </Field>
            <Field label="Company (optional)">
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Acme Bank Ltd"
                autoComplete="organization"
                className="input"
              />
            </Field>
          </>
        )}

        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            required
            className="input"
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            minLength={6}
            className="input"
          />
        </Field>

        {error && (
          <p className="text-[0.82rem] text-airtel-red font-medium">{error}</p>
        )}
        {notice && (
          <p className="text-[0.82rem] text-emerald-700 font-medium">{notice}</p>
        )}

        <button
          type="submit"
          disabled={submitting || !configured}
          className="w-full inline-flex items-center justify-center gap-2 bg-airtel-navy hover:bg-airtel-navy-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[0.96rem] px-7 py-3 rounded-lg transition-colors mt-2"
        >
          {submitting
            ? 'Please wait…'
            : mode === 'signin' ? 'Sign in →' : 'Create account →'}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-border text-center">
        <button
          type="button"
          onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null); setNotice(null); }}
          className="text-[0.85rem] text-ink-sub hover:text-airtel-red font-medium transition-colors"
        >
          {mode === 'signin'
            ? "Don't have an account? Create one →"
            : 'Already have an account? Sign in →'}
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: #fff;
          border: 1px solid #dadfe7;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.92rem;
          color: #141414;
          transition: border-color .15s;
          outline: none;
        }
        .input:focus { border-color: #d40000; box-shadow: 0 0 0 3px rgba(212,0,0,0.10); }
      `}</style>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.78rem] font-semibold text-ink-sub mb-1.5">{label}</span>
      {children}
    </label>
  );
}
