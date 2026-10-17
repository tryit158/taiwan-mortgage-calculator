import React, { useState } from 'react';
import { 
  Share2, Copy, Check, MessageCircle, Facebook, Sparkles, 
  Image as ImageIcon, BookmarkPlus, History, Link as LinkIcon, Download
} from 'lucide-react';
import { MortgageShareCardModal } from './MortgageShareCardModal';
import { CalculationHistoryDrawer, SavedCalculation } from './CalculationHistoryDrawer';

interface SocialShareBarProps {
  loanAmount: number; // 萬元
  loanTerm: number; // 年
  gracePeriod: number; // 年
  interestRate: number; // %
  repaymentMethod: 'equal_payment' | 'equal_principal';
  firstMonthPayment: number;
  afterGracePeriodPayment: number;
  totalInterest: number;
  onApplyCalculation?: (calc: SavedCalculation) => void;
}

export function SocialShareBar({
  loanAmount,
  loanTerm,
  gracePeriod,
  interestRate,
  repaymentMethod,
  firstMonthPayment,
  afterGracePeriodPayment,
  totalInterest,
  onApplyCalculation
}: SocialShareBarProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // 專屬帶參數網址
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://tryit.qzz.io';
  const paramUrl = `${currentOrigin}/?amount=${loanAmount}&term=${loanTerm}&grace=${gracePeriod}&rate=${interestRate}&method=${repaymentMethod}`;

  const methodText = repaymentMethod === 'equal_payment' ? '本息平均攤還' : '本金平均攤還';

  // 自傳播格式化文字（自帶水印與專屬參數網址）
  const shareSummaryText = `🏠【台灣房貸試算結果 · 快速財務評估】
💰 貸款金額：${loanAmount} 萬元 (${loanTerm}年期)
📈 參考利率：${interestRate}% (${methodText})
${gracePeriod > 0 ? `⏳ 寬限期月繳：$${firstMonthPayment.toLocaleString()} 元/月 (${gracePeriod}年寬限期)\n💥 寬限期後月繳：$${afterGracePeriodPayment.toLocaleString()} 元/月\n` : `💰 每月還款：$${firstMonthPayment.toLocaleString()} 元/月\n`}💸 總利息支出：約 ${(totalInterest / 10000).toFixed(1)} 萬元
----------------------------------------
✨ 本數據由 tryit.qzz.io 房貸試算神器 計算產出
👉 點擊開啟這筆專屬試算明細：
${paramUrl}
💡 支援 2026 新青安、40年房貸、寬限期試算與六大行庫比較`;

  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareSummaryText)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(paramUrl)}`;

  const handleCopyText = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(shareSummaryText);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyUrl = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(paramUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy url', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl my-6 border border-indigo-900/50">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <Share2 className="w-4 h-4" /> 自傳播裂變 · 專屬連結與精美圖卡
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            覺得試算有幫助？一鍵分享或存為專屬連結
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            產生帶浮水印的 LINE/Threads 精美圖卡，或儲存當前貸款條件（{loanAmount}萬/{loanTerm}年/{interestRate}%），分享給另一半、家人或房仲討論！
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* 產生精美圖卡按鈕 (Primary Viral Hook) */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>產生精美圖卡 (LINE / Threads)</span>
          </button>

          {/* 歷史紀錄與儲存按鈕 (Retention Hook) */}
          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600/80 hover:bg-indigo-600 active:scale-95 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm border border-indigo-400/30 cursor-pointer"
          >
            <History className="w-4 h-4 text-indigo-200" />
            <span>儲存 / 歷史紀錄</span>
          </button>

          {/* LINE Share Button */}
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#00B900] hover:bg-[#009900] active:scale-95 text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="分享至 LINE 群組"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>LINE 分享</span>
          </a>

          {/* Copy Formatted Text Card */}
          <button
            onClick={handleCopyText}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              copiedText
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-200'
            } active:scale-95 cursor-pointer`}
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>已複製試算卡片！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>一鍵複製結果</span>
              </>
            )}
          </button>

          {/* Copy URL */}
          <button
            onClick={handleCopyUrl}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              copiedUrl
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-200'
            } active:scale-95 cursor-pointer`}
            title="複製專屬試算網址"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-300" /> : <LinkIcon className="w-4 h-4 text-indigo-300" />}
            <span>{copiedUrl ? '專屬網址已複製' : '專屬連結'}</span>
          </button>
        </div>
      </div>

      {/* Share Card Modal */}
      <MortgageShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        loanAmount={loanAmount}
        loanTerm={loanTerm}
        gracePeriod={gracePeriod}
        interestRate={interestRate}
        repaymentMethod={repaymentMethod}
        firstMonthPayment={firstMonthPayment}
        afterGracePeriodPayment={afterGracePeriodPayment}
        totalInterest={totalInterest}
      />

      {/* Calculation History & Compare Drawer */}
      <CalculationHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        currentCalculation={{
          loanAmount,
          loanTerm,
          gracePeriod,
          interestRate,
          repaymentMethod,
          firstMonthPayment,
          afterGracePeriodPayment,
          totalInterest
        }}
        onApplyCalculation={(calc) => {
          if (onApplyCalculation) {
            onApplyCalculation(calc);
          }
        }}
      />
    </div>
  );
}
