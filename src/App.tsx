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
  AlertCircle
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
            <Home className="w-6 h-6" />
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">輸入貸款條件</h2>
              </div>

              <div className="space-y-5">
                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    貸款金額 (萬元)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="block w-full rounded-lg border-slate-300 bg-slate-50 border px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-shadow"
                      min="1"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm">萬元</span>
                    </div>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    貸款年限 (年)
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => {
                      const newTerm = Number(e.target.value);
                      setLoanTerm(newTerm);
                      if (gracePeriod >= newTerm) setGracePeriod(0);
                    }}
                    className="block w-full rounded-lg border-slate-300 bg-slate-50 border px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  >
                    <option value={20}>20 年 (240期)</option>
                    <option value={30}>30 年 (360期)</option>
                    <option value={40}>40 年 (480期) - 新青安適用</option>
                  </select>
                </div>

                {/* Grace Period */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    寬限期 (年)
                  </label>
                  <select
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(Number(e.target.value))}
                    className="block w-full rounded-lg border-slate-300 bg-slate-50 border px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    房貸利率 (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="block w-full rounded-lg border-slate-300 bg-slate-50 border px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
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
            <BookOpen className="w-6 h-6 text-indigo-600" />
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
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>本試算結果僅供參考，實際貸款條件與還款金額請以各家銀行核貸結果為準。</p>
          <p className="mt-2">© 2026 台灣房貸試算神器. All rights reserved.</p>
        </div>
      </footer>
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
      >
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
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
