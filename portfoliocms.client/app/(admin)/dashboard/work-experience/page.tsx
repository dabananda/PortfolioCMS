'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import {
  BriefcaseBusiness, Plus, Pencil, Trash2, X, Check,
  AlertCircle, Loader2, Building2, Calendar, MapPin
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type WorkExperience = {
  id: string; companyName: string; companyDescription?: string;
  role: string; startDate: string; endDate?: string;
  workDescription?: string; userId: string; createdAt: string;
};

type Toast = { type: 'success' | 'error'; msg: string } | null;

function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
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

type FormState = { companyName: string; companyDescription: string; role: string; startDate: string; endDate: string; workDescription: string; };
const defaultForm: FormState = { companyName: '', companyDescription: '', role: '', startDate: '', endDate: '', workDescription: '' };

function ExperienceModal({ open, experience, onClose, onSaved }: {
  open: boolean; experience?: WorkExperience; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isCurrent, setIsCurrent] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!experience;

  useEffect(() => {
    if (open) {
      if (experience) {
        setForm({ companyName: experience.companyName, companyDescription: experience.companyDescription ?? '',
          role: experience.role, startDate: experience.startDate, endDate: experience.endDate ?? '',
          workDescription: experience.workDescription ?? '' });
        setIsCurrent(!experience.endDate);
      } else { setForm(defaultForm); setIsCurrent(false); }
      setError('');
    }
  }, [open, experience]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        companyName: form.companyName, companyDescription: form.companyDescription || undefined,
        role: form.role, startDate: form.startDate,
        endDate: isCurrent ? undefined : form.endDate || undefined,
        workDescription: form.workDescription || undefined,
      };
      const res = isEdit
        ? await fetchWithAuthMutation(`workexperience/${experience!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('workexperience', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['experiences'] });
      qc.invalidateQueries({ queryKey: ['experiences-count'] });
      onSaved(isEdit ? 'Experience updated!' : 'Experience added!');
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;
  const inputCls = "w-full px-3.5 py-2.5 rounded-lg bg-white/4 border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Experience' : 'Add Experience'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm"><AlertCircle size={14} />{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Company *</label>
              <input className={inputCls} placeholder="Acme Corp" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Role *</label>
              <input className={inputCls} placeholder="Senior Developer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Company Description</label>
            <textarea rows={2} className={inputCls + ' resize-none'} placeholder="Brief description of the company…"
              value={form.companyDescription} onChange={e => setForm(f => ({ ...f, companyDescription: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Start Date *</label>
              <input type="date" className={inputCls + ' [color-scheme:dark]'} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">End Date</label>
              <input type="date" className={inputCls + ' [color-scheme:dark] disabled:opacity-40'} value={form.endDate}
                disabled={isCurrent} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${isCurrent ? 'bg-violet-600 border-violet-500' : 'border-white/20 group-hover:border-white/40'}`}
              onClick={() => setIsCurrent(v => !v)}>
              {isCurrent && <Check size={10} className="text-white" />}
            </div>
            <span className="text-sm text-white/50 select-none">I currently work here</span>
          </label>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Work Description</label>
            <textarea rows={4} className={inputCls + ' resize-none'} placeholder="Describe your responsibilities and achievements…"
              value={form.workDescription} onChange={e => setForm(f => ({ ...f, workDescription: e.target.value }))} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.companyName || !form.role || !form.startDate}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Experience'}
          </button>
        </div>
      </div>
    </div>
  );
}

const formatDate = (d: string) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const getDuration = (start: string, end?: string) => {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  return [yrs > 0 ? `${yrs}y` : '', mos > 0 ? `${mos}m` : ''].filter(Boolean).join(' ') || '<1m';
};

const ACCENT_COLORS = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-amber-500','bg-cyan-500','bg-rose-500'];

export default function WorkExperiencePage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; experience?: WorkExperience }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<WorkExperience | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const { data: experiences = [], isLoading } = useQuery<WorkExperience[]>({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await fetchWithAuth('workexperience');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`workexperience/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['experiences'] });
      qc.invalidateQueries({ queryKey: ['experiences-count'] });
      setToast({ type: 'success', msg: 'Experience deleted.' });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-5">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ExperienceModal open={modal.open} experience={modal.experience}
        onClose={() => setModal({ open: false })} onSaved={msg => setToast({ type: 'success', msg })} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Experience?"
        itemName={deleteTarget ? `${deleteTarget.role} at ${deleteTarget.companyName}` : undefined}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2"><BriefcaseBusiness size={20} className="text-violet-400" /> Work Experience</h1>
          <p className="text-sm text-white/35 mt-0.5">{experiences.length} position{experiences.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> Add Experience
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl p-5 flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-white/8 shrink-0" />
              <div className="flex-1 space-y-2"><div className="h-4 bg-white/8 rounded w-2/3" /><div className="h-3 bg-white/5 rounded w-1/3" /><div className="h-3 bg-white/5 rounded w-full" /></div>
            </div>
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <BriefcaseBusiness size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No experience entries yet</p>
          <button onClick={() => setModal({ open: true })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto mt-4"><Plus size={14} /> Add Experience</button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp, i) => (
            <div key={exp.id} className="bg-[#161b22] border border-white/6 rounded-xl p-5 hover:border-white/10 transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ACCENT_COLORS[i % ACCENT_COLORS.length]}/15 border border-white/8`}>
                  <Building2 size={16} className={`${ACCENT_COLORS[i % ACCENT_COLORS.length].replace('bg-','text-').replace('/15','')}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white/90">{exp.role}</h3>
                      <p className="text-sm text-white/50 mt-0.5">{exp.companyName}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => setModal({ open: true, experience: exp })} className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => setDeleteTarget(exp)} className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-white/30">
                      <Calendar size={11} />
                      {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                    <span className="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded-full">
                      {getDuration(exp.startDate, exp.endDate)}
                    </span>
                    {!exp.endDate && (
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </div>
                  {exp.workDescription && (
                    <p className="text-sm text-white/40 mt-3 leading-relaxed line-clamp-2">{exp.workDescription}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
