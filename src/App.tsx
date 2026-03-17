/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Calculator,
  Info,
  BookOpen,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  PiggyBank,
  Home,
  AlertCircle,
  X
} from 'lucide-react';

// Utility for class merging
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RepaymentMethod = 'equal_payment' | 'equal_principal';

interface CalculationResult {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface Summary {
  totalPayment: number;
  totalInterest: number;
  firstMonthPayment: number;
  gracePeriodPayment: number;
  afterGracePeriodPayment: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function App() {
  const [loanAmount, setLoanAmount] = useState<number>(1000); // in 10k (萬元)
  const [loanTerm, setLoanTerm] = useState<number>(30); // in years
  const [gracePeriod, setGracePeriod] = useState<number>(0); // in years
  const [interestRate, setInterestRate] = useState<number>(2.06); // in %
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('equal_payment');

  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Calculate Amortization Schedule
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
        // Grace period
        payment = interest;
        principal = 0;
        if (i === 1) gracePeriodPayment = payment;
      } else {
        // After grace period
        if (repaymentMethod === 'equal_payment') {
          // 本息平均攤還
          const M = (P * r * Math.pow(1 + r, nPrime)) / (Math.pow(1 + r, nPrime) - 1);
          payment = M;
          principal = payment - interest;
          if (i === g + 1) afterGracePeriodPayment = payment;
        } else {
          // 本金平均攤還
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

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare chart data (yearly summary to avoid too many points)
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

    // Add last year
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6" aria-hidden="true" />
            <h1 className="text-xl font-bold tracking-tight">台灣房貸試算神器</h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <a href="#calculator" className="hover:text-indigo-200 transition-colors">試算工具</a>
            <a href="#knowledge" className="hover:text-indigo-200 transition-colors">房貸知識庫</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Calculator Inputs */}
          <div className="lg:col-span-4 space-y-6" id="calculator">
            {/* SEO Text Block */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-2">關於本試算機</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                買房是人生大事，房貸往往伴隨我們 20 到 40 年。本工具專為台灣購屋族設計，提供最精準的<strong>本息平均攤還</strong>與<strong>本金平均攤還</strong>試算。無論您是適用 2026 最新<strong>新青安房貸</strong>的首購族，還是需要評估<strong>寬限期</strong>影響的換屋族，都能透過本系統的圖表與明細，快速掌握每月的財務負擔，做出最明智的理財決策。
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-indigo-600" aria-hidden="true" />
                <h2 className="text-lg font-bold text-slate-800">輸入貸款條件</h2>
              </div>

              <div className="space-y-5">
                {/* Loan Amount */}
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

                {/* Loan Term */}
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

                {/* Grace Period */}
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

                {/* Interest Rate */}
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

                {/* Repayment Method */}
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

              </div>
            </div>
          </div>

          {/* Right Column: Results & Charts */}
          <div className="lg:col-span-8 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                  <PiggyBank className="w-4 h-4" />
                  首期月付金
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(summary.firstMonthPayment)}
                </div>
                {gracePeriod > 0 && (
                  <div className="text-xs text-slate-500 mt-1">
                    (寬限期內僅繳息)
                  </div>
                )}
              </div>
              
              {gracePeriod > 0 && (
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <div className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    寬限期後月付金
                  </div>
                  <div className="text-2xl font-bold text-rose-600">
                    {formatCurrency(summary.afterGracePeriodPayment)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    (第 {gracePeriod * 12 + 1} 期起)
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-sm font-medium text-slate-500 mb-1">
                  總利息支出
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {formatCurrency(summary.totalInterest)}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-sm font-medium text-slate-500 mb-1">
                  總還款金額
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {formatCurrency(summary.totalPayment)}
                </div>
              </div>
            </div>

            {/* Charts & Tables Area */}
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
                    {/* Line Chart */}
                    <div>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 text-center">每年還款金額變化 (本金 vs 利息)</h3>
                      <div className="h-72 w-full">
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

                    {/* Pie Chart */}
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">期數</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">本期本金</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">本期利息</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">本期本息和</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">剩餘本金</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {schedule.map((row) => (
                          <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              第 {row.month} 期 <span className="text-xs text-slate-400 ml-1">({row.year}年)</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right">{formatCurrency(row.principal)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right">{formatCurrency(row.interest)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 text-right">{formatCurrency(row.payment)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatCurrency(row.remainingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Section */}
        <div className="mt-16" id="knowledge">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <BookOpen className="w-6 h-6 text-indigo-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-slate-800">房貸知識與常見問題</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <KnowledgeCard 
              title="什麼是「新青安」房貸？"
              content="「青年安心成家購屋優惠貸款精進方案」(簡稱新青安) 是政府為減輕無自有住宅家庭購屋負擔推出的專案。最高貸款額度達 1000 萬元，貸款年限最長可達 40 年，寬限期最長 5 年。目前一段式機動利率補貼後為 1.775% (至2026年7月底)。"
            />
            <KnowledgeCard 
              title="本息攤還 vs 本金攤還，該選哪個？"
              content="【本息平均攤還】每月還款金額固定，方便財務規劃，適合一般上班族。前期還款多為利息，本金減少較慢。\n\n【本金平均攤還】每月償還固定本金加上利息，因此前期月付金較高，但會逐月遞減。總繳利息較少，適合手頭資金充裕、想省利息的人。"
            />
            <KnowledgeCard 
              title="寬限期是什麼？我該使用嗎？"
              content="寬限期是指在約定期限內「只繳利息、不還本金」。\n優點：初期還款壓力小，適合剛買房需花費裝潢、買家電的首購族。\n缺點：寬限期結束後，剩餘本金需在縮短的年限內攤還，月付金會暴增。總繳利息也會比不使用寬限期來得多。請務必評估寬限期後的還款能力。"
            />
            <KnowledgeCard 
              title="如何評估自己的購屋負擔能力？"
              content="建議使用「房貸收支比」(每月房貸支出 ÷ 每月總收入)。\n健康的房貸收支比建議控制在 30%~33% 以內，最高不宜超過 40%，以免影響生活品質或遇到升息時無力負擔。購屋前也應預留至少半年的緊急預備金。"
            />
            <KnowledgeCard 
              title="什麼是「一段式」與「分段式」機動利率？"
              content="【一段式機動利率】整個貸款期間，以基準利率加上固定加碼利率計息。雖然基準利率會隨央行升降息浮動，但加碼部分不變。適合預期長期持有的自住客。\n\n【分段式機動利率】通常前一兩年利率較低（甚至低於一段式），但第三年起加碼利率會大幅提高。適合預計短期內就會轉手或提前還清貸款的投資客。"
            />
            <KnowledgeCard 
              title="提前還款會有違約金嗎？"
              content="多數銀行房貸合約中會設有「綁約期」（通常為 1 到 3 年）。如果在綁約期間內「提前清償全部本金」或「塗銷抵押權」，銀行會收取提前清償違約金（通常是提前還款金額的 0.5% ~ 1%）。\n\n但如果是「部分提前還款」（也就是多還一點本金，但不塗銷），多數銀行是不收違約金的，建議簽約前務必確認合約條款。"
            />
            <KnowledgeCard 
              title="申請房貸需要準備哪些文件？"
              content="1. 身分證明：雙證件影本（身分證、健保卡或駕照）。\n2. 財力證明：近半年薪資轉帳存摺明細、最新年度扣繳憑單或所得清單。若為自營商，需提供營業稅單（401表）。\n3. 買賣契約：不動產買賣契約書影本。\n4. 擔保品資料：土地及建物登記謄本。\n\n準備越齊全的財力證明，越有機會爭取到較低的利率與較高的成數。"
            />
            <KnowledgeCard 
              title="什麼是聯徵分數？如何提高房貸過件率？"
              content="聯徵分數（信用評分）是銀行評估您還款能力的重要指標。分數介於 200 到 800 分之間。\n\n提高過件率的秘訣：\n1. 培養信用：持有信用卡並全額繳清，不使用循環利息。\n2. 避免遲繳：任何貸款、卡費都應準時繳納。\n3. 減少負債：申請房貸前，盡量結清信貸或車貸。\n4. 穩定收入：保持同一份工作至少半年至一年以上，讓銀行看到穩定的現金流。"
            />
            <KnowledgeCard 
              title="預售屋、新成屋、中古屋的貸款成數有何不同？"
              content="【預售屋/新成屋】通常貸款成數最高，若地點佳且個人信用良好，有機會貸到 8 成甚至 85 成。建商通常會有配合的銀行，條件較優惠。\n\n【中古屋】銀行會依據房屋的屋齡、地段、屋況進行「鑑價」。通常鑑價金額會低於實際成交價，貸款成數約落在 7 成到 8 成之間。屋齡越老（如 30 年以上公寓），貸款成數可能越低，且貸款年限也會受限（通常要求：屋齡 + 貸款年限 < 50 或 60）。"
            />
            <KnowledgeCard 
              title="房貸壽險是什麼？我需要保嗎？"
              content="房貸壽險是專為房貸族設計的保險，當借款人發生意外身故或完全失能時，保險理賠金會優先用來清償房貸，避免房屋被法拍，留給家人一個安穩的家。\n\n是否需要保？\n如果您是家庭的「唯一或主要經濟支柱」，且沒有足夠的其他壽險保障，強烈建議投保。保費可選擇「躉繳（一次繳清，可跟著房貸一起貸）」或「期繳（每年繳）」。"
            />
          </div>
        </div>

        {/* SEO Long-form Articles Section */}
        <div className="mt-20 max-w-5xl mx-auto space-y-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">2026 台灣購屋與房貸最新趨勢指南</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">1. 央行信用管制與利率環境</h3>
                <p>
                  在經歷了過去幾年的全球通膨與升息循環後，2026 年的台灣房貸市場逐漸步入一個相對穩定的「高原期」。雖然央行的基準利率不再像過去那樣頻繁大幅調升，但整體資金成本已較疫情前顯著增加。對於購屋族而言，這意味著「利息支出」在每月還款中的佔比變高了。因此，在購屋前使用精準的房貸試算工具，詳細評估「本息平均攤還」與「本金平均攤還」的總利息差異，變得比以往任何時候都更加重要。此外，央行針對特定區域（如六都及新竹縣市）的第二戶以上住宅貸款，仍可能實施嚴格的成數限制與無寬限期規定，投資客或換屋族需特別留意資金調度。
                </p>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">2. 新青安房貸的延續與影響</h3>
                <p>
                  「青年安心成家購屋優惠貸款精進方案」（簡稱新青安）自推出以來，大幅降低了首購族的進場門檻。其三大亮點：最高貸款額度 1,000 萬元、最長貸款年限 40 年、以及最長 5 年的寬限期，依然是許多年輕人買房的首選。然而，專家提醒，長達 5 年的寬限期雖然初期輕鬆，但第 6 年起本金將壓縮在剩餘的 35 年內攤還，月付金將會出現「斷崖式」的跳升。建議首購族在享受政策紅利的同時，務必利用本站的試算機，切換查看「寬限期後」的真實月付金，確保未來的薪資成長幅度能跟上還款壓力。
                </p>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">3. 綠色金融與 ESG 房貸專案</h3>
                <p>
                  隨著全球對永續發展（ESG）的重視，台灣各大銀行也紛紛推出「綠色房貸」或「永續房貸」專案。如果民眾購買的房屋具備「綠建築標章」（如鑽石級、黃金級、銀級等），或是配備節能減碳設施，銀行通常願意提供手續費減免、較低的貸款利率（可能減碼 0.02% ~ 0.05%），甚至給予較高的貸款成數。這不僅有助於環保，也能實質減輕購屋者的財務負擔。在尋找物件時，不妨將建築物的節能環保標章列入考量條件之一。
                </p>
              </section>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">房貸申請完整流程教學 (新手必看)</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                對於第一次買房的首購族來說，房貸申請流程往往令人感到陌生與焦慮。只要掌握以下四個關鍵步驟，就能從容應對銀行的各項要求，順利取得購屋資金：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-indigo-700 mb-2">步驟一：財務評估與尋找銀行 (簽約後 1-2 週)</h4>
                  <p className="text-sm">
                    在簽訂房屋買賣契約後，應立即開始尋找合適的貸款銀行。建議同時找 2 到 3 家銀行進行初步評估（包含薪轉銀行、建商配合銀行、或常往來的銀行）。此階段銀行會調閱您的「聯徵紀錄」，請注意短期內不要讓太多家銀行密集調閱聯徵（建議不超過 3 家），以免影響信用評分。
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-indigo-700 mb-2">步驟二：房屋鑑價與條件審核 (約 1-2 週)</h4>
                  <p className="text-sm">
                    選定銀行並正式提出申請後，銀行會派員或委託估價公司對房屋進行「鑑價」。銀行的貸款成數是基於「買賣成交價」與「銀行鑑價」兩者取其低來計算。鑑價完成後，銀行的授信部門會綜合評估您的還款能力（財力證明、收支比）與房屋價值，最終核定貸款額度、利率及年限。
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-indigo-700 mb-2">步驟三：簽約對保與開戶 (約半天)</h4>
                  <p className="text-sm">
                    當您同意銀行核發的貸款條件後，需親自前往銀行進行「對保」。對保就是借款人與保證人（若有）親自簽署借款契約的過程。此時銀行會詳細說明貸款合約內容，包含利率計算方式、違約金規定等。同時，您也需要在該銀行開立一個帳戶，作為未來每月自動扣繳房貸的帳戶。
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-indigo-700 mb-2">步驟四：抵押權設定與撥款 (約 3-5 天)</h4>
                  <p className="text-sm">
                    對保完成後，代書（地政士）會拿著相關文件到地政事務所辦理「抵押權設定」，將房屋抵押給貸款銀行。設定完成後，銀行會確認產權無誤，並在買賣雙方約定的交屋日，將貸款金額直接撥入履約保證專戶或賣方帳戶。至此，房貸申請流程正式完成，您也準備迎接新家了！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>本試算結果僅供參考，實際貸款條件與還款金額請以各家銀行核貸結果為準。</p>
          <div className="mt-4 flex justify-center gap-6">
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-indigo-600 transition-colors">隱私權政策</button>
            <button onClick={() => setIsTermsOpen(true)} className="hover:text-indigo-600 transition-colors">服務條款</button>
          </div>
          <p className="mt-4">© 2026 台灣房貸試算神器. All rights reserved.</p>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative shadow-xl">
            <button onClick={() => setIsPrivacyOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">隱私權政策 (Privacy Policy)</h2>
            <div className="space-y-5 text-slate-600 text-sm leading-relaxed">
              <p>本網站（台灣房貸試算神器）非常重視您的隱私權。請閱讀以下有關隱私權保護政策的更多內容。</p>
              
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">1. 資料收集與使用</h3>
                <p>本網站作為一個純前端的計算工具，<strong>不會</strong>主動收集、儲存或傳送您輸入的任何財務數據（如貸款金額、利率、年限等）至我們的伺服器。所有的計算過程皆在您的瀏覽器端（Client-side）完成，確保您的財務隱私絕對安全。</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">2. Cookie 與第三方廣告 (Google AdSense)</h3>
                <p>本網站使用 Google AdSense 服務來提供廣告。Google 及其合作夥伴會使用 Cookie 根據您先前對本網站或其他網站的造訪紀錄來放送廣告。</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Google 使用廣告 Cookie，可讓 Google 及其合作夥伴根據使用者造訪本網站和/或網際網路上其他網站的資料，向使用者放送合適的廣告。</li>
                  <li>使用者可以選擇停用個人化廣告。如要停用，請前往 <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">廣告設定</a>。</li>
                  <li>我們也可能使用分析工具（如 Google Analytics）的 Cookie 來分析網站流量並優化您的使用者體驗。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">3. 外部連結</h3>
                <p>本網站可能包含其他網站的連結。我們對這些外部網站的隱私權做法或內容概不負責。建議您在離開本網站時，閱讀每個收集個人識別資訊網站的隱私權聲明。</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">4. 政策修改</h3>
                <p>我們保留隨時修改本隱私權政策的權利，修改後的條款將直接發布於本網站上。建議您定期查看本頁面以了解任何變更。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative shadow-xl">
            <button onClick={() => setIsTermsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">服務條款 (Terms of Service)</h2>
            <div className="space-y-5 text-slate-600 text-sm leading-relaxed">
              <p>歡迎使用台灣房貸試算神器。使用本網站即表示您同意遵守以下條款：</p>
              
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">1. 僅供參考聲明</h3>
                <p>本網站提供的所有計算結果、圖表與數據<strong>僅供參考與初步評估之用</strong>。實際的貸款額度、利率、寬限期、手續費及每月還款金額，需以各家金融機構最終核貸的結果與正式合約為準。本網站不保證計算結果的絕對精確性，亦不對因依賴本網站資訊而產生的任何財務損失負責。</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">2. 服務可用性</h3>
                <p>我們致力於維持網站的正常運作，但保留隨時修改、暫停或終止本網站部分或全部服務的權利，且不另行通知。對於因網站無法使用而造成的任何不便，我們不承擔任何責任。</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">3. 智慧財產權</h3>
                <p>本網站的介面設計、程式碼、圖表樣式及文字內容等，均受智慧財產權法保護。未經授權，請勿隨意複製、修改或用於商業用途。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KnowledgeCard({ title, content }: { title: string, content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
        )}
      </button>
      <div 
        className={cn(
          "px-6 overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
}
