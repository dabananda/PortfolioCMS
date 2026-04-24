'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import {
  BadgeCheck, Plus, Pencil, Trash2, X, Check, AlertCircle,
  Loader2, CalendarDays, Link as LinkIcon, Hash,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type Certification = {
  id: string;
  certificationName: string;
  issuingOrganization: string;
  dateObtained: string;
  credentialId?: string;
  certificateUrl?: string;
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
  certificationName: string;
  issuingOrganization: string;
  dateObtained: string;
  credentialId: string;
  certificateUrl: string;
};
const defaultForm: FormState = {
  certificationName: '', issuingOrganization: '',
  dateObtained: '', credentialId: '', certificateUrl: '',
};

function CertificationModal({ open, cert, onClose, onSaved }: {
  open: boolean; cert?: Certification; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [error, setError] = useState('');
  const isEdit = !!cert;

  useEffect(() => {
    if (open) {
      setForm(cert ? {
        certificationName: cert.certificationName,
        issuingOrganization: cert.issuingOrganization,
        dateObtained: cert.dateObtained,
        credentialId: cert.credentialId ?? '',
        certificateUrl: cert.certificateUrl ?? '',
      } : defaultForm);
      setError('');
    }
  }, [open, cert]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        certificationName: form.certificationName,
        issuingOrganization: form.issuingOrganization,
        dateObtained: form.dateObtained,
        credentialId: form.credentialId || undefined,
        certificateUrl: form.certificateUrl || undefined,
      };
      const res = isEdit
        ? await fetchWithAuthMutation(`certification/${cert!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('certification', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certifications'] });
      onSaved(isEdit ? 'Certification updated!' : 'Certification added!');
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;
  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg bg-white/4 border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all';
  const isValid = form.certificationName && form.issuingOrganization && form.dateObtained;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Certification' : 'Add Certification'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Certification Name *</label>
            <input className={inputCls} placeholder="e.g. AWS Certified Solutions Architect"
              value={form.certificationName} onChange={e => setForm(f => ({ ...f, certificationName: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Issuing Organization *</label>
            <input className={inputCls} placeholder="e.g. Amazon Web Services"
              value={form.issuingOrganization} onChange={e => setForm(f => ({ ...f, issuingOrganization: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Date Obtained *</label>
            <input type="date" className={inputCls + ' [color-scheme:dark]'}
              value={form.dateObtained} onChange={e => setForm(f => ({ ...f, dateObtained: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Credential ID</label>
            <div className="relative">
              <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="e.g. AWS-12345-XYZ"
                value={form.credentialId} onChange={e => setForm(f => ({ ...f, credentialId: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Certificate URL</label>
            <div className="relative">
              <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="https://..."
                value={form.certificateUrl} onChange={e => setForm(f => ({ ...f, certificateUrl: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !isValid}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Certification'}
          </button>
        </div>
      </div>
    </div>
  );
}

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

export default function CertificationsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; cert?: Certification }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const { data: certs = [], isLoading } = useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: async () => {
      const res = await fetchWithAuth('certification');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`certification/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certifications'] });
      setToast({ type: 'success', msg: 'Certification deleted.' });
      setDeleteTarget(null);
    },
    onError: () => setToast({ type: 'error', msg: 'Failed to delete.' }),
  });

  return (
    <div className="space-y-5">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />
      <CertificationModal open={modal.open} cert={modal.cert}
        onClose={() => setModal({ open: false })}
        onSaved={msg => setToast({ type: 'success', msg })} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Certification?"
        itemName={deleteTarget?.certificationName}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <BadgeCheck size={20} className="text-violet-400" /> Certifications
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            {certs.length} certification{certs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> Add Certification
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl p-5 flex gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-white/8 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/8 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/3" />
                <div className="h-3 bg-white/5 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : certs.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <BadgeCheck size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No certifications yet</p>
          <p className="text-white/25 text-sm mb-4">Add your professional certifications and credentials.</p>
          <button onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto">
            <Plus size={14} /> Add Certification
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {certs.map(cert => (
            <div key={cert.id} className="bg-[#161b22] border border-white/6 rounded-xl p-5 hover:border-white/10 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <BadgeCheck size={18} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white/90 truncate">{cert.certificationName}</h3>
                      <p className="text-sm text-violet-400/80 mt-0.5">{cert.issuingOrganization}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => setModal({ open: true, cert })}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteTarget(cert)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-white/30">
                      <CalendarDays size={11} /> {formatDate(cert.dateObtained)}
                    </span>
                    {cert.credentialId && (
                      <span className="flex items-center gap-1 text-xs text-white/30">
                        <Hash size={11} /> {cert.credentialId}
                      </span>
                    )}
                    {cert.certificateUrl && (
                      <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                        <LinkIcon size={11} /> View Certificate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
