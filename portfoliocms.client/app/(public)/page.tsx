"use client";

import { useEffect, useState } from "react";
import { getPortfolio, getBlogPosts } from "./lib/api";
import type { PublicPortfolio, BlogPost } from "./types/portfolio";
import HeroSection from "./components/sections/HeroSection";
import SkillsSection from "./components/sections/SkillsSection";
import ExperienceEducationSection from "./components/sections/ExperienceEducationSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import CertificationsSection from "./components/sections/CertificationsSection";
import ReviewsSection from "./components/sections/ReviewsSection";
import ExtraCurricularSection from "./components/sections/ExtraCurricularSection";
import ProblemSolvingSection from "./components/sections/ProblemSolvingSection";
import LatestBlogsSection from "./components/sections/LatestBlogsSection";
import ContactSection from "./components/sections/ContactSection";

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10 py-20 space-y-16 animate-pulse">
      {/* Hero skeleton */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div
          className="w-48 h-48 rounded-full shrink-0"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div className="flex-1 space-y-4">
          <div
            className="h-6 rounded w-1/3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <div
            className="h-10 rounded w-2/3"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div
            className="h-4 rounded w-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <div
            className="h-4 rounded w-3/4"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <div className="flex gap-3 pt-2">
            <div
              className="h-11 w-36 rounded-lg"
              style={{ background: "rgba(59,43,238,0.2)" }}
            />
            <div
              className="h-11 w-36 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>
        </div>
      </div>
      {/* Sections skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div
            className="h-5 rounded w-40"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div
                key={j}
                className="h-16 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Homepage() {
  const [portfolio, setPortfolio] = useState<
    PublicPortfolio | null | undefined
  >(undefined);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function load() {
      const [portfolioData, blogData] = await Promise.all([
        getPortfolio(),
        getBlogPosts({ page: 1, pageSize: 3 }),
      ]);
      console.log("Loaded portfolio:", portfolioData);
      setPortfolio(portfolioData);
      setBlogPosts(blogData?.items ?? []);
    }
    load();
  }, []);

  // Still loading
  if (portfolio === undefined) {
    return <PageSkeleton />;
  }

  // Failed to load
  if (portfolio === null) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div
            className="size-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(59,43,238,0.15)", color: "#7c6fff" }}
          >
            <span className="material-symbols-outlined text-[32px]">
              error_outline
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Portfolio Unavailable
          </h1>
          <p className="text-slate-500 text-sm">
            Could not load portfolio data. Please check the server
            configuration.
          </p>
        </div>
      </div>
    );
  }

  const {
    profile,
    skills,
    workExperiences,
    educations,
    projects,
    certifications,
    socialLinks,
    reviews,
    extraCurricularActivities,
    problemSolvings,
  } = portfolio;

  return (
    <>
      <HeroSection profile={profile} socialLinks={socialLinks} />
      <SkillsSection skills={skills} />
      <ExperienceEducationSection
        workExperiences={workExperiences}
        educations={educations}
      />
      <ProjectsSection projects={projects} />
      <CertificationsSection certifications={certifications} />
      <ExtraCurricularSection activities={extraCurricularActivities} />
      <ProblemSolvingSection problemSolvings={problemSolvings} />
      <ReviewsSection reviews={reviews} />
      <LatestBlogsSection posts={blogPosts} />
      <ContactSection socialLinks={socialLinks} />
    </>
  );
}
