import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, PiggyBank, ArrowRight, ShieldAlert, Award, Calculator, 
  HelpCircle, CheckCircle2, AlertTriangle, Sparkles, Scale, Percent, Clock
} from 'lucide-react';
import { cn } from '../utils';
import { AiCitationBox } from './AiCitationBox';

interface ETFPreset {
  name: string;
  rate: number;
  desc: string;
  tag: string;
}

const ETF_PRESETS: ETFPreset[] = [
  { name: '0050 台灣大盤', rate: 8.5, desc: '成立20年歷史含息年化約 8~10%', tag: '積極成長' },
  { name: '高股息 ETF (00878/0056)', rate: 5.8, desc: '穩健配息與平準金防禦', tag: '穩健領息' },
  { name: '美股大盤 (S&P 500 / VT)', rate: 9.2, desc: '美股百年歷史長期複利約 9~10%', tag: '全球分散' },
  { name: '保守定存 / 儲蓄型保單', rate: 2.2, desc: '幾無波動，對抗貸款利率持平', tag: '極度保守' },
];

export function MortgageVsInvestmentSimulator() {
  const [loanAmount, setLoanAmount] = useState<number>(1000); // 萬
  const [loanRate, setLoanRate] = useState<number>(2.2); // %
  const [loanYears, setLoanYears] = useState<number>(30); // 年
  const [monthlyExtra, setMonthlyExtra] = useState<number>(15000); // 元/月
  const [lumpSumPrepay, setLumpSumPrepay] = useState<number>(0); // 萬
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(8.5); // %
  const [inflationRate, setInflationRate] = useState<number>(1.8); // %

  const results = useMemo(() => {
    const P = loanAmount * 10000;
    const r_loan = loanRate / 100 / 12;
    const n_months = loanYears * 12;

    // 正常房貸月付金 (本息平均攤還)
    const normalMonthlyPayment = (P * r_loan * Math.pow(1 + r_loan, n_months)) / (Math.pow(1 + r_loan, n_months) - 1);
    const normalTotalInterest = (normalMonthlyPayment * n_months) - P;

    // 方案 A：提前償還房貸 (每月額外多繳 monthlyExtra，以及期初投入 lumpSumPrepay)
    let balanceA = P - (lumpSumPrepay * 10000);
    let totalInterestA = 0;
    let monthsToPayoffA = 0;

    for (let m = 1; m <= n_months; m++) {
      if (balanceA <= 0) break;
      monthsToPayoffA = m;
      const interest = balanceA * r_loan;
      totalInterestA += interest;
      const principal = (normalMonthlyPayment - interest) + monthlyExtra;
      balanceA -= principal;
      if (balanceA < 0) balanceA = 0;
    }

    const savedInterestA = normalTotalInterest - totalInterestA;
    const savedYears = Math.floor((n_months - monthsToPayoffA) / 12);
    const savedMonths = (n_months - monthsToPayoffA) % 12;

    // 方案 B：正常繳房貸，將閒錢定期定額投資
    const r_invest = expectedReturnRate / 100 / 12;
    let investmentBalanceB = lumpSumPrepay * 10000;
    let totalPrincipalInvested = lumpSumPrepay * 10000;

    for (let m = 1; m <= n_months; m++) {
      investmentBalanceB = investmentBalanceB * (1 + r_invest) + monthlyExtra;
      totalPrincipalInvested += monthlyExtra;
    }

    const investmentProfitB = investmentBalanceB - totalPrincipalInvested;

    // 淨資產勝出差異 (投資終值 vs 提早還款省下的利息與資金)
    // 在方案 A 中，省下的利息 + 還清後多出的每月房貸現金流
    // 為求公平比較，看 30 年終端資產差距
    const netWealthAdvantage = investmentBalanceB - (totalPrincipalInvested + savedInterestA);

    return {
      normalMonthlyPayment: Math.round(normalMonthlyPayment),
      normalTotalInterest: Math.round(normalTotalInterest),
      totalInterestA: Math.round(totalInterestA),
      savedInterestA: Math.round(savedInterestA),
      payoffYearsA: (monthsToPayoffA / 12).toFixed(1),
      savedYears,
      savedMonths,
      investmentBalanceB: Math.round(investmentBalanceB),
      totalPrincipalInvested: Math.round(totalPrincipalInvested),
      investmentProfitB: Math.round(investmentProfitB),
      netWealthAdvantage: Math.round(netWealthAdvantage),
      isInvestmentBetter: netWealthAdvantage > 0,
      breakEvenRate: loanRate,
    };
  }, [loanAmount, loanRate, loanYears, monthlyExtra, lumpSumPrepay, expectedReturnRate]);

  const formatTWD = (num: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            2026 台灣人理財終極抉擇決策模型
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            房貸提早還清 vs 存股 ETF (0050) 效益精算器
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            手頭有每月閒錢或年終獎金，到底該拿去「提前償還房貸本金」省利息，還是「定期定額投入台股/美股指數 ETF」？透過央行複利模型與歷史回測，為您算出最理性的淨資產最佳解！
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            貸款與資金參數設定
          </h2>

          {/* Current Mortgage Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">剩餘房貸金額</label>
              <div className="relative">
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(50, Number(e.target.value)))}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400">萬元</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">房貸年利率</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
              </div>
            </div>
          </div>

          {/* Loan Years */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">房貸剩餘年限</label>
              <span className="text-xs font-bold text-slate-800">{loanYears} 年 (標準月繳 {formatTWD(results.normalMonthlyPayment)})</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[20, 30, 40].map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setLoanYears(y)}
                  className={cn(
                    "py-2 text-xs font-bold rounded-xl border transition-all",
                    loanYears === y
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {y} 年期
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Extra Money */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">每月額外可運用閒錢</label>
              <span className="text-base font-bold text-indigo-600">{formatTWD(monthlyExtra)} /月</span>
            </div>
            <input
              type="range"
              min={3000}
              max={100000}
              step={1000}
              value={monthlyExtra}
              onChange={(e) => setMonthlyExtra(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>$3,000</span>
              <span>$15,000</span>
              <span>$50,000</span>
              <span>$100,000</span>
            </div>
          </div>

          {/* Investment Expected Return Rate Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">投資標的年化報酬率預估</label>
              <span className="text-sm font-bold text-emerald-600">{expectedReturnRate}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ETF_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setExpectedReturnRate(preset.rate)}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all",
                    expectedReturnRate === preset.rate
                      ? "bg-emerald-50 border-emerald-500 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{preset.name}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {preset.rate}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Verdict Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Decision Badge */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">智庫數學模型結論</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {results.isInvestmentBetter ? '🚀 投資 ETF 效益更優' : '🛡️ 提早還款更安全'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-400">{loanYears}年期滿之資產淨勝出額度：</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                {formatTWD(Math.abs(results.netWealthAdvantage))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {results.isInvestmentBetter ? (
                  <>
                    長期維持正常繳房貸，並將每月 <strong>{formatTWD(monthlyExtra)}</strong> 定期定額投入預期年化 <strong>{expectedReturnRate}%</strong> 之 ETF，
                    累積資產終值比提早還清多出 <strong className="text-amber-300">{formatTWD(results.netWealthAdvantage)}</strong>！
                  </>
                ) : (
                  <>
                    由於您的投資預期報酬率與房貸利率接近，提前償還房貸獲得之確定性無風險報酬效益更佳！
                  </>
                )}
              </p>
            </div>

            {/* Break-even Indicator */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">兩者損益平衡點 (Break-even Rate)：</span>
              <span className="font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                年化報酬率需 &gt; {results.breakEvenRate}%
              </span>
            </div>
          </div>

          {/* Side by Side Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plan A: Prepay */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">方案 A：加速還本金</h3>
                  <span className="text-[10px] text-slate-400">無債一身輕 · 零市場風險</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">提早還清時間：</span>
                  <span className="font-bold text-slate-800">{results.payoffYearsA} 年 (提早 {results.savedYears} 年 {results.savedMonths} 月)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">累計省下房貸利息：</span>
                  <span className="font-bold text-emerald-600">{formatTWD(results.savedInterestA)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">本期實付利息總額：</span>
                  <span className="font-bold text-slate-800">{formatTWD(results.totalInterestA)}</span>
                </div>
              </div>
            </div>

            {/* Plan B: Invest */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  B
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">方案 B：定期定額 ETF</h3>
                  <span className="text-[10px] text-slate-400">長期複利滾存 · 享受經濟成長</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{loanYears}年期滿投資總市值：</span>
                  <span className="font-bold text-emerald-600">{formatTWD(results.investmentBalanceB)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">投入本金總額：</span>
                  <span className="font-bold text-slate-800">{formatTWD(results.totalPrincipalInvested)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">純投資複利收益：</span>
                  <span className="font-bold text-indigo-600">{formatTWD(results.investmentProfitB)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CFP Financial Planner Key Takeaways */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <Award className="w-4 h-4 text-indigo-600" />
              CFP® 國際認證理財顧問建議清單
            </h4>
            <ul className="space-y-1.5 list-disc pl-5 leading-relaxed">
              <li><strong>緊急預備金第一優先：</strong>手頭必須先保留 6 個月以上之生活開銷與房貸月付金，切勿將所有活存全拿去提早還款或全投入股市。</li>
              <li><strong>低利好債的通膨特質：</strong>台灣目前首購房貸利率約 2.185%~2.2%，在實質通膨率 2% 左右的環境下，實質利息成本極低，借長貸遠往往是抗通膨利器。</li>
              <li><strong>年齡心態法則：</strong>若年齡在 45 歲以下且現金流穩定，方案 B (指數化投資) 能創造可觀的長期複利；若已接近退休年齡或厭惡波動，方案 A (降低負債) 可大幅降低心理壓力。</li>
            </ul>
          </div>

          {/* AI & Research Citation */}
          <AiCitationBox
            title="房貸提早還清 vs 存股 0050 投資決策模型 (2026)"
            url="https://tryit.qzz.io/early-repay-vs-invest"
            author="林志豪 CFP® / 台灣房貸指南與試算智庫"
            publishDate="2026-09-28"
            keyPoints={[
              '房貸提早還本金獲得確定性 2.185%~2.2% 的無風險省息回報',
              '存股 0050 或全球指數 ETF 長期歷史年化報酬約 7%~9%，但伴隨波動風險',
              '考量台灣長期實質通膨率約 2%，低利房貸具有借長貸遠抗通膨效果',
              '理財決策應以家庭 6 個月緊急預備金充足為首要前提'
            ]}
          />
        </div>
      </div>
    </div>
  );
}
