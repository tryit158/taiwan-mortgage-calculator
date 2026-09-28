import React, { useState, useMemo } from 'react';
import { RefreshCw, TrendingDown, DollarSign, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { FeedbackRatingWidget } from './FeedbackRatingWidget';

export function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState<number>(1000); // 萬元
  const [remainingYears, setRemainingYears] = useState<number>(25); // 年
  const [currentRate, setCurrentRate] = useState<number>(2.45); // %
  const [newRate, setNewRate] = useState<number>(2.185); // %
  const [penaltyFee, setPenaltyFee] = useState<number>(0); // 違約金 (NTD)
  const [scrivenerFee, setScrivenerFee] = useState<number>(7000); // 代書費 (NTD)
  const [appraisalFee, setAppraisalFee] = useState<number>(3000); // 鑑價開辦費 (NTD)

  const calculations = useMemo(() => {
    const P = currentBalance * 10000;
    const n = remainingYears * 12;

    // 原房貸月付金
    const rOld = currentRate / 100 / 12;
    const oldMonthlyPayment = (P * rOld * Math.pow(1 + rOld, n)) / (Math.pow(1 + rOld, n) - 1);
    const oldTotalPayment = oldMonthlyPayment * n;
    const oldTotalInterest = oldTotalPayment - P;

    // 新房貸月付金
    const rNew = newRate / 100 / 12;
    const newMonthlyPayment = (P * rNew * Math.pow(1 + rNew, n)) / (Math.pow(1 + rNew, n) - 1);
    const newTotalPayment = newMonthlyPayment * n;
    const newTotalInterest = newTotalPayment - P;

    // 每月省下金額
    const monthlySavings = oldMonthlyPayment - newMonthlyPayment;

    // 轉貸法定與規費成本:
    // 地政設定規費: 貸款金額 1.2倍 × 0.1% (即千分之一)
    const registryFee = Math.round(P * 1.2 * 0.001);
    const totalSwitchCost = Math.round(registryFee + scrivenerFee + appraisalFee + penaltyFee);

    // 打平回本期 (月數)
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(totalSwitchCost / monthlySavings) : Infinity;

    // 總生命週期省下淨利息 (扣除成本後)
    const grossInterestSaved = oldTotalInterest - newTotalInterest;
    const netSavings = grossInterestSaved - totalSwitchCost;

    const isWorthIt = monthlySavings > 0 && breakEvenMonths <= 24 && netSavings > 50000;

    return {
      oldMonthlyPayment: Math.round(oldMonthlyPayment),
      newMonthlyPayment: Math.round(newMonthlyPayment),
      monthlySavings: Math.round(monthlySavings),
      registryFee,
      totalSwitchCost,
      breakEvenMonths,
      grossInterestSaved: Math.round(grossInterestSaved),
      netSavings: Math.round(netSavings),
      isWorthIt,
    };
  }, [currentBalance, remainingYears, currentRate, newRate, penaltyFee, scrivenerFee, appraisalFee]);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          省息降負擔神器
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          房貸轉貸損益與回本期精算器
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          全面納入「地政抵押權設定規費」、「代書費」、「銀行開辦費」與「原行違約金」，一鍵精算轉貸是否真正划算，幫您守住辛苦錢。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
            轉貸比較條件
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              目前剩餘房貸本金 (萬元)
            </label>
            <div className="relative">
              <input
                type="number"
                step="50"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="w-full text-sm font-semibold pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">萬元</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                剩餘貸款年限
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={remainingYears}
                  onChange={(e) => setRemainingYears(Number(e.target.value))}
                  className="w-full text-xs font-semibold pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600"
                />
                <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">年</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-700 mb-1">
                原房貸利率 (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={currentRate}
                onChange={(e) => setCurrentRate(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50/30 text-rose-900 focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-700 mb-1">
              新銀行核貸優惠利率 (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(Number(e.target.value))}
              className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/40 text-emerald-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">目前台灣民營行庫優質客戶地板價約 2.185% ~ 2.25%。</p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-600 block">轉貸衍生手續費與規費</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  代書費 (塗銷+設定)
                </label>
                <input
                  type="number"
                  step="500"
                  value={scrivenerFee}
                  onChange={(e) => setScrivenerFee(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  新銀行開辦/鑑價費
                </label>
                <input
                  type="number"
                  step="500"
                  value={appraisalFee}
                  onChange={(e) => setAppraisalFee(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                原銀行提前清償違約金 (綁約期內通常 0.5%~1%)
              </label>
              <input
                type="number"
                step="5000"
                value={penaltyFee}
                onChange={(e) => setPenaltyFee(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                placeholder="若已過綁約期請填 0"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-500/30 text-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  轉貸效益診斷
                </span>
                <span className="text-xs text-emerald-200">
                  利率調降: <strong className="text-amber-300 font-bold">{(currentRate - newRate).toFixed(2)}%</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xs">
                  <p className="text-xs text-emerald-200 mb-1">每月直接少繳 (現金流釋放)</p>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                    ${calculations.monthlySavings.toLocaleString()} <span className="text-xs font-normal text-white">元/月</span>
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xs">
                  <p className="text-xs text-emerald-200 mb-1">轉貸規費回本期</p>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                    {calculations.breakEvenMonths === Infinity ? '無法回本' : `第 ${calculations.breakEvenMonths} 個月`}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-teal-800/80">
                <div className="flex justify-between items-center text-xs text-emerald-100">
                  <span>總轉貸成本 (規費+代書+手續費):</span>
                  <strong>${calculations.totalSwitchCost.toLocaleString()} 元</strong>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-white mt-1">
                  <span>扣除成本後，總淨省下利息支出:</span>
                  <span className="text-amber-300 text-lg">${calculations.netSavings.toLocaleString()} 元</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Verdict Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              專家決策建議：我該不該現在辦理轉貸？
            </h3>

            {calculations.isWorthIt ? (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  強烈建議進行轉貸！效益顯著。
                </div>
                <p>
                  您的轉貸回本期僅需 <strong>{calculations.breakEvenMonths} 個月</strong>（不到兩年），且剩餘貸款期間內可淨省下 <strong>${calculations.netSavings.toLocaleString()} 元</strong> 的巨額利息！
                </p>
                <p className="text-slate-500">
                  建議立即向新銀行索取貸款申請書，並要求新行業務爭取補貼代書費或減免開辦費。
                </p>
              </div>
            ) : (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  審慎考慮：轉貸回本期偏長或利息降幅有限。
                </div>
                <p>
                  因為兩家銀行利差僅有 {(currentRate - newRate).toFixed(2)}%，或是原銀行仍有違約金，需要 <strong>{calculations.breakEvenMonths} 個月</strong> 才能打平轉貸手續規費。
                </p>
                <p className="text-slate-500">
                  建議解方：可先向「原貸款銀行」提出降息申請（告知有其他行庫開出更低利率，要求內度調降），省去重新設定抵押權的兩三萬規費！
                </p>
              </div>
            )}
          </div>

          {/* Breakdown of Costs */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              轉貸規費與手續費明細拆解
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span>政府地政抵押權設定規費 (貸款金額 1.2倍 × 0.1%)</span>
                <strong>${calculations.registryFee.toLocaleString()} 元</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span>合格地政士 (代書) 塗銷與設定公費</span>
                <strong>${scrivenerFee.toLocaleString()} 元</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span>新銀行房屋鑑價、徵信開辦作業手續費</span>
                <strong>${appraisalFee.toLocaleString()} 元</strong>
              </div>
              {penaltyFee > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-rose-600">
                  <span>原貸款銀行提前清償違約金</span>
                  <strong>${penaltyFee.toLocaleString()} 元</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FeedbackRatingWidget
        pageId="refinance-calculator"
        pageTitle="房貸轉貸損益與回本期精算器"
      />
    </div>
  );
}
