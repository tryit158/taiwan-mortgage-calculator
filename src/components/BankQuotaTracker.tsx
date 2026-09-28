import React, { useState } from 'react';
import { Landmark, Clock, AlertTriangle, CheckCircle2, Search, Filter, ShieldCheck, Flame } from 'lucide-react';
import { FeedbackRatingWidget } from './FeedbackRatingWidget';

interface BankStatus {
  name: string;
  type: 'public' | 'private';
  quotaStatus: 'normal' | 'queue' | 'strict' | 'paused';
  statusText: string;
  waitDays: string;
  minRate: string;
  requirements: string[];
  lastUpdate: string;
}

export function BankQuotaTracker() {
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [searchBank, setSearchBank] = useState('');

  const banks: BankStatus[] = [
    {
      name: '臺灣銀行 (Bank of Taiwan)',
      type: 'public',
      quotaStatus: 'queue',
      statusText: '額度緊縮·限額排隊',
      waitDays: '45 ~ 60 天',
      minRate: '2.185% (新青安 1.775%)',
      requirements: ['優先受理新青安與名下無自用住宅首購', '收支比(DTI)要求高於 60% 需加保證人', '暫緩受理第二戶換屋房貸'],
      lastUpdate: '2026-09-26',
    },
    {
      name: '土地銀行 (Land Bank of Taiwan)',
      type: 'public',
      quotaStatus: 'queue',
      statusText: '專案排隊中',
      waitDays: '40 ~ 50 天',
      minRate: '2.185% (新青安 1.775%)',
      requirements: ['不動產專業專業銀行，新青安額度相對充裕', '嚴格檢視自住切結書與無出租證明', '撥款需配合總行分批放款排程'],
      lastUpdate: '2026-09-26',
    },
    {
      name: '合作金庫 (Taiwan Cooperative Bank)',
      type: 'public',
      quotaStatus: 'strict',
      statusText: '審核從嚴·控管成數',
      waitDays: '60 ~ 75 天',
      minRate: '2.25%',
      requirements: ['老客戶與薪轉戶優先進件', '一般首購成數上限 7.5~8 成', '非首購暫緩受理'],
      lastUpdate: '2026-09-26',
    },
    {
      name: '兆豐國際商銀 (Mega Bank)',
      type: 'public',
      quotaStatus: 'queue',
      statusText: '限額批覆撥款',
      waitDays: '45 ~ 60 天',
      minRate: '2.20%',
      requirements: ['優先承作優質企業員工與百大企業', '加強擔保品鑑價折算率', '對保後撥款須等待分行額度批次釋出'],
      lastUpdate: '2026-09-25',
    },
    {
      name: '第一銀行 (First Bank)',
      type: 'public',
      quotaStatus: 'strict',
      statusText: '高資產/首購優先',
      waitDays: '60 天以上',
      minRate: '2.22%',
      requirements: ['搭配理財型房貸或存款往來者優先審核', '套房（15坪以下）暫不受理', '寬限期最長 1~2 年'],
      lastUpdate: '2026-09-24',
    },
    {
      name: '華南銀行 (Hua Nan Bank)',
      type: 'public',
      quotaStatus: 'queue',
      statusText: '分期配額受理',
      waitDays: '45 ~ 60 天',
      minRate: '2.20%',
      requirements: ['落實實價登錄與內部鑑價取其低', '新青安與公教築巢優利貸優先', '暫停一般純增貸業務'],
      lastUpdate: '2026-09-24',
    },
    {
      name: '台北富邦銀行 (Taipei Fubon Bank)',
      type: 'private',
      quotaStatus: 'normal',
      statusText: '額度穩定·正常進件',
      waitDays: '20 ~ 30 天',
      minRate: '2.25%',
      requirements: ['針對首購及高信用評分客戶審核快速', '數位帳戶與線上申貸享手續費折扣', '第二戶受央行限貸 5 成管制'],
      lastUpdate: '2026-09-26',
    },
    {
      name: '國泰世華銀行 (Cathay United Bank)',
      type: 'private',
      quotaStatus: 'normal',
      statusText: '正常受理撥款',
      waitDays: '25 ~ 35 天',
      minRate: '2.28%',
      requirements: ['優質住宅大樓鑑價成數佳', '歡迎轉貸與優質客戶專案評估', '需檢附完整所得扣繳憑單'],
      lastUpdate: '2026-09-25',
    },
    {
      name: '中國信託 (CTBC Bank)',
      type: 'private',
      quotaStatus: 'normal',
      statusText: '常態審查受理',
      waitDays: '20 ~ 30 天',
      minRate: '2.29%',
      requirements: ['服務效率高，適合急需取得核貸證明者', '可搭配壽險房貸享更優惠利率', '成數依聯徵評分與擔保品彈性核定'],
      lastUpdate: '2026-09-26',
    },
    {
      name: '玉山銀行 (E.SUN Bank)',
      type: 'private',
      quotaStatus: 'queue',
      statusText: '優質客戶優先',
      waitDays: '35 ~ 45 天',
      minRate: '2.26%',
      requirements: ['醫護、師字輩與公教人員綠色通道', '需有往來薪轉或信用卡良好紀錄', '小套房依地段個案審查'],
      lastUpdate: '2026-09-25',
    },
    {
      name: '永豐銀行 (Bank SinoPac)',
      type: 'private',
      quotaStatus: 'normal',
      statusText: '彈性受理·成數高',
      waitDays: '25 ~ 35 天',
      minRate: '2.27%',
      requirements: ['對首購族友善，支援 8~8.5 成專案', '針對綠建築與節能住宅提供利率折減', '手續費透明'],
      lastUpdate: '2026-09-24',
    },
    {
      name: '台新銀行 (Taishin Bank)',
      type: 'private',
      quotaStatus: 'normal',
      statusText: '正常受理撥款',
      waitDays: '25 ~ 30 天',
      minRate: '2.28%',
      requirements: ['Richart 數位用戶享專案優惠', '歡迎薪轉往來企業員工申貸', '審核速度明快'],
      lastUpdate: '2026-09-24',
    }
  ];

  const filtered = banks.filter(b => {
    const matchType = filterType === 'all' || b.type === filterType;
    const matchSearch = b.name.toLowerCase().includes(searchBank.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
          <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
          全台房貸緊縮與排隊實況即時看板 (每日更新)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          全台銀行 72-2 滿水位排隊與限貸緊縮指數實況
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          買房簽約前必讀！台灣《銀行法》第 72 條之 2 規定銀行不動產放款不得超過存款與金融債券總額 30%。為您即時追蹤各大公私立行庫額度開放與撥款等待期。
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部銀行 ({banks.length})
            </button>
            <button
              onClick={() => setFilterType('public')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'public'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              公股八大行庫
            </button>
            <button
              onClick={() => setFilterType('private')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'private'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              優質民營銀行
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋銀行名稱..."
              value={searchBank}
              onChange={(e) => setSearchBank(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Bank Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((bank) => (
          <div
            key={bank.name}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-all space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {bank.type === 'public' ? '公股行庫' : '民營行庫'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{bank.name}</h3>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                bank.quotaStatus === 'normal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : bank.quotaStatus === 'queue'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {bank.statusText}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  預估撥款等待期
                </span>
                <strong className="text-slate-800 text-sm font-bold">{bank.waitDays}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">最新最低參考利率</span>
                <strong className="text-indigo-600 text-sm font-bold">{bank.minRate}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                現行承辦內規與要求
              </span>
              <ul className="space-y-1">
                {bank.requirements.map((req, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
              <span>資訊校核時間: {bank.lastUpdate}</span>
              <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                點擊帶入此利率試算 &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Advice banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          買房簽約前防違約三大保命招式
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <strong className="text-white block font-bold text-sm mb-1">1. 加註成數特約但書條款</strong>
            於買賣契約特別約定：「買方申辦房貸若未達成交價 8 成（或指定金額），無條件解除契約，賣方全額無息退還已付價金。」
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <strong className="text-white block font-bold text-sm mb-1">2. 同時洽詢 2~3 家銀行</strong>
            簽約後立即向薪轉銀行、大型民營行庫同時送件，避開單一銀行突然滿水位或臨時抽銀根的致命危機。
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <strong className="text-white block font-bold text-sm mb-1">3. 拉長交屋約定天數</strong>
            因目前審核與排隊撥款多需 45~60 天，建議買賣契約完稅至交屋日期寬限至 60~75 天以上，避免遲延交屋被賣方沒收罰款。
          </div>
        </div>
      </div>

      <FeedbackRatingWidget
        pageId="bank-quota-tracker"
        pageTitle="全台各銀行 72-2 滿水位排隊與限貸緊縮指數實況"
      />
    </div>
  );
}
