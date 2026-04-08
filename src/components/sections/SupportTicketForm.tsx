'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
type Priority = (typeof PRIORITIES)[number];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function SupportTicketForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !description.trim()) {
      setErrorMsg('Please fill in all required fields.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, description, priority }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setDescription('');
        setPriority('Medium');
      } else {
        setErrorMsg(json.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.05))',
          border: '1px solid rgba(34,197,94,0.25)',
        }}
      >
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Ticket received
        </h2>
        <p className="text-zinc-300">
          Thanks — we&apos;ve logged your ticket and a specialist will be in touch shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 px-5 py-2 rounded-lg text-sm font-medium text-violet-300 hover:text-white border border-violet-400/30 hover:border-violet-400/60 transition-colors"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 sm:p-8 space-y-5"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
            placeholder="Your name"
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="you@company.com"
          />
        </Field>
      </div>

      <Field label="Subject" required>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="form-input"
          placeholder="Brief summary of the issue"
        />
      </Field>

      <Field label="Priority" required>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="form-input"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description" required>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className="form-input resize-y"
          placeholder="Describe what's happening, when it started, and any steps to reproduce."
        />
      </Field>

      {status === 'error' && errorMsg && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(124,58,237,1))',
          boxShadow: '0 4px 16px rgba(139,92,246,0.4)',
        }}
      >
        <Send className="w-4 h-4" />
        {status === 'submitting' ? 'Submitting...' : 'Submit Ticket'}
      </button>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: white;
          font-size: 0.875rem;
          transition: border-color 0.2s, background 0.2s;
        }
        :global(.form-input:focus) {
          outline: none;
          border-color: rgba(139, 92, 246, 0.6);
          background: rgba(0, 0, 0, 0.5);
        }
        :global(.form-input::placeholder) {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
        {label}
        {required && <span className="text-violet-400 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
