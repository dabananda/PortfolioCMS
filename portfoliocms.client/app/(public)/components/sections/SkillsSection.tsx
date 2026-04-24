import type { Skill } from "../../types/portfolio";

const PROFICIENCY_COLORS: Record<number, string> = {
  0: "#64748b", // Slate
  1: "#3b82f6", // Blue
  2: "#8b5cf6", // Purple
  3: "#ec4899", // Pink
  4: "#f59e0b", // Amber
};

const PROFICIENCY_LABELS: Record<number, string> = {
  0: "Beginner",
  1: "Elementary",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
};

interface SkillsSectionProps {
  skills: Skill[];
}

function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills.length) return null;

  const grouped = groupSkillsByCategory(skills);
  const allSkillNames = skills.map((s) => s.skillName);

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-48 opacity-10 pointer-events-none"
        style={{ background: "#3b2bee", filter: "blur(80px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">
            <span className="material-symbols-outlined text-[14px]">code</span>
            Skills & Expertise
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            My Tech Stack
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Technologies and tools I work with to build great products
          </p>
        </div>

        {/* Marquee */}
        <div className="relative w-full mb-16 overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, #121022, transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to left, #121022, transparent)",
            }}
          />
          <div className="flex gap-4 animate-marquee whitespace-nowrap">
            {[...allSkillNames, ...allSkillNames].map((name, i) => (
              <span key={i} className="skill-pill shrink-0">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Grouped Skills - Modern Tag Cloud Redesign */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="card-dark p-6 flex flex-col">
              {/* Category Header with Icon */}
              <h3 className="font-display font-semibold text-white mb-6 flex items-center gap-3">
                <div
                  className="size-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(59,43,238,0.15)",
                    color: "#7c6fff",
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    terminal
                  </span>
                </div>
                {category}
              </h3>

              {/* Flex Wrap Skill Tags */}
              <div className="flex flex-wrap gap-2.5">
                {catSkills.map((skill) => {
                  const color =
                    PROFICIENCY_COLORS[skill.proficiency] ?? "#3b2bee";
                  const label =
                    PROFICIENCY_LABELS[skill.proficiency] ?? "Unknown";

                  return (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/5 cursor-default"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Glowing Dot for Proficiency Level */}
                      <span
                        className="size-1.5 rounded-full"
                        style={{
                          background: color,
                          boxShadow: `0 0 6px ${color}`,
                        }}
                      />

                      {/* Skill Name */}
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                        {skill.skillName}
                      </span>

                      {/* Subtle Proficiency Text */}
                      {/* <span
                        className="text-[10px] font-bold uppercase tracking-wider opacity-80"
                        style={{ color: color }}
                      >
                        {label}
                      </span> */}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
