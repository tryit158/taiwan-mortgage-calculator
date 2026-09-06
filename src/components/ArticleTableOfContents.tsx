import React, { useMemo } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface ArticleTableOfContentsProps {
  content: string;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function ArticleTableOfContents({ content }: ArticleTableOfContentsProps) {
  const headings = useMemo(() => {
    const lines = content.split('\n');
    const items: HeadingItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_~`]/g, '').trim();
        // create a safe anchor id
        const id = text
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '');
        if (text && id) {
          items.push({ id, text, level });
        }
      }
    });

    return items;
  }, [content]);

  if (headings.length < 2) return null;

  const handleScrollTo = (id: string) => {
    // Try to find the heading element on the page
    const headingsElements = Array.from(document.querySelectorAll('h2, h3'));
    const target = headingsElements.find((el) => {
      const elText = el.textContent?.replace(/[*_~`]/g, '').trim();
      const item = headings.find((h) => h.id === id);
      return elText && item && elText.includes(item.text);
    });

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="my-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-base">
        <List className="w-5 h-5 text-indigo-600" />
        <span>本文快速導覽目錄 (Table of Contents)</span>
      </div>
      <nav className="space-y-1.5">
        {headings.map((h, i) => (
          <button
            key={i}
            onClick={() => handleScrollTo(h.id)}
            className={`w-full text-left text-xs sm:text-sm text-slate-600 hover:text-indigo-600 hover:underline flex items-start gap-2 transition-colors py-1 ${
              h.level === 3 ? 'pl-4 text-slate-500' : 'font-medium text-slate-800'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span>{h.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
