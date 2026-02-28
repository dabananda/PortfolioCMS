"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth, fetchWithAuthMutation, uploadFile } from "@/lib/api";
import {
  User,
  Upload,
  FileText,
  Camera,
  Check,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar,
  Globe,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  ZoomIn,
  Mail,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type UserProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  status: number;
  headLine: string;
  imageUrl?: string;
  resumeUrl?: string;
  location?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
};

const USER_STATUS = [
  {
    value: 0,
    label: "Available",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  {
    value: 1,
    label: "Open to Work",
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    dot: "bg-sky-400",
  },
  {
    value: 2,
    label: "Not Available",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    dot: "bg-rose-400",
  },
  {
    value: 3,
    label: "Busy",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
  },
];

const STATUS_STRING_MAP: Record<string, number> = {
  Available: 0,
  OpenToWork: 1,
  NotAvailable: 2,
  Busy: 3,
};

type Toast = { type: "success" | "error"; msg: string } | null;

function ToastMsg({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium transition-all duration-300
      ${toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-300" : "bg-rose-500/15 border-rose-500/25 text-rose-300"}`}
    >
      {toast.type === "success" ? (
        <Check size={15} />
      ) : (
        <AlertCircle size={15} />
      )}
      {toast.msg}
    </div>
  );
}

function ImageUploadZone({
  value,
  onUpload,
  uploading,
}: {
  value?: string;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-white/15 cursor-pointer hover:border-violet-500/50 transition-colors group"
        onClick={() => ref.current?.click()}
      >
        {value ? (
          <Image src={value} alt="Profile" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={32} className="text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          {uploading ? (
            <Loader2 size={20} className="text-white animate-spin" />
          ) : (
            <Camera size={20} className="text-white" />
          )}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/8 border border-white/8 transition-all disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Upload size={11} />
        )}
        {uploading ? "Uploading…" : "Upload Photo"}
      </button>
    </div>
  );
}

