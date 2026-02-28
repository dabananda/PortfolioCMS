'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth, fetchWithAuthMutation, uploadFile } from '@/lib/api';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FolderOpen, Plus, Pencil, Trash2, ExternalLink, Github,
  X, Check, AlertCircle, Loader2, Upload, Image as ImageIcon, Tag
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  gitHubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
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

const TECH_COLORS = [
  'bg-blue-500/15 text-blue-300 border-blue-500/20',
  'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  'bg-violet-500/15 text-violet-300 border-violet-500/20',
  'bg-amber-500/15 text-amber-300 border-amber-500/20',
  'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  'bg-rose-500/15 text-rose-300 border-rose-500/20',
];

type FormState = {
  title: string; description: string; technologies: string[];
  gitHubUrl: string; liveUrl: string; imageUrl: string;
};

const defaultForm: FormState = { title: '', description: '', technologies: [], gitHubUrl: '', liveUrl: '', imageUrl: '' };

function ProjectModal({
  open, project, onClose, onSaved
}: { open: boolean; project?: Project; onClose: () => void; onSaved: (msg: string) => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [techInput, setTechInput] = useState('');
  const [imgUploading, setImgUploading] = useState(false);
  const [error, setError] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);
  const isEdit = !!project;

  useEffect(() => {
    if (open) {
      setForm(project ? {
        title: project.title, description: project.description,
        technologies: project.technologies, gitHubUrl: project.gitHubUrl ?? '',
        liveUrl: project.liveUrl ?? '', imageUrl: project.imageUrl ?? '',
      } : defaultForm);
      setError('');
      setTechInput('');
    }
  }, [open, project]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title, description: form.description,
        technologies: form.technologies,
        gitHubUrl: form.gitHubUrl || undefined,
        liveUrl: form.liveUrl || undefined,
        imageUrl: form.imageUrl || undefined,
      };
      const res = isEdit
        ? await fetchWithAuthMutation(`project/${project!.id}`, 'PUT', payload)
        : await fetchWithAuthMutation('project', 'POST', payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save project');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['projects-count'] });
      onSaved(isEdit ? 'Project updated!' : 'Project created!');
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  const handleImgUpload = async (file: File) => {
    setImgUploading(true);
    try {
      const { url } = await uploadFile('upload/image', file);
      setForm(f => ({ ...f, imageUrl: url }));
    } catch { setError('Image upload failed.'); }
    finally { setImgUploading(false); }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm(f => ({ ...f, technologies: [...f.technologies, t] }));
    }
    setTechInput('');
  };

  if (!open) return null;
  const inputCls = "w-full px-3.5 py-2.5 rounded-lg bg-white/4 border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
          <h2 className="text-base font-semibold text-white/90">{isEdit ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm"><AlertCircle size={14} />{error}</div>}

          {/* Image Upload */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2 block">Project Image</label>
            <div className="relative h-36 rounded-xl overflow-hidden bg-white/3 border border-white/8 cursor-pointer hover:border-violet-500/40 transition-colors group"
              onClick={() => imgRef.current?.click()}>
              {form.imageUrl ? (
                <Image src={form.imageUrl} alt="preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <ImageIcon size={28} className="text-white/20 group-hover:text-violet-400 transition-colors" />
                  <span className="text-xs text-white/30">Click to upload image</span>
                </div>
              )}
              {imgUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 size={22} className="text-violet-400 animate-spin" />
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1.5 bg-black/60 rounded-lg"><Upload size={13} className="text-white" /></div>
              </div>
            </div>
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImgUpload(e.target.files[0])} />
          </div>

          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Title *</label>
            <input className={inputCls} placeholder="My Awesome Project" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Description *</label>
            <textarea rows={4} className={inputCls + ' resize-none'} placeholder="Describe your project…"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Technologies */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input className={inputCls} placeholder="React, Node.js…" value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} />
              <button type="button" onClick={addTech}
                className="px-3 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-sm font-medium border border-violet-500/20 transition-colors shrink-0">
                Add
              </button>
            </div>
            {form.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.technologies.map((t, i) => (
                  <span key={t} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${TECH_COLORS[i % TECH_COLORS.length]}`}>
                    {t}
                    <button onClick={() => setForm(f => ({ ...f, technologies: f.technologies.filter(x => x !== t) }))}
                      className="hover:opacity-60 transition-opacity"><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">GitHub URL</label>
              <input className={inputCls} placeholder="https://github.com/…" value={form.gitHubUrl} onChange={e => setForm(f => ({ ...f, gitHubUrl: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">Live URL</label>
              <input className={inputCls} placeholder="https://myapp.com" value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.title || !form.description}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ id, title, onClose, onDeleted }: { id: string; title: string; onClose: () => void; onDeleted: () => void }) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => fetchWithAuthMutation(`project/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['projects-count'] });
      onDeleted();
      onClose();
    },
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-rose-400" />
        </div>
        <h3 className="text-base font-semibold text-white/90 mb-1">Delete Project?</h3>
        <p className="text-sm text-white/40 mb-5">"{title}" will be permanently deleted. This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/8 transition-all">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const CARD_GRADIENTS = ['from-blue-600 to-indigo-700','from-violet-600 to-purple-700','from-emerald-600 to-teal-700','from-rose-600 to-pink-700','from-amber-600 to-orange-700','from-cyan-600 to-sky-700'];

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; project?: Project }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setModal({ open: true });
      router.replace('/dashboard/projects');
    }
  }, [searchParams, router]);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetchWithAuth('project');
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchWithAuthMutation(`project/${id}`, 'DELETE'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['projects-count'] });
      setDeleteTarget(null);
      setToast({ type: 'success', msg: 'Project deleted.' });
    },
    onError: () => setToast({ type: 'error', msg: 'Failed to delete project.' }),
  });

  return (
    <div className="space-y-5">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Project?"
        itemName={deleteTarget?.title}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <ProjectModal open={modal.open} project={modal.project}
        onClose={() => setModal({ open: false })}
        onSaved={msg => setToast({ type: 'success', msg })} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <FolderOpen size={20} className="text-violet-400" /> Projects
          </h1>
          <p className="text-sm text-white/35 mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#161b22] border border-white/6 rounded-xl overflow-hidden animate-pulse">
              <div className="h-40 bg-white/5" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/8 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded" />
                <div className="h-3 bg-white/5 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
          <FolderOpen size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium mb-1">No projects yet</p>
          <p className="text-sm text-white/25 mb-5">Create your first project to showcase your work</p>
          <button onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto">
            <Plus size={14} /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <div key={project.id} className="bg-[#161b22] border border-white/6 rounded-xl overflow-hidden hover:border-white/12 transition-colors group flex flex-col">
              {/* Image */}
              <div className="relative h-40 shrink-0">
                {project.imageUrl ? (
                  <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} opacity-70`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal({ open: true, project })}
                    className="p-1.5 rounded-lg bg-black/60 text-white/70 hover:text-white border border-white/10 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteTarget(project)}
                    className="p-1.5 rounded-lg bg-black/60 text-white/70 hover:text-rose-400 border border-white/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-white/90 leading-snug mb-1.5">{project.title}</h3>
                <p className="text-xs text-white/40 line-clamp-2 flex-1 mb-3">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 4).map((t, ti) => (
                      <span key={t} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${TECH_COLORS[ti % TECH_COLORS.length]}`}>
                        <Tag size={8} /> {t}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium border border-white/10 text-white/30">+{project.technologies.length - 4}</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  {project.gitHubUrl && (
                    <a href={project.gitHubUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-white/35 hover:text-white/70 transition-colors">
                      <Github size={11} /> GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-white/35 hover:text-white/70 transition-colors ml-auto">
                      <ExternalLink size={11} /> Live Demo
                    </a>
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
