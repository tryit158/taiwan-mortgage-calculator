import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  ShieldAlert,
  UserCheck,
  FileText,
  Search,
  Scale,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';

export function NewYouth3VisualDashboard() {
  const [activeTab, setActiveTab] = useState<'reforms' | 'simulator'>('reforms');

  // Simulator states
  const [loanAmount, setLoanAmount] = useState<number>(1000); // in 10k NTD (default 1000 = 1000萬)
  const [yearsCaught, setYearsCaught] = useState<number>(2); // Caught after N years (default 2)

  // Calculations for Simulator
  const calculations = useMemo(() => {
    const L = loanAmount * 10000; // actual loan amount
    const caughtYears = yearsCaught;

    // 1. Normal New Youth (1.775%)
    const normalRate = 1.775 / 100 / 12;
    // Grace period monthly payment
    const normalGracePayment = Math.round(L * normalRate);
    
    // After grace monthly payment (remaining 35 years = 420 months)
    const normalTermMonths = 35 * 12;
    const normalAfterGracePayment = Math.round(
      (L * normalRate * Math.pow(1 + normalRate, normalTermMonths)) /
      (Math.pow(1 + normalRate, normalTermMonths) - 1)
    );

    // 2. Violated Penalized (2.50%, shortened to 20 years = 240 months, no grace)
    const penaltyRate = 2.50 / 100 / 12;
    const penaltyTermMonths = 20 * 12;
    const penaltyPayment = Math.round(
      (L * penaltyRate * Math.pow(1 + penaltyRate, penaltyTermMonths)) /
      (Math.pow(1 + penaltyRate, penaltyTermMonths) - 1)
    );

    // 3. Clawback Subsidy
    // Government subsidy is 0.5% per year
    const yearlySubsidyClawback = Math.round(L * 0.005);
    const totalClawback = yearlySubsidyClawback * caughtYears;

    // Monthly payment skyrocket ratio
    const increasePercent = Math.round(((penaltyPayment - normalGracePayment) / normalGracePayment) * 100);

    return {
      normalGracePayment,
      normalAfterGracePayment,
      penaltyPayment,
      totalClawback,
      increasePercent,
      yearlySubsidyClawback
    };
  }, [loanAmount, yearsCaught]);

  const chartData = [
    {
      name: '寬限期正常月付',
      '月付金額 (元)': calculations.normalGracePayment,
      color: '#10b981'
    },
    {
      name: '正常本息攤還',
      '月付金額 (元)': calculations.normalAfterGracePayment,
      color: '#3b82f6'
    },
    {
      name: '違規追罰月付',
      '月付金額 (元)': calculations.penaltyPayment,
      color: '#ef4444'
    }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-8 my-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> 政策最新快訊
          </span>
          <h3 className="text-xl font-bold text-slate-800">
            新青安 3.0 政策變革與違規處罰圖解
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            政府打擊人頭戶與非法轉租，一生一次、貸後查核新制全攻略
          </p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg self-start md:self-auto">
          <button
            onClick={() => setActiveTab('reforms')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'reforms'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            四大改革圖解
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'simulator'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            違規代價模擬器
          </button>
        </div>
      </div>

      {activeTab === 'reforms' ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Reform Card 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 h-fit">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-sm">重點一</span>
                  <h4 className="font-bold text-slate-800">一生限貸一次</h4>
                </div>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  每位國民<strong>一生僅限使用一次</strong>新青安優惠。即使日後賣屋、全額還清貸款或轉貸，此生皆無法再次申請。
                </p>
              </div>
            </div>

            {/* Reform Card 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 h-fit">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm">重點二</span>
                  <h4 className="font-bold text-slate-800">強制簽署自住切結</h4>
                </div>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  申請時必須強制簽署切結書，保證房屋<strong>確為自辦自住，絕無轉租或作人頭戶</strong>。一旦查獲不實將即刻撤銷補貼。
                </p>
              </div>
            </div>

            {/* Reform Card 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex gap-4">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-600 h-fit">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-sm">重點三</span>
                  <h4 className="font-bold text-slate-800">跨部門大數據追蹤</h4>
                </div>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  銀行與國稅局聯手勾稽<strong>租金補貼申請、房屋稅籍、自來水/用電度數異常</strong>。無人居住或低電量將列為首要查核對象。
                </p>
              </div>
            </div>

            {/* Reform Card 4 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex gap-4">
              <div className="p-3 bg-red-50 rounded-lg text-red-600 h-fit">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded-sm">重點四</span>
                  <h4 className="font-bold text-slate-800">違規即刻重罰</h4>
                </div>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  查獲違規將<strong>終止所有利息補貼</strong>、追繳開辦至今的所有補貼差額、貸款年限強制縮短、取消寬限期。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700 leading-relaxed">
              <strong className="block font-semibold text-blue-800 mb-1">自住客免驚！3.0新制主要針對投機客</strong>
              只要您是真正符合首購、自己居住且無轉租意圖的剛性需求自用族群，3.0新制將為您擠出炒作泡沫，維護更健康的房市環境。您可以放心且合理地使用這項國家級優惠！
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Simulator Panel */}
          <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 mb-6">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> 違規轉租「代價」試算器
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Sliders */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>貸款金額 (新青安上限 1000 萬)</span>
                    <span className="text-indigo-600 font-semibold">{loanAmount} 萬元</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="1000"
                    step="50"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>300 萬</span>
                    <span>650 萬</span>
                    <span>1000 萬</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>第幾年被查獲違規？ (追回利息年數)</span>
                    <span className="text-amber-600 font-semibold">{yearsCaught} 年</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={yearsCaught}
                    onChange={(e) => setYearsCaught(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 年 (第12個月)</span>
                    <span>3 年 (第36個月)</span>
                    <span>5 年 (第60個月)</span>
                  </div>
                </div>
              </div>

              {/* Quick Math Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                  <div className="text-xs font-medium text-rose-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> 立即繳回利息補貼
                  </div>
                  <div className="text-2xl font-bold text-rose-600">
                    NT$ {calculations.totalClawback.toLocaleString()} 元
                  </div>
                  <p className="text-[11px] text-rose-500 mt-1.5 leading-tight">
                    依每年 0.5% 補貼款計算，在第 {yearsCaught} 年查獲時需一次全額返還給國庫。
                  </p>
                </div>

                <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                  <div className="text-xs font-medium text-red-700 mb-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> 月付金暴增幅度
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    +{calculations.increasePercent}% 暴增
                  </div>
                  <p className="text-[11px] text-red-500 mt-1.5 leading-tight">
                    月還款從原本寬限期 ${calculations.normalGracePayment.toLocaleString()} 元，瞬間飆升至罰款後的 ${calculations.penaltyPayment.toLocaleString()} 元。
                  </p>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="mt-6">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
                月還款金額對比 (守法自住 vs 違規罰則)
              </h5>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} width={50} />
                    <Tooltip
                      formatter={(value: any) => [`${value.toLocaleString()} 元`, '月付金額']}
                      contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar dataKey="月付金額 (元)" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Step-by-Step Penalty details */}
            <div className="mt-6 border-t border-slate-100 pt-5 text-sm text-slate-600 space-y-3">
              <div className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                🚨 違規後還款條件重置明細 (100% 依新法規計算)
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>貸款剩餘總年限</span>
                <span className="font-semibold text-red-600">40 年 ➔ 20 年 (腰斬一半)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>剩餘寬限期資格</span>
                <span className="font-semibold text-red-600">5 年 ➔ 0 年 (立即取消本息攤還)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>房貸利率</span>
                <span className="font-semibold text-red-600">1.775% ➔ 2.50% (取消利息補貼)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
