"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth, fetchWithAuthMutation, uploadFile } from "@/lib/api";
import Image from "next/image";
import {
  ArrowLeft,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  Globe,
  FileText,
  Minus,
  Save,
  X,
  Plus,
  Tag,
} from "lucide-react";

type Category = { id: string; name: string };
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  blogPostCategoryId: string;
  categoryName: string;
  createdAt: string;
};

// Simple markdown → HTML renderer (no dependencies)
function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headings
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-bold text-white/90 mt-6 mb-2">$1</h3>',
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-bold text-white/90 mt-8 mb-3">$1</h2>',
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-2xl font-bold text-white/90 mt-8 mb-4">$1</h1>',
    )
    // Blockquote
    .replace(
      /^&gt; (.+)$/gm,
      '<blockquote class="border-l-4 border-violet-500 pl-4 text-white/50 italic my-4 py-1">$1</blockquote>',
    )
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-white/10 my-6" />')
    // Bold, italic, code inline
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-white/95">$1</strong>',
    )
    .replace(/\*(.+?)\*/g, '<em class="italic text-white/75">$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-white/8 text-violet-300 font-mono text-[13px]">$1</code>',
    )
    // Links
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors" target="_blank" rel="noreferrer">$1</a>',
    )
    // Unordered list
    .replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc text-white/70">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-white/70">$1</li>')
    // Ordered list
    .replace(
      /^\d+\. (.+)$/gm,
      '<li class="ml-4 list-decimal text-white/70">$1</li>',
    )
    // Code blocks
    .replace(
      /```[\w]*\n([\s\S]*?)```/g,
      '<pre class="bg-white/5 border border-white/8 rounded-lg p-4 my-4 overflow-x-auto"><code class="font-mono text-sm text-emerald-300">$1</code></pre>',
    )
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="text-white/65 leading-relaxed my-3">')
    .replace(/\n/g, "<br/>");

  return `<p class="text-white/65 leading-relaxed my-3">${html}</p>`;
}

// Slug generator
const toSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 100);

const generateSlug = (title: string) => {
  const base = toSlug(title);
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : `post-${suffix}`;
};

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-white/8 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all";

