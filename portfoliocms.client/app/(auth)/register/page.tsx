"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      setSuccessMsg(
        "Account created! Please check your email to confirm your account.",
      );

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .auth-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background-color: #0c0c0e;
          color: #e8e6e1;
        }

        /* ── Left panel ── */
        .auth-left {
          display: none;
          position: relative;
          flex: 1;
          overflow: hidden;
          background: #111113;
        }
        @media (min-width: 1024px) { .auth-left { display: flex; flex-direction: column; justify-content: space-between; padding: 3rem; } }

        .auth-left-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .auth-left-glow {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .auth-brand {
          position: relative;
          z-index: 1;
        }
        .auth-brand-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #8b5cf6;
          margin-right: 10px;
          vertical-align: middle;
        }
        .auth-brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          letter-spacing: 0.02em;
          color: #e8e6e1;
        }

        .auth-steps {
          position: relative;
          z-index: 1;
        }
        .auth-steps-title {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .auth-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .auth-step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #2a2a30;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          color: #8b5cf6;
          font-weight: 500;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .auth-step-label {
          font-size: 0.875rem;
          color: #888;
          line-height: 1.5;
        }
        .auth-step-label strong {
          display: block;
          color: #c9c6c0;
          font-weight: 500;
          margin-bottom: 0.15rem;
        }

        /* ── Right panel ── */
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          max-width: 100%;
        }
        @media (min-width: 1024px) { .auth-right { max-width: 560px; } }

        .auth-card {
          width: 100%;
          max-width: 460px;
        }

        .auth-header {
          margin-bottom: 2rem;
        }
        .auth-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8b5cf6;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .auth-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: #8b5cf6;
        }
        .auth-title {
          font-family: 'DM Serif Display', serif;
          font-size: 2.2rem;
          line-height: 1.15;
          color: #f0ede8;
          margin-bottom: 0.5rem;
        }
        .auth-subtitle {
          font-size: 0.875rem;
          color: #666;
          font-weight: 300;
        }

        /* ── Form ── */
        .auth-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .auth-field {
          margin-bottom: 1.25rem;
        }
        .auth-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 0.5rem;
        }
        .auth-input {
          width: 100%;
          background: #16161a;
          border: 1px solid #2a2a30;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #e8e6e1;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .auth-input::placeholder { color: #3a3a42; }
        .auth-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        .auth-input-error { border-color: #ef4444 !important; }
        .auth-error-msg {
          font-size: 0.75rem;
          color: #f87171;
          margin-top: 0.35rem;
        }

        /* ── Banners ── */
        .auth-banner-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          color: #f87171;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .auth-banner-success {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          color: #4ade80;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        /* ── Submit ── */
        .auth-submit {
          width: 100%;
          padding: 0.85rem 1.5rem;
          background: #8b5cf6;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 0.5rem;
        }
        .auth-submit:hover:not(:disabled) {
          background: #7c3aed;
          box-shadow: 0 4px 24px rgba(139,92,246,0.35);
          transform: translateY(-1px);
        }
        .auth-submit:active:not(:disabled) { transform: translateY(0); }
        .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-submit-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .auth-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Footer ── */
        .auth-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.85rem;
          color: #555;
        }
        .auth-footer a {
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .auth-footer a:hover { color: #a78bfa; }

        /* ── Divider ── */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.5rem 0;
        }
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: #1e1e24;
        }
        .auth-divider-text {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: #3a3a42;
          text-transform: uppercase;
        }

        /* ── Password hint ── */
        .auth-hint {
          font-size: 0.72rem;
          color: #3a3a42;
          margin-top: 0.35rem;
        }
      `}</style>

      <div className="auth-root">
        {/* Left decorative panel */}
        <div className="auth-left">
          <div className="auth-left-grid" />
          <div className="auth-left-glow" />

          <div className="auth-brand">
            <span className="auth-brand-dot" />
            <span className="auth-brand-name">PortfolioCMS</span>
          </div>

          <div className="auth-steps">
            <p className="auth-steps-title">Getting started is easy</p>

            <div className="auth-step">
              <div className="auth-step-num">1</div>
              <div className="auth-step-label">
                <strong>Create your account</strong>
                Fill in your details to get started in seconds.
              </div>
            </div>

            <div className="auth-step">
              <div className="auth-step-num">2</div>
              <div className="auth-step-label">
                <strong>Confirm your email</strong>
                We'll send a verification link to your inbox.
              </div>
            </div>

            <div className="auth-step">
              <div className="auth-step-num">3</div>
              <div className="auth-step-label">
                <strong>Build your portfolio</strong>
                Showcase projects, skills, and experience — all in one place.
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <p className="auth-eyebrow">Get started</p>
              <h1 className="auth-title">
                Create your
                <br />
                account
              </h1>
              <p className="auth-subtitle">
                Your portfolio starts here. It only takes a moment.
              </p>
            </div>

            {error && <div className="auth-banner-error">{error}</div>}
            {successMsg && (
              <div className="auth-banner-success">{successMsg}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="auth-grid-2">
                <div>
                  <label className="auth-label">First Name</label>
                  <input
                    {...register("firstName")}
                    className={`auth-input${errors.firstName ? " auth-input-error" : ""}`}
                    placeholder="Jane"
                  />
                  {errors.firstName && (
                    <p className="auth-error-msg">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="auth-label">Last Name</label>
                  <input
                    {...register("lastName")}
                    className={`auth-input${errors.lastName ? " auth-input-error" : ""}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="auth-error-msg">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Username</label>
                <input
                  {...register("username")}
                  type="text"
                  placeholder="janedoe"
                  className={`auth-input${errors.username ? " auth-input-error" : ""}`}
                />
                {errors.username && (
                  <p className="auth-error-msg">{errors.username.message}</p>
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="jane@example.com"
                  className={`auth-input${errors.email ? " auth-input-error" : ""}`}
                />
                {errors.email && (
                  <p className="auth-error-msg">{errors.email.message}</p>
                )}
              </div>

              <div className="auth-grid-2">
                <div>
                  <label className="auth-label">Password</label>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••••"
                    className={`auth-input${errors.password ? " auth-input-error" : ""}`}
                  />
                  {errors.password ? (
                    <p className="auth-error-msg">{errors.password.message}</p>
                  ) : (
                    <p className="auth-hint">Min. 8 characters</p>
                  )}
                </div>
                <div>
                  <label className="auth-label">Confirm Password</label>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="••••••••••"
                    className={`auth-input${errors.confirmPassword ? " auth-input-error" : ""}`}
                  />
                  {errors.confirmPassword && (
                    <p className="auth-error-msg">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-submit"
              >
                <span className="auth-submit-inner">
                  {isLoading && <span className="auth-spinner" />}
                  {isLoading ? "Creating account..." : "Create account"}
                </span>
              </button>
            </form>

            <div className="auth-divider">
              <span className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <span className="auth-divider-line" />
            </div>

            <div className="auth-footer">
              Already have an account? <Link href="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
