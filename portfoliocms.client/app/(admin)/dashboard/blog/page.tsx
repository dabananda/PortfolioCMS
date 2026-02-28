"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchWithAuth, fetchWithAuthMutation } from "@/lib/api";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Globe,
  Tag,
  X,
  Search,
  Filter,
} from "lucide-react";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  blogPostCategoryId: string;
  categoryName: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
};

type Category = {
  id: string;
  name: string;
  description?: string;
  postCount: number;
};

type Toast = { type: "success" | "error"; msg: string } | null;

function ToastMsg({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium
      ${toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-300" : "bg-rose-500/15 border-rose-500/25 text-rose-300"}`}
    >
      {toast.type === "success" ? (
        <Check size={15} />
      ) : (
        <AlertCircle size={15} />
      )}
      {toast.msg}
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-[#0d1117] transition-all";

const GRADIENTS = [
  "from-emerald-600 to-teal-700",
  "from-sky-600 to-blue-700",
  "from-violet-600 to-purple-700",
  "from-rose-600 to-pink-700",
  "from-amber-600 to-orange-700",
  "from-cyan-600 to-sky-700",
];

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000),
    hours = Math.floor(diff / 3600000),
    days = Math.floor(diff / 86400000);
  if (mins < 60) return mins + "m ago";
  if (hours < 24) return hours + "h ago";
  if (days < 7) return days + "d ago";
  return new Date(iso).toLocaleDateString();
};

// ── Category Modal ─────────────────────────────────────────────────────────────
function CategoryModal({
  open,
  category,
  onClose,
  onSaved,
}: {
  open: boolean;
  category?: Category;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const isEdit = !!category;

  useEffect(() => {
    if (open) {
      setForm(
        category
          ? { name: category.name, description: category.description ?? "" }
          : { name: "", description: "" },
      );
      setError("");
    }
  }, [open, category]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description || undefined,
      };
      const res = isEdit
        ? await fetchWithAuthMutation(
            `blogpostcategory/${category!.id}`,
            "PUT",
            payload,
          )
        : await fetchWithAuthMutation("blogpostcategory", "POST", payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-categories"] });
      onSaved(isEdit ? "Category updated!" : "Category created!");
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <h2 className="text-base font-semibold text-white/90">
            {isEdit ? "Edit Category" : "New Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
              Name *
            </label>
            <input
              className={inputCls}
              placeholder="Technology, Design…"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1.5 block">
              Description
            </label>
            <textarea
              rows={2}
              className={inputCls + " resize-none"}
              placeholder="Optional description…"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !form.name}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {mutation.isPending ? "Saving…" : isEdit ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");
  const [catModal, setCatModal] = useState<{
    open: boolean;
    category?: Category;
  }>({ open: false });

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const res = await fetchWithAuth("blogpost?PageSize=100");
      const json = await res.json();
      const data = json.data ?? json;
      return data.items ?? data;
    },
  });

  const { data: categories = [], isLoading: catLoading } = useQuery<Category[]>(
    {
      queryKey: ["blog-categories"],
      queryFn: async () => {
        const res = await fetchWithAuth("blogpostcategory");
        const json = await res.json();
        return json.data ?? json;
      },
    },
  );

  const togglePublish = useMutation({
    mutationFn: async (post: BlogPost) => {
      const ep = post.isPublished
        ? `blogpost/${post.id}/unpublish`
        : `blogpost/${post.id}/publish`;
      const res = await fetchWithAuthMutation(ep, "PATCH");
      if (!res.ok) throw new Error("Failed to update status");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blogs-count"] });
      setToast({ type: "success", msg: "Post status updated!" });
    },
    onError: () => setToast({ type: "error", msg: "Failed to update status." }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchWithAuthMutation(`blogpost/${id}`, "DELETE"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blogs-count"] });
      setToast({ type: "success", msg: "Post deleted." });
      setDeleteTarget(null);
    },
  });

  const deleteCat = useMutation({
    mutationFn: (id: string) =>
      fetchWithAuthMutation(`blogpostcategory/${id}`, "DELETE"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-categories"] });
      setToast({ type: "success", msg: "Category deleted." });
    },
    onError: () =>
      setToast({
        type: "error",
        msg: "Cannot delete a category that has posts.",
      }),
  });

  const filtered = posts.filter((p) => {
    const matchesStatus =
      filter === "all"
        ? true
        : filter === "published"
          ? p.isPublished
          : !p.isPublished;
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.summary ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.blogPostCategoryId === categoryFilter;
    return matchesStatus && matchesSearch && matchesCategory;
  });

  const publishedCount = posts.filter((p) => p.isPublished).length;
  const draftCount = posts.filter((p) => !p.isPublished).length;

  return (
    <div className="space-y-5">
      <ToastMsg toast={toast} onClose={() => setToast(null)} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Post?"
        itemName={deleteTarget?.title}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />

      <CategoryModal
        open={catModal.open}
        category={catModal.category}
        onClose={() => setCatModal({ open: false })}
        onSaved={(msg) => setToast({ type: "success", msg })}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <BookOpen size={20} className="text-violet-400" /> Blog
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            Manage your blog posts and categories
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/4 border border-white/8 rounded-lg p-0.5 w-fit">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "posts" ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-white/40 hover:text-white/70"}`}
        >
          <BookOpen size={14} /> Posts
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${activeTab === "posts" ? "bg-white/20" : "bg-white/8"}`}
          >
            {posts.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "categories" ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-white/40 hover:text-white/70"}`}
        >
          <Tag size={14} /> Categories
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${activeTab === "categories" ? "bg-white/20" : "bg-white/8"}`}
          >
            {categories.length}
          </span>
        </button>
      </div>

      {/* ── Posts Tab ── */}
      {activeTab === "posts" && (
        <>
          {/* Post controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-white/35">
                {posts.length} total ·{" "}
                <span className="text-emerald-400">
                  {publishedCount} published
                </span>{" "}
                ·{" "}
                <span className="text-amber-400">
                  {draftCount} draft{draftCount !== 1 ? "s" : ""}
                </span>
                {filtered.length !== posts.length && (
                  <span className="text-violet-400 ml-1">
                    · {filtered.length} shown
                  </span>
                )}
              </p>
              <button
                onClick={() => router.push("/dashboard/blog/new")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95"
              >
                <Plus size={15} /> New Post
              </button>
            </div>

            {/* Search + Filters row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search posts…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#0d1117] border border-white/8 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Category filter */}
              <div className="relative">
                <Filter
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ colorScheme: "dark", backgroundColor: "#0d1117" }}
                  className="pl-8 pr-8 py-2 rounded-lg border border-white/8 text-sm text-white/70 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer appearance-none"
                >
                  <option
                    value="all"
                    style={{ backgroundColor: "#161b22", color: "#e2e8f0" }}
                  >
                    All Categories
                  </option>
                  {categories.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      style={{ backgroundColor: "#161b22", color: "#e2e8f0" }}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-white/30"
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Status filter */}
              <div className="flex items-center bg-white/4 border border-white/8 rounded-lg p-0.5">
                {(["all", "published", "draft"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${filter === f ? "bg-violet-600 text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    {f === "all"
                      ? `All (${posts.length})`
                      : f === "published"
                        ? `Published (${publishedCount})`
                        : `Drafts (${draftCount})`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts table */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#161b22] border border-white/6 rounded-xl p-4 flex gap-4 animate-pulse"
                >
                  <div className="w-20 h-14 rounded-lg bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-white/8 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
              <BookOpen size={40} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/40 font-medium mb-1">
                No {filter !== "all" ? filter + " " : ""}posts yet
              </p>
              {filter === "all" && (
                <button
                  onClick={() => router.push("/dashboard/blog/new")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto mt-4"
                >
                  <Plus size={14} /> Write your first post
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#161b22] border border-white/6 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Post", "Category", "Status", "Date", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-semibold text-white/20 tracking-widest uppercase px-5 py-3"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post, i) => (
                    <tr
                      key={post.id}
                      className="border-b border-white/4 last:border-0 hover:bg-white/1.5 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0">
                            {post.imageUrl ? (
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full bg-linear-to-br ${GRADIENTS[i % GRADIENTS.length]} opacity-60`}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white/80 truncate max-w-xs">
                              {post.title}
                            </p>
                            {post.summary && (
                              <p className="text-xs text-white/30 truncate max-w-xs">
                                {post.summary}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/5 border border-white/8 w-fit">
                          <Tag size={9} /> {post.categoryName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            post.isPublished
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-white/30 whitespace-nowrap">
                        {timeAgo(post.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => togglePublish.mutate(post)}
                            title={post.isPublished ? "Unpublish" : "Publish"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              post.isPublished
                                ? "text-white/30 hover:text-amber-400 hover:bg-amber-500/8"
                                : "text-white/30 hover:text-emerald-400 hover:bg-emerald-500/8"
                            }`}
                          >
                            {post.isPublished ? (
                              <EyeOff size={13} />
                            ) : (
                              <Globe size={13} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/dashboard/blog/${post.id}/edit`)
                            }
                            title="Edit post"
                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(post)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Categories Tab ── */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/35">
              {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </p>
            <button
              onClick={() => setCatModal({ open: true })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95"
            >
              <Plus size={15} /> New Category
            </button>
          </div>

          {catLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-[#161b22] border border-white/6 rounded-xl p-16 text-center">
              <Tag size={40} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/40 font-medium mb-1">
                No categories yet
              </p>
              <p className="text-sm text-white/25 mb-4">
                Create categories to organize your blog posts
              </p>
              <button
                onClick={() => setCatModal({ open: true })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all mx-auto"
              >
                <Plus size={14} /> Create your first category
              </button>
            </div>
          ) : (
            <div className="bg-[#161b22] border border-white/6 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Category", "Description", "Posts", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-semibold text-white/20 tracking-widest uppercase px-5 py-3"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-white/4 last:border-0 hover:bg-white/1.5 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center shrink-0">
                            <Tag size={14} className="text-violet-400" />
                          </div>
                          <span className="text-sm font-medium text-white/80">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-white/30 truncate max-w-xs block">
                          {cat.description || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            cat.postCount > 0
                              ? "bg-violet-500/15 text-violet-300 border-violet-500/20"
                              : "bg-white/5 text-white/25 border-white/8"
                          }`}
                        >
                          {cat.postCount} post{cat.postCount !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setCatModal({ open: true, category: cat })
                            }
                            title="Edit category"
                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteCat.mutate(cat.id)}
                            title="Delete category"
                            className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
