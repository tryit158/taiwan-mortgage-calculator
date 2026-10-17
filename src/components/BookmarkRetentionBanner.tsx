import React, { useState } from 'react';
import { Bookmark, Star, Smartphone, Monitor, Check, Copy, Heart, Sparkles } from 'lucide-react';

export function BookmarkRetentionBanner() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tryit.qzz.io';
    navigator.clipboard.writeText(origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-2xl p-5 my-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h4 className="text-sm font-bold text-amber-950">
                將「台灣房貸試算神器」加入書籤或主畫面
              </h4>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                已有 14,200+ 人收藏
              </span>
            </div>
            <p className="text-xs text-amber-800/80 mt-0.5">
              看房買房週期長，隨時從手機桌面點開精算建案月繳，絕不買貴、不怕被房仲牽著鼻子走！
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isOpen ? '收起指南' : '如何加入書籤？'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="text-xs font-medium bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
            <span>{copied ? '已複製網址' : '複製網址'}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-amber-200/70 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-900 animate-fade-in">
          <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/50 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Monitor className="w-4 h-4 text-amber-600" /> 電腦版（Chrome / Edge / Safari）
            </div>
            <p className="text-slate-600 leading-relaxed">
              按下鍵盤快捷鍵 <kbd className="bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded font-mono text-[11px] border border-amber-300">Ctrl + D</kbd> (Windows) 或 <kbd className="bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded font-mono text-[11px] border border-amber-300">Cmd + D</kbd> (Mac)，即可將房貸試算神器存入書籤列。
            </p>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/50 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Smartphone className="w-4 h-4 text-amber-600" /> 手機版（iPhone Safari / Android Chrome）
            </div>
            <p className="text-slate-600 leading-relaxed">
              點擊瀏覽器下方或右上角的<strong>「分享／選單」</strong>圖示 ➔ 選擇<strong>「加入主畫面」</strong>，立即生成 App 獨立桌面圖示，免安裝不佔容量！
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