function ResumeSection({
  value,
  onUpload,
  uploading,
}: {
  value?: string;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => ref.current?.click()}
        className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/40 cursor-pointer transition-colors bg-white/2 hover:bg-white/4 group"
      >
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          {uploading ? (
            <Loader2 size={18} className="text-violet-400 animate-spin" />
          ) : (
            <FileText size={18} className="text-violet-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">
            {uploading
              ? "Uploading resume…"
              : value
                ? "Replace Resume PDF"
                : "Upload Resume PDF"}
          </p>
          <p className="text-xs text-white/30 mt-0.5">PDF format, max 10 MB</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/20 text-violet-300 text-xs font-medium shrink-0">
          {value ? "Replace" : "Upload"}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
            setPreview(false);
          }
        }}
      />

      {/* File info + actions */}
      {value && !uploading && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-white/3 border border-white/6">
          <FileText size={14} className="text-violet-400 shrink-0" />
          <span className="text-xs text-white/50 truncate flex-1">
            {decodeURIComponent(value.split("/").pop() ?? value).slice(0, 50)}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setPreview((v) => !v)}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${preview ? "bg-violet-600/20 text-violet-300 border border-violet-500/20" : "text-white/40 hover:text-white/70 hover:bg-white/6"}`}
            >
              <ZoomIn size={11} /> {preview ? "Hide" : "Preview"}
            </button>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 px-2 py-1 rounded-md hover:bg-white/6 transition-colors"
            >
              <ExternalLink size={11} /> Open
            </a>
          </div>
        </div>
      )}

      {/* Embedded PDF Preview */}
      {value && preview && (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-white/3 relative">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/8">
            <span className="text-xs text-white/40 font-medium">
              Resume Preview
            </span>
            <button
              onClick={() => setPreview(false)}
              className="p-1 rounded text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(value)}&embedded=true`}
            className="w-full"
            style={{ height: "520px" }}
            title="Resume Preview"
          />
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-white/8 text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-[#0d1117] transition-all";

export default function ProfilePage() {
  const qc = useQueryClient();
  const [toast, setToast] = useState<Toast>(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);

  const [form, setForm] = useState({
    dateOfBirth: "",
    status: 0,
    headLine: "",
    imageUrl: "",
    resumeUrl: "",
    location: "",
    isPublic: false,
  });

  const {
    data: profile,
    isLoading,
    error: profileError,
  } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetchWithAuth("userprofile");
      const json = await res.json();
      return json.data ?? json;
    },
    retry: false,
  });

  useEffect(() => {
    if (profile) {
      setHasProfile(true);
      // API returns status as string enum name (JsonStringEnumConverter)
      const rawStatus = profile.status as unknown as string | number;
      const statusValue =
        typeof rawStatus === "string"
          ? (STATUS_STRING_MAP[rawStatus] ?? 0)
          : Number(rawStatus);
      setForm({
        dateOfBirth: profile.dateOfBirth
          ? (profile.dateOfBirth as unknown as string).split("T")[0]
          : "",
        status: statusValue,
        headLine: profile.headLine ?? "",
        imageUrl: profile.imageUrl ?? "",
        resumeUrl: profile.resumeUrl ?? "",
        location: profile.location ?? "",
        isPublic: profile.isPublic ?? false,
      });
    }
    if (profileError) setHasProfile(false);
  }, [profile, profileError]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        dateOfBirth: form.dateOfBirth || null,
        status: form.status,
        headLine: form.headLine || "",
        imageUrl: form.imageUrl || undefined,
        resumeUrl: form.resumeUrl || undefined,
        location: form.location || undefined,
        isPublic: form.isPublic,
      };
      const method = hasProfile ? "PUT" : "POST";
      const res = await fetchWithAuthMutation("userprofile", method, payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Save failed (${res.status})`);
      }
      return res.json();
    },
    onSuccess: () => {
      setHasProfile(true);
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      setToast({ type: "success", msg: "Profile saved successfully!" });
    },
    onError: (e: Error) => setToast({ type: "error", msg: e.message }),
  });

  const handleImageUpload = async (file: File) => {
    setImgUploading(true);
    try {
      const { url } = await uploadFile("upload/image", file);
      setForm((f) => ({ ...f, imageUrl: url }));
      setToast({ type: "success", msg: "Photo uploaded!" });
    } catch {
      setToast({ type: "error", msg: "Image upload failed." });
    } finally {
      setImgUploading(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setResumeUploading(true);
    try {
      const { url } = await uploadFile("upload/resume", file);
      setForm((f) => ({ ...f, resumeUrl: url }));
      setToast({ type: "success", msg: "Resume uploaded!" });
    } catch {
      setToast({ type: "error", msg: "Resume upload failed." });
    } finally {
      setResumeUploading(false);
    }
  };

  const currentStatus = USER_STATUS.find(
    (s) => s.value === Number(form.status),
  );

  if (isLoading)
    return (
      <div className="flex gap-6">
        <div className="w-72 shrink-0">
          <div className="bg-[#161b22] border border-white/6 rounded-xl p-6 animate-pulse">
            <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-4" />
            <div className="h-4 w-32 bg-white/8 rounded mx-auto mb-2" />
            <div className="h-3 w-24 bg-white/5 rounded mx-auto" />
          </div>
        </div>
        <div className="flex-1 space-y-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-white/6 rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 w-40 bg-white/8 rounded mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-10 bg-white/5 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Your Profile";

  return (
    <div className="flex gap-6">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />

      {/* ── Left: Live Profile Preview ── */}
      <div className="w-72 shrink-0">
        <div className="sticky top-6 space-y-4">
          {/* Preview Card */}
          <div className="bg-[#161b22] border border-white/6 rounded-xl overflow-hidden">
            {/* Cover gradient */}
            <div className="h-20 bg-linear-to-br from-violet-600/40 via-indigo-600/30 to-purple-700/40 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
            </div>

            {/* Avatar */}
            <div className="flex justify-center -mt-10 relative z-10">
              <div className="w-20 h-20 rounded-full border-4 border-[#161b22] overflow-hidden bg-[#0d1117] shadow-xl">
                {form.imageUrl ? (
                  <Image
                    src={form.imageUrl}
                    alt={fullName}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-violet-600 to-indigo-600">
                    <span className="text-xl font-bold text-white">
                      {fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="px-5 pt-3 pb-5 text-center">
              <h2 className="text-base font-bold text-white/90">{fullName}</h2>
              {form.headLine && (
                <p className="text-xs text-white/45 mt-1 leading-relaxed">
                  {form.headLine}
                </p>
              )}

              {/* Status + Location */}
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                {currentStatus && (
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${currentStatus.color}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} animate-pulse`}
                    />
                    {currentStatus.label}
                  </div>
                )}
                {/* Visibility */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      form.isPublic
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-white/5 border-white/8 text-white/30"
                    }`}
                  >
                    {form.isPublic ? <Eye size={9} /> : <EyeOff size={9} />}
                    {form.isPublic ? "Public" : "Private"}
                  </span>
              </div>

              {/* Visibility */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    form.isPublic
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border-white/8 text-white/30"
                  }`}
                >
                  {form.location && (
                <span className="flex items-center gap-1 text-[10px] text-white/35">
                  <MapPin size={9} /> {form.location}
                </span>
              )}
                </span>
              </div>
            </div>

            {/* Action links */}
            <div className="border-t border-white/6 px-4 py-3 space-y-1">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
                >
                  <Mail size={12} className="text-violet-400" />
                  <span className="truncate">{profile.email}</span>
                </a>
              )}
              {form.resumeUrl && (
                <a
                  href={form.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
                >
                  <Download size={12} className="text-violet-400" />
                  <span>Download Resume</span>
                  <ExternalLink size={9} className="ml-auto opacity-50" />
                </a>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-[#161b22] border border-white/6 rounded-xl p-4">
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">
              Profile Completeness
            </p>
            {(() => {
              const fields = [
                { label: "Photo", done: !!form.imageUrl },
                { label: "Headline", done: !!form.headLine },
                { label: "Location", done: !!form.location },
                { label: "Birthday", done: !!form.dateOfBirth },
                { label: "Resume", done: !!form.resumeUrl },
              ];
              const completed = fields.filter((f) => f.done).length;
              const pct = Math.round((completed / fields.length) * 100);
              return (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct === 100
                            ? "bg-emerald-500"
                            : pct >= 60
                              ? "bg-violet-500"
                              : "bg-amber-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        pct === 100
                          ? "text-emerald-400"
                          : pct >= 60
                            ? "text-violet-400"
                            : "text-amber-400"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    {fields.map((f) => (
                      <div key={f.label} className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                            f.done ? "bg-emerald-500/20" : "bg-white/5"
                          }`}
                        >
                          {f.done ? (
                            <Check size={8} className="text-emerald-400" />
                          ) : (
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                          )}
                        </div>
                        <span
                          className={`text-[11px] ${f.done ? "text-white/50" : "text-white/25"}`}
                        >
                          {f.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Right: Edit Form ── */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header card */}
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-6">
          <div className="flex items-start gap-6 flex-wrap sm:flex-nowrap">
            <ImageUploadZone
              value={form.imageUrl}
              onUpload={handleImageUpload}
              uploading={imgUploading}
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white/90">{fullName}</h1>
              <p className="text-sm text-white/35 mt-0.5">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {form.location && (
                  <span className="flex items-center gap-1 text-xs text-white/35">
                    <MapPin size={11} /> {form.location}
                  </span>
                )}
                {currentStatus && (
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${currentStatus.color}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}
                    />
                    {currentStatus.label}
                  </div>
                )}
                <span
                  className={`flex items-center gap-1 text-xs ${form.isPublic ? "text-emerald-400" : "text-white/25"}`}
                >
                  {form.isPublic ? <Eye size={11} /> : <EyeOff size={11} />}
                  {form.isPublic ? "Public" : "Private"}
                </span>
              </div>
              {form.headLine && (
                <p className="text-sm text-white/50 mt-2 italic">
                  "{form.headLine}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white/70 mb-5 flex items-center gap-2">
            <User size={14} className="text-violet-400" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
                Headline
              </label>
              <input
                className={inputCls}
                placeholder="e.g. Full-Stack Developer & Designer"
                value={form.headLine}
                onChange={(e) =>
                  setForm((f) => ({ ...f, headLine: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
                <input
                  className={inputCls + " pl-9"}
                  placeholder="City, Country"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
                <input
                  type="date"
                  style={{ colorScheme: "dark" }}
                  className={inputCls + " pl-9"}
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
                Status
              </label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: Number(e.target.value) }))
                  }
                  style={{ colorScheme: "dark", backgroundColor: "#0d1117" }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-white/8 text-sm text-white/90 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer appearance-none"
                >
                  {USER_STATUS.map((s) => (
                    <option
                      key={s.value}
                      value={s.value}
                      style={{ backgroundColor: "#161b22", color: "#e2e8f0" }}
                    >
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-white/30"
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Public toggle */}
          <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/6">
            <div>
              <p className="text-sm font-medium text-white/70 flex items-center gap-2">
                <Globe size={14} className="text-violet-400" /> Public Profile
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                Make your portfolio visible to visitors
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isPublic: !f.isPublic }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.isPublic ? "bg-violet-600" : "bg-white/10"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form.isPublic ? "left-6" : "left-1"}`}
              />
            </button>
          </div>
        </div>

        {/* Resume */}
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white/70 mb-5 flex items-center gap-2">
            <FileText size={14} className="text-violet-400" /> Resume / CV
          </h2>
          <ResumeSection
            value={form.resumeUrl}
            onUpload={handleResumeUpload}
            uploading={resumeUploading}
          />
        </div>

        {/* Save button */}
        <div className="bg-[#161b22] border border-white/6 rounded-xl p-4 flex items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            All changes are saved to your profile immediately.
          </p>
          <button
            type="button"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {saveMutation.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Check size={15} />
            )}
            {saveMutation.isPending
              ? "Saving…"
              : hasProfile
                ? "Save Changes"
                : "Create Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
