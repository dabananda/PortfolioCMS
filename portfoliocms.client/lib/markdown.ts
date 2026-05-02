export function renderMarkdown(md: string): string {
   const html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    // Blockquote (& was already escaped to &gt; above)
    .replace(
      /^&gt; (.+)$/gm,
      '<blockquote class="border-l-4 border-violet-500 pl-4 italic my-4 py-1 opacity-75">$1</blockquote>',
    )
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-6 opacity-10" />')
    // Bold + italic combined
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-white/10 text-violet-300 font-mono text-[13px]">$1</code>',
    )
    // Images — must come BEFORE links, otherwise ![alt](url) is consumed by the link regex
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />',
    )
    // Links
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors" target="_blank" rel="noreferrer">$1</a>',
    )
    // Unordered list items
    .replace(/^\* (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal">$1</li>')
    // Fenced code blocks
    .replace(
      /```[\w]*\n([\s\S]*?)```/g,
      '<pre class="bg-white/5 border border-white/10 rounded-lg p-4 my-4 overflow-x-auto"><code class="font-mono text-sm text-emerald-300">$1</code></pre>',
    )
    // Paragraph breaks
    .replace(/\n\n/g, '</p><p class="leading-relaxed my-3">')
    .replace(/\n/g, "<br/>");

  return `<p class="leading-relaxed my-3">${html}</p>`;
}
