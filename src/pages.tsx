import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articles } from './data/articles';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Calculator, AlertCircle, PiggyBank, TrendingUp, BookOpen, ChevronDown, ChevronUp, X, Calendar } from 'lucide-react';
import { cn } from './utils';

// --- Calculator Component ---
type RepaymentMethod = 'equal_payment' | 'equal_principal';

interface CalculationResult {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function CalculatorSection({ initialLoanAmount = 1000 }: { initialLoanAmount?: number }) {
  const [loanAmount, setLoanAmount] = useState<number>(initialLoanAmount); // in 10k
  const [loanTerm, setLoanTerm] = useState<number>(30); // in years
  const [gracePeriod, setGracePeriod] = useState<number>(0); // in years
  const [interestRate, setInterestRate] = useState<number>(2.06); // in %
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('equal_payment');
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [rateData, setRateData] = useState<{updateDate: string, baseRate: string} | null>(null);

  useEffect(() => {
    fetch('/data/rate.json')
      .then(response => response.json())
      .then(data => {
        document.title = `台灣房貸試算神器 - ${data.updateDate} 最新新青安利率 ${data.baseRate}%`;
        setRateData(data);
      })
      .catch(err => console.error('Failed to fetch latest rate', err));
  }, []);

  const { schedule, summary } = useMemo(() => {
    const P = loanAmount * 10000;
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const g = gracePeriod * 12;
    const nPrime = n - g;

    let currentBalance = P;
    let totalInterest = 0;
    let totalPayment = 0;
    const newSchedule: CalculationResult[] = [];

    let firstMonthPayment = 0;
    let gracePeriodPayment = 0;
    let afterGracePeriodPayment = 0;

    for (let i = 1; i <= n; i++) {
      let payment = 0;
      let principal = 0;
      let interest = currentBalance * r;

      if (i <= g) {
        payment = interest;
        principal = 0;
        if (i === 1) gracePeriodPayment = payment;
      } else {
        if (repaymentMethod === 'equal_payment') {
          const M = (P * r * Math.pow(1 + r, nPrime)) / (Math.pow(1 + r, nPrime) - 1);
          payment = M;
          principal = payment - interest;
          if (i === g + 1) afterGracePeriodPayment = payment;
        } else {
          principal = P / nPrime;
          payment = principal + interest;
          if (i === g + 1) afterGracePeriodPayment = payment;
        }
      }

      if (i === 1) firstMonthPayment = payment;

      currentBalance -= principal;
      if (currentBalance < 0) currentBalance = 0;

      totalInterest += interest;
      totalPayment += payment;

      newSchedule.push({
        month: i,
        year: Math.ceil(i / 12),
        payment: Math.round(payment),
        principal: Math.round(principal),
        interest: Math.round(interest),
        remainingBalance: Math.round(currentBalance),
      });
    }

    return {
      schedule: newSchedule,
      summary: {
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        firstMonthPayment: Math.round(firstMonthPayment),
        gracePeriodPayment: Math.round(gracePeriodPayment),
        afterGracePeriodPayment: Math.round(afterGracePeriodPayment),
      },
    };
  }, [loanAmount, loanTerm, gracePeriod, interestRate, repaymentMethod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = useMemo(() => {
    const yearlyData = [];
    let currentYear = 1;
    let yearPrincipal = 0;
    let yearInterest = 0;
    let yearPayment = 0;

    schedule.forEach((row) => {
      if (row.year === currentYear) {
        yearPrincipal += row.principal;
        yearInterest += row.interest;
        yearPayment += row.payment;
      } else {
        yearlyData.push({
          year: `第 ${currentYear} 年`,
          principal: yearPrincipal,
          interest: yearInterest,
          payment: yearPayment,
          balance: row.remainingBalance,
        });
        currentYear = row.year;
        yearPrincipal = row.principal;
        yearInterest = row.interest;
        yearPayment = row.payment;
      }
    });

    if (yearPayment > 0) {
      yearlyData.push({
        year: `第 ${currentYear} 年`,
        principal: yearPrincipal,
        interest: yearInterest,
        payment: yearPayment,
        balance: schedule[schedule.length - 1].remainingBalance,
      });
    }

    return yearlyData;
  }, [schedule]);

  const pieData = [
    { name: '貸款本金', value: loanAmount * 10000 },
    { name: '總利息', value: summary.totalInterest },
  ];

  const currentDate = new Date();
  const endDate = new Date(currentDate.getFullYear() + loanTerm, currentDate.getMonth(), 1);
  const endDateString = `${endDate.getFullYear()}年${endDate.getMonth() + 1}月`;
  
  const principalRatio = (loanAmount * 10000) / summary.totalPayment;
  const arcCircumference = Math.PI * 90;
  const arcOffset = arcCircumference * (1 - principalRatio);

  const resultCardNode = (
    <div className="bg-gradient-to-br from-[#1a7b8c] to-[#2cb67d] rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
      <h3 className="text-center text-lg font-medium mb-6 opacity-90">台灣房貸神器 - 結果展示</h3>
      
      <div className="relative w-full max-w-[280px] mx-auto mb-8">
        <svg viewBox="0 0 200 110" className="w-full overflow-visible drop-shadow-md">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
          </defs>
          <path 
            d="M 10 100 A 90 90 0 0 1 190 100" 
            fill="none" 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth="14" 
            strokeLinecap="round" 
          />
          <path 
            d="M 10 100 A 90 90 0 0 1 190 100" 
            fill="none" 
            stroke="url(#arcGradient)" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeDasharray={arcCircumference}
            strokeDashoffset={arcOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <p className="text-sm opacity-90 mb-1">月付貸付</p>
          <p className="text-4xl font-bold tracking-tight mb-1">
            ${summary.firstMonthPayment.toLocaleString()} <span className="text-lg font-normal opacity-80">元</span>
          </p>
          <p className="text-xs opacity-80">
            {repaymentMethod === 'equal_payment' ? '本息平均攤還' : '本金平均攤還'} ({loanTerm}年)
          </p>
          {gracePeriod > 0 && (
            <p className="text-[10px] text-yellow-200 mt-1.5 bg-black/20 px-2.5 py-0.5 rounded-full">
              寬限期後: ${summary.afterGracePeriodPayment.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <PiggyBank className="w-3.5 h-3.5 text-[#2cb67d]" />
            貸款金額
          </div>
          <div className="text-lg font-bold">{loanAmount} 萬</div>
        </div>
        <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#2cb67d]" />
            年率
          </div>
          <div className="text-lg font-bold">{interestRate}%</div>
        </div>
        <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Calculator className="w-3.5 h-3.5 text-[#2cb67d]" />
            全利息
          </div>
          <div className="text-lg font-bold">${summary.totalInterest.toLocaleString()} <span className="text-xs font-normal text-slate-500">元</span></div>
        </div>
        <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#2cb67d]" />
            上次支付日期
          </div>
          <div className="text-lg font-bold">{endDateString}</div>
        </div>
      </div>
    </div>
  );

  const shopeeLinksNode = (
    <>
      <p className="text-sm font-medium text-slate-500 mb-4">🏠 算好房貸了？看看網友推薦的入厝好物：</p>
      <div className="flex gap-3 flex-wrap">
        <a href="https://s.shopee.tw/1BIYUgJEOw" target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#ee4d2d] text-white rounded-md font-medium text-sm hover:bg-[#d74326] transition-colors no-underline shadow-sm">智能門鎖</a>
        <a href="https://s.shopee.tw/6fdV2GUWpQ" target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#ee4d2d] text-white rounded-md font-medium text-sm hover:bg-[#d74326] transition-colors no-underline shadow-sm">抗通膨家電</a>
        <a href="https://s.shopee.tw/AADNDqQGVv" target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#ee4d2d] text-white rounded-md font-medium text-sm hover:bg-[#d74326] transition-colors no-underline shadow-sm">今日領取免運券</a>
      </div>
    </>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Mobile Result Card (Top) */}
      <div className="lg:hidden">
        {resultCardNode}
      </div>

      {/* Left Column: Calculator Inputs */}
      <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20 lg:h-fit lg:self-start">
        {/* Mobile Shopee Recommendations (Above "關於本試算機") */}
        <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-6 order-2">
          {shopeeLinksNode}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 order-3">
          <h2 className="text-lg font-bold text-slate-800 mb-2">關於本試算機</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            買房是人生大事，房貸往往伴隨我們 20 到 40 年。本工具專為台灣購屋族設計，提供最精準的<strong>本息平均攤還</strong>與<strong>本金平均攤還</strong>試算。無論您是適用 2026 最新<strong>新青安房貸</strong>的首購族，還是需要評估<strong>寬限期</strong>影響的換屋族，都能透過本系統的圖表與明細，快速掌握每月的財務負擔，做出最明智的理財決策。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 order-1">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-800">輸入貸款條件</h2>
          </div>

          {rateData && (
            <div id="current-rate-info" className="text-[13px] text-slate-600 bg-indigo-50/50 border border-indigo-100 px-3 py-2.5 rounded-lg mb-6 -mt-2 flex items-center gap-2">
               <span className="shrink-0">📈</span> 目前銀行機動利率參考：<strong className="text-indigo-700">{rateData.baseRate}%</strong> <span className="text-slate-400 text-xs">(更新於 {rateData.updateDate})</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="loan-amount" className="block text-sm font-medium text-slate-700 mb-1">
                貸款金額 (萬元)
              </label>
              <div className="relative">
                <input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="block w-full rounded-lg border-slate-300 bg-slate-50 border px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-shadow"
                  min="1"
                  aria-label="輸入貸款金額(萬元)"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">萬元</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="loan-term" className="block text-sm font-medium text-slate-700 mb-1">
                貸款年限 (年)
              </label>
              <select
                id="loan-term"
                value={loanTerm}
                onChange={(e) => {
                  const newTerm = Number(e.target.value);
                  setLoanTerm(newTerm);
                  if (gracePeriod >= newTerm) setGracePeriod(0);
                }}
                className="block w-full rounded-lg border-slate-300 bg-slate-50 border px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                aria-label="選擇貸款年限"
              >
                <option value={20}>20 年 (240期)</option>
                <option value={30}>30 年 (360期)</option>
                <option value={40}>40 年 (480期) - 新青安適用</option>
              </select>
            </div>

            <div>
              <label htmlFor="grace-period" className="block text-sm font-medium text-slate-700 mb-1">
                寬限期 (年)
              </label>
              <select
                id="grace-period"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(Number(e.target.value))}
                className="block w-full rounded-lg border-slate-300 bg-slate-50 border px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                aria-label="選擇寬限期"
              >
                <option value={0}>無寬限期</option>
                <option value={1}>1 年 (12期)</option>
                <option value={2}>2 年 (24期)</option>
                <option value={3}>3 年 (36期)</option>
                <option value={4}>4 年 (48期)</option>
                <option value={5}>5 年 (60期) - 新青安上限</option>
              </select>
              {gracePeriod > 0 && (
                <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  寬限期內只需繳利息，期滿後月付金將顯著增加。
                </p>
              )}
            </div>

            <div>
              <label htmlFor="interest-rate" className="block text-sm font-medium text-slate-700 mb-1">
                房貸利率 (%)
              </label>
              <div className="relative">
                <input
                  id="interest-rate"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="block w-full rounded-lg border-slate-300 bg-slate-50 border px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  aria-label="輸入房貸利率"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">%</span>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setInterestRate(1.775)}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-100 border border-indigo-200"
                >
                  新青安一段式 (1.775%)
                </button>
                <button
                  onClick={() => setInterestRate(2.06)}
                  className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md hover:bg-slate-200 border border-slate-200"
                >
                  一般房貸地板價 (2.06%)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                還款方式
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setRepaymentMethod('equal_payment')}
                  className={cn(
                    "px-4 py-3 rounded-lg border text-sm font-medium transition-all",
                    repaymentMethod === 'equal_payment'
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  本息平均攤還
                  <span className="block text-xs font-normal mt-1 opacity-80">每月繳款金額固定</span>
                </button>
                <button
                  onClick={() => setRepaymentMethod('equal_principal')}
                  className={cn(
                    "px-4 py-3 rounded-lg border text-sm font-medium transition-all",
                    repaymentMethod === 'equal_principal'
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  本金平均攤還
                  <span className="block text-xs font-normal mt-1 opacity-80">總利息較低，前期負擔大</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowComparisonModal(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-sm hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                傳統房貸 vs 新青安，哪個省？
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Results & Charts */}
      <div className="lg:col-span-8 space-y-6">
        {/* Mobile Sticky Summary Bar */}
        <div className="lg:hidden sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm px-4 py-3 -mx-4 sm:-mx-6 -mt-6 mb-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-slate-700">首期月付金</span>
          </div>
          <div className="text-xl font-bold text-indigo-600">
            {formatCurrency(summary.firstMonthPayment)}
          </div>
        </div>

        {/* Desktop Result Card */}
        <div className="hidden lg:block">
          {resultCardNode}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('chart')}
                className={cn(
                  "w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors",
                  activeTab === 'chart'
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                )}
              >
                圖表分析
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={cn(
                  "w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors",
                  activeTab === 'table'
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                )}
              >
                每月還款明細
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'chart' ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-4 text-center">每年還款金額變化 (本金 vs 利息)</h3>
                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis 
                          tickFormatter={(value) => `${(value / 10000).toFixed(0)}萬`} 
                          tick={{ fontSize: 12, fill: '#64748b' }} 
                          axisLine={false} 
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                        <Line type="monotone" dataKey="principal" name="償還本金" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="interest" name="支付利息" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="h-64 w-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-slate-800">還款結構比例</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-slate-600">貸款本金:</span>
                      <span className="text-sm font-medium text-slate-900">{formatCurrency(loanAmount * 10000)}</span>
                      <span className="text-xs text-slate-500">({((loanAmount * 10000 / summary.totalPayment) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                      <span className="text-sm text-slate-600">總利息:</span>
                      <span className="text-sm font-medium text-slate-900">{formatCurrency(summary.totalInterest)}</span>
                      <span className="text-xs text-slate-500">({((summary.totalInterest / summary.totalPayment) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg border border-slate-200 scrollbar-hide">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-3 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">期數</th>
                      <th scope="col" className="px-3 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">本期本息和</th>
                      <th scope="col" className="px-3 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">本期本金</th>
                      <th scope="col" className="px-3 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">本期利息</th>
                      <th scope="col" className="px-3 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">剩餘本金</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-500">
                          第 {row.month} 期 <span className="text-[10px] sm:text-xs text-slate-400 ml-1">({row.year}年)</span>
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-indigo-600 text-right">{formatCurrency(row.payment)}</td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-900 text-right">{formatCurrency(row.principal)}</td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-900 text-right">{formatCurrency(row.interest)}</td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-500 text-right">{formatCurrency(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Shopee Recommendations */}
        <div id="shopee-recommend-desktop" className="hidden lg:block mt-8 pt-6 border-t border-dashed border-slate-300">
          {shopeeLinksNode}
        </div>

      </div>

      {showComparisonModal && (
        <ComparisonModal 
          loanAmount={loanAmount} 
          onClose={() => setShowComparisonModal(false)} 
        />
      )}
    </div>
  );
}

function calculateMortgage(P: number, r_annual: number, n_years: number, g_years: number) {
  const r = r_annual / 100 / 12;
  const n = n_years * 12;
  const g = g_years * 12;
  const nPrime = n - g;

  let totalInterest = 0;
  let gracePayment = 0;
  let normalPayment = 0;

  if (g > 0) {
    gracePayment = P * r;
    totalInterest += gracePayment * g;
  }

  const M = (P * r * Math.pow(1 + r, nPrime)) / (Math.pow(1 + r, nPrime) - 1);
  normalPayment = M;
  
  const totalNormalPayment = M * nPrime;
  const principalPaid = P;
  totalInterest += (totalNormalPayment - principalPaid);

  return {
    gracePayment: Math.round(gracePayment),
    normalPayment: Math.round(normalPayment),
    totalInterest: Math.round(totalInterest)
  };
}

function ComparisonModal({ loanAmount, onClose }: { loanAmount: number, onClose: () => void }) {
  // 傳統房貸: 30年, 無寬限期, 2.06%
  const traditional = calculateMortgage(loanAmount * 10000, 2.06, 30, 0);
  
  // 新青安: 40年, 5年寬限期, 1.775% (最高1000萬)
  const calcAmount = Math.min(loanAmount, 1000) * 10000;
  const newYouth = calculateMortgage(calcAmount, 1.775, 40, 5);
  
  let newYouthTotalInterest = newYouth.totalInterest;
  let newYouthGracePayment = newYouth.gracePayment;
  let newYouthNormalPayment = newYouth.normalPayment;
  
  // 超過1000萬的部分，以一般房貸利率(2.06%)，同樣40年、5年寬限期計算
  if (loanAmount > 1000) {
    const remainingAmount = (loanAmount - 1000) * 10000;
    const remainingCalc = calculateMortgage(remainingAmount, 2.06, 40, 5);
    newYouthTotalInterest += remainingCalc.totalInterest;
    newYouthGracePayment += remainingCalc.gracePayment;
    newYouthNormalPayment += remainingCalc.normalPayment;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">傳統房貸 vs 新青安 比較表</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">
          <p className="text-slate-600 mb-6">
            以您輸入的貸款金額 <strong>{loanAmount} 萬元</strong> 進行試算。
            {loanAmount > 1000 && <span className="text-amber-600 block mt-1">註：新青安最高額度為 1000 萬元，超過部分以一般房貸利率 (2.06%) 計算。</span>}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Traditional */}
            <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
              <div className="text-center mb-4 pb-4 border-b border-slate-200">
                <h4 className="font-bold text-slate-800 text-lg">傳統一般房貸</h4>
                <p className="text-sm text-slate-500 mt-1">30年期 / 無寬限期 / 利率 2.06%</p>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">每月還款金額</div>
                  <div className="text-xl font-bold text-slate-800">{formatCurrency(traditional.normalPayment)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">總利息支出</div>
                  <div className="text-xl font-bold text-slate-800">{formatCurrency(traditional.totalInterest)}</div>
                </div>
              </div>
            </div>

            {/* New Youth */}
            <div className="bg-indigo-50 rounded-xl p-4 sm:p-5 border border-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                最輕鬆
              </div>
              <div className="text-center mb-4 pb-4 border-b border-indigo-200">
                <h4 className="font-bold text-indigo-900 text-lg">新青安房貸</h4>
                <p className="text-sm text-indigo-700 mt-1">40年期 / 5年寬限期 / 利率 1.775%</p>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-indigo-700 mb-1">前 5 年每月還款 (僅繳息)</div>
                  <div className="text-xl font-bold text-indigo-600">{formatCurrency(newYouthGracePayment)}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-700 mb-1">第 6 年起每月還款</div>
                  <div className="text-xl font-bold text-indigo-900">{formatCurrency(newYouthNormalPayment)}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-700 mb-1">總利息支出</div>
                  <div className="text-xl font-bold text-indigo-900">{formatCurrency(newYouthTotalInterest)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h5 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              試算結論
            </h5>
            <p className="text-sm text-amber-700 leading-relaxed">
              新青安雖然前 5 年月付金極低，能大幅減輕初期壓力，但因為<strong>貸款年限拉長至 40 年</strong>，整體的<strong>總利息支出會比傳統 30 年房貸高出許多</strong>。建議您評估未來的換屋計畫與薪資成長幅度，若預計長期持有，可考慮提前還款以節省利息。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Pages ---

export function Home() {
  return (
    <div className="space-y-16">
      <section>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">台灣房貸試算神器｜2026新青安、寬限期、本息本金一鍵計算</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            專為首購族貸款與轉貸需求設計的房貸試算工具，支援新青安試算、轉貸試算、寬限期評估。提供詳細的圖表分析與每月還款明細，幫助您輕鬆規劃購屋財務。
          </p>
        </div>
        <CalculatorSection />
      </section>

      <section className="border-t border-slate-200 pt-16">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">為什麼需要使用房貸試算工具？</h2>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
            <p>
              買房是人生中最大筆的消費之一，而房貸往往伴隨我們長達 20 到 40 年。許多首購族在看房時，往往只關注「房屋總價」與「頭期款」，卻忽略了未來每個月沉重的「房貸月付金」。透過專業的房屋貸款計算器，您可以在簽約前，精準預估未來的財務負擔。
            </p>
            <p>
              本站提供的「台灣房貸試算神器」不僅支援一般的房貸計算，更針對台灣特有的房貸環境進行了優化。無論您是想進行「首購族貸款」評估、了解「新青安試算」的優惠方案、進行「轉貸試算」以降低利息，或是比較「本息平均攤還 vs 本金平均攤還」的總利息差異，都能在這裡一鍵獲得詳細的數據與圖表分析。
            </p>
            <p>
              強烈建議您在看屋階段，就將心儀物件的價格輸入試算機中，並將利率設定得比目前市場利率稍高一些（例如加碼 0.25%），進行家庭財務的壓力測試。確保每月的房貸支出不超過家庭總收入的 1/3（即房貸負擔率），才能在擁有自己小窩的同時，依然保有良好的生活品質。
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">房貸常見問題 (FAQ)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">Q: 1000萬房貸一個月還多少？</h3>
              <p className="text-sm text-slate-600">
                以貸款 1000 萬、利率 2.06%、30 年期「本息平均攤還」且無寬限期來試算，每個月大約需還款 37,263 元。建議您的家庭月收入至少要有 11 萬元以上，才能維持較好的生活品質與應付突發支出。
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">Q: 新青安貸款五年寬限期試算怎麼算？</h3>
              <p className="text-sm text-slate-600">
                若使用新青安貸款 1000 萬、利率 1.775%、40 年期並搭配 5 年寬限期。前 5 年每月只需繳利息約 14,792 元；但第 6 年起，本金需在剩餘 35 年內攤還，月付金將跳升至約 31,983 元，需特別留意未來的還款壓力。
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">Q: 本息平均攤還 vs 本金平均攤還 差在哪？</h3>
              <p className="text-sm text-slate-600">
                「本息平均攤還」每個月繳交的總金額固定，方便做財務規劃，但總繳利息較高。「本金平均攤還」則是每個月固定償還一樣多的本金，初期月付金非常高，但總繳利息較低，且越繳越輕鬆。
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">Q: 我適合進行轉貸試算嗎？</h3>
              <p className="text-sm text-slate-600">
                如果您目前的房貸利率較高，或是房屋有增值空間想要增貸，都可以考慮轉貸。建議利用本站的轉貸試算功能，比較新舊銀行的利率差額是否大於轉貸所需的各項手續費（如代書費、塗銷費、開辦費等），確認划算後再行動。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-800">最新房貸知識與文章</h2>
          </div>
          <Link to="/articles" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
            查看全部文章 &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.slice(0, 4).map(article => (
            <Link key={article.id} to={`/articles/${article.id}`} className="block group">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full transition-all hover:shadow-md hover:border-indigo-300">
                <p className="text-xs text-slate-400 mb-2">{article.date}</p>
                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ArticlesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">房貸知識專欄</h1>
      <p className="text-slate-600 mb-10 text-lg">
        我們提供最完整的購屋指南、房貸教學與市場趨勢分析，幫助您在買房路上不走冤枉路。
      </p>
      <div className="space-y-6">
        {articles.map(article => (
          <Link key={article.id} to={`/articles/${article.id}`} className="block group">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-all hover:shadow-md hover:border-indigo-300">
              <p className="text-sm text-indigo-600 font-medium mb-2">{article.date}</p>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">{article.title}</h2>
              <p className="text-slate-600 leading-relaxed">{article.excerpt}</p>
              <div className="mt-4 text-indigo-600 font-medium text-sm flex items-center gap-1">
                閱讀全文 &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">找不到該文章</h2>
        <Link to="/articles" className="text-indigo-600 hover:underline">返回文章列表</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
      <Link to="/articles" className="text-sm text-indigo-600 hover:underline mb-8 inline-block">&larr; 返回文章列表</Link>
      <p className="text-sm text-slate-500 mb-3">{article.date}</p>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">{article.title}</h1>
      <div className="prose prose-slate prose-indigo max-w-none prose-img:rounded-2xl prose-img:shadow-md prose-img:w-full prose-img:object-cover prose-img:my-8 prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-indigo-600 prose-li:text-slate-600 prose-table:w-full prose-table:border-collapse prose-th:bg-slate-50 prose-th:p-3 prose-th:border prose-th:border-slate-200 prose-td:p-3 prose-td:border prose-td:border-slate-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content.replace(/\\n/g, '\n')}</ReactMarkdown>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">關於我們</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>
          歡迎來到「台灣房貸試算神器」，這是一個專為台灣購屋族、首購族以及換屋族打造的免費線上工具與知識平台。
        </p>
        <p>
          買房是多數人一生中最大的財務決策，動輒千萬的房屋總價，往往需要向銀行申請長達 20 年、30 年甚至 40 年的房屋貸款。我們深知，在面對複雜的利率計算（如一段式、分段式機動利率）、寬限期評估（先甘後苦的還款壓力），以及「本息平均攤還」與「本金平均攤還」的艱難選擇時，許多沒有金融背景的民眾會感到困惑與無助。
        </p>
        <p>
          如果沒有在簽約前做好完善的財務壓力測試，很容易在交屋後因為沉重的「房貸月付金」而犧牲了原有的生活品質，甚至面臨斷頭違約的風險。因此，我們致力於開發最直覺、最精準的試算工具，幫助您清晰地看見未來的財務藍圖。
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">我們的使命與願景</h3>
        <p>
          我們的使命是<strong>「讓房貸資訊透明化，讓購屋決策更安心」</strong>。
        </p>
        <p>
          我們希望打破金融資訊的壁壘，讓每一位使用者都能輕鬆掌握自己的還款能力。除了提供強大的試算工具外，我們也深知「知識就是力量」。因此，我們的專業團隊持續撰寫並更新房貸相關的知識文章、市場趨勢指南、以及銀行貸款的談判技巧，期望能成為您買房路上的最佳指南針。
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">為什麼選擇我們？</h3>
        <ul className="list-disc pl-5 space-y-4">
          <li>
            <strong>完全免費且無廣告干擾核心功能：</strong> 我們的所有核心試算工具與知識文章皆免費開放給大眾使用。我們致力於提供乾淨、流暢的使用者體驗。
          </li>
          <li>
            <strong>絕對的隱私安全：</strong> 我們極度重視您的個人隱私。本站採用純前端 (Client-side) 技術架構，這意味著您輸入的所有試算數據（如貸款金額、利率、年限等）都只會留在您個人的瀏覽器中進行運算。我們<strong>絕對不會</strong>收集、上傳或儲存您的任何財務資訊至我們的伺服器。
          </li>
          <li>
            <strong>專業與準確的計算邏輯：</strong> 我們的計算機底層邏輯嚴格遵循台灣銀行業標準的「年金法」與「平均攤還法」公式。無論是新青安貸款的特殊寬限期設定，或是複雜的本金攤還圖表，都能確保試算結果具備極高的參考價值。
          </li>
          <li>
            <strong>豐富的在地化內容：</strong> 我們的文章與指南完全針對台灣的房地產市場與央行政策（如信用管制、新青安政策）量身打造，提供最接地氣的實用建議。
          </li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">免責聲明</h3>
        <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100">
          本網站提供的所有試算結果與文章內容僅供參考。實際的貸款額度、利率、寬限期及每月還款金額，仍須以各家銀行最終核貸的條件為準。我們強烈建議您在做出任何重大財務決策前，應親自向各大金融機構或專業理財顧問進行諮詢。本網站不對任何因使用本站資訊而導致的直接或間接財務損失負責。
        </p>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">聯絡我們</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>
          如果您對我們的網站有任何建議、發現任何錯誤，或者有商務合作的需求，我們非常歡迎您與我們聯繫！
        </p>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-8">
          <h3 className="font-bold text-slate-800 mb-2">電子郵件</h3>
          <p className="text-indigo-600 font-medium">contact@tryit.qzz.io</p>
          <p className="text-sm text-slate-500 mt-2">我們通常會在 1-2 個工作天內回覆您的信件。</p>
        </div>
        <p className="text-sm text-slate-500 mt-8">
          請注意：我們不提供個別的理財諮詢或貸款代辦服務。所有關於個人貸款條件的疑問，建議您直接洽詢各大金融機構。
        </p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">隱私權政策 (Privacy Policy)</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>本網站（台灣房貸試算神器）非常重視您的隱私權。請閱讀以下有關隱私權保護政策的更多內容。</p>
        
        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. 資料收集與使用</h3>
        <p>本網站作為一個純前端的計算工具，<strong>不會</strong>主動收集、儲存或傳送您輸入的任何財務數據（如貸款金額、利率、年限等）至我們的伺服器。所有的計算過程皆在您的瀏覽器端（Client-side）完成，確保您的財務隱私絕對安全。</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Cookie 與第三方廣告 (Google AdSense)</h3>
        <p>本網站使用 Google AdSense 服務來提供廣告。Google 及其合作夥伴會使用 Cookie 根據您先前對本網站或其他網站的造訪紀錄來放送廣告。</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Google 使用廣告 Cookie，可讓 Google 及其合作夥伴根據使用者造訪本網站和/或網際網路上其他網站的資料，向使用者放送合適的廣告。</li>
          <li>使用者可以選擇停用個人化廣告。如要停用，請前往 <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">廣告設定</a>。</li>
          <li>我們也可能使用分析工具（如 Google Analytics）的 Cookie 來分析網站流量並優化您的使用者體驗。</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. 外部連結</h3>
        <p>本網站可能包含其他網站的連結。我們對這些外部網站的隱私權做法或內容概不負責。建議您在離開本網站時，閱讀每個收集個人識別資訊網站的隱私權聲明。</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. 政策修改</h3>
        <p>我們保留隨時修改本隱私權政策的權利，修改後的條款將直接發布於本網站上。建議您定期查看本頁面以了解任何變更。</p>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">服務條款 (Terms of Service)</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>歡迎使用台灣房貸試算神器。使用本網站即表示您同意遵守以下條款：</p>
        
        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. 僅供參考聲明</h3>
        <p>本網站提供的所有計算結果、圖表與數據<strong>僅供參考與初步評估之用</strong>。實際的貸款額度、利率、寬限期、手續費及每月還款金額，需以各家金融機構最終核貸的結果與正式合約為準。本網站不保證計算結果的絕對精確性，亦不對因依賴本網站資訊而產生的任何財務損失負責。</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. 服務可用性</h3>
        <p>我們致力於維持網站的正常運作，但保留隨時修改、暫停或終止本網站部分或全部服務的權利，且不另行通知。對於因網站無法使用而造成的任何不便，我們不承擔任何責任。</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. 智慧財產權</h3>
        <p>本網站的介面設計、程式碼、圖表樣式及文字內容等，均受智慧財產權法保護。未經授權，請勿隨意複製、修改或用於商業用途。</p>
      </div>
    </div>
  );
}

export function Landing1200WPage() {
  React.useEffect(() => {
    document.title = "1200萬房貸試算 - 月付多少？利息多少？(2026更新)";
    return () => {
      document.title = "台灣房貸試算神器｜2026新青安、寬限期、本息本金一鍵計算";
    };
  }, []);

  return (
    <div className="space-y-16">
      <section>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">1200萬房貸試算 - 月付多少？利息多少？(2026更新)</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            買房預算抓 1200 萬，想知道每個月房貸要繳多少錢？如果搭配新青安貸款，寬限期內外月付金差多少？馬上使用專屬試算器為您解答！
          </p>
        </div>
        <CalculatorSection initialLoanAmount={1200} />
      </section>

      <section className="border-t border-slate-200 pt-16">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">1200萬房貸常見情形解析</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">一般房貸 (無寬限期)</h3>
              <p className="text-sm text-slate-600">
                若以貸款 1200 萬、利率 2.06%、30 年期「本息平均攤還」試算，每個月約需繳款 <strong>44,716 元</strong>。建議家庭月收入至少要有 13～14 萬，才不會讓生活品質打折。
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
               <h3 className="font-bold text-slate-800 mb-2">搭配新青安貸款</h3>
              <p className="text-sm text-slate-600">
                新青安最高額度為 1000 萬，剩餘 200 萬須用一般房貸。合併試算下，前 5 年寬限期可能每月只需兩萬出頭，但第 6 年起本金開始攤還，月付金會大幅跳升至 4 萬多，務必評估未來還款能力。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
