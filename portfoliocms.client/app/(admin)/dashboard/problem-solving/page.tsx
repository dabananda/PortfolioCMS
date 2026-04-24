'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import {
  Terminal, Plus, Pencil, Trash2, X, Check, AlertCircle,
  Loader2, ExternalLink, Trophy, Hash, AtSign,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type ProblemSolving = {
  id: string;
  judgeName: string;
  totalSolved: number;
  rank?: string;
  handle?: string;
  profileUrl: string;
  userId: string;
  createdAt: string;
};

type Toast = { type: 'success' | 'error'; msg: string } | null;

function ToastMsg({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium
      ${toast.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' : 'bg-rose-500/15 border-rose-500/25 text-rose-300'}`}>
      {toast.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
      {toast.msg}
    </div>
  );
}

type FormState = {
  judgeName: string;
  totalSolved: string;
  rank: string;
  handle: string;
  profileUrl: string;
};
const defaultForm: FormState = { judgeName: '', totalSolved: '', rank: '', handle: '', profileUrl: '' };

const POPULAR_JUDGES = ['Codeforces', 'LeetCode', 'AtCoder', 'CodeChef', 'HackerRank', 'SPOJ', 'UVa Online Judge'];

function ProblemSolvingModal({ open, ps, onClose, onSaved }: {
  open: boolean; ps?: ProblemSolving; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [error, setError] = useState('');
  const isEdit = !!ps;

  useEffect(() => {
    if (open) {
      setForm(ps ? {
        judgeName: ps.judgeName,
        totalSolved: String(ps.totalSolved),
        rank: ps.rank ?? '',
        handle: ps.handle ?? '',
        profileUrl: ps.profileUrl,
      } : defaultForm);
      setError('');
    }
  }, [open, ps]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        judgeName: form.judgeName,
        totalSolved: parseInt(form.totalSolved, 10),
        rank: form.rank || undefined,
        handle: form.handle || undefined,
        profileUrl: form.profileUrl,
      };
      const res = isEdit
        ? await fetchWithAuthMutation(`problemsolving/${ps!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('problemsolving', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['problem-solving'] });
      onSaved(isEdit ? 'Profile updated!' : 'Profile added!');
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;
  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg bg-white/4 border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all';
  const isValid = form.judgeName && form.totalSolved && form.profileUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Profile' : 'Add Profile'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Online Judge *</label>
            <input list="judges" className={inputCls} placeholder="e.g. Codeforces"
              value={form.judgeName} onChange={e => setForm(f => ({ ...f, judgeName: e.target.value }))} />
            <datalist id="judges">
              {POPULAR_JUDGES.map(j => <option key={j} value={j} />)}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Total Solved *</label>
              <input type="number" min="0" className={inputCls} placeholder="e.g. 500"
                value={form.totalSolved} onChange={e => setForm(f => ({ ...f, totalSolved: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Rank</label>
              <div className="relative">
                <Trophy size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input className={inputCls + ' pl-9'} placeholder="e.g. Expert"
                  value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Handle / Username</label>
            <div className="relative">
              <AtSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="your_handle"
                value={form.handle} onChange={e => setForm(f => ({ ...f, handle: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Profile URL *</label>
            <div className="relative">
              <ExternalLink size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="https://codeforces.com/profile/..."
                value={form.profileUrl} onChange={e => setForm(f => ({ ...f, profileUrl: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !isValid}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

const JUDGE_COLORS: Record<string, string> = {
  codeforces: 'text-red-400 bg-red-500/10 border-red-500/20',
  leetcode: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  atcoder: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  codechef: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  hackerrank: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};
const getJudgeColor = (name: string) =>
  JUDGE_COLORS[name.toLowerCase().split(' ')[0]] ?? 'text-violet-400 bg-violet-500/10 border-violet-500/20';

export default function ProblemSolvingPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; ps?: ProblemSolving }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<ProblemSolving | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const { data: profiles = [], isLoading } = useQuery<ProblemSolving[]>({
    queryKey: ['problem-solving'],
    queryFn: async () => {
      const res = await fetchWithAuth('problemsolving');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`problemsolving/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['problem-solving'] });
      setToast({ type: 'success', msg: 'Profile deleted.' });
      setDeleteTarget(null);
    },
    onError: () => setToast({ type: 'error', msg: 'Failed to delete.' }),
  });

  const totalSolved = profiles.reduce((s, p) => s + p.totalSolved, 0);

  return (
    <div className="space-y-5">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />
      <ProblemSolvingModal open={modal.open} ps={modal.ps}
        onClose={() => setModal({ open: false })}
        onSaved={msg => setToast({ type: 'success', msg })} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Profile?"
        itemName={deleteTarget?.judgeName}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <Terminal size={20} className="text-violet-400" /> Problem Solving
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            {profiles.length} platform{profiles.length !== 1 ? 's' : ''} · {totalSolved.toLocaleString()} total solved
          </p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> Add Profile
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-white/8 rounded w-1/2 mb-3" />
              <div className="h-8 bg-white/5 rounded w-1/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <Terminal size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No profiles yet</p>
          <p className="text-white/25 text-sm mb-4">Add your competitive programming profiles.</p>
          <button onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto">
            <Plus size={14} /> Add Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map(ps => {
            const colorCls = getJudgeColor(ps.judgeName);
            return (
              <div key={ps.id} className="bg-[#161b22] border border-white/6 rounded-xl p-5 hover:border-white/10 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${colorCls}`}>
                      <Terminal size={10} /> {ps.judgeName}
                    </span>
                    {ps.handle && (
                      <p className="text-white/40 text-xs mt-1.5 flex items-center gap-1">
                        <AtSign size={10} /> {ps.handle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => setModal({ open: true, ps })}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteTarget(ps)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white/90">{ps.totalSolved.toLocaleString()}</p>
                    <p className="text-xs text-white/30 mt-0.5">Solved</p>
                  </div>
                  {ps.rank && (
                    <div className="bg-amber-500/[0.07] border border-amber-500/15 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-amber-400 truncate">{ps.rank}</p>
                      <p className="text-xs text-white/30 mt-0.5">Rank</p>
                    </div>
                  )}
                </div>
                <a href={ps.profileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  <ExternalLink size={11} /> View Profile
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
