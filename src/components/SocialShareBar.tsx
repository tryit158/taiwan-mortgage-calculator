import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Facebook, Sparkles } from 'lucide-react';

interface SocialShareBarProps {
  loanAmount: number; // 萬元
  loanTerm: number; // 年
  gracePeriod: number; // 年
  interestRate: number; // %
  repaymentMethod: 'equal_payment' | 'equal_principal';
  firstMonthPayment: number;
  afterGracePeriodPayment: number;
  totalInterest: number;
}

export function SocialShareBar({
  loanAmount,
  loanTerm,
  gracePeriod,
  interestRate,
  repaymentMethod,
  firstMonthPayment,
  afterGracePeriodPayment,
  totalInterest
}: SocialShareBarProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const pageUrl = window.location.href;
  const methodText = repaymentMethod === 'equal_payment' ? '本息平均攤還' : '本金平均攤還';

  const shareSummaryText = `🏠 【青年安心成家房貸 3.0 試算結果】
💵 貸款金額：${loanAmount} 萬元 (${loanTerm}年期)
📈 參考利率：${interestRate}% (${methodText})
${gracePeriod > 0 ? `⏳ 寬限期月繳：$${firstMonthPayment.toLocaleString()} 元/月 (${gracePeriod}年寬限)\n💥 寬限期後月繳：$${afterGracePeriodPayment.toLocaleString()} 元/月\n` : `💰 每月還款：$${firstMonthPayment.toLocaleString()} 元/月\n`}💸 總利息支出：約 ${(totalInterest / 10000).toFixed(1)} 萬元
------------------
👉 一鍵試算你的房貸條件：${pageUrl}`;

  const handleLineShare = () => {
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareSummaryText)}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFbShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareSummaryText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch (err) {
      console.error('Failed to copy url', err);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide mb-1">
            <Share2 className="w-4 h-4" /> 台灣社群分享與 LINE 一鍵卡片
          </div>
          <h3 className="text-base font-bold text-white">
            覺得結果有參考價值？一鍵分享給家人配偶評估
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            可直接傳送至 LINE 群組、FB 或複製專業試算文字卡
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* LINE Share Button */}
          <button
            onClick={handleLineShare}
            className="flex items-center gap-1.5 bg-[#00B900] hover:bg-[#009900] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="分享至 LINE 群組"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>LINE 分享</span>
          </button>

          {/* FB Share Button */}
          <button
            onClick={handleFbShare}
            className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="分享至 Facebook"
          >
            <Facebook className="w-4 h-4 fill-white" />
            <span>FB 分享</span>
          </button>

          {/* Copy Text Summary Card */}
          <button
            onClick={handleCopyText}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              copiedText
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
            } active:scale-95 cursor-pointer`}
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>已複製 LINE 卡片！</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>複製 LINE 摘要卡</span>
              </>
            )}
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyUrl}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              copiedUrl
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
            } active:scale-95 cursor-pointer`}
            title="複製網址"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedUrl ? '網址已複製' : '複製連結'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
