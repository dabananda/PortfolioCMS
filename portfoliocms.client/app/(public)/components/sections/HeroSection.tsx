import Image from 'next/image';
import Link from 'next/link';
import type { PublicProfile, SocialLink } from '../../types/portfolio';

const PROFICIENCY_LABELS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];

function getSocialIcon(name: string): React.ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes('github')) {
    return (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  if (lower.includes('linkedin')) {
    return (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }
  return <span className="material-symbols-outlined text-[18px]">open_in_new</span>;
}

interface HeroSectionProps {
  profile: PublicProfile;
  socialLinks: SocialLink[];
}

export default function HeroSection({ profile, socialLinks }: HeroSectionProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const isAvailable = profile.status === 0; // Available

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-grid-pattern" />

      {/* Glow orbs */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: '#3b2bee', filter: 'blur(120px)' }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: '#6366f1', filter: 'blur(120px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <div className="flex flex-col gap-3">
              {/* Status badge */}
              {isAvailable && (
                <div className="section-badge w-fit">
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: '#3b2bee' }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ background: '#3b2bee' }}
                    />
                  </span>
                  Available for work
                </div>
              )}

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
                Hello, I&apos;m{' '}
                <span className="text-gradient">{fullName}</span>.
              </h1>

              <h2 className="text-slate-400 text-xl md:text-2xl font-light mt-2 font-display">
                {profile.headLine}
              </h2>

              {profile.location && (
                <p className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {profile.location}
                </p>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/#projects" className="btn-primary">
                View Projects
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link href="/#contact" className="btn-outline">
                Get In Touch
              </Link>
              {/* {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  id="resume"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Resume
                </a>
              )} */}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-5 mt-4 pt-6 border-t border-white/5">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.name}
                    className="text-slate-500 hover:text-[#7c6fff] transition-colors duration-300"
                  >
                    {getSocialIcon(link.name)}
                    <span className="sr-only">{link.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Image / Visual */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5]">
              {/* Blur decorations */}
              <div
                className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-30"
                style={{ background: '#3b2bee', filter: 'blur(80px)' }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-15"
                style={{ background: '#6366f1', filter: 'blur(80px)' }}
              />

              {/* Image container */}
              <div
                className="relative h-full w-full rounded-2xl overflow-hidden group"
                style={{
                  background: '#1a1828',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#121022]/80 via-transparent to-transparent z-10" />

                {profile.imageUrl ? (
                  <Image
                    src={profile.imageUrl}
                    alt={fullName}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="size-32 rounded-full flex items-center justify-center text-4xl font-bold font-display text-white"
                      style={{ background: 'rgba(59,43,238,0.3)' }}
                    >
                      {profile.firstName[0]}{profile.lastName[0]}
                    </div>
                  </div>
                )}

                {/* Floating card */}
                <div
                  className="absolute bottom-6 left-6 right-6 z-20 p-4 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: 'rgba(59,43,238,0.2)', color: '#7c6fff' }}
                    >
                      <span className="material-symbols-outlined text-[22px]">code</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{profile.headLine}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{profile.location ?? 'World'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative badge */}
              <div
                className="absolute top-8 -right-4 z-30 py-2 px-4 rounded-lg flex items-center gap-2"
                style={{
                  background: '#121022',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <span className="text-amber-400 material-symbols-outlined text-[18px]">star</span>
                <span className="text-white text-xs font-bold whitespace-nowrap">Open to Work</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
