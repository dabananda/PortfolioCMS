import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio and blog',
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .public-root {
          font-family: 'Inter', sans-serif;
          background-color: #121022;
          color: #e2e8f0;
          min-height: 100vh;
        }

        .font-display { font-family: 'Space Grotesk', sans-serif; }

        .glass-nav {
          background: rgba(18,16,34,0.75);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .bg-grid-pattern {
          background-image: linear-gradient(to right,#2a2839 1px,transparent 1px),
            linear-gradient(to bottom,#2a2839 1px,transparent 1px);
          background-size: 40px 40px;
          mask-image: linear-gradient(to bottom,transparent,8%,black,92%,transparent);
          -webkit-mask-image: linear-gradient(to bottom,transparent,8%,black,92%,transparent);
        }

        .text-gradient {
          background: linear-gradient(135deg, #3b2bee 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-dark {
          background: #1a1828;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1rem;
          transition: border-color 0.2s;
        }
        .card-dark:hover { border-color: rgba(59,43,238,0.3); }

        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px 24px; background: #3b2bee; color: white; font-weight: 700;
          font-size: 14px; border-radius: 8px; transition: all 0.2s; cursor: pointer;
          border: none; box-shadow: 0 4px 20px rgba(59,43,238,0.3);
        }
        .btn-primary:hover { background: #4d3ef0; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(59,43,238,0.4); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-outline {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px 24px; background: transparent; color: #e2e8f0; font-weight: 700;
          font-size: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s; cursor: pointer;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); }

        .section-badge {
          display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px;
          border-radius: 9999px; background: rgba(59,43,238,0.1); border: 1px solid rgba(59,43,238,0.2);
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #7c6fff;
        }

        .skill-pill {
          display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 9999px;
          background: rgba(59,43,238,0.1); border: 1px solid rgba(59,43,238,0.2); color: #a5b4fc;
          font-size: 13px; font-weight: 500; transition: all 0.2s;
        }
        .skill-pill:hover { background: rgba(59,43,238,0.2); border-color: rgba(59,43,238,0.4); color: white; }

        .timeline-line {
          position: absolute; left: 20px; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(59,43,238,0.4) 20%, rgba(59,43,238,0.4) 80%, transparent);
        }

        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }

        .prose-dark h1, .prose-dark h2, .prose-dark h3 { color: #f1f5f9; margin-top: 1.5em; margin-bottom: 0.5em; font-family: 'Space Grotesk', sans-serif; }
        .prose-dark p { color: #94a3b8; margin-bottom: 1em; line-height: 1.8; }
        .prose-dark ul, .prose-dark ol { color: #94a3b8; padding-left: 1.5em; margin-bottom: 1em; }
        .prose-dark li { margin-bottom: 0.25em; }
        .prose-dark code { background: rgba(59,43,238,0.15); color: #a5b4fc; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .prose-dark pre { background: #0d0b1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px; overflow-x: auto; margin-bottom: 1em; }
        .prose-dark pre code { background: transparent; padding: 0; }
        .prose-dark strong { color: #e2e8f0; }
        .prose-dark a { color: #7c6fff; text-decoration: underline; }
        .prose-dark blockquote { border-left: 3px solid #3b2bee; padding-left: 1em; color: #94a3b8; margin: 1em 0; font-style: italic; }
        .prose-dark img { border-radius: 8px; margin: 1em 0; max-width: 100%; }
      `}</style>
      <div className="public-root">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
