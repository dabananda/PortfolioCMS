import type { Review } from "../../types/portfolio";

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
            color: star <= rating ? "#f59e0b" : "#374151",
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
  "from-violet-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
];

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews.length) return null;

  // Duplicate the reviews array to create a seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section id="reviews" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">
            <span className="material-symbols-outlined text-[14px]">star</span>
            Testimonials
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            What People Say
          </h2>
        </div>
      </div>

      {/* This outer container hides the overflow and allows the inner container
        to be wider than the screen.
      */}
      <div className="w-full overflow-hidden relative">
        {/* Optional: Add gradient fades to the left and right edges for a smoother look */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0f0e17] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0f0e17] to-transparent z-10 pointer-events-none" />

        {/* The scrolling container */}
        <div className="animate-scroll-left flex gap-6 px-4">
          {duplicatedReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="card-dark p-6 w-[350px] shrink-0 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-black/30 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${
                    AVATAR_COLORS[index % AVATAR_COLORS.length]
                  }`}
                >
                  {review.name?.charAt(0).toUpperCase()}
                </div>

                {/* Name + designation */}
                <div className="flex flex-col">
                  <h4 className="font-semibold text-white leading-none">
                    {review.name}
                  </h4>
                  {review.designation && (
                    <span className="text-xs text-[#7c6fff]">
                      {review.designation}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <StarRating rating={Math.round(review.rating)} />
              </div>

              {/* Comment */}
              <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">
                “{review.comment}”
              </p>

              {/* Footer */}
              <div className="text-xs text-slate-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
