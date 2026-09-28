import React, { useState, useMemo } from 'react';
import { Calculator, ShieldAlert, CheckCircle2, Home, TrendingUp, HelpCircle, DollarSign, Wallet, Compass } from 'lucide-react';
import { FeedbackRatingWidget } from './FeedbackRatingWidget';

export function AffordabilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(90000); // NTD
  const [existingDebt, setExistingDebt] = useState<number>(5000); // NTD
  const [savingsCash, setSavingsCash] = useState<number>(2500000); // NTD (自備款)
  const [loanTerm, setLoanTerm] = useState<number>(30); // years
  const [interestRate, setInterestRate] = useState<number>(2.185); // %
  const [dtiRatio, setDtiRatio] = useState<number>(35); // 建議收支比上限 %
  const [emergencyFund, setEmergencyFund] = useState<number>(500000); // 預留緊急備用金與裝潢雜支

  const results = useMemo(() => {
    // 扣除現有債務後的可用房貸上限月付金
    const maxMonthlyBudget = (monthlyIncome * (dtiRatio / 100)) - existingDebt;
    const safeMonthlyBudget = Math.max(0, maxMonthlyBudget);

    // 根據年金現值公式逆推可貸金額: PV = PMT * (1 - (1+r)^-n) / r
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    let maxLoanAmount = 0;
    if (r > 0 && n > 0 && safeMonthlyBudget > 0) {
      maxLoanAmount = safeMonthlyBudget * ((1 - Math.pow(1 + r, -n)) / r);
    }

    // 可動用自備款 = 總存款 - 預留緊急金與稅費
    const usableDownPayment = Math.max(0, savingsCash - emergencyFund);

    // 房貸成數上限通常為 8 成 (貸款 80%, 自備款 20%)
    // 由自備款推算最高總價: usableDownPayment / 0.2
    const priceCapByDownPayment = usableDownPayment / 0.2;

    // 由房貸月付能力推算最高總價: maxLoanAmount / 0.8
    const priceCapByIncome = maxLoanAmount / 0.8;

    // 實際可買最高總價 (取兩者瓶頸限制)
    const affordableHomePrice = Math.min(priceCapByDownPayment, priceCapByIncome);

    // 試算瓶頸分析
    const bottleneck = priceCapByDownPayment < priceCapByIncome ? 'down_payment' : 'monthly_income';

    // 預估真實月付金
    const actualLoan = affordableHomePrice * 0.8;
    const actualMonthlyPayment = actualLoan > 0
      ? (actualLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : 0;

    // 契稅與雜項規費估算 (約總價 2%)
    const estimatedFees = affordableHomePrice * 0.02;

    return {
      safeMonthlyBudget: Math.round(safeMonthlyBudget),
      maxLoanAmount: Math.round(maxLoanAmount),
      usableDownPayment: Math.round(usableDownPayment),
      affordableHomePrice: Math.round(affordableHomePrice),
      actualLoan: Math.round(actualLoan),
      actualMonthlyPayment: Math.round(actualMonthlyPayment),
      bottleneck,
      estimatedFees: Math.round(estimatedFees),
      actualDti: monthlyIncome > 0 ? (((actualMonthlyPayment + existingDebt) / monthlyIncome) * 100).toFixed(1) : '0',
    };
  }, [monthlyIncome, existingDebt, savingsCash, loanTerm, interestRate, dtiRatio, emergencyFund]);

  const formatNTD = (val: number) => {
    if (val >= 100000000) {
      return `${(val / 100000000).toFixed(2)} 億元`;
    }
    if (val >= 10000) {
      return `${(val / 10000).toFixed(0)} 萬元`;
    }
    return `${val.toLocaleString()} 元`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          2026 首購財務規劃必備
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          購屋負擔能力與自備款推算器
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          以央行最新房貸授信標準與 DTI 收支比準則，根據您的「月收入」、「存款自備款」與「現有債務」，一鍵逆推您能買多少錢的房子。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <Wallet className="w-5 h-5 text-indigo-600" />
            財務能力參數輸入
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              家庭每月淨收入 (元)
            </label>
            <div className="relative">
              <input
                type="number"
                step="5000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full text-sm font-semibold pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">NTD</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">包含本薪、固定津貼，夫妻合併購屋可填寫雙薪合計。</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              目前每月其他債務支出 (元)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1000"
                value={existingDebt}
                onChange={(e) => setExistingDebt(Number(e.target.value))}
                className="w-full text-sm font-semibold pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">NTD</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">包含信用貸款、車貸、學貸或信用卡分期付款。</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              現有流動總資產 / 存款儲蓄 (元)
            </label>
            <div className="relative">
              <input
                type="number"
                step="50000"
                value={savingsCash}
                onChange={(e) => setSavingsCash(Number(e.target.value))}
                className="w-full text-sm font-semibold pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">NTD</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              預留緊急備用金與稅費裝潢 (元)
            </label>
            <div className="relative">
              <input
                type="number"
                step="50000"
                value={emergencyFund}
                onChange={(e) => setEmergencyFund(Number(e.target.value))}
                className="w-full text-sm font-semibold pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">NTD</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">強烈建議保留 6 個月生活費及契稅、代書費預備金，不可全數投入頭期款。</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                預估貸款年限
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600"
              >
                <option value={20}>20 年期</option>
                <option value={30}>30 年期 (主流)</option>
                <option value={40}>40 年期 (新青安)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                預估房貸利率 (%)
              </label>
              <input
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">
                房貸收支比 (DTI) 上限警示線: {dtiRatio}%
              </label>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                dtiRatio <= 33 ? 'bg-emerald-100 text-emerald-800' :
                dtiRatio <= 40 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {dtiRatio <= 33 ? '安全充裕' : dtiRatio <= 40 ? '主流標準' : '緊繃偏高'}
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="55"
              step="5"
              value={dtiRatio}
              onChange={(e) => setDtiRatio(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Price Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  綜合試算結論
                </span>
                <span className="text-xs text-indigo-200">
                  實質收支比: <strong className="text-amber-300 font-bold">{results.actualDti}%</strong>
                </span>
              </div>

              <div>
                <p className="text-xs text-indigo-200 mb-1">建議購屋最高總價 (安全範圍)</p>
                <div className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight">
                  {formatNTD(results.affordableHomePrice)}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-indigo-700/60 text-xs">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
                  <span className="text-indigo-200 block text-[11px]">可貸金額 (8成)</span>
                  <strong className="text-base text-white font-bold">{formatNTD(results.actualLoan)}</strong>
                </div>
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
                  <span className="text-indigo-200 block text-[11px]">所需自備款 (2成)</span>
                  <strong className="text-base text-white font-bold">{formatNTD(results.affordableHomePrice * 0.2)}</strong>
                </div>
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs col-span-2 sm:col-span-1">
                  <span className="text-indigo-200 block text-[11px]">每月房貸還款</span>
                  <strong className="text-base text-emerald-300 font-bold">${results.actualMonthlyPayment.toLocaleString()} 元</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bottleneck Diagnostic Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              關鍵財務瓶頸分析與突破策略
            </h3>

            {results.bottleneck === 'down_payment' ? (
              <div className="text-xs text-slate-600 leading-relaxed space-y-2 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                <p className="font-bold text-amber-900 text-sm">
                  ⚠️ 目前限制您購屋總價的最大瓶頸是：「自備款不足」
                </p>
                <p>
                  以您每月的收入現金流（月入 {monthlyIncome.toLocaleString()} 元），原本有能力負擔更高總價的月繳房貸；但因為手頭扣除預留金後的可用自備款僅有 <strong>{formatNTD(results.usableDownPayment)}</strong>，無法跨過銀行 2 成自備款的硬門檻。
                </p>
                <div className="font-semibold text-slate-800 pt-1">
                  💡 專家建議解方：
                  <ul className="list-disc pl-5 mt-1 space-y-1 font-normal">
                    <li>善用父母每年 244 萬元免稅贈與額度贊助自備款。</li>
                    <li>稍微減少裝潢預備金，選擇附裝潢或屋況良好的物件。</li>
                    <li>鎖定外圍重劃區預售屋，運用 2~3 年施工期分期繳納工程款。</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-600 leading-relaxed space-y-2 bg-indigo-50/60 p-4 rounded-xl border border-indigo-200/60">
                <p className="font-bold text-indigo-900 text-sm">
                  ℹ️ 目前限制您購屋總價的最大瓶頸是：「每月收入負債比」
                </p>
                <p>
                  您的儲蓄自備款非常充裕，但因為每月房貸月付金加上既有債務，受限於 {dtiRatio}% 的安全收支比線，若買更高總價的房屋，月付金將會擠壓到生活水準與儲蓄防禦力。
                </p>
                <div className="font-semibold text-slate-800 pt-1">
                  💡 專家建議解方：
                  <ul className="list-disc pl-5 mt-1 space-y-1 font-normal">
                    <li>優先提前還清每月 {existingDebt.toLocaleString()} 元的信用貸款或車貸，立即釋放月付額度。</li>
                    <li>若符合年齡資格，爭取 40 年房貸將月繳本金攤薄。</li>
                    <li>由雙薪配偶共同簽署作為房貸保證人或共同借款人。</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Regional Housing Guidance */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              以目前總價 {formatNTD(results.affordableHomePrice)}，在台灣六都市場落點評估
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-bold mb-1">雙北都會區</strong>
                {results.affordableHomePrice >= 18000000 ? (
                  <span>可評估新北第一環（板橋、中永和、三重）標準 2~3 房電梯大樓，或台北市文山、北投成熟中古華廈。</span>
                ) : results.affordableHomePrice >= 12000000 ? (
                  <span>可鎖定新北第二環（新莊、泰山、土城、樹林）2 房，或淡水、鶯歌高指名度優質 3 房大樓。</span>
                ) : (
                  <span>建議鎖定淡海新市鎮、八里、鶯歌或基隆市區中古電梯大樓與公寓產品。</span>
                )}
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-bold mb-1">桃園、新竹與中南部</strong>
                {results.affordableHomePrice >= 15000000 ? (
                  <span>在新竹竹北外圍、台中市西屯、北屯機捷特區、高雄左營高鐵特區皆有相當充裕的全新 2~3 房選擇。</span>
                ) : results.affordableHomePrice >= 10000000 ? (
                  <span>可選桃園中路、青埔外圍、台中太平、烏日高鐵、台南永康、高雄楠梓科技園區周邊 2 房含車位。</span>
                ) : (
                  <span>適合中南部蛋白區屋齡 15 年以內優質華廈或市區標準 2 房中古產品。</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedbackRatingWidget
        pageId="affordability-calculator"
        pageTitle="購屋負擔能力與自備款推算器"
      />
    </div>
  );
}
