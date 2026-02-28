'use client';

import { useState } from 'react';
import type { SocialLink } from '../../types/portfolio';
import { sendContactMessage } from '../../lib/api';

interface ContactSectionProps {
  socialLinks?: SocialLink[];
}

function getSocialIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('github')) return 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z';
  if (lower.includes('linkedin')) return 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z';
  return '';
}

export default function ContactSection({ socialLinks = [] }: ContactSectionProps) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    subject: '',
    description: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const result = await sendContactMessage(form);
    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setForm({ fullName: '', email: '', subject: '', description: '' });
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-[#3b2bee]/50';
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-96 h-48 opacity-15 pointer-events-none"
        style={{ background: '#3b2bee', filter: 'blur(80px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">
            <span className="material-symbols-outlined text-[14px]">mail</span>
            Get in Touch
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Let&apos;s Connect
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Have a project in mind or just want to say hello? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Left: Info */}
          <div className="space-y-8">
            <div className="card-dark p-6 flex items-start gap-4">
              <div
                className="size-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(59,43,238,0.15)', color: '#7c6fff' }}
              >
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm">Email</h3>
                <p className="text-slate-400 text-sm mt-1">Send me a message using the form</p>
              </div>
            </div>

            <div className="card-dark p-6 flex items-start gap-4">
              <div
                className="size-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(59,43,238,0.15)', color: '#7c6fff' }}
              >
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm">Response Time</h3>
                <p className="text-slate-400 text-sm mt-1">Usually within 24 hours</p>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="card-dark p-6">
                <h3 className="font-display font-bold text-white text-sm mb-4">Social Profiles</h3>
                <div className="space-y-3">
                  {socialLinks.map((link) => {
                    const iconPath = getSocialIcon(link.name);
                    return (
                      <a
                        key={link.id}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        {iconPath ? (
                          <svg className="size-5 text-slate-400 group-hover:text-[#7c6fff] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d={iconPath} />
                          </svg>
                        ) : (
                          <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-[#7c6fff]">
                            open_in_new
                          </span>
                        )}
                        <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                          {link.name}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-slate-600 ml-auto group-hover:text-[#7c6fff]">
                          open_in_new
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="card-dark p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Subject *</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Message *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell me about your project or question..."
                className={inputClass + ' resize-none'}
                style={inputStyle}
              />
            </div>

            {/* Status */}
            {status === 'success' && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {message}
              </div>
            )}
            {status === 'error' && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <span className="material-symbols-outlined text-[18px]">error</span>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full justify-center"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin size-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