export default function BlogEditorPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string | undefined;
  const isEdit = !!postId;
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [preview, setPreview] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [inlineImgUploading, setInlineImgUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverImgRef = useRef<HTMLInputElement>(null);
  const inlineImgRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const res = await fetchWithAuth("blogpostcategory");
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetchWithAuthMutation("blogpostcategory", "POST", {
        name,
      });
      if (!res.ok) throw new Error("Failed to create category");
      const json = await res.json();
      return (json.data ?? json) as Category;
    },
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["blog-categories"] });
      setCategoryId(created.id);
      setNewCategoryName("");
      setShowNewCategory(false);
    },
  });

  const { data: post } = useQuery<BlogPost>({
    queryKey: ["blog-post", postId],
    queryFn: async () => {
      const res = await fetchWithAuth(`blogpost/${postId}`);
      const json = await res.json();
      return json.data ?? json;
    },
    enabled: isEdit,
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setSlugEdited(true);
      setSummary(post.summary ?? "");
      setContent(post.content);
      setImageUrl(post.imageUrl ?? "");
      setCategoryId(post.blogPostCategoryId);
    }
  }, [post]);

  // Auto-generate slug from title (only if user hasn't manually edited it)
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(toSlug(title));
    }
  }, [title, slugEdited]);

  // Set default category
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  // Toolbar insertion helper
  const insertText = useCallback(
    (before: string, after: string = "", placeholder: string = "text") => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = ta.value.slice(start, end) || placeholder;
      const newVal =
        ta.value.slice(0, start) +
        before +
        selected +
        after +
        ta.value.slice(end);
      setContent(newVal);
      setTimeout(() => {
        ta.focus();
        ta.selectionStart = start + before.length;
        ta.selectionEnd = start + before.length + selected.length;
      }, 0);
    },
    [],
  );

  const insertLine = useCallback((prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
    const newVal =
      ta.value.slice(0, lineStart) + prefix + ta.value.slice(lineStart);
    setContent(newVal);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + prefix.length;
    }, 0);
  }, []);

  const TOOLBAR = [
    {
      icon: Bold,
      title: "Bold",
      action: () => insertText("**", "**", "bold text"),
    },
    {
      icon: Italic,
      title: "Italic",
      action: () => insertText("*", "*", "italic text"),
    },
    { icon: Minus, title: "Separator", action: null },
    { icon: Heading1, title: "Heading 1", action: () => insertLine("# ") },
    { icon: Heading2, title: "Heading 2", action: () => insertLine("## ") },
    { icon: Heading3, title: "Heading 3", action: () => insertLine("### ") },
    { icon: Minus, title: "Separator", action: null },
    { icon: List, title: "Bullet List", action: () => insertLine("- ") },
    {
      icon: ListOrdered,
      title: "Ordered List",
      action: () => insertLine("1. "),
    },
    { icon: Quote, title: "Blockquote", action: () => insertLine("> ") },
    { icon: Minus, title: "Separator", action: null },
    {
      icon: Code,
      title: "Inline Code",
      action: () => insertText("`", "`", "code"),
    },
    {
      icon: Link,
      title: "Link",
      action: () => insertText("[", "](https://)", "link text"),
    },
    {
      icon: ImageIcon,
      title: "Insert Image",
      action: () => inlineImgRef.current?.click(),
    },
  ];

  // Upload cover image
  const handleCoverUpload = async (file: File) => {
    setImgUploading(true);
    try {
      const { url } = await uploadFile("upload/image", file);
      setImageUrl(url);
    } catch {
      setError("Cover image upload failed.");
    } finally {
      setImgUploading(false);
    }
  };

  // Upload inline image and insert markdown
  const handleInlineImageUpload = async (file: File) => {
    setInlineImgUploading(true);
    try {
      const { url } = await uploadFile("upload/image", file);
      insertText(`![${file.name}](${url})`, "", "");
    } catch {
      setError("Image upload failed.");
    } finally {
      setInlineImgUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (publish: boolean | null = null) => {
      const finalSlug = slugEdited ? slug : generateSlug(title);
      const payload = {
        title,
        summary: summary || undefined,
        content,
        imageUrl: imageUrl || undefined,
        blogPostCategoryId: categoryId,
        slug: finalSlug,
      };
      let res;
      if (isEdit) {
        res = await fetchWithAuthMutation(`blogpost/${postId}`, "PUT", payload);
        if (!res.ok)
          throw new Error(
            (await res.json().catch(() => ({}))).message || "Failed to save",
          );
        if (publish !== null) {
          const pubRes = await fetchWithAuthMutation(
            `blogpost/${postId}/${publish ? "publish" : "unpublish"}`,
            "PATCH",
          );
          if (!pubRes.ok) throw new Error("Failed to update publish status");
        }
      } else {
        res = await fetchWithAuthMutation("blogpost", "POST", payload);
        if (!res.ok)
          throw new Error(
            (await res.json().catch(() => ({}))).message || "Failed to create",
          );
        if (publish) {
          const json = await res.json();
          const newId = json.data?.id ?? json.id;
          if (newId) {
            await fetchWithAuthMutation(`blogpost/${newId}/publish`, "PATCH");
          }
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blogs-count"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (e: Error) => setError(e.message),
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertText("  ", "", "");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveMutation.mutate(null);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      insertText("**", "**", "bold text");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      insertText("*", "*", "italic text");
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div
      className="flex flex-col h-full"
      style={{ minHeight: "calc(100vh - 112px)" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
        <button
          onClick={() => router.push("/dashboard/blog")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Blog
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/25">
            {wordCount} words · ~{readTime} min read
          </span>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
              <Check size={10} /> Saved
            </span>
          )}
          <button
            onClick={() => saveMutation.mutate(null)}
            disabled={
              saveMutation.isPending || !title || !content || !categoryId
            }
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8 border border-white/8 text-white/60 hover:text-white/90 text-sm font-medium transition-all disabled:opacity-40"
          >
            {saveMutation.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save Draft
          </button>
          <button
            onClick={() => saveMutation.mutate(true)}
            disabled={
              saveMutation.isPending || !title || !content || !categoryId
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Globe size={13} />
            )}
            {isEdit && post?.isPublished ? "Save & Publish" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm mb-4 shrink-0">
          <AlertCircle size={14} />
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left sidebar — metadata */}
        <div className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto">
          {/* Cover image */}
          <div className="bg-[#161b22] border border-white/6 rounded-xl overflow-hidden">
            <div
              className="relative h-36 cursor-pointer group"
              onClick={() => coverImgRef.current?.click()}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="cover"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-white/2 hover:bg-white/4 transition-colors">
                  <ImageIcon
                    size={24}
                    className="text-white/20 group-hover:text-violet-400 transition-colors"
                  />
                  <span className="text-xs text-white/30">
                    Click to add cover
                  </span>
                </div>
              )}
              {imgUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 size={22} className="text-violet-400 animate-spin" />
                </div>
              )}
              {imageUrl && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                  <Upload size={16} className="text-white" />
                  <span className="text-xs text-white font-medium">Change</span>
                </div>
              )}
            </div>
            <input
              ref={coverImgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleCoverUpload(e.target.files[0])
              }
            />
            {imageUrl && (
              <div className="px-3 py-2 border-t border-white/5">
                <button
                  onClick={() => setImageUrl("")}
                  className="text-xs text-white/30 hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <X size={10} /> Remove cover
                </button>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-[#161b22] border border-white/6 rounded-xl p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-semibold text-white/35 uppercase tracking-widest block">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCategory((v) => !v)}
                  className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Plus size={10} /> New
                </button>
              </div>

              {showNewCategory ? (
                <div className="space-y-2">
                  <div className="flex gap-1.5">
                    <input
                      autoFocus
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0d1117] border border-violet-500/40 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-violet-500/70 transition-all"
                      placeholder="Category name…"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newCategoryName.trim())
                          createCategoryMutation.mutate(newCategoryName.trim());
                        if (e.key === "Escape") {
                          setShowNewCategory(false);
                          setNewCategoryName("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        newCategoryName.trim() &&
                        createCategoryMutation.mutate(newCategoryName.trim())
                      }
                      disabled={
                        !newCategoryName.trim() ||
                        createCategoryMutation.isPending
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      {createCategoryMutation.isPending ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Check size={11} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCategoryName("");
                      }}
                      className="px-2 py-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/6 transition-all"
                    >
                      <X size={11} />
                    </button>
                  </div>
                  <p className="text-[10px] text-white/25">
                    Press Enter to create · Esc to cancel
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <Tag
                    size={11}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{ colorScheme: "dark", backgroundColor: "#0d1117" }}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-white/8 text-sm text-white/80 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Select category</option>
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
                </div>
              )}
            </div>
            <div>
              <label className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-1.5 block">
                URL Slug
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-[#0d1117] border border-white/8 text-xs text-white/60 font-mono placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                placeholder="auto-generated-from-title"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
              />
              <p className="text-[10px] text-white/20 mt-1">
                Auto-generated from title. Edit to customize.
              </p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-1.5 block">
                Summary
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[#0d1117] border border-white/8 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                placeholder="Brief description shown in listings…"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            {isEdit && post && (
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                  post.isPublished
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}
              >
                {post.isPublished ? (
                  <Globe size={11} />
                ) : (
                  <FileText size={11} />
                )}
                {post.isPublished ? "Currently Published" : "Draft"}
              </div>
            )}
          </div>

          {/* Keyboard shortcuts */}
          <div className="bg-[#161b22] border border-white/6 rounded-xl p-4">
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2">
              Shortcuts
            </p>
            {[
              ["Ctrl+S", "Save draft"],
              ["Ctrl+B", "Bold"],
              ["Ctrl+I", "Italic"],
              ["Tab", "Indent"],
            ].map(([key, desc]) => (
              <div
                key={key}
                className="flex items-center justify-between py-0.5"
              >
                <span className="text-[11px] text-white/30">{desc}</span>
                <kbd className="text-[10px] text-white/25 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded font-mono">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Main editor area */}
        <div className="flex-1 flex flex-col bg-[#161b22] border border-white/6 rounded-xl overflow-hidden min-h-0">
          {/* Title */}
          <div className="px-6 pt-5 pb-3 border-b border-white/5 shrink-0">
            <input
              className="w-full bg-transparent text-2xl font-bold text-white/90 placeholder-white/20 outline-none border-none"
              placeholder="Post title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {slug && (
              <p className="text-xs text-white/25 mt-1.5 font-mono">
                /blog/{slug || "auto-slug"}
              </p>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-4 py-2 border-b border-white/5 shrink-0 flex-wrap">
            {TOOLBAR.map((btn, i) => {
              if (btn.icon === Minus && btn.action === null) {
                return <div key={i} className="w-px h-5 bg-white/10 mx-1.5" />;
              }
              const Icon = btn.icon;
              return (
                <button
                  key={i}
                  type="button"
                  title={btn.title}
                  onClick={btn.action ?? undefined}
                  className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/6 transition-all"
                >
                  <Icon size={14} />
                </button>
              );
            })}
            {inlineImgUploading && (
              <Loader2
                size={14}
                className="text-violet-400 animate-spin ml-1"
              />
            )}
            <div className="flex-1" />
            <button
              onClick={() => setPreview((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preview
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                  : "text-white/35 hover:text-white/70 hover:bg-white/6"
              }`}
            >
              {preview ? <EyeOff size={13} /> : <Eye size={13} />}
              {preview ? "Editor" : "Preview"}
            </button>
          </div>

          <input
            ref={inlineImgRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleInlineImageUpload(e.target.files[0])
            }
          />

          {/* Editor / Preview */}
          <div className="flex-1 overflow-hidden">
            {preview ? (
              <div
                className="h-full overflow-y-auto px-6 py-5 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(
                    content || "*Nothing to preview yet. Start writing!*",
                  ),
                }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                className="w-full h-full bg-transparent text-sm text-white/80 placeholder-white/20 outline-none resize-none px-6 py-5 font-mono leading-relaxed"
                placeholder={`Start writing your post in Markdown…

# Heading 1
## Heading 2

**bold** *italic* \`inline code\`

- bullet list
1. ordered list

> blockquote

\`\`\`javascript
// code block
const hello = 'world';
\`\`\`

[link text](https://example.com)
![image alt](image-url)`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
