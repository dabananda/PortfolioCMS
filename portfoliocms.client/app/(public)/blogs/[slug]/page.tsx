import { getBlogPost, getBlogPosts } from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return {
    title: post?.title ?? 'Blog Post',
    description: post?.summary ?? '',
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, related] = await Promise.all([
    getBlogPost(slug),
    getBlogPosts({ page: 1, pageSize: 4 }),
  ]);

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <p className="text-slate-500 text-sm mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blogs" className="btn-primary">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = related?.items.filter((p) => p.id !== post.id).slice(0, 3) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-12 overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-96 h-48 opacity-15 pointer-events-none"
          style={{ background: '#3b2bee', filter: 'blur(80px)' }}
        />

        <div className="max-w-4xl mx-auto px-4 md:px-10 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-300 truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Category */}
          <div className="section-badge mb-4 w-fit">
            <span className="material-symbols-outlined text-[14px]">article</span>
            {post.categoryName}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">update</span>
                Updated {formatDate(post.updatedAt)}
              </span>
            )}
          </div>

          {/* Summary */}
          {post.summary && (
            <p
              className="text-lg text-slate-300 leading-relaxed pl-4 mb-8"
              style={{ borderLeft: '3px solid #3b2bee' }}
            >
              {post.summary}
            </p>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {post.imageUrl && (
        <div className="max-w-5xl mx-auto px-4 md:px-10 mb-12">
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-10 pb-20">
        <article
          className="prose-dark"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Divider */}
        <div
          className="my-12 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(59,43,238,0.3), transparent)' }}
        />

        {/* Back / share */}
        <div className="flex items-center justify-between">
          <Link href="/blogs" className="btn-outline">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            All Posts
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Share</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-white mb-8">More Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blogs/${related.slug}`}
                  className="card-dark overflow-hidden group hover:-translate-y-0.5 transition-transform"
                >
                  {related.imageUrl && (
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: 'rgba(59,43,238,0.1)', color: '#7c6fff' }}
                    >
                      {related.categoryName}
                    </span>
                    <h3 className="font-display font-bold text-white text-sm mt-2 line-clamp-2 group-hover:text-[#7c6fff] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2">
                      {formatDate(related.publishedAt ?? related.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
