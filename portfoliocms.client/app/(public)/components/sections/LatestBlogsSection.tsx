import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '../../types/portfolio';

interface LatestBlogsSectionProps {
  posts: BlogPost[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function LatestBlogsSection({ posts }: LatestBlogsSectionProps) {
  if (!posts.length) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute left-0 top-0 w-64 h-64 opacity-10 pointer-events-none"
        style={{ background: '#3b2bee', filter: 'blur(100px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="section-badge mb-4">
              <span className="material-symbols-outlined text-[14px]">article</span>
              Writing
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Latest Insights
            </h2>
            <p className="text-slate-400 mt-3">
              Thoughts on engineering, design, and architecture.
            </p>
          </div>
          <Link
            href="/blogs"
            className="hidden sm:flex items-center gap-2 text-[#7c6fff] hover:text-white transition-colors font-medium text-sm"
          >
            View All
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="card-dark overflow-hidden group block hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden" style={{ background: '#0d0b1a' }}>
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px]" style={{ color: 'rgba(59,43,238,0.3)' }}>
                      article
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1828]/90 to-transparent" />
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-bold text-white uppercase tracking-wider"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                >
                  {post.categoryName}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-base leading-snug group-hover:text-[#7c6fff] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.summary && (
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                )}
                <div className="flex items-center text-[#7c6fff] font-bold text-sm mt-4">
                  Read Article
                  <span className="material-symbols-outlined ml-1 text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:hidden">
          <Link href="/blogs" className="btn-outline">
            View All Posts
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
