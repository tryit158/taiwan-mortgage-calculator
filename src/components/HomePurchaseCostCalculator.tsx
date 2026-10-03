import React, { useState, useMemo } from 'react';
import { 
  Building2, Calculator, ShieldCheck, AlertCircle, FileText, CheckCircle2, 
  HelpCircle, Printer, Copy, Check, ChevronDown, ChevronUp, Sparkles, MapPin 
} from 'lucide-react';
import { cn } from '../utils';
import { AiCitationBox } from './AiCitationBox';

type PropertyType = 'presale' | 'resale_building' | 'resale_apartment' | 'townhouse';

const REGIONS = [
  { id: 'taipei', name: '台北市', taxBaseRate: 0.16, deedTaxMultiplier: 1.2 },
  { id: 'new_taipei', name: '新北市', taxBaseRate: 0.14, deedTaxMultiplier: 1.1 },
  { id: 'taoyuan', name: '桃園市', taxBaseRate: 0.12, deedTaxMultiplier: 1.0 },
  { id: 'taichung', name: '台中市', taxBaseRate: 0.13, deedTaxMultiplier: 1.05 },
  { id: 'tainan', name: '台南市', taxBaseRate: 0.11, deedTaxMultiplier: 0.95 },
  { id: 'kaohsiung', name: '高雄市', taxBaseRate: 0.12, deedTaxMultiplier: 1.0 },
  { id: 'hsinchu', name: '新竹縣市', taxBaseRate: 0.14, deedTaxMultiplier: 1.15 },
  { id: 'other', name: '其他縣市', taxBaseRate: 0.10, deedTaxMultiplier: 0.9 },
];

