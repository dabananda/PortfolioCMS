import type { ExtraCurricularActivity } from '../../types/portfolio';

interface ExtraCurricularSectionProps {
  activities: ExtraCurricularActivity[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const ICONS = ['sports_esports', 'music_note', 'groups', 'volunteer_activism', 'emoji_events', 'public'];

export default function ExtraCurricularSection({ activities }: ExtraCurricularSectionProps) {
  if (!activities.length) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute left-0 bottom-0 w-64 h-64 opacity-10 pointer-events-none"
        style={{ background: '#3b2bee', filter: 'blur(100px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sticky title side */}
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <div className="section-badge mb-4">
              <span className="material-symbols-outlined text-[14px]">local_activity</span>
              Beyond Work
            </div>
            <h2 className="font-display text-4xl font-bold text-white leading-tight">
              Extracurricular Activities
            </h2>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              Activities and pursuits outside of professional work that shape who I am.
            </p>
          </div>

          {/* Activities grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activities.map((activity, idx) => (
              <div key={activity.id} className="card-dark p-5 group hover:-translate-y-0.5 transition-transform">
                <div className="flex items-start gap-4">
                  <div
                    className="size-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(59,43,238,0.15)', color: '#7c6fff' }}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {ICONS[idx % ICONS.length]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-sm">{activity.title}</h3>
                    <p className="text-[#7c6fff] text-xs font-medium mt-0.5">{activity.organization}</p>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{activity.description}</p>
                    <p className="text-slate-600 text-xs mt-2">
                      {formatDate(activity.startDate)} — {activity.endDate ? formatDate(activity.endDate) : 'Present'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
