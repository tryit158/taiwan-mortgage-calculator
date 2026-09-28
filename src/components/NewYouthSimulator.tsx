import React, { useState, useMemo } from 'react';
import { ShieldAlert, TrendingUp, AlertOctagon, CheckCircle2, ChevronRight, BarChart3, HelpCircle, Info } from 'lucide-react';
import { FeedbackRatingWidget } from './FeedbackRatingWidget';

export function NewYouthSimulator() {
  const [loanAmount, setLoanAmount] = useState<number>(1000); // 萬元 (新青安上限1000萬)
  const [newYouthGrace, setNewYouthGrace] = useState<number>(5); // 0~5 年
  const [tradGrace, setTradGrace] = useState<number>(0); // 0~3 年
  const [investReturnRate, setInvestReturnRate] = useState<number>(5.0); // % 投資機會成本估算

  const results = useMemo(() => {
    const P = loanAmount * 10000;
    const rNY = 1.775 / 100 / 12; // 新青安補貼後利率 1.775%
    const rTrad = 2.185 / 100 / 12; // 傳統首購地板價約 2.185%

    // 1. 新青安: 40年 (480期), 寬限期 gNY
    const nNY = 40 * 12;
    const gNY = newYouthGrace * 12;
    const nNYPrime = nNY - gNY;

    // 寬限期月付金 (純息)
    const nyGraceMonthly = P * rNY;
    // 寬限期後月付金 (本息攤還)
    const nyAfterGraceMonthly = (P * rNY * Math.pow(1 + rNY, nNYPrime)) / (Math.pow(1 + rNY, nNYPrime) - 1);
    const nyTotalInterest = (nyGraceMonthly * gNY) + (nyAfterGraceMonthly * nNYPrime) - P;

    // 2. 傳統房貸: 30年 (360期), 寬限期 gTrad
    const nTrad = 30 * 12;
    const gTrad = tradGrace * 12;
    const nTradPrime = nTrad - gTrad;

    const tradGraceMonthly = P * rTrad;
    const tradAfterGraceMonthly = (P * rTrad * Math.pow(1 + rTrad, nTradPrime)) / (Math.pow(1 + rTrad, nTradPrime) - 1);
    const tradTotalInterest = (tradGraceMonthly * gTrad) + (tradAfterGraceMonthly * nTradPrime) - P;

    // 月付金斷崖暴增百分比 (新青安)
    const cliffJumpPercent = nyGraceMonthly > 0 ? (((nyAfterGraceMonthly - nyGraceMonthly) / nyGraceMonthly) * 100).toFixed(0) : '0';

    // 總利息差距 (新青安40年 vs 傳統30年)
    const totalInterestDiff = nyTotalInterest - tradTotalInterest;

    return {
      nyGraceMonthly: Math.round(nyGraceMonthly),
      nyAfterGraceMonthly: Math.round(nyAfterGraceMonthly),
      nyTotalInterest: Math.round(nyTotalInterest),
      tradGraceMonthly: Math.round(tradGraceMonthly),
      tradAfterGraceMonthly: Math.round(tradAfterGraceMonthly),
      tradTotalInterest: Math.round(tradTotalInterest),
      cliffJumpPercent,
      totalInterestDiff: Math.round(totalInterestDiff),
    };
  }, [loanAmount, newYouthGrace, tradGrace]);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          全台首購政策深度沙盤推演
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          新青安 40年期 vs 傳統 30年期 寬限期斷崖與全週期利弊推演
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          首購族最想知道的真相：新青安前 5 年寬限期雖然每個月輕鬆，但第 6 年起月付金翻倍的「斷崖效應」有多劇烈？40年多繳的總利息到底是多少？
        </p>
      </div>

      {/* Control sliders */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              試算貸款本金 (最高 1,000 萬元)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="300"
                max="1000"
                step="50"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-sm font-bold text-indigo-700 whitespace-nowrap">{loanAmount} 萬元</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              新青安寬限期設定: {newYouthGrace} 年
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={newYouthGrace}
                onChange={(e) => setNewYouthGrace(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-sm font-bold text-indigo-700 whitespace-nowrap">{newYouthGrace} 年</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              傳統房貸寬限期設定: {tradGrace} 年
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={tradGrace}
                onChange={(e) => setTradGrace(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-sm font-bold text-indigo-700 whitespace-nowrap">{tradGrace} 年</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side by side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Youth Card */}
        <div className="bg-white rounded-3xl border-2 border-indigo-500 p-6 sm:p-8 shadow-sm relative space-y-6">
          <div className="flex justify-between items-center">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              青年安心成家 (新青安)
            </span>
            <span className="text-xs font-semibold text-slate-500">40年期 · 補貼利率 1.775%</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">
              {newYouthGrace > 0 ? `前 ${newYouthGrace} 年寬限期 (純繳利息)` : '每月本息攤還'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">
              ${results.nyGraceMonthly.toLocaleString()} <span className="text-sm font-normal text-slate-500">元/月</span>
            </div>
          </div>

          {newYouthGrace > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-xs text-rose-700 font-bold">
                <span className="flex items-center gap-1">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  第 {newYouthGrace + 1} 年起月付金「斷崖式暴增」
                </span>
                <span className="bg-rose-200 text-rose-800 px-2 py-0.5 rounded text-[11px]">
                  跳升 +{results.cliffJumpPercent}%
                </span>
              </div>
              <div className="text-2xl font-black text-rose-700">
                ${results.nyAfterGraceMonthly.toLocaleString()} <span className="text-xs font-normal text-rose-600">元/月</span>
              </div>
              <p className="text-[11px] text-rose-600 leading-tight pt-1">
                每個月直接多出 ${(results.nyAfterGraceMonthly - results.nyGraceMonthly).toLocaleString()} 元的本金開銷！
              </p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>全期總利息支出:</span>
              <strong className="text-slate-900">${results.nyTotalInterest.toLocaleString()} 元</strong>
            </div>
            <div className="flex justify-between">
              <span>本息合計總還款:</span>
              <strong className="text-slate-900">${((loanAmount * 10000) + results.nyTotalInterest).toLocaleString()} 元</strong>
            </div>
          </div>
        </div>

        {/* Traditional Mortgage Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative space-y-6">
          <div className="flex justify-between items-center">
            <span className="bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              一般銀行首購房貸
            </span>
            <span className="text-xs font-semibold text-slate-500">30年期 · 一般利率 2.185%</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">
              {tradGrace > 0 ? `前 ${tradGrace} 年寬限期` : '每月固定本息攤還'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-800">
              ${(tradGrace > 0 ? results.tradGraceMonthly : results.tradAfterGraceMonthly).toLocaleString()} <span className="text-sm font-normal text-slate-500">元/月</span>
            </div>
          </div>

          {tradGrace > 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-xs text-slate-600 font-bold">第 {tradGrace + 1} 年起月付金</span>
              <div className="text-2xl font-black text-slate-800">
                ${results.tradAfterGraceMonthly.toLocaleString()} <span className="text-xs font-normal text-slate-500">元/月</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1">
              <strong className="block text-emerald-900 font-bold">平穩支出無斷崖</strong>
              <span>30 年每月維持相同金額，家庭收支可精準掌控，不需面臨 5 年後財務休克風險。</span>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>全期總利息支出:</span>
              <strong className="text-slate-900">${results.tradTotalInterest.toLocaleString()} 元</strong>
            </div>
            <div className="flex justify-between">
              <span>本息合計總還款:</span>
              <strong className="text-slate-900">${((loanAmount * 10000) + results.tradTotalInterest).toLocaleString()} 元</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Summary Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-400" />
          全週期沙盤推演真相總結
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
            <strong className="text-white block font-bold text-base">1. 總利息差額警示</strong>
            <p>
              新青安雖然利率較低（1.775%），但因為<strong>年限拉長到 40 年加上 5 年寬限期</strong>，前五年完全沒還本金，最終累計繳給銀行的總利息高達 <strong>${(results.nyTotalInterest / 10000).toFixed(1)} 萬元</strong>！
            </p>
            <p className="text-amber-300">
              相較於一般 30 年傳統房貸，新青安在 40 年全週期下多付了約 <strong>{((results.nyTotalInterest - results.tradTotalInterest) / 10000).toFixed(1)} 萬元</strong> 的利息！
            </p>
          </div>

          <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
            <strong className="text-white block font-bold text-base">2. 什麼樣的人最適合新青安？</strong>
            <ul className="list-disc pl-5 space-y-1 text-slate-200">
              <li>剛成家的年輕首購族，手頭現金需留作裝潢、育兒與結婚開銷。</li>
              <li>預期未來 5 年內工作升遷或家庭雙薪有明確成長空間。</li>
              <li>打算在持有滿 5~6 年後透過自住滿額優惠換屋重購退稅。</li>
            </ul>
          </div>
        </div>
      </div>

      <FeedbackRatingWidget
        pageId="new-youth-simulator"
        pageTitle="新青安 40年期 vs 傳統 30年期 沙盤推演器"
      />
    </div>
  );
}