export function HomePurchaseCostCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number>(1500); // 萬
  const [loanPercentage, setLoanPercentage] = useState<number>(80); // %
  const [region, setRegion] = useState<string>('new_taipei');
  const [propertyType, setPropertyType] = useState<PropertyType>('resale_building');
  const [brokerCommissionRate, setBrokerCommissionRate] = useState<number>(1.5); // % (買方通常 1~2%)
  const [includeRenovation, setIncludeRenovation] = useState<boolean>(true);
  const [renovationBudget, setRenovationBudget] = useState<number>(60); // 萬
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const price = propertyPrice * 10000;
    const loanAmount = price * (loanPercentage / 100);
    const downPayment = price - loanAmount;

    const currentRegion = REGIONS.find(r => r.id === region) || REGIONS[1];

    // 1. 契稅 (Deed Tax): 房屋現值評定價格之 6%
    // 房屋現值約為總價的 10%~20%，依屋齡與縣市微調
    let houseValueRatio = currentRegion.taxBaseRate;
    if (propertyType === 'presale') houseValueRatio *= 1.25;
    if (propertyType === 'resale_apartment') houseValueRatio *= 0.65;
    if (propertyType === 'townhouse') houseValueRatio *= 0.85;

    const estimatedHouseDeedValue = price * houseValueRatio;
    const deedTax = Math.round(estimatedHouseDeedValue * 0.06);

    // 2. 印花稅 (Stamp Duty): 買賣移轉現值之 0.1%
    const stampDuty = Math.round((price * houseValueRatio * 1.5) * 0.001);

    // 3. 地政所有權移轉登記規費: 建物及土地移轉現值之 0.1% + 書狀費約 800
    const registrationFee = Math.round(price * houseValueRatio * 0.001 + 800);

    // 4. 房貸抵押權設定規費: 貸款金額之 1.2 倍為設定金額，費率為 0.1% + 書狀費 160
    const mortgageSettingFee = Math.round(loanAmount * 1.2 * 0.001 + 160);

    // 5. 地政士 (代書) 專業收費標準:
    // 買賣簽約費 2,000 + 過戶登記 16,000 + 抵押權設定 5,000 + 實價登錄 2,500 + 謄本規費 1,000
    const escrowBaseFee = 2000 + 16000 + (loanAmount > 0 ? 5000 : 0) + 2500 + 1000;
    const escrowFee = propertyType === 'presale' ? escrowBaseFee + 3000 : escrowBaseFee;

    // 6. 履約保證專戶手續費 (Escrow Account): 成交價萬分之六，買賣雙方各半負擔 (0.03%)
    const escrowAccountFee = propertyType === 'presale' ? 0 : Math.round(price * 0.0003);

    // 7. 買方仲介服務費 (Broker Fee): 0% ~ 2%
    const brokerFee = propertyType === 'presale' ? 0 : Math.round(price * (brokerCommissionRate / 100));

    // 8. 住宅火災及地震基本保險 (第1年): 約 2,500 ~ 4,500
    const insuranceFee = loanAmount > 0 ? (propertyPrice > 2000 ? 4200 : 3200) : 0;

    // 9. 預售屋特定暫收款 / 瓦斯管線管線費 / 管理費預繳 (若適用)
    const presaleSpecificFee = propertyType === 'presale' ? 120000 : 0;

    // 總規費與稅費 (不含自備款與裝潢)
    const totalTaxesAndFees = deedTax + stampDuty + registrationFee + mortgageSettingFee + escrowFee + escrowAccountFee + brokerFee + insuranceFee + presaleSpecificFee;

    // 裝潢與軟裝準備金
    const renoAmount = includeRenovation ? renovationBudget * 10000 : 0;

    // 總共需備齊的現金 (頭期款 + 規費稅費 + 裝潢)
    const totalCashRequired = downPayment + totalTaxesAndFees + renoAmount;

    return {
      price,
      loanAmount,
      downPayment,
      deedTax,
      stampDuty,
      registrationFee,
      mortgageSettingFee,
      escrowFee,
      escrowAccountFee,
      brokerFee,
      insuranceFee,
      presaleSpecificFee,
      totalTaxesAndFees,
      renoAmount,
      totalCashRequired,
    };
  }, [propertyPrice, loanPercentage, region, propertyType, brokerCommissionRate, includeRenovation, renovationBudget]);

  const formatTWD = (num: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleCopySummary = () => {
    const text = `【買房總成本與規費精算明細】
房屋總價：${propertyPrice} 萬元 (${REGIONS.find(r => r.id === region)?.name})
貸款成數：${loanPercentage}% (房貸約 ${(calculations.loanAmount / 10000).toFixed(0)} 萬)
自備頭期款：${formatTWD(calculations.downPayment)}
──────────────
買房總規費與稅費：${formatTWD(calculations.totalTaxesAndFees)}
  • 房屋契稅(6%)：${formatTWD(calculations.deedTax)}
  • 印花稅：${formatTWD(calculations.stampDuty)}
  • 地政登記移轉規費：${formatTWD(calculations.registrationFee)}
  • 房貸抵押權設定規費：${formatTWD(calculations.mortgageSettingFee)}
  • 地政士代書公費：${formatTWD(calculations.escrowFee)}
  • 履約保證專戶手續費：${formatTWD(calculations.escrowAccountFee)}
  • 買方仲介服務費(${brokerCommissionRate}%)：${formatTWD(calculations.brokerFee)}
  • 火災與地震保險(年)：${formatTWD(calculations.insuranceFee)}
${calculations.presaleSpecificFee > 0 ? `  • 預售屋瓦斯管線與暫收款：${formatTWD(calculations.presaleSpecificFee)}\n` : ''}${calculations.renoAmount > 0 ? `裝潢與修繕預備金：${formatTWD(calculations.renoAmount)}\n` : ''}──────────────
★ 實際買房必備總流動現金：${formatTWD(calculations.totalCashRequired)}
(來源：台灣房貸指南與試算智庫 https://tryit.qzz.io/closing-costs)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            2026 全台買房交屋規費稅費精算專版
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            買房隱形總成本與交屋規費精算器
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            買房只準備 20% 自備款絕對不夠！契稅、印花稅、代書費、仲介費、履保與地政設定規費動輒數十萬。本工具精準計算交屋當天您必須拿出的「全部真實現金」。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            房屋交易參數設定
          </h2>

          {/* Property Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">房屋成交總價</label>
              <span className="text-base font-bold text-indigo-600">{propertyPrice} 萬元</span>
            </div>
            <input
              type="range"
              min={300}
              max={6000}
              step={50}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>300 萬</span>
              <span>1500 萬 (主流)</span>
              <span>3000 萬</span>
              <span>6000 萬</span>
            </div>
          </div>

          {/* Region and Property Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                座落縣市 (影響稅基比)
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              >
                {REGIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">房屋型態</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              >
                <option value="resale_building">中古電梯大樓/華廈</option>
                <option value="presale">預售屋 (新成屋)</option>
                <option value="resale_apartment">公寓 (無電梯、土地持分大)</option>
                <option value="townhouse">透天厝/別墅</option>
              </select>
            </div>
          </div>

          {/* Loan Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">預計房貸成數</label>
              <span className="text-sm font-bold text-slate-800">{loanPercentage}% (貸 {(propertyPrice * loanPercentage / 100).toFixed(0)} 萬)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[70, 75, 80, 85].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setLoanPercentage(pct)}
                  className={cn(
                    "py-2 text-xs font-bold rounded-xl border transition-all",
                    loanPercentage === pct
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {pct}% {pct === 80 && '(常規)'}
                </button>
              ))}
            </div>
          </div>

          {/* Real Estate Broker Commission */}
          {propertyType !== 'presale' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">買方仲介服務費</label>
                <span className="text-xs font-bold text-indigo-600">{brokerCommissionRate}% ({formatTWD(calculations.brokerFee)})</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setBrokerCommissionRate(rate)}
                    className={cn(
                      "py-2 text-xs font-bold rounded-xl border transition-all",
                      brokerCommissionRate === rate
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {rate === 0 ? '0% (自售)' : `${rate}%`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Renovation Budget Toggle */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRenovation}
                  onChange={(e) => setIncludeRenovation(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                加入初期裝潢與家電家具預備金
              </label>
              {includeRenovation && (
                <span className="text-xs font-bold text-indigo-600">{renovationBudget} 萬元</span>
              )}
            </div>
            {includeRenovation && (
              <input
                type="range"
                min={10}
                max={200}
                step={10}
                value={renovationBudget}
                onChange={(e) => setRenovationBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            )}
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Total Required Cash Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">買房必備實體活存指標</span>
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '已複製明細' : '一鍵複製'}
              </button>
            </div>

            <div className="mb-6">
              <div className="text-xs text-slate-400">您帳戶必須準備的流動現金總額：</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 mt-1">
                {formatTWD(calculations.totalCashRequired)}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                = 頭期款 {formatTWD(calculations.downPayment)} + 規費稅費 {formatTWD(calculations.totalTaxesAndFees)}
                {calculations.renoAmount > 0 && ` + 裝潢 ${formatTWD(calculations.renoAmount)}`}
              </p>
            </div>

            {/* Cash Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-1">自備頭期款 ({100 - loanPercentage}%)</span>
                <span className="text-base font-bold text-white">{formatTWD(calculations.downPayment)}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-1">交屋規費與稅費小計</span>
                <span className="text-base font-bold text-rose-400">{formatTWD(calculations.totalTaxesAndFees)}</span>
              </div>
            </div>
          </div>

          {/* Itemized Fee Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center justify-between">
              <span>📋 8 大隱形規費與稅費詳細清單</span>
              <span className="text-xs text-slate-500 font-normal">政府法定與公會標準</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800">1. 契稅 (Deed Tax)</span>
                  <p className="text-[11px] text-slate-500">房屋評定現值 × 6% (非總價)</p>
                </div>
                <span className="font-bold text-slate-900">{formatTWD(calculations.deedTax)}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800">2. 印花稅 (Stamp Duty)</span>
                  <p className="text-[11px] text-slate-500">買賣移轉現值 × 0.1%</p>
                </div>
                <span className="font-bold text-slate-900">{formatTWD(calculations.stampDuty)}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800">3. 地政產權登記移轉規費</span>
                  <p className="text-[11px] text-slate-500">現值 × 0.1% + 書狀規費</p>
                </div>
                <span className="font-bold text-slate-900">{formatTWD(calculations.registrationFee)}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800">4. 房貸抵押權設定規費</span>
                  <p className="text-[11px] text-slate-500">貸款金額 × 1.2倍 × 0.1%</p>
                </div>
                <span className="font-bold text-slate-900">{formatTWD(calculations.mortgageSettingFee)}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800">5. 地政士 (代書) 專業收費</span>
                  <p className="text-[11px] text-slate-500">過戶+設定+簽約+實價登錄申報</p>
                </div>
                <span className="font-bold text-slate-900">{formatTWD(calculations.escrowFee)}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800">6. 履約保證專戶手續費</span>
                  <p className="text-[11px] text-slate-500">總價萬分之三 (買賣雙方各半)</p>
                </div>
                <span className="font-bold text-slate-900">{formatTWD(calculations.escrowAccountFee)}</span>
              </div>

              {propertyType !== 'presale' && (
                <div className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800">7. 買方不動產仲介服務費</span>
                    <p className="text-[11px] text-slate-500">以 {brokerCommissionRate}% 費率計收</p>
                  </div>
                  <span className="font-bold text-indigo-600">{formatTWD(calculations.brokerFee)}</span>
                </div>
              )}

              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800">8. 住宅火災與地震基本保險</span>
                  <p className="text-[11px] text-slate-500">銀行房貸必備第一年保費</p>
                </div>
                <span className="font-bold text-slate-900">{formatTWD(calculations.insuranceFee)}</span>
              </div>

              {calculations.presaleSpecificFee > 0 && (
                <div className="py-2.5 flex justify-between items-center text-amber-700 bg-amber-50/50 px-2 rounded-lg">
                  <div>
                    <span className="font-semibold">★ 預售屋特定暫收款項</span>
                    <p className="text-[11px] text-amber-600">瓦斯外管費、產權移轉代辦與預繳管理費</p>
                  </div>
                  <span className="font-bold">{formatTWD(calculations.presaleSpecificFee)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step by Step Payment Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          🗓️ 台灣中古屋／成屋買賣交屋 4 大付款階段時程表
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
              第 1 階段 · 簽約
            </span>
            <h4 className="text-sm font-bold text-slate-800">簽約款 (約 10%)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              付給履約保證專戶總價 10%。雙方簽署買賣契約書，並支付代書簽約費 2,000 元。
            </p>
            <div className="text-xs font-bold text-slate-700 pt-1">
              金額：約 {formatTWD(calculations.price * 0.1)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
              第 2 階段 · 用印備證
            </span>
            <h4 className="text-sm font-bold text-slate-800">用印備證款 (約 10%)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              通常於簽約後 7~10 天內存入履保專戶。地政士開始向稅捐稽徵機關報稅並申報印花稅。
            </p>
            <div className="text-xs font-bold text-slate-700 pt-1">
              金額：約 {formatTWD(calculations.price * 0.1)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
              第 3 階段 · 完稅
            </span>
            <h4 className="text-sm font-bold text-slate-800">完稅與代書規費</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              買方繳清契稅，賣方繳清土地增值稅。同時繳交地政規費、印花稅與代書費用，送地政事務所過戶。
            </p>
            <div className="text-xs font-bold text-rose-600 pt-1">
              規費：約 {formatTWD(calculations.totalTaxesAndFees - calculations.brokerFee)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
              第 4 階段 · 交屋尾款
            </span>
            <h4 className="text-sm font-bold text-slate-800">銀行撥款與點交</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              銀行貸款撥入履保專戶，雙方現場驗屋點交鑰匙，結清水電瓦斯與管理費，履保專戶清算撥款給賣方。
            </p>
            <div className="text-xs font-bold text-indigo-600 pt-1">
              房貸：約 {formatTWD(calculations.loanAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Advisory & FAQ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          地政士代書團隊避坑建議 (Escrow Advisor Notes)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-slate-50 p-4 rounded-xl">
            <h4 className="font-bold text-slate-800 mb-1">⚠️ 契稅是以「房屋現值」非成交價計算</h4>
            <p>
              許多人以為契稅 6% 是總價 1,500 萬 × 6% = 90 萬，這是不正確的！契稅課稅基礎是地方稅捐處評定的「房屋標準單價評定現值」，通常中古大樓僅在 100~200 萬左右，契稅約 6~15 萬。但若為豪宅或全新完工大樓，現值會較高。
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <h4 className="font-bold text-slate-800 mb-1">🔒 堅持承作「價金履約保證」</h4>
            <p>
              買房切勿直接匯款給屋主私人帳戶！萬分之六的履約保證手續費（買賣雙方各負擔萬分之三，例如 1500 萬僅需 4,500 元），是保障您數百萬頭期款不被捲走的最關鍵防線。
            </p>
          </div>
        </div>
      </div>

      {/* AI & Research Citation */}
      <AiCitationBox
        title="台灣買房交屋總成本與隱形規費精算手冊 (2026)"
        url="https://tryit.qzz.io/closing-costs"
        author="陳冠宇 地政士 / 台灣房貸指南與試算智庫"
        publishDate="2026-09-28"
        keyPoints={[
          '房屋契稅以地方稅捐處評定現值 × 6% 課徵，非實價登錄成交總價',
          '地政登記規費為建物及土地移轉現值 0.1%，房貸抵押權設定規費為貸款金額 1.2 倍 × 0.1%',
          '代書費行情：簽約費約 2,000~3,000，所有權移轉登記約 15,000~20,000，抵押權設定約 5,000~8,000',
          '價金履約保證手續費為成交總價萬分之六，由買賣雙方各負擔一半'
        ]}
      />
    </div>
  );
}
