import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { articles } from './data/articles';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Calculator, AlertCircle, PiggyBank, TrendingUp, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
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

export function CalculatorSection() {
  const [loanAmount, setLoanAmount] = useState<number>(1000); // in 10k
  const [loanTerm, setLoanTerm] = useState<number>(30); // in years
  const [gracePeriod, setGracePeriod] = useState<number>(0); // in years
  const [interestRate, setInterestRate] = useState<number>(2.06); // in %
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('equal_payment');
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Calculator Inputs */}
      <div className="lg:col-span-4 space-y-6">
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
          </div>
        </div>
      </div>

      {/* Right Column: Results & Charts */}
      <div className="lg:col-span-8 space-y-6">
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
  );
}

// --- Pages ---

export function Home() {
  return (
    <div className="space-y-16">
      <section>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">台灣房貸試算神器</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            最專業的房貸試算工具，支援新青安、寬限期、本息攤還與本金攤還。提供詳細的圖表分析與每月還款明細，幫助您輕鬆規劃購屋財務。
          </p>
        </div>
        <CalculatorSection />
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
      <div className="prose prose-slate prose-indigo max-w-none">
        {article.content.split('\\n\\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-bold text-slate-800 mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
          }
          if (paragraph.startsWith('* ')) {
            return <li key={index} className="ml-4 mb-2 text-slate-600">{paragraph.replace('* ', '')}</li>;
          }
          if (paragraph.match(/^[0-9]+\. \*\*/)) {
             // Handle numbered bold lists
             const parts = paragraph.split('**');
             return <p key={index} className="mb-4 text-slate-600"><strong>{parts[1]}</strong>{parts[2]}</p>
          }
          return <p key={index} className="mb-4 text-slate-600 leading-relaxed">{paragraph}</p>;
        })}
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
          歡迎來到「台灣房貸試算神器」，這是一個專為台灣購屋族打造的免費線上工具平台。
        </p>
        <p>
          買房是多數人一生中最大的財務決策，而房貸往往伴隨我們長達 20 到 40 年。我們深知在面對複雜的利率計算、寬限期評估以及本息/本金攤還的選擇時，許多人會感到困惑與無助。因此，我們致力於開發最直覺、最精準的試算工具，幫助您清晰地看見未來的財務藍圖。
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">我們的使命</h3>
        <p>
          我們的使命是「讓房貸資訊透明化，讓購屋決策更安心」。除了提供強大的試算工具外，我們也持續撰寫並更新房貸相關的知識文章與市場趨勢指南，期望能成為您買房路上的最佳指南針。
        </p>
        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">為什麼選擇我們？</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>完全免費：</strong> 我們的所有工具與文章皆免費開放給大眾使用。</li>
          <li><strong>隱私安全：</strong> 我們是一個純前端的應用程式，您的試算數據只會留在您的瀏覽器中，我們不會收集或儲存您的任何財務資訊。</li>
          <li><strong>專業準確：</strong> 我們的計算邏輯嚴格遵循台灣銀行業的標準公式，確保試算結果的參考價值。</li>
        </ul>
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
          <p className="text-indigo-600 font-medium">contact@taiwan-mortgage-calculator.com</p>
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
