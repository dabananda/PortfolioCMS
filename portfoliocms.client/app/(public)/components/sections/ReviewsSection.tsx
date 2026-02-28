import type { Review } from '../../types/portfolio';

interface ReviewsSectionProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined text-[16px]"
          style={{
            color: star <= rating ? '#f59e0b' : '#374151',
            fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

const AVATAR_COLORS = [
  'from-violet-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
];

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews.length) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute right-0 top-1/4 w-64 h-64 opacity-10 pointer-events-none"
        style={{ background: '#3b2bee', filter: 'blur(100px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">
            <span className="material-symbols-outlined text-[14px]">format_quote</span>
            Testimonials
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            What People Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div key={review.id} className="card-dark p-6 flex flex-col group hover:-translate-y-1 transition-transform">
              {/* Stars */}
              <div className="mb-4">
                <StarRating rating={review.rating} />
              </div>

              {/* Quote */}
              <blockquote className="text-slate-300 text-sm leading-relaxed flex-1 relative">
                <span
                  className="absolute -top-2 -left-1 text-5xl leading-none opacity-20"
                  style={{ color: '#3b2bee', fontFamily: 'Georgia, serif' }}
                >
                  &quot;
                </span>
                <p className="relative z-10 pl-3">{review.comment}</p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
                <div
                  className={`size-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                >
                  {review.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  {review.designation && (
                    <p className="text-slate-500 text-xs">{review.designation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
