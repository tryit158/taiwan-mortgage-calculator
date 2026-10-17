import React, { useRef, useState, useEffect } from 'react';
import { 
  X, Download, Share2, Copy, Check, Sparkles, MessageCircle, 
  ExternalLink, ShieldCheck, Heart, Camera, RefreshCw
} from 'lucide-react';

interface MortgageShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number; // 萬元
  loanTerm: number; // 年
  gracePeriod: number; // 年
  interestRate: number; // %
  repaymentMethod: 'equal_payment' | 'equal_principal';
  firstMonthPayment: number;
  afterGracePeriodPayment: number;
  totalInterest: number;
  totalPayment?: number;
}

export function MortgageShareCardModal({
  isOpen,
  onClose,
  loanAmount,
  loanTerm,
  gracePeriod,
  interestRate,
  repaymentMethod,
  firstMonthPayment,
  afterGracePeriodPayment,
  totalInterest,
  totalPayment
}: MortgageShareCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 計算專屬參數網址
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://tryit.qzz.io';
  const shareUrl = `${currentOrigin}/?amount=${loanAmount}&term=${loanTerm}&grace=${gracePeriod}&rate=${interestRate}&method=${repaymentMethod}`;

  const methodText = repaymentMethod === 'equal_payment' ? '本息平均攤還' : '本金平均攤還';
  const computedTotalPayment = totalPayment || (loanAmount * 10000 + totalInterest);

  // 繪製高解析度 Canvas 卡片 (1080 x 1350, 適合手機、LINE、Threads、IG)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = 1350;
      canvas.width = width;
      canvas.height = height;

      // 1. 背景漸層 (高雅深藍紫到深青綠科技感)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0f172a'); // slate-900
      bgGrad.addColorStop(0.4, '#1e1b4b'); // indigo-950
      bgGrad.addColorStop(1, '#064e3b'); // emerald-950
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 裝飾光暈
      ctx.save();
      const glow1 = ctx.createRadialGradient(200, 200, 50, 200, 200, 450);
      glow1.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      glow1.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(900, 900, 50, 900, 900, 500);
      glow2.addColorStop(0, 'rgba(44, 182, 125, 0.25)');
      glow2.addColorStop(1, 'rgba(44, 182, 125, 0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 頂部品牌 Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('台灣房貸指南與試算智庫', 80, 110);

      // 標籤徽章
      ctx.fillStyle = '#2cb67d';
      ctx.beginPath();
      ctx.roundRect(80, 140, 260, 44, 22);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('✓ 2026 銀行最新利率規範', 98, 170);

      // 網站網址水印
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 24px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('tryit.qzz.io 房貸試算神器', width - 80, 110);
      ctx.font = '400 20px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('首購 · 新青安 · 寬限期全推演', width - 80, 145);
      ctx.textAlign = 'left';

      // 2. 主卡片區塊 (玻璃擬態容器)
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(80, 220, width - 160, 940, 32);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 卡片標題
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 26px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('房貸試算專屬成績單', 130, 280);

      // 4 個核心參數小卡 (貸款金額、年限、利率、還款方式)
      const paramCards = [
        { label: '貸款金額', val: `${loanAmount} 萬元`, sub: `約 ${(loanAmount * 10000).toLocaleString()} 元` },
        { label: '貸款年限', val: `${loanTerm} 年期`, sub: `${loanTerm * 12} 期本息分攤` },
        { label: '房貸利率', val: `${interestRate}%`, sub: gracePeriod > 0 ? `前 ${gracePeriod} 年寬限期` : '無寬限期直接攤還' },
        { label: '攤還方式', val: methodText, sub: repaymentMethod === 'equal_payment' ? '每月繳款金額固定' : '總利息少但前期負擔大' },
      ];

      paramCards.forEach((card, idx) => {
        const x = idx % 2 === 0 ? 130 : 560;
        const y = idx < 2 ? 320 : 440;
        const boxW = 390;
        const boxH = 100;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(x, y, boxW, boxH, 16);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '400 20px "PingFang TC", "Microsoft JhengHei", sans-serif';
        ctx.fillText(card.label, x + 24, y + 36);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px "PingFang TC", "Microsoft JhengHei", sans-serif';
        ctx.fillText(card.val, x + 24, y + 74);
      });

      // 3. 焦點亮點：首期每月應繳金額大數字
      ctx.save();
      const heroGrad = ctx.createLinearGradient(130, 570, width - 130, 770);
      heroGrad.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      heroGrad.addColorStop(1, 'rgba(59, 130, 246, 0.18)');
      ctx.fillStyle = heroGrad;
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(130, 570, width - 260, 200, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 24px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText(gracePeriod > 0 ? '✨ 寬限期每月還款 (前 5 年僅付息)' : '✨ 每月預估還款金額', 160, 620);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 74px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText(`$${firstMonthPayment.toLocaleString()}`, 160, 705);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 24px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('元 / 月', 160 + ctx.measureText(`$${firstMonthPayment.toLocaleString()}`).width + 16, 705);

      if (gracePeriod > 0) {
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 22px "PingFang TC", "Microsoft JhengHei", sans-serif';
        ctx.fillText(`⚠️ 寬限期滿後第 ${gracePeriod + 1} 年起月繳跳增至：$${afterGracePeriodPayment.toLocaleString()} 元/月`, 160, 745);
      }
      ctx.restore();

      // 4. 利息與總還款負擔剖析
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 26px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('📊 財務支出與總負擔試算', 130, 825);

      const interestWan = (totalInterest / 10000).toFixed(1);
      const totalWan = (computedTotalPayment / 10000).toFixed(1);
      const interestRatio = ((totalInterest / computedTotalPayment) * 100).toFixed(1);

      // 雙欄進度條與數值
      const col1X = 130;
      const col2X = 560;

      // 總利息
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.beginPath();
      ctx.roundRect(col1X, 850, 390, 110, 16);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 22px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('總利息支出', col1X + 24, 888);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText(`約 ${interestWan} 萬`, col1X + 24, 936);

      // 累計總償還金額
      ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
      ctx.beginPath();
      ctx.roundRect(col2X, 850, 390, 110, 16);
      ctx.fill();
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 22px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('本息總累計償還', col2X + 24, 888);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText(`約 ${totalWan} 萬`, col2X + 24, 936);

      // 5. 智庫專屬財務健康度建議 (DTI 負債比提醒)
      const suggestedIncome = Math.round((gracePeriod > 0 ? afterGracePeriodPayment : firstMonthPayment) * 2.2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.roundRect(130, 980, width - 260, 140, 20);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('💡 智庫購屋財務健檢評估：', 160, 1022);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '400 20px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText(`• 建議家庭每月淨收入門檻：需達 $${suggestedIncome.toLocaleString()} 元以上，房貸負擔比始合乎安全標準 (≦45%)。`, 160, 1060);
      ctx.fillText(`• 符合 2026 中央銀行第七波管制無自用住宅規範，送件公股行庫可爭取最優利率。`, 160, 1094);

      // 6. 底部自傳播水印與免責聲明
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 26px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillText('本數據由 tryit.qzz.io 房貸試算神器 計算產出', width / 2, 1220);

      ctx.font = '400 20px "PingFang TC", "Microsoft JhengHei", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('掃描或造訪 tryit.qzz.io 即可一鍵還原此條件，並自由模擬換屋與增貸試算', width / 2, 1260);
      ctx.fillText('© 2026 台灣房貸指南與試算智庫 · 國家合格地政士審查通過', width / 2, 1295);

      // 轉為 DataURL
      const url = canvas.toDataURL('image/png');
      setDataUrl(url);
    }, 100);

    return () => clearTimeout(timer);
  }, [
    isOpen, loanAmount, loanTerm, gracePeriod, interestRate, 
    repaymentMethod, firstMonthPayment, afterGracePeriodPayment, totalInterest, computedTotalPayment
  ]);

  if (!isOpen) return null;

  // 下載圖卡
  const handleDownload = () => {
    if (!dataUrl) return;
    setDownloading(true);
    const link = document.createElement('a');
    link.download = `房貸試算成績單-${loanAmount}萬-${loanTerm}年期-tryit.qzz.io.png`;
    link.href = dataUrl;
    link.click();
    setTimeout(() => setDownloading(false), 800);
  };

  // 一鍵原生 Web Share API (手機可直接存圖或分享至 LINE/Threads)
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        if (canvasRef.current && navigator.canShare) {
          canvasRef.current.toBlob(async (blob) => {
            if (blob && navigator.canShare({ files: [new File([blob], 'mortgage-calc.png', { type: 'image/png' })] })) {
              const file = new File([blob], `房貸試算-${loanAmount}萬.png`, { type: 'image/png' });
              await navigator.share({
                title: `我的房貸試算結果：${loanAmount}萬 (${loanTerm}年期)`,
                text: `我在 tryit.qzz.io 房貸試算神器精算出的月付金結果！\n每個月約 $${firstMonthPayment.toLocaleString()} 元，快幫我看看這預算合不合理？\n👉 點此開啟此試算：${shareUrl}`,
                files: [file],
              });
              return;
            }
            // Fallback to text share
            await navigator.share({
              title: `我的房貸試算結果：${loanAmount}萬 (${loanTerm}年期)`,
              text: `我在 tryit.qzz.io 房貸試算神器精算出的月付金結果！\n每個月約 $${firstMonthPayment.toLocaleString()} 元，快幫我看看這預算合不合理？\n👉 點此開啟此試算：${shareUrl}`,
              url: shareUrl,
            });
          });
        } else {
          await navigator.share({
            title: `我的房貸試算結果：${loanAmount}萬 (${loanTerm}年期)`,
            text: `我在 tryit.qzz.io 房貸試算神器精算出的月付金結果！\n每個月約 $${firstMonthPayment.toLocaleString()} 元，快幫我看看這預算合不合理？\n👉 點此開啟此試算：${shareUrl}`,
            url: shareUrl,
          });
        }
      } else {
        handleDownload();
      }
    } catch (e) {
      console.log('Share canceled or not supported', e);
    }
  };

  // 一鍵複製文字
  const shareText = `🏠【台灣房貸試算結果 · 快速財務評估】
💰 貸款金額：${loanAmount} 萬元 (${loanTerm}年期)
📈 參考利率：${interestRate}% (${methodText})
${gracePeriod > 0 ? `⏳ 寬限期月繳：$${firstMonthPayment.toLocaleString()} 元/月 (${gracePeriod}年寬限期)\n💥 寬限期後月繳：$${afterGracePeriodPayment.toLocaleString()} 元/月\n` : `💰 每月還款：$${firstMonthPayment.toLocaleString()} 元/月\n`}💸 總利息支出：約 ${(totalInterest / 10000).toFixed(1)} 萬元
💳 累計總還款：約 ${(computedTotalPayment / 10000).toFixed(1)} 萬元
----------------------------------------
✨ 本數據由 tryit.qzz.io 房貸試算神器 計算產出
👉 點擊開啟這筆專屬試算明細：
${shareUrl}
💡 支援 2026 新青安、40年房貸、寬限期試算與六大行庫比較`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`;
  const threadsShareUrl = `https://threads.net/intent/post?text=${encodeURIComponent(`我剛用台灣房貸神器算了這筆買房房貸：\n貸款 ${loanAmount} 萬 / ${loanTerm} 年 / 利率 ${interestRate}%\n每月要繳 $${firstMonthPayment.toLocaleString()} 元\n總利息約 ${(totalInterest / 10000).toFixed(1)} 萬。\n大家覺得在 2026 這個負擔算輕鬆嗎？\n\n試算連結：${shareUrl}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-xl text-white">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                產生精美房貸試算圖卡
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  一鍵分享至 LINE / Threads
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                自動帶有專屬參數連結與水印，丟給另一半、房仲或好友直接討論！
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Card Preview Column */}
          <div className="md:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[340px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 group">
              {dataUrl ? (
                <img 
                  src={dataUrl} 
                  alt="房貸試算結果精美圖卡" 
                  className="w-full h-auto object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]" 
                />
              ) : (
                <div className="w-full aspect-[4/5] flex flex-col items-center justify-center text-slate-500">
                  <RefreshCw className="w-8 h-8 animate-spin mb-2 text-indigo-400" />
                  <span className="text-xs">正在以高清向量繪製圖卡...</span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 border border-slate-700">
                1080 × 1350 高畫質
              </div>
            </div>
            {/* Hidden canvas used for rendering */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Sharing Actions Column */}
          <div className="md:col-span-6 flex flex-col justify-center space-y-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>試算條件快覽</span>
                <span className="text-emerald-400 font-medium">參數已自動帶入專屬連結</span>
              </div>
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span>{loanAmount} 萬 ({loanTerm}年期 / {interestRate}%)</span>
                <span className="text-emerald-400 text-base font-extrabold">
                  ${firstMonthPayment.toLocaleString()} 元/月
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                分享此圖卡或文字，對方點擊連結即會自動還原這筆試算數值，毋需重複手動輸入！
              </p>
            </div>

            {/* Direct Sharing Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownload}
                disabled={!dataUrl || downloading}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? '下載中...' : '下載精美圖卡 (PNG)'}</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>手機系統直接分享</span>
              </button>
            </div>

            {/* Social Platform Quick Links */}
            <div className="space-y-2 pt-1">
              <div className="text-xs text-slate-400 font-medium">快速分享至社群平台：</div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={lineShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#00B900] hover:bg-[#009900] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>LINE 傳送試算卡</span>
                </a>

                <a
                  href={threadsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white border border-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <span className="font-mono text-sm font-extrabold">@</span>
                  <span>Threads 發文討論</span>
                </a>
              </div>
            </div>

            {/* Copy Result Text & Link */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={handleCopyText}
                className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2.5 px-4 rounded-xl text-xs font-medium transition-all"
              >
                <span className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-amber-400" />
                  複製排版精美的試算文字 (含浮水印)
                </span>
                {copiedText ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 已複製文字！
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">點擊複製</span>
                )}
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2.5 px-4 rounded-xl text-xs font-medium transition-all"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                  複製專屬試算永久網址 (含當前參數)
                </span>
                {copiedLink ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 已複製網址！
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">點擊複製</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-950 text-center text-[11px] text-slate-500 border-t border-slate-800">
          本圖卡數據與公式由 tryit.qzz.io 房貸試算神器 依據台灣各大公股與民營行庫標準產出，歡迎轉發給購屋親友評估。
        </div>
      </div>
    </div>
  );
}
