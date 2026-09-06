import React, { useState } from 'react';
import { Activity, ShieldCheck, AlertCircle, TrendingDown, HelpCircle } from 'lucide-react';

export function DtiHealthGauge() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(90000); // NTD
  const [monthlyMortgage, setMonthlyMortgage] = useState<number>(35000); // NTD
  const [otherDebts, setOtherDebts] = useState<number>(0); // NTD (credit card, car loan, etc.)

  const totalMonthlyDebt = monthlyMortgage + otherDebts;
  const dtiRatio = monthlyIncome > 0 ? (totalMonthlyDebt / monthlyIncome) * 100 : 0;

  // DTI Status
  let statusColor = 'text-emerald-600';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let statusText = '極度安全 (黃金比例)';
  let barColor = 'bg-emerald-500';
  let advice = '您的房貸支出控制在總收入 30% 以內，能從容應付央行升息與未來家庭突發支出，銀行核貸意願極高！';

  if (dtiRatio > 50) {
    statusColor = 'text-rose-600';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
    statusText = '危險過載 (斷頭高風險)';
    barColor = 'bg-rose-500';
    advice = '房貸已吃掉一半以上薪水！一旦面臨升息或寬限期結束，將陷入繳不出貸款的斷頭風險，銀行極可能要求提供實力更強的保證人。';
  } else if (dtiRatio > 40) {
    statusColor = 'text-amber-600';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    statusText = '緊繃警戒 (需嚴格自律)';
    barColor = 'bg-amber-500';
    advice = '房貸佔比超過 40%，生活開銷會受到明顯壓縮。強烈建議選擇「本息平均攤還」以平穩支出，並準備至少 6 個月緊急預備金。';
  } else if (dtiRatio >= 30) {
    statusColor = 'text-blue-600';
    badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
    statusText = '標準常規 (銀行普遍接受)';
    barColor = 'bg-blue-500';
    advice = '符合台灣各大銀行一般授信評估的常規健康區間（30% ~ 40%），日常消費與投資能維持合理平衡。';
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">家庭房貸負擔率 (DTI) 財務安全壓力測試</h3>
          </div>
          <p className="text-slate-500 text-sm">
            銀行授信的核心指標：評估您的每月收入是否能承受房貸支出，避免買房後生活品質斷崖式滑落。
          </p>
        </div>
        <div className="shrink-0">
          <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border ${badgeBg}`}>
            {statusText}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Input sliders */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <label htmlFor="income-input" className="text-slate-700 font-semibold">家庭每月稅後淨收入</label>
              <span className="text-indigo-600 font-bold">{monthlyIncome.toLocaleString()} 元</span>
            </div>
            <input
              id="income-input"
              type="range"
              min="30000"
              max="300000"
              step="5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>3 萬 (小資單身)</span>
              <span>15 萬 (雙薪家庭)</span>
              <span>30 萬+ (高收入)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <label htmlFor="mortgage-input" className="text-slate-700 font-semibold">預估每月房貸本息支出</label>
              <span className="text-indigo-600 font-bold">{monthlyMortgage.toLocaleString()} 元</span>
            </div>
            <input
              id="mortgage-input"
              type="range"
              min="10000"
              max="150000"
              step="2000"
              value={monthlyMortgage}
              onChange={(e) => setMonthlyMortgage(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 萬</span>
              <span>7 萬</span>
              <span>15 萬</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <label htmlFor="debts-input" className="text-slate-700 font-semibold">其他每月固定負債 (車貸、信貸或學貸)</label>
              <span className="text-slate-600 font-bold">{otherDebts.toLocaleString()} 元</span>
            </div>
            <input
              id="debts-input"
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={otherDebts}
              onChange={(e) => setOtherDebts(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Results and Meter */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-center space-y-4">
          <div className="text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">房貸所得比 (DTI Ratio)</span>
            <div className={`text-4xl font-extrabold mt-1 tracking-tight ${statusColor}`}>
              {dtiRatio.toFixed(1)}%
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              月負債支出 {totalMonthlyDebt.toLocaleString()} 元 / 月收入 {monthlyIncome.toLocaleString()} 元
            </span>
          </div>

          {/* Progress Bar Visual */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-300 ${barColor}`}
                style={{ width: `${Math.min(dtiRatio, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0% (無負擔)</span>
              <span className="text-emerald-600">30% 安全線</span>
              <span className="text-amber-600">40% 警戒線</span>
              <span className="text-rose-600">50% 紅線</span>
            </div>
          </div>

          {/* Expert Advice Box */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800 block mb-1">💡 專家精準建議：</strong>
            {advice}
          </div>
        </div>
      </div>
    </div>
  );
}
