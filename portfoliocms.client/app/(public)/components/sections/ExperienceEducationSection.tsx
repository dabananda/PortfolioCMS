import type { WorkExperience, Education } from '../../types/portfolio';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

interface ExperienceEducationSectionProps {
  workExperiences: WorkExperience[];
  educations: Education[];
}

export default function ExperienceEducationSection({
  workExperiences,
  educations,
}: ExperienceEducationSectionProps) {
  if (!workExperiences.length && !educations.length) return null;

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-10 pointer-events-none"
        style={{ background: "#3b2bee", filter: "blur(100px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">
            <span className="material-symbols-outlined text-[14px]">work</span>
            Background
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Experience & Education
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          {workExperiences.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-8 flex items-center gap-3">
                <div
                  className="size-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(59,43,238,0.2)",
                    color: "#7c6fff",
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    business_center
                  </span>
                </div>
                Work Experience
              </h3>

              <div className="relative pl-12">
                <div className="timeline-line" />
                <div className="space-y-8">
                  {workExperiences.map((exp, idx) => (
                    <div key={exp.id} className="relative">
                      {/* Dot */}
                      <div
                        className="absolute -left-[34px] size-4 rounded-full border-2 top-1"
                        style={{
                          background: idx === 0 ? "#3b2bee" : "#1a1828",
                          borderColor: "#3b2bee",
                        }}
                      />
                      <div className="card-dark p-5 hover:-translate-y-0.5 transition-transform">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-display font-bold text-white">
                              {exp.role}
                            </h4>
                            <p className="text-[#7c6fff] text-sm font-medium">
                              {exp.companyName}
                            </p>
                          </div>
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                            style={{
                              background: "rgba(59,43,238,0.1)",
                              color: "#a5b4fc",
                              border: "1px solid rgba(59,43,238,0.2)",
                            }}
                          >
                            {formatDate(exp.startDate)} —{" "}
                            {exp.endDate ? formatDate(exp.endDate) : "Present"}
                          </span>
                        </div>
                        {exp.companyDescription && (
                          <p className="text-slate-500 text-xs mb-2">
                            {exp.companyDescription}
                          </p>
                        )}
                        {exp.workDescription && (
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {exp.workDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-8 flex items-center gap-3">
                <div
                  className="size-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(59,43,238,0.2)",
                    color: "#7c6fff",
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    school
                  </span>
                </div>
                Education
              </h3>

              <div className="relative pl-12">
                <div className="timeline-line" />
                <div className="space-y-8">
                  {educations.map((edu, idx) => (
                    <div key={edu.id} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className="absolute -left-[34px] size-4 rounded-full border-2 top-1.5"
                        style={{
                          background: idx === 0 ? "#3b2bee" : "#1a1828",
                          borderColor: "#3b2bee",
                        }}
                      />

                      <div className="card-dark p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
                        {/* Top Row: Removed `flex-wrap` to force elements to stay on the same line */}
                        <div className="flex items-start justify-between gap-3">
                          {/* Added `min-w-0` so long text wraps inside this container instead of pushing the date down */}
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <h4 className="font-display font-bold text-white text-base md:text-lg break-words">
                              {edu.instituteName}
                            </h4>
                            <p className="text-[#7c6fff] text-sm font-medium">
                              {edu.department}
                            </p>
                          </div>

                          {/* The `shrink-0` class ensures this badge never gets squished */}
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0 mt-0.5"
                            style={{
                              background: "rgba(59,43,238,0.1)",
                              color: "#a5b4fc",
                              border: "1px solid rgba(59,43,238,0.2)",
                            }}
                          >
                            {formatDate(edu.startDate)} —{" "}
                            {edu.endDate ? formatDate(edu.endDate) : "Present"}
                          </span>
                        </div>

                        {/* Bottom Row: Location and CGPA */}
                        <div className="flex flex-wrap items-center gap-4 mt-1">
                          <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-[16px]">
                              location_on
                            </span>
                            <span>{edu.instituteLocation}</span>
                          </span>

                          <span
                            className="text-xs px-2.5 py-1 rounded-md font-medium"
                            style={{
                              background: "rgba(59,43,238,0.1)",
                              color: "#a5b4fc",
                            }}
                          >
                            CGPA: {edu.cgpa}/{edu.scale}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
