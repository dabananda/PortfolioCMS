"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWithAuth, fetchWithAuthMutation } from "@/lib/api";
import {
  Settings,
  User,
  Lock,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Server,
  Globe,
} from "lucide-react";

type Toast = { type: "success" | "error"; msg: string } | null;

type SmtpSettings = {
  id?: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  senderName: string;
  senderEmail: string;
  enableSsl: boolean;
};

function ToastMsg({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium
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

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#161b22] border border-white/6 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
        <Icon size={14} className="text-violet-400" />
        <h2 className="text-sm font-semibold text-white/70">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-[#0d1117] transition-all";

// ── Password Section ──────────────────────────────────────────────────────────
function PasswordSection({ setToast }: { setToast: (t: Toast) => void }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (form.newPassword !== form.confirmPassword)
        throw new Error("Passwords do not match");
      if (form.newPassword.length < 8)
        throw new Error("Password must be at least 8 characters");
      const res = await fetchWithAuthMutation(
        "account/change-password",
        "POST",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to change password");
      }
    },
    onSuccess: () => {
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setError("");
      setToast({ type: "success", msg: "Password changed successfully!" });
    },
    onError: (e: Error) => setError(e.message),
  });

  const strength =
    form.newPassword.length === 0
      ? 0
      : form.newPassword.length < 8
        ? 1
        : form.newPassword.length < 12
          ? 2
          : form.newPassword.length < 16
            ? 3
            : 4;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    "bg-rose-500",
    "bg-amber-500",
    "bg-violet-500",
    "bg-emerald-500",
  ];
  const strengthText = [
    "",
    "text-rose-400",
    "text-amber-400",
    "text-violet-400",
    "text-emerald-400",
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            className={inputCls + " pr-10"}
            placeholder="••••••••"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((f) => ({ ...f, currentPassword: e.target.value }))
            }
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
          >
            {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              className={inputCls + " pr-10"}
              placeholder="Min. 8 chars"
              value={form.newPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, newPassword: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
            >
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
            Confirm Password
          </label>
          <input
            type="password"
            className={inputCls}
            placeholder="Repeat new password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((f) => ({ ...f, confirmPassword: e.target.value }))
            }
          />
        </div>
      </div>
      {form.newPassword.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden flex gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 h-full rounded-full transition-all ${i <= strength ? strengthColor[strength] : "bg-transparent"}`}
              />
            ))}
          </div>
          <span className={`text-xs font-medium ${strengthText[strength]}`}>
            {strengthLabel[strength]}
          </span>
        </div>
      )}
      <div className="flex justify-end pt-1">
        <button
          onClick={() => mutation.mutate()}
          disabled={
            mutation.isPending ||
            !form.currentPassword ||
            !form.newPassword ||
            !form.confirmPassword
          }
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Lock size={14} />
          )}
          {mutation.isPending ? "Updating…" : "Change Password"}
        </button>
      </div>
    </div>
  );
}

// ── SMTP Section ──────────────────────────────────────────────────────────────
function SmtpSection({ setToast }: { setToast: (t: Toast) => void }) {
  const [form, setForm] = useState<SmtpSettings & { smtpPassword: string }>({
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    senderName: "",
    senderEmail: "",
    enableSsl: true,
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const { isLoading } = useQuery<SmtpSettings>({
    queryKey: ["smtp-settings"],
    queryFn: async () => {
      const res = await fetchWithAuth("adminsettings/system");
      const json = await res.json();
      return json.data ?? json;
    },
    retry: false,
  });

  // Pre-fill from query data
  useQuery<SmtpSettings>({
    queryKey: ["smtp-settings"],
    queryFn: async () => {
      const res = await fetchWithAuth("adminsettings/system");
      const json = await res.json();
      const data = json.data ?? json;
      if (data && !loaded) {
        setForm((f) => ({
          ...f,
          smtpHost: data.smtpHost ?? "",
          smtpPort: data.smtpPort ?? 587,
          smtpUser: data.smtpUser ?? "",
          senderName: data.senderName ?? "",
          senderEmail: data.senderEmail ?? "",
          enableSsl: data.enableSsl ?? true,
        }));
        setLoaded(true);
      }
      return data;
    },
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        smtpHost: form.smtpHost,
        smtpPort: form.smtpPort,
        smtpUser: form.smtpUser,
        smtpPassword: form.smtpPassword || undefined,
        senderName: form.senderName,
        senderEmail: form.senderEmail,
        enableSsl: form.enableSsl,
      };
      const res = await fetchWithAuthMutation(
        "adminsettings/system",
        "PUT",
        payload,
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save SMTP settings");
      }
    },
    onSuccess: () => setToast({ type: "success", msg: "SMTP settings saved!" }),
    onError: (e: Error) => setError(e.message),
  });

  const COMMON_PORTS = [25, 465, 587, 2525];

  if (isLoading)
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-white/5 rounded-lg" />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/15 text-xs text-violet-300/70 flex items-start gap-2">
        <Mail size={13} className="shrink-0 mt-0.5 text-violet-400" />
        Configure SMTP to enable contact form emails, password resets, and
        notifications. Leave password blank to keep the existing value.
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
            SMTP Host *
          </label>
          <input
            className={inputCls}
            placeholder="smtp.gmail.com"
            value={form.smtpHost}
            onChange={(e) =>
              setForm((f) => ({ ...f, smtpHost: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
            Port *
          </label>
          <div className="relative">
            <input
              type="number"
              className={inputCls}
              placeholder="587"
              value={form.smtpPort}
              onChange={(e) =>
                setForm((f) => ({ ...f, smtpPort: Number(e.target.value) }))
              }
            />
          </div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {COMMON_PORTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setForm((f) => ({ ...f, smtpPort: p }))}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${form.smtpPort === p ? "bg-violet-600/30 text-violet-300 border border-violet-500/30" : "bg-white/4 text-white/30 hover:text-white/60 border border-white/6"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
            SMTP Username *
          </label>
          <input
            className={inputCls}
            placeholder="your@email.com"
            value={form.smtpUser}
            onChange={(e) =>
              setForm((f) => ({ ...f, smtpUser: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
            SMTP Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className={inputCls + " pr-10"}
              placeholder="Leave blank to keep existing"
              value={form.smtpPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, smtpPassword: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
            Sender Name *
          </label>
          <input
            className={inputCls}
            placeholder="My Portfolio"
            value={form.senderName}
            onChange={(e) =>
              setForm((f) => ({ ...f, senderName: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
            Sender Email *
          </label>
          <input
            type="email"
            className={inputCls}
            placeholder="noreply@yoursite.com"
            value={form.senderEmail}
            onChange={(e) =>
              setForm((f) => ({ ...f, senderEmail: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/6">
        <div>
          <p className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Globe size={13} className="text-violet-400" /> Enable SSL/TLS
          </p>
          <p className="text-xs text-white/30 mt-0.5">
            Recommended for secure email delivery
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, enableSsl: !f.enableSsl }))}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.enableSsl ? "bg-violet-600" : "bg-white/10"}`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form.enableSsl ? "left-6" : "left-1"}`}
          />
        </button>
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={() => mutation.mutate()}
          disabled={
            mutation.isPending ||
            !form.smtpHost ||
            !form.smtpUser ||
            !form.senderName ||
            !form.senderEmail
          }
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Server size={14} />
          )}
          {mutation.isPending ? "Saving…" : "Save SMTP Settings"}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [toast, setToast] = useState<Toast>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("email") ?? "");
  }, []);

  return (
    <div className="max-w-2xl space-y-5">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />

      <div>
        <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
          <Settings size={20} className="text-violet-400" /> Settings
        </h1>
        <p className="text-sm text-white/35 mt-0.5">
          Manage your account, email, and content settings
        </p>
      </div>

      {/* Account info */}
      <Section title="Account" icon={User}>
        <div className="p-4 rounded-xl bg-white/3 border border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {email.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">
                {email || "Admin"}
              </p>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1 w-fit">
                <Shield size={9} /> Administrator
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* SMTP Settings */}
      <Section title="SMTP Email Configuration" icon={Mail}>
        <SmtpSection setToast={setToast} />
      </Section>

      {/* Change password */}
      <Section title="Change Password" icon={Lock}>
        <PasswordSection setToast={setToast} />
      </Section>
    </div>
  );
}
