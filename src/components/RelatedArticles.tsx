import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { articles, Article } from '../data/articles';

interface RelatedArticlesProps {
  currentArticleId: string;
}

export function RelatedArticles({ currentArticleId }: RelatedArticlesProps) {
  // Find related articles (excluding the current one)
  const otherArticles = articles.filter(a => a.id !== currentArticleId);
  // Pick 3 related articles
  const current = articles.find(a => a.id === currentArticleId);
  
  const related = otherArticles.slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        <h3 className="text-xl font-bold text-slate-900">推薦延伸閱讀 (Related Guides)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(item => (
          <Link
            key={item.id}
            to={`/blog/${item.id}`}
            className="group block bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-400 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
                <Calendar className="w-3 h-3" />
                {item.date}
              </span>
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {item.excerpt}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              深入閱讀 <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
