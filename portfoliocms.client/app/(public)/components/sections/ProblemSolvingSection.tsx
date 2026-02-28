import type { ProblemSolving } from '../../types/portfolio';

interface ProblemSolvingSectionProps {
  problemSolvings: ProblemSolving[];
}

const JUDGE_ICONS: Record<string, string> = {
  codeforces: '🔥',
  leetcode: '💡',
  atcoder: '⚡',
  codechef: '🍴',
  hackerrank: '🏆',
  default: '💻',
};

function getJudgeIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const key of Object.keys(JUDGE_ICONS)) {
    if (lower.includes(key)) return JUDGE_ICONS[key];
  }
  return JUDGE_ICONS.default;
}

const JUDGE_COLORS: string[] = [
  '#3b2bee', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
];

export default function ProblemSolvingSection({ problemSolvings }: ProblemSolvingSectionProps) {
  if (!problemSolvings.length) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none"
        style={{ background: '#6366f1', filter: 'blur(100px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            Competitive
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Problem Solving
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Competitive programming profiles and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problemSolvings.map((ps, idx) => (
            <a
              key={ps.id}
              href={ps.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-dark p-6 group hover:-translate-y-1 transition-transform block"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="size-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${JUDGE_COLORS[idx % JUDGE_COLORS.length]}22` }}
                >
                  {getJudgeIcon(ps.judgeName)}
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-[#7c6fff] transition-colors text-[18px]">
                  open_in_new
                </span>
              </div>

              <h3 className="font-display font-bold text-white text-lg group-hover:text-[#7c6fff] transition-colors">
                {ps.judgeName}
              </h3>

              {ps.handle && (
                <p className="text-slate-400 text-sm mt-1">@{ps.handle}</p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div
                  className="p-3 rounded-lg text-center"
                  style={{ background: 'rgba(59,43,238,0.08)' }}
                >
                  <p className="font-display font-bold text-xl text-white">{ps.totalSolved}</p>
                  <p className="text-slate-500 text-xs">Solved</p>
                </div>
                {ps.rank && (
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ background: 'rgba(245,158,11,0.08)' }}
                  >
                    <p className="font-display font-bold text-xl text-amber-400">{ps.rank}</p>
                    <p className="text-slate-500 text-xs">Rank</p>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
