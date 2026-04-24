"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  resumeUrl?: string;
}

export default function Navbar({ resumeUrl }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view using IntersectionObserver
  useEffect(() => {
    const sectionIds = [
      "home",
      "about",
      "experience",
      "projects",
      "education",
      "contact",
    ];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/#home", section: "home" },
    { label: "Experience", href: "/#experience", section: "experience" },
    { label: "Skills", href: "/#skills", section: "skills" },
    { label: "Projects", href: "/#projects", section: "projects" },
    { label: "Contact", href: "/#contact", section: "contact" },
    { label: "Blogs", href: "/blogs", section: null },
  ];

  const isBlogPage = pathname?.startsWith("/blogs");

  const isActive = (link: (typeof navLinks)[0]) => {
    if (link.section === null) {
      return isBlogPage;
    }
    return !isBlogPage && activeSection === link.section;
  };

  // NEW: Custom click handler to prevent hash stacking
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[0],
  ) => {
    if (link.section) {
      // If we are already on the homepage, manually handle the scroll and URL update
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(link.section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `/#${link.section}`);
        }
      }
      setActiveSection(link.section);
    }
    setIsMobileOpen(false); // Always close mobile menu on click
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "glass-nav border-white/8"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center size-9 rounded-lg bg-[#3b2bee]/20 text-[#7c6fff] group-hover:bg-[#3b2bee]/30 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              terminal
            </span>
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Portfolio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className={`text-sm font-medium transition-colors ${
                isActive(link)
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={resumeUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2 !px-5 !text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Resume
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {isMobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden glass-nav border-t border-white/8 px-4 pb-4">
          <nav className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link)
                    ? "text-white bg-white/8"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
