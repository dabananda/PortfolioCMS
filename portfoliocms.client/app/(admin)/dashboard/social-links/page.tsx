'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation } from '@/lib/api';
import {
  Link2, Plus, Pencil, Trash2, X, Check, AlertCircle,
  Loader2, ExternalLink, Globe,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type SocialLink = {
  id: string;
  name: string;
  link: string;
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

type FormState = { name: string; link: string };
const defaultForm: FormState = { name: '', link: '' };

const POPULAR_PLATFORMS = [
  'GitHub', 'LinkedIn', 'Twitter', 'YouTube', 'Instagram',
  'Facebook', 'Portfolio', 'Blog', 'Dev.to', 'Medium', 'Dribbble', 'Behance',
];

function SocialLinkModal({ open, socialLink, onClose, onSaved }: {
  open: boolean; socialLink?: SocialLink; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [error, setError] = useState('');
  const isEdit = !!socialLink;

  useEffect(() => {
    if (open) {
      setForm(socialLink ? { name: socialLink.name, link: socialLink.link } : defaultForm);
      setError('');
    }
  }, [open, socialLink]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { name: form.name, link: form.link };
      const res = isEdit
        ? await fetchWithAuthMutation(`sociallink/${socialLink!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('sociallink', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['social-links'] });
      onSaved(isEdit ? 'Link updated!' : 'Link added!');
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;
  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg bg-white/4 border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all';
  const isValid = form.name && form.link;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Social Link' : 'Add Social Link'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Platform *</label>
            <input list="platforms" className={inputCls} placeholder="e.g. GitHub"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <datalist id="platforms">
              {POPULAR_PLATFORMS.map(p => <option key={p} value={p} />)}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">URL *</label>
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={inputCls + ' pl-9'} placeholder="https://..."
                value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !isValid}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Link'}
          </button>
        </div>
      </div>
    </div>
  );
}

const PLATFORM_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  github:    { color: 'text-white/70',  bg: 'bg-white/5',       border: 'border-white/10' },
  linkedin:  { color: 'text-blue-400',  bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  twitter:   { color: 'text-sky-400',   bg: 'bg-sky-500/10',    border: 'border-sky-500/20' },
  youtube:   { color: 'text-red-400',   bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  instagram: { color: 'text-pink-400',  bg: 'bg-pink-500/10',   border: 'border-pink-500/20' },
  dribbble:  { color: 'text-rose-400',  bg: 'bg-rose-500/10',   border: 'border-rose-500/20' },
  medium:    { color: 'text-white/70',  bg: 'bg-white/5',       border: 'border-white/10' },
  default:   { color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
};
const getPlatformStyle = (name: string) =>
  PLATFORM_STYLES[name.toLowerCase()] ?? PLATFORM_STYLES.default;

export default function SocialLinksPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; socialLink?: SocialLink }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const { data: links = [], isLoading } = useQuery<SocialLink[]>({
    queryKey: ['social-links'],
    queryFn: async () => {
      const res = await fetchWithAuth('sociallink');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`sociallink/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['social-links'] });
      setToast({ type: 'success', msg: 'Link deleted.' });
      setDeleteTarget(null);
    },
    onError: () => setToast({ type: 'error', msg: 'Failed to delete.' }),
  });

  return (
    <div className="space-y-5">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />
      <SocialLinkModal open={modal.open} socialLink={modal.socialLink}
        onClose={() => setModal({ open: false })}
        onSaved={msg => setToast({ type: 'success', msg })} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Social Link?"
        itemName={deleteTarget?.name}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <Link2 size={20} className="text-violet-400" /> Social Links
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            {links.length} link{links.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> Add Link
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/8" />
                <div className="h-4 bg-white/8 rounded w-24" />
              </div>
              <div className="h-3 bg-white/5 rounded w-full" />
            </div>
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <Link2 size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No social links yet</p>
          <p className="text-white/25 text-sm mb-4">Add links to your social profiles and portfolio sites.</p>
          <button onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto">
            <Plus size={14} /> Add Link
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {links.map(sl => {
            const style = getPlatformStyle(sl.name);
            return (
              <div key={sl.id} className="bg-[#161b22] border border-white/6 rounded-xl p-4 hover:border-white/10 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${style.bg} ${style.border}`}>
                    <Link2 size={16} className={style.color} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal({ open: true, socialLink: sl })}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteTarget(sl)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className={`font-semibold text-sm ${style.color}`}>{sl.name}</p>
                <a href={sl.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mt-1 truncate">
                  <ExternalLink size={10} className="shrink-0" />
                  <span className="truncate">{sl.link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
