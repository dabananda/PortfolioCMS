'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import {
  Sparkles, Plus, Pencil, Trash2, X, Check, AlertCircle,
  Loader2, Calendar, Building2,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type Activity = {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string;
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
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string;
};
const defaultForm: FormState = { title: '', organization: '', description: '', startDate: '', endDate: '' };

function ActivityModal({ open, activity, onClose, onSaved }: {
  open: boolean; activity?: Activity; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isCurrent, setIsCurrent] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!activity;

  useEffect(() => {
    if (open) {
      if (activity) {
        setForm({
          title: activity.title,
          organization: activity.organization,
          description: activity.description,
          startDate: activity.startDate,
          endDate: activity.endDate ?? '',
        });
        setIsCurrent(!activity.endDate);
      } else {
        setForm(defaultForm);
        setIsCurrent(false);
      }
      setError('');
    }
  }, [open, activity]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        organization: form.organization,
        description: form.description,
        startDate: form.startDate,
        endDate: isCurrent ? undefined : form.endDate || undefined,
      };
      const res = isEdit
        ? await fetchWithAuthMutation(`extracurricularactivity/${activity!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('extracurricularactivity', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['extra-curricular'] });
      onSaved(isEdit ? 'Activity updated!' : 'Activity added!');
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;
  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg bg-white/4 border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all';
  const isValid = form.title && form.organization && form.description && form.startDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Activity' : 'Add Activity'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Activity Title *</label>
            <input className={inputCls} placeholder="e.g. Debate Club Member"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Organization *</label>
            <div className="relative">
              <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="e.g. City Debate Society"
                value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Description *</label>
            <textarea rows={3} className={inputCls + ' resize-none'} placeholder="Describe your role and achievements..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Start Date *</label>
              <input type="date" className={inputCls + ' [color-scheme:dark]'}
                value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">End Date</label>
              <input type="date" className={inputCls + ' [color-scheme:dark] disabled:opacity-40'}
                value={form.endDate} disabled={isCurrent} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${isCurrent ? 'bg-violet-600 border-violet-500' : 'border-white/20 group-hover:border-white/40'}`}
              onClick={() => setIsCurrent(v => !v)}>
              {isCurrent && <Check size={10} className="text-white" />}
            </div>
            <span className="text-sm text-white/50 select-none">Currently ongoing</span>
          </label>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !isValid}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Activity'}
          </button>
        </div>
      </div>
    </div>
  );
}

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

const ACCENT_COLORS = [
  'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
];

export default function ExtraCurricularPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; activity?: Activity }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['extra-curricular'],
    queryFn: async () => {
      const res = await fetchWithAuth('extracurricularactivity');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`extracurricularactivity/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['extra-curricular'] });
      setToast({ type: 'success', msg: 'Activity deleted.' });
      setDeleteTarget(null);
    },
    onError: () => setToast({ type: 'error', msg: 'Failed to delete.' }),
  });

  return (
    <div className="space-y-5">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />
      <ActivityModal open={modal.open} activity={modal.activity}
        onClose={() => setModal({ open: false })}
        onSaved={msg => setToast({ type: 'success', msg })} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Activity?"
        itemName={deleteTarget?.title}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <Sparkles size={20} className="text-violet-400" /> Extracurricular Activities
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> Add Activity
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl p-5 flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-white/8 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/8 rounded w-1/2" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <Sparkles size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No activities yet</p>
          <p className="text-white/25 text-sm mb-4">Add activities that showcase interests beyond your professional work.</p>
          <button onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto">
            <Plus size={14} /> Add Activity
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, idx) => {
            const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
            const isCurrent = !activity.endDate;
            return (
              <div key={activity.id} className="bg-[#161b22] border border-white/6 rounded-xl p-5 hover:border-white/10 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${accent}`}>
                    <Sparkles size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white/90">{activity.title}</h3>
                        <p className="text-sm text-violet-400/80 mt-0.5 flex items-center gap-1">
                          <Building2 size={11} /> {activity.organization}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => setModal({ open: true, activity })}
                          className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(activity)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-white/40 mt-2 leading-relaxed line-clamp-2">{activity.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-white/30">
                        <Calendar size={11} />
                        {formatDate(activity.startDate)} — {isCurrent ? 'Present' : formatDate(activity.endDate!)}
                      </span>
                      {isCurrent && (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">
                          Ongoing
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
