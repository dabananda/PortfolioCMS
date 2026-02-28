'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import { Code2, Plus, Pencil, Trash2, X, Check, AlertCircle, Loader2, Layers } from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type Skill = {
  id: string; skillName: string; category?: string;
  proficiency: number; userId: string; createdAt: string;
};

type Toast = { type: 'success' | 'error'; msg: string } | null;

const PROFICIENCY = [
  { value: 0, label: 'Beginner', color: 'bg-white/30', barColor: 'bg-white/30', width: '20%' },
  { value: 1, label: 'Elementary', color: 'bg-sky-500', barColor: 'bg-sky-500', width: '40%' },
  { value: 2, label: 'Intermediate', color: 'bg-violet-500', barColor: 'bg-violet-500', width: '60%' },
  { value: 3, label: 'Advanced', color: 'bg-emerald-500', barColor: 'bg-emerald-500', width: '80%' },
  { value: 4, label: 'Expert', color: 'bg-amber-500', barColor: 'bg-amber-500', width: '100%' },
];

const getProficiency = (v: number) => PROFICIENCY.find(p => p.value === v) ?? PROFICIENCY[2];

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

type FormState = { skillName: string; category: string; proficiency: number };
const defaultForm: FormState = { skillName: '', category: '', proficiency: 2 };

const BADGE_MAP: Record<number, string> = {
  0: 'border-white/15 bg-white/5 text-white/40',
  1: 'border-sky-500/30 bg-sky-500/15 text-sky-300',
  2: 'border-violet-500/30 bg-violet-500/15 text-violet-300',
  3: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  4: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
};

function SkillModal({ open, skill, onClose, onSaved }: {
  open: boolean; skill?: Skill; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [error, setError] = useState('');
  const isEdit = !!skill;

  useEffect(() => {
    if (open) {
      setForm(skill
        ? { skillName: skill.skillName, category: skill.category ?? '', proficiency: Number(skill.proficiency) }
        : defaultForm);
      setError('');
    }
  }, [open, skill]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { skillName: form.skillName, category: form.category || undefined, proficiency: form.proficiency };
      const res = isEdit
        ? await fetchWithAuthMutation(`skill/${skill!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('skill', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skills'] });
      qc.invalidateQueries({ queryKey: ['skills-count'] });
      onSaved(isEdit ? 'Skill updated!' : 'Skill added!');
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;

  const prof = getProficiency(form.proficiency);
  const inputCls = "w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Skill' : 'Add Skill'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Skill Name *</label>
            <input className={inputCls} placeholder="e.g. React, Python, Figma"
              value={form.skillName} onChange={e => setForm(f => ({ ...f, skillName: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Category</label>
            <input className={inputCls} placeholder="e.g. Frontend, Backend, Design"
              value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2 block">Proficiency</label>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${BADGE_MAP[form.proficiency] ?? BADGE_MAP[2]}`}>
                  {prof.label}
                </span>
                <span className="text-xs text-white/30">{form.proficiency * 25}%</span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${prof.barColor}`} style={{ width: prof.width }} />
              </div>
              <div className="flex gap-1.5">
                {PROFICIENCY.map(p => (
                  <button key={p.value} type="button" onClick={() => setForm(f => ({ ...f, proficiency: p.value }))}
                    className={`flex-1 h-9 rounded-lg text-[10px] font-semibold transition-all border ${
                      form.proficiency === p.value
                        ? `${p.barColor} text-white border-transparent`
                        : 'bg-white/3 text-white/30 border-white/6 hover:bg-white/6 hover:text-white/60'
                    }`}>
                    {p.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.skillName}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Skill'}
          </button>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_COLORS = ['text-blue-400','text-violet-400','text-emerald-400','text-amber-400','text-cyan-400','text-rose-400'];

export default function SkillsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; skill?: Skill }>({ open: false });
  const [toast, setToast] = useState<Toast>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await fetchWithAuth('skill');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`skill/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skills'] });
      qc.invalidateQueries({ queryKey: ['skills-count'] });
      setDeleteTarget(null);
      setToast({ type: 'success', msg: 'Skill deleted.' });
    },
  });

  // Group by category — safe access
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryKeys = Object.keys(grouped).sort();

  return (
    <div className="space-y-5">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />
      <SkillModal open={modal.open} skill={modal.skill}
        onClose={() => setModal({ open: false })}
        onSaved={msg => setToast({ type: 'success', msg })} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Skill?"
        itemName={deleteTarget?.skillName}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <Code2 size={20} className="text-violet-400" /> Skills
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            {skills.length} skill{skills.length !== 1 ? 's' : ''} across {categoryKeys.length} categor{categoryKeys.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> Add Skill
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1,2].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-white/8 rounded w-24 mb-4" />
              {[1,2,3].map(j => <div key={j} className="h-10 bg-white/4 rounded-lg mb-2" />)}
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <Code2 size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No skills yet</p>
          <button onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto mt-4">
            <Plus size={14} /> Add your first skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categoryKeys.map((cat, ci) => (
            <div key={cat} className="bg-[#161b22] border border-white/6 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
                <Layers size={13} className={CATEGORY_COLORS[ci % CATEGORY_COLORS.length]} />
                <h3 className="text-sm font-semibold text-white/70">{cat}</h3>
                <span className="ml-auto text-xs text-white/25">{grouped[cat].length}</span>
              </div>
              <div className="divide-y divide-white/4">
                {grouped[cat].map(skill => {
                  const prof = getProficiency(Number(skill.proficiency));
                  return (
                    <div key={skill.id} className="flex items-center gap-4 px-5 py-3 group hover:bg-white/[0.015] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/80">{skill.skillName}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1 bg-white/8 rounded-full max-w-32 overflow-hidden">
                            <div className={`h-full rounded-full ${prof.barColor}`} style={{ width: prof.width }} />
                          </div>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${BADGE_MAP[prof.value] ?? BADGE_MAP[2]}`}>
                            {prof.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModal({ open: true, skill })}
                          className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(skill)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
