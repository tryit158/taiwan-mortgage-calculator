import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, ChevronRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Answers {
  hasProperty: string; // 'none' | 'one' | 'more'
  age: string; // 'adult' | 'minor'
  budget: string; // 'under1500' | '1500to2500' | 'over2500'
  downPaymentPercent: string; // 'under20' | '20to30' | 'over30'
  isSecondHouse: string; // 'no' | 'yes'
}

export function MortgageEligibilityWizard() {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>({
    hasProperty: '',
    age: '',
    budget: '',
    downPaymentPercent: '',
    isSecondHouse: '',
  });
  const [completed, setCompleted] = useState<boolean>(false);

  const handleSelect = (key: keyof Answers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({
      hasProperty: '',
      age: '',
      budget: '',
      downPaymentPercent: '',
      isSecondHouse: '',
    });
    setCompleted(false);
  };

  // Evaluation logic
  const isYouthEligible = answers.hasProperty === 'none' && answers.age === 'adult';
  const isDownPaymentTight = answers.downPaymentPercent === 'under20';
  const isHighBudget = answers.budget === 'over2500';
  const isSecondHouseRestricted = answers.hasProperty === 'one' || answers.hasProperty === 'more';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">智能檢測工具</span>
              <h2 className="text-xl sm:text-2xl font-bold">2026 首購買房與新青安資格 30秒自我評估</h2>
            </div>
          </div>
          {completed && (
            <button
              onClick={handleReset}
              className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 重新測驗
            </button>
          )}
        </div>
        <p className="text-indigo-100 text-sm mt-3 max-w-2xl">
          依據中央銀行第七波信用管制與財政部最新放款審查標準，回答 4 個簡單問題，立即取得客製化貸款資格報告與避坑指南。
        </p>

        {/* Progress Bar */}
        {!completed && (
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx <= step ? 'bg-amber-400' : 'bg-white/20'
                }`}
              />
            ))}
            <span className="text-xs text-indigo-200 font-medium ml-2">步驟 {step} / 4</span>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        {!completed ? (
          <div className="space-y-6">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                  第 1 題：請問借款人（與其配偶及未成年子女）名下目前是否有自用住宅？
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelect('hasProperty', 'none')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.hasProperty === 'none'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base">全家名下完全無房產</span>
                    <span className="text-xs text-slate-500 mt-1 block">符合正統首購族定義與新青安自用資格</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('hasProperty', 'one')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.hasProperty === 'one'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base">名下已有 1 戶房屋（換屋中或持有）</span>
                    <span className="text-xs text-slate-500 mt-1 block">受央行管制第二戶限貸或需簽署切結書</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                  第 2 題：借款人年齡是否已成年（符合法定民法年齡）？
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelect('age', 'adult')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.age === 'adult'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base">年滿 18 歲（具備完全行為能力）</span>
                    <span className="text-xs text-slate-500 mt-1 block">新青安無年齡上限，成年即可申請</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('age', 'minor')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.age === 'minor'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base">未滿 18 歲（未成年）</span>
                    <span className="text-xs text-slate-500 mt-1 block">無法單獨向銀行申辦購屋貸款</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                  第 3 題：您預計購買的房屋總價預算大約落在？
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelect('budget', 'under1500')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.budget === 'under1500'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base font-medium">1,500 萬以內</span>
                    <span className="text-xs text-slate-500 mt-1 block">新青安 1000 萬可貸滿約 7~8 成</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('budget', '1500to2500')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.budget === '1500to2500'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base font-medium">1,500 萬 ~ 2,500 萬</span>
                    <span className="text-xs text-slate-500 mt-1 block">需搭配「新青安 1000 萬 + 一般房貸」雙軌</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('budget', 'over2500')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.budget === 'over2500'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base font-medium">2,500 萬以上</span>
                    <span className="text-xs text-slate-500 mt-1 block">銀行重視財力證明與自備款現金深度</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                  第 4 題：您目前準備好的自有現金頭期款比例約為多少？
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelect('downPaymentPercent', 'under20')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.downPaymentPercent === 'under20'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base font-medium">未滿 20%（極緊繃）</span>
                    <span className="text-xs text-rose-500 mt-1 block">鑑價若打折易面臨交屋違約風險</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('downPaymentPercent', '20to30')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.downPaymentPercent === '20to30'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base font-medium">20% ~ 30%（標準安全）</span>
                    <span className="text-xs text-emerald-600 mt-1 block">符合常規 8 成房貸與契稅裝潢備援</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('downPaymentPercent', 'over30')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      answers.downPaymentPercent === 'over30'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/30 font-semibold'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-base font-medium">30% 以上（資金充裕）</span>
                    <span className="text-xs text-indigo-600 mt-1 block">核貸容易，可大膽爭取低利率</span>
                  </button>
                </div>
              </div>
            )}

            {/* Next / Submit Button */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                  &larr; 回上一步
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (step === 1 && !answers.hasProperty) ||
                  (step === 2 && !answers.age) ||
                  (step === 3 && !answers.budget) ||
                  (step === 4 && !answers.downPaymentPercent)
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-xs transition-all"
              >
                {step === 4 ? '查看評估報告' : '下一題'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Report Section */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              {isYouthEligible ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
              )}
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {isYouthEligible
                    ? '恭喜！您完全符合「2026 新青安首購優惠房貸」法定申請資格'
                    : isSecondHouseRestricted
                    ? '注意：名下已有房產，將受央行選擇性信用管制嚴格約束'
                    : '評估完成：請依個人條件選擇一般銀行房貸方案'}
                </h4>
                <p className="text-sm text-slate-600 mt-0.5">
                  {isYouthEligible
                    ? '您符合無自用住宅首購標準，享公股行庫優先撥款額度保障，不受銀行法 72-2 限貸排隊卡關影響。'
                    : '受信用管制影響，銀行成數審核嚴格，建議簽約時務必加入「貸款成數不足無條件解約」特約條款。'}
                </p>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase">1. 最高貸款額度與方案</span>
                <p className="text-base font-bold text-slate-800">
                  {isYouthEligible ? '最高 1,000 萬新青安 + 超額一般貸' : '一般商業銀行房貸方案'}
                </p>
                <p className="text-xs text-slate-500">
                  {isYouthEligible
                    ? '新青安上限 1000 萬享補貼優惠利率，若房屋總價高，超出部分可與承貸公股行庫申辦搭配自用一般房貸。'
                    : '目前一般房貸利率地板價約為 2.185%~2.4%，審查重視個人薪資轉帳證明與扣繳憑單。'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase">2. 貸款年限與寬限期</span>
                <p className="text-base font-bold text-slate-800">
                  {isYouthEligible ? '最長 40 年期 / 最高 5 年寬限期' : '常規 30 年期 / 寬限期 0~2 年'}
                </p>
                <p className="text-xs text-slate-500">
                  {isYouthEligible
                    ? '40 年房貸能大幅降低每月負擔，但總利息支出較高。5年寬限期結束後月付金將倍增，需備妥充足現金流。'
                    : '央行管制下，非首購或第二戶通常取消寬限期，月付金採本息攤還直接起算。'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase">3. 銀行法 72-2 撥款風險</span>
                <p className={`text-base font-bold ${isYouthEligible ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isYouthEligible ? '公股行庫專案優先保障' : '部分民營銀行額度緊繃排隊'}
                </p>
                <p className="text-xs text-slate-500">
                  {isYouthEligible
                    ? '金管會要求銀行額度優先保留給無自用住宅純首購與新青安，公股八大行庫排隊時程最穩定。'
                    : '建議同步接洽非銀行法 72-2 限制的農漁會信用部、信用合作社或壽險公司作為備援方案。'}
                </p>
              </div>
            </div>

            {/* Down Payment Warning if applicable */}
            {isDownPaymentTight && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">⚠️ 自備款低於 20% 風險警示</strong>
                  若銀行不動產鑑價低於買賣成交合約價（鑑價打折），銀行僅會以「鑑價金額」核撥 8 成，差額必須由買方以現金補足。建議簽約前要求仲介在買賣契約特別加註「非可歸責買方銀行核貸不足成數無條件解約」。
                </div>
              </div>
            )}

            {/* Recommended Action Guides */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                本評估結果依據中華民國財政部與央行最新授信準則產出，實際核貸仍以銀行審核為準。
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/blog/bank-lending-cap-article-72-2-mortgage-quota-guide"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline"
                >
                  閱讀：銀行72-2滿水位排隊防違約攻略 &rarr;
                </Link>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  重新檢測
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
