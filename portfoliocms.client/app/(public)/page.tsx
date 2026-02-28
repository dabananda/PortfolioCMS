import { getPortfolio, getBlogPosts } from './lib/api';
import HeroSection from './components/sections/HeroSection';
import SkillsSection from './components/sections/SkillsSection';
import ExperienceEducationSection from './components/sections/ExperienceEducationSection';
import ProjectsSection from './components/sections/ProjectsSection';
import CertificationsSection from './components/sections/CertificationsSection';
import ReviewsSection from './components/sections/ReviewsSection';
import ExtraCurricularSection from './components/sections/ExtraCurricularSection';
import ProblemSolvingSection from './components/sections/ProblemSolvingSection';
import LatestBlogsSection from './components/sections/LatestBlogsSection';
import ContactSection from './components/sections/ContactSection';

export const revalidate = 60;

export default async function Homepage() {
  const [portfolio, blogData] = await Promise.all([
    getPortfolio(),
    getBlogPosts({ page: 1, pageSize: 3 }),
  ]);

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div
            className="size-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(59,43,238,0.15)', color: '#7c6fff' }}
          >
            <span className="material-symbols-outlined text-[32px]">error_outline</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Portfolio Unavailable</h1>
          <p className="text-slate-500 text-sm">
            Could not load portfolio data. Please check the server configuration.
          </p>
        </div>
      </div>
    );
  }

  const { profile, skills, workExperiences, educations, projects, certifications, socialLinks, reviews, extraCurricularActivities, problemSolvings } = portfolio;
  const blogPosts = blogData?.items ?? [];

  return (
    <>
      <HeroSection profile={profile} socialLinks={socialLinks} />
      <SkillsSection skills={skills} />
      <ExperienceEducationSection workExperiences={workExperiences} educations={educations} />
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
