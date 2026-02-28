import Image from 'next/image';
import type { Project } from '../../types/portfolio';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none"
        style={{ background: '#3b2bee', filter: 'blur(120px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">
            <span className="material-symbols-outlined text-[14px]">folder_open</span>
            Work
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Featured Projects
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            A selection of things I&apos;ve built
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className="card-dark overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden" style={{ background: '#0d0b1a' }}>
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="size-16 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(59,43,238,0.15)' }}
                    >
                      <span className="material-symbols-outlined text-[32px]" style={{ color: '#7c6fff' }}>
                        folder_open
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1828]/90 to-transparent" />

                {/* Index badge */}
                <div
                  className="absolute top-3 right-3 size-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(59,43,238,0.8)', color: 'white' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-[#7c6fff] transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span key={tech} className="skill-pill !text-xs !py-1 !px-2.5">{tech}</span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="skill-pill !text-xs !py-1 !px-2.5">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
                  {project.gitHubUrl && (
                    <a
                      href={project.gitHubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                    >
                      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#7c6fff] hover:text-white text-xs font-bold transition-colors ml-auto"
                    >
                      Live Demo
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
