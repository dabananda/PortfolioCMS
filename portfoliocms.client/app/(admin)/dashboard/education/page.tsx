'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import { GraduationCap, Plus, Pencil, Trash2, X, Check, AlertCircle, Loader2, Calendar, MapPin, Award } from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type Education = {
  id: string; instituteName: string; department: string;
  cgpa: number; scale: number; startDate: string; endDate?: string;
  instituteLocation: string; userId: string; createdAt: string;
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

type FormState = { instituteName: string; department: string; cgpa: string; scale: string; startDate: string; endDate: string; instituteLocation: string; };
const defaultForm: FormState = { instituteName: '', department: '', cgpa: '', scale: '4', startDate: '', endDate: '', instituteLocation: '' };

function EducationModal({ open, education, onClose, onSaved }: {
  open: boolean; education?: Education; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isCurrent, setIsCurrent] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!education;

  useEffect(() => {
    if (open) {
      if (education) {
        setForm({ instituteName: education.instituteName, department: education.department,
          cgpa: String(education.cgpa), scale: String(education.scale),
          startDate: education.startDate, endDate: education.endDate ?? '', instituteLocation: education.instituteLocation });
        setIsCurrent(!education.endDate);
      } else { setForm(defaultForm); setIsCurrent(false); }
      setError('');
    }
  }, [open, education]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        instituteName: form.instituteName, department: form.department,
        cgpa: parseFloat(form.cgpa), scale: parseFloat(form.scale),
        startDate: form.startDate,
        endDate: isCurrent ? undefined : form.endDate || undefined,
        instituteLocation: form.instituteLocation,
      };
      const res = isEdit
        ? await fetchWithAuthMutation(`education/${education!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('education', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['education'] });
      onSaved(isEdit ? 'Education updated!' : 'Education added!');
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
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Education' : 'Add Education'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm"><AlertCircle size={14} />{error}</div>}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Institute Name *</label>
            <input className={inputCls} placeholder="University of Example" value={form.instituteName} onChange={e => setForm(f => ({ ...f, instituteName: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Department *</label>
            <input className={inputCls} placeholder="Computer Science & Engineering" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Location *</label>
            <div className="relative">
              <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="City, Country" value={form.instituteLocation} onChange={e => setForm(f => ({ ...f, instituteLocation: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">CGPA *</label>
              <input type="number" step="0.01" min="0" max="10" className={inputCls} placeholder="3.75" value={form.cgpa} onChange={e => setForm(f => ({ ...f, cgpa: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Scale *</label>
              <select className={inputCls + ' cursor-pointer'} value={form.scale} onChange={e => setForm(f => ({ ...f, scale: e.target.value }))}>
                <option value="4">4.0</option>
                <option value="5">5.0</option>
                <option value="10">10.0</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Start Date *</label>
              <input type="date" className={inputCls + ' [color-scheme:dark]'} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">End Date</label>
              <input type="date" className={inputCls + ' [color-scheme:dark] disabled:opacity-40'} value={form.endDate} disabled={isCurrent} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${isCurrent ? 'bg-violet-600 border-violet-500' : 'border-white/20 group-hover:border-white/40'}`} onClick={() => setIsCurrent(v => !v)}>
              {isCurrent && <Check size={10} className="text-white" />}
            </div>
            <span className="text-sm text-white/50 select-none">Currently studying here</span>
          </label>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.instituteName || !form.department || !form.startDate || !form.cgpa || !form.instituteLocation}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Education'}
          </button>
        </div>
      </div>
    </div>
  );
}

const formatDate = (d: string) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const getGpaColor = (cgpa: number, scale: number) => {
  const pct = cgpa / scale;
  if (pct >= 0.85) return { bar: 'bg-emerald-500', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  if (pct >= 0.70) return { bar: 'bg-violet-500', badge: 'text-violet-400 bg-violet-500/10 border-violet-500/20' };
  if (pct >= 0.55) return { bar: 'bg-amber-500', badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  return { bar: 'bg-rose-500', badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
};

export default function EducationPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; education?: Education }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const { data: educations = [], isLoading } = useQuery<Education[]>({
    queryKey: ['education'],
    queryFn: async () => {
      const res = await fetchWithAuth('education');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`education/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['education'] });
      setToast({ type: 'success', msg: 'Education deleted.' });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-5">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <EducationModal open={modal.open} education={modal.education}
        onClose={() => setModal({ open: false })} onSaved={msg => setToast({ type: 'success', msg })} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Education?"
        itemName={deleteTarget?.instituteName}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2"><GraduationCap size={20} className="text-violet-400" /> Education</h1>
          <p className="text-sm text-white/35 mt-0.5">{educations.length} entr{educations.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> Add Education
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl p-5 flex gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-white/8 shrink-0" />
              <div className="flex-1 space-y-2"><div className="h-4 bg-white/8 rounded w-2/3" /><div className="h-3 bg-white/5 rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : educations.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <GraduationCap size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No education entries yet</p>
          <button onClick={() => setModal({ open: true })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto mt-4"><Plus size={14} /> Add Education</button>
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map(edu => {
            const colors = getGpaColor(edu.cgpa, edu.scale);
            const pct = Math.min(100, (edu.cgpa / edu.scale) * 100);
            return (
              <div key={edu.id} className="bg-[#161b22] border border-white/6 rounded-xl p-5 hover:border-white/10 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white/90">{edu.instituteName}</h3>
                        <p className="text-sm text-white/50 mt-0.5">{edu.department}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => setModal({ open: true, education: edu })} className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => setDeleteTarget(edu)} className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-white/30"><Calendar size={11} />{formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}</span>
                      <span className="flex items-center gap-1 text-xs text-white/30"><MapPin size={11} />{edu.instituteLocation}</span>
                      {!edu.endDate && <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                    {/* GPA Bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colors.bar} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                        <Award size={9} /> {edu.cgpa} / {edu.scale}
                      </span>
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
