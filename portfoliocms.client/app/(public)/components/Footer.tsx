import Link from "next/link";
import type { SocialLink } from "../types/portfolio";
import { getPortfolio } from "../lib/api";

function getSocialPath(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("github"))
    return "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z";
  if (lower.includes("linkedin"))
    return "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z";
  return "";
}

export default async function Footer() {
  const portfolio = await getPortfolio();
  const socialLinks: SocialLink[] = portfolio?.socialLinks ?? [];
  const profile = portfolio?.profile;
  const name = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Portfolio";

  return (
    <footer
      style={{
        background: "#0d0b1a",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
      className="py-10 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-[#3b2bee]/20 text-[#7c6fff]">
              <span className="material-symbols-outlined text-[16px]">
                terminal
              </span>
            </div>
            <span className="font-display font-bold text-white">{name}</span>
          </Link>

          <nav className="flex items-center gap-6">
            {["Home", "About", "Projects", "Blog", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Blog" ? "/blogs" : `/#${item.toLowerCase()}`}
                className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.slice(0, 4).map((link) => {
              const path = getSocialPath(link.name);
              return (
                <a
                  key={link.id}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.name}
                  className="text-slate-500 hover:text-[#7c6fff] transition-colors"
                >
                  {path ? (
                    <svg
                      className="size-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d={path} />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">
                      {link.name.slice(0, 2)}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()}{" "}
            <a href="https://github.com/dabananda" target="_blank">{name}</a>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
