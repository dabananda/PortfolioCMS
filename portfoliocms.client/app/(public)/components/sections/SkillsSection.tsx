import type { Skill } from '../../types/portfolio';

const PROFICIENCY_COLORS: Record<number, string> = {
  0: '#64748b',
  1: '#3b82f6',
  2: '#8b5cf6',
  3: '#ec4899',
  4: '#f59e0b',
};

const PROFICIENCY_LABELS: Record<number, string> = {
  0: 'Beginner',
  1: 'Elementary',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
};

interface SkillsSectionProps {
  skills: Skill[];
}

function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? 'Other';
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
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-48 opacity-10 pointer-events-none"
        style={{ background: '#3b2bee', filter: 'blur(80px)' }}
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
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #121022, transparent)' }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #121022, transparent)' }}
          />
          <div className="flex gap-4 animate-marquee whitespace-nowrap">
            {[...allSkillNames, ...allSkillNames].map((name, i) => (
              <span key={i} className="skill-pill shrink-0">{name}</span>
            ))}
          </div>
        </div>

        {/* Grouped */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="card-dark p-6">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <span
                  className="size-2 rounded-full inline-block"
                  style={{ background: '#3b2bee' }}
                />
                {category}
              </h3>
              <div className="space-y-3">
                {catSkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-300 font-medium">{skill.skillName}</span>
                      <span className="text-xs text-slate-500">{PROFICIENCY_LABELS[skill.proficiency] ?? 'Unknown'}</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${((skill.proficiency + 1) / 5) * 100}%`,
                          background: PROFICIENCY_COLORS[skill.proficiency] ?? '#3b2bee',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
