import React, { useState } from 'react';
import { Building2, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Search } from 'lucide-react';

export interface BankRateInfo {
  id: string;
  name: string;
  category: 'public' | 'private';
  standardRate: number; // e.g. 2.06
  newYouthRate?: number; // e.g. 1.775
  maxTerm: number; // e.g. 40
  maxGrace: number; // e.g. 5
  badge: string;
  features: string[];
  lastUpdated: string;
}

export const TAIWAN_BANKS: BankRateInfo[] = [
  {
    id: 'bot',
    name: '臺灣銀行',
    category: 'public',
    standardRate: 2.06,
    newYouthRate: 1.775,
    maxTerm: 40,
    maxGrace: 5,
    badge: '公股龍頭 / 新青安撥款第一',
    features: ['新青安最高貸款1000萬', '政府補貼利息0.375%', '免開辦費優惠'],
    lastUpdated: '2026-08'
  },
  {
    id: 'landbank',
    name: '土地銀行',
    category: 'public',
    standardRate: 2.06,
    newYouthRate: 1.775,
    maxTerm: 40,
    maxGrace: 5,
    badge: '不動產專業銀行',
    features: ['專辦土地與房屋貸款', '新青安專案審核專業', '可搭配國宅優惠'],
    lastUpdated: '2026-08'
  },
  {
    id: 'tcb',
    name: '合作金庫',
    category: 'public',
    standardRate: 2.06,
    newYouthRate: 1.775,
    maxTerm: 40,
    maxGrace: 5,
    badge: '公股主力行庫',
    features: ['新青安40年期優惠', '全台分行據點多', '支持綠建築房屋貸款'],
    lastUpdated: '2026-08'
  },
  {
    id: 'firstbank',
    name: '第一銀行',
    category: 'public',
    standardRate: 2.06,
    newYouthRate: 1.775,
    maxTerm: 40,
    maxGrace: 5,
    badge: 'ESG綠色房貸首選',
    features: ['綠建築房貸利率額外減碼', '數位對保流程快', '提供線上試算對保'],
    lastUpdated: '2026-08'
  },
  {
    id: 'huanan',
    name: '華南銀行',
    category: 'public',
    standardRate: 2.06,
    newYouthRate: 1.775,
    maxTerm: 40,
    maxGrace: 5,
    badge: '公股安心房貸',
    features: ['優質企業員工利率優惠', '寬限期最長5年', '手續費常態優惠'],
    lastUpdated: '2026-08'
  },
  {
    id: 'chb',
    name: '彰化銀行',
    category: 'public',
    standardRate: 2.06,
    newYouthRate: 1.775,
    maxTerm: 40,
    maxGrace: 5,
    badge: '首購族優選',
    features: ['新青安配套完善', '轉貸優惠審核快', '無隱藏規費'],
    lastUpdated: '2026-08'
  },
  {
    id: 'mega',
    name: '兆豐銀行',
    category: 'public',
    standardRate: 2.06,
    newYouthRate: 1.775,
    maxTerm: 40,
    maxGrace: 5,
    badge: '外匯與百大企業首選',
    features: ['百大企業員工額度高', '外幣與房貸整合優惠', '新青安核貸效率佳'],
    lastUpdated: '2026-08'
  },
  {
    id: 'tpebank',
    name: '臺灣企銀',
    category: 'public',
    standardRate: 2.06,
    newYouthRate: 1.775,
    maxTerm: 40,
    maxGrace: 5,
    badge: '公股青年優惠',
    features: ['青年成家首購低利', '支持中小企業主個人房貸', '手續費親民'],
    lastUpdated: '2026-08'
  },
  {
    id: 'ctbc',
    name: '中國信託',
    category: 'private',
    standardRate: 2.18,
    maxTerm: 30,
    maxGrace: 3,
    badge: '民營龍頭 / 審核快速',
    features: ['線上APP一鍵對保申辦', '核貸審查速度快', '優質客戶高額度'],
    lastUpdated: '2026-08'
  },
  {
    id: 'cathay',
    name: '國泰世華',
    category: 'private',
    standardRate: 2.15,
    maxTerm: 30,
    maxGrace: 3,
    badge: '數位房貸創新',
    features: ['VIP尊榮利率專案', '綠建築優惠減碼', '房貸線上即時估價'],
    lastUpdated: '2026-08'
  },
  {
    id: 'fubon',
    name: '台北富邦',
    category: 'private',
    standardRate: 2.15,
    maxTerm: 30,
    maxGrace: 3,
    badge: '富邦集團整合優惠',
    features: ['結合富邦人壽/產險優惠', '轉貸減免開辦費', '優質薪轉戶專案'],
    lastUpdated: '2026-08'
  },
  {
    id: 'esun',
    name: '玉山銀行',
    category: 'private',
    standardRate: 2.15,
    maxTerm: 30,
    maxGrace: 3,
    badge: '服務優良 / 數位便捷',
    features: ['ESG永續房貸方案', '線上試算對保流程順暢', '信用卡卡友利率優惠'],
    lastUpdated: '2026-08'
  }
];

interface TaiwanBankRateTableProps {
  onSelectRate: (rate: number, term: number, grace: number) => void;
}

export function TaiwanBankRateTable({ onSelectRate }: TaiwanBankRateTableProps) {
  const [filterCategory, setFilterCategory] = useState<'all' | 'public' | 'private'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = TAIWAN_BANKS.filter(bank => {
    const matchesCategory = filterCategory === 'all' || bank.category === filterCategory;
    const matchesSearch = bank.name.includes(searchTerm) || bank.badge.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="taiwan-bank-rates" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 my-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> 2026 台灣各大行庫最新房貸利率比較表
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            台灣 8 大公股與主要民營銀行房貸利率比價卡
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            資料即時更新於 2026年8月。點擊「一鍵帶入試算」即可將該行庫利率與年限直接代入上方計算機。
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋銀行名稱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36 sm:w-44"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterCategory === 'all' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterCategory('public')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterCategory === 'public' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              8大公股
            </button>
            <button
              onClick={() => setFilterCategory('private')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterCategory === 'private' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              主要民營
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBanks.map((bank) => {
          const displayRate = bank.newYouthRate || bank.standardRate;
          return (
            <div 
              key={bank.id} 
              className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between bg-slate-50/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    {bank.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    bank.category === 'public' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {bank.badge}
                  </span>
                </div>

                <div className="my-3 bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-500">
                      {bank.newYouthRate ? '新青安優惠利率' : '一般首購地板利率'}
                    </p>
                    <p className="text-xl font-black text-indigo-700 tracking-tight">
                      {displayRate}% <span className="text-xs font-normal text-slate-400">起</span>
                    </p>
                  </div>
                  <div className="text-right border-l border-slate-100 pl-3">
                    <p className="text-[11px] text-slate-500">最長期限/寬限期</p>
                    <p className="text-xs font-bold text-slate-700">
                      {bank.maxTerm}年 / {bank.maxGrace}年
                    </p>
                  </div>
                </div>

                <ul className="space-y-1 mb-4">
                  {bank.features.map((feat, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  onSelectRate(displayRate, bank.maxTerm, bank.maxGrace);
                  const el = document.getElementById('loan-amount');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 group border border-indigo-200/60"
              >
                <span>一鍵帶入此利率試算</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>利率資料係參考中央銀行與各大行庫 2026 年最新牌告利率，實際核貸利率仍視借款人個人信用聯徵分數而定。</span>
        </div>
        <div className="flex items-center gap-1 font-medium text-indigo-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>每天同步台灣行庫數據</span>
        </div>
      </div>
    </div>
  );
}
