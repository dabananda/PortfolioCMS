'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '../lib/api';
import type { BlogPost } from '../types/portfolio';

const PAGE_SIZE = 9;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="card-dark overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden shrink-0" style={{ background: '#0d0b1a' }}>
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1828]/80 to-transparent" />
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-bold text-white uppercase tracking-wider"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          {post.categoryName}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </span>
        </div>
        <h3 className="font-display font-bold text-white text-base leading-snug group-hover:text-[#7c6fff] transition-colors line-clamp-2 flex-1">
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
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center size-10 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30"
        style={{ background: '#1a1828', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="flex items-center justify-center size-10 rounded-lg font-bold text-sm transition-colors"
          style={
            p === page
              ? { background: '#3b2bee', color: 'white', boxShadow: '0 4px 16px rgba(59,43,238,0.3)' }
              : { background: '#1a1828', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }
          }
        >
          {p}
        </button>
      ))}

      {totalPages > 5 && page < totalPages - 2 && (
        <>
          <span className="text-slate-500">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex items-center justify-center size-10 rounded-lg font-bold text-sm text-slate-400 hover:text-white transition-colors"
            style={{ background: '#1a1828', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center justify-center size-10 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30"
        style={{ background: '#1a1828', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const data = await getBlogPosts({ page, pageSize: PAGE_SIZE, search: search || undefined });
    if (data) {
      setPosts(data.items);
      setTotalPages(data.totalPages);
      // Extract unique categories
      const cats = Array.from(new Set(data.items.map((p) => p.categoryName)));
      setCategories((prev) => Array.from(new Set([...prev, ...cats])));
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const filteredPosts =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.categoryName === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-16 overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-96 h-48 opacity-15 pointer-events-none"
          style={{ background: '#3b2bee', filter: 'blur(80px)' }}
        />
        <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
          <h1 className="font-display text-5xl md:text-6xl font-black text-white leading-tight">
            Blog Archive
          </h1>
          <p className="text-slate-400 text-lg mt-4 max-w-2xl">
            Deep dives into software engineering, distributed systems, and modern web development.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-10 pb-20">
        {/* Search + filter bar */}
        <div
          className="sticky top-16 z-40 -mx-4 px-4 md:-mx-0 md:px-0 py-4 mb-6"
          style={{ background: 'rgba(18,16,34,0.9)', backdropFilter: 'blur(12px)' }}
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-500 group-focus-within:text-[#7c6fff] transition-colors text-[20px]">
                  search
                </span>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles, topics, or keywords..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-[#3b2bee]/50"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>
            <button type="submit" className="btn-primary !py-3 shrink-0">
              Search
            </button>
          </form>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={
                    activeCategory === cat
                      ? { background: '#3b2bee', color: 'white', boxShadow: '0 4px 16px rgba(59,43,238,0.3)' }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#94a3b8',
                        }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-dark overflow-hidden animate-pulse">
                <div className="h-48" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="p-5 space-y-3">
                  <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.05)', width: '60%' }} />
                  <div className="h-5 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.05)', width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[48px] text-slate-700 block mb-4">
              search_off
            </span>
            <p className="text-slate-400 text-lg font-medium">No posts found</p>
            <p className="text-slate-600 text-sm mt-2">Try a different search term or category</p>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
