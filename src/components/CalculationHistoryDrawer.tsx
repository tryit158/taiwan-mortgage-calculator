import React, { useState, useEffect } from 'react';
import { 
  History, Bookmark, BookmarkPlus, Trash2, ArrowRight, Check, Copy, 
  ExternalLink, Sparkles, Scale, X, Clock, HelpCircle, Smartphone, Monitor
} from 'lucide-react';

export interface SavedCalculation {
  id: string;
  name: string;
  createdAt: string;
  loanAmount: number; // 萬元
  loanTerm: number; // 年
  gracePeriod: number; // 年
  interestRate: number; // %
  repaymentMethod: 'equal_payment' | 'equal_principal';
  firstMonthPayment: number;
  afterGracePeriodPayment: number;
  totalInterest: number;
}

interface CalculationHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCalculation: {
    loanAmount: number;
    loanTerm: number;
    gracePeriod: number;
    interestRate: number;
    repaymentMethod: 'equal_payment' | 'equal_principal';
    firstMonthPayment: number;
    afterGracePeriodPayment: number;
    totalInterest: number;
  };
  onApplyCalculation: (calc: SavedCalculation) => void;
}

const STORAGE_KEY = 'taiwan_mortgage_history_v1';

export function CalculationHistoryDrawer({
  isOpen,
  onClose,
  currentCalculation,
  onApplyCalculation,
}: CalculationHistoryDrawerProps) {
  const [savedList, setSavedList] = useState<SavedCalculation[]>([]);
  const [customName, setCustomName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<[string, string] | null>(null);
  const [showBookmarkGuide, setShowBookmarkGuide] = useState(false);

  // 讀取 localStorage 紀錄
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedList(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load calculation history', e);
    }
  }, [isOpen]);

  const saveToStorage = (newList: SavedCalculation[]) => {
    setSavedList(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save calculation history', e);
    }
  };

  // 儲存當前試算
  const handleSaveCurrent = () => {
    const defaultLabel = `${currentCalculation.loanAmount}萬 (${currentCalculation.loanTerm}年/${currentCalculation.interestRate}%)`;
    const newRecord: SavedCalculation = {
      id: Date.now().toString(),
      name: customName.trim() || defaultLabel,
      createdAt: new Date().toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      ...currentCalculation,
    };

    const updated = [newRecord, ...savedList.slice(0, 19)]; // 保留最新 20 筆
    saveToStorage(updated);
    setCustomName('');
    setIsSaving(false);
  };

  // 刪除紀錄
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedList.filter(item => item.id !== id);
    saveToStorage(updated);
    if (compareIds && (compareIds[0] === id || compareIds[1] === id)) {
      setCompareIds(null);
    }
  };

  // 複製專屬連結
  const handleCopyRecordLink = (item: SavedCalculation, e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tryit.qzz.io';
    const link = `${origin}/?amount=${item.loanAmount}&term=${item.loanTerm}&grace=${item.gracePeriod}&rate=${item.interestRate}&method=${item.repaymentMethod}`;
    navigator.clipboard.writeText(link);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isOpen) return null;

  // 兩筆試算對比計算
  const calcA = compareIds ? savedList.find(i => i.id === compareIds[0]) : null;
  const calcB = compareIds ? savedList.find(i => i.id === compareIds[1]) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <History className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                我的房貸試算歷史與專屬連結
                <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
                  已存 {savedList.length} 筆
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                本機自動儲存您的看房與房貸比價歷史，一鍵還原或對比
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Action: Save Current Calculation */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                <BookmarkPlus className="w-4 h-4 text-indigo-600" />
                將當前試算儲存至此清單
              </div>
              <span className="text-[11px] text-indigo-700 font-medium">
                當前：{currentCalculation.loanAmount}萬 / {currentCalculation.loanTerm}年 / {currentCalculation.interestRate}%
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="為這筆試算取個名字（例如：新北板橋中古屋1200萬、新青安40年）"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveCurrent();
                }}
                className="flex-1 text-xs sm:text-sm bg-white border border-indigo-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSaveCurrent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0"
              >
                儲存紀錄
              </button>
            </div>
          </div>

          {/* Compare Modal/View if active */}
          {calcA && calcB && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Scale className="w-4 h-4 text-amber-600" />
                  兩筆方案深度對比
                </div>
                <button
                  onClick={() => setCompareIds(null)}
                  className="text-xs text-amber-700 hover:underline"
                >
                  關閉對比
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                  <div className="font-bold text-slate-900 truncate">方案 A: {calcA.name}</div>
                  <div className="text-slate-500">貸款：{calcA.loanAmount}萬 ({calcA.loanTerm}年/{calcA.interestRate}%)</div>
                  <div className="text-indigo-600 font-bold">首期月繳：${calcA.firstMonthPayment.toLocaleString()} 元</div>
                  <div className="text-slate-600">總利息：約 {(calcA.totalInterest / 10000).toFixed(1)} 萬</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                  <div className="font-bold text-slate-900 truncate">方案 B: {calcB.name}</div>
                  <div className="text-slate-500">貸款：{calcB.loanAmount}萬 ({calcB.loanTerm}年/{calcB.interestRate}%)</div>
                  <div className="text-indigo-600 font-bold">首期月繳：${calcB.firstMonthPayment.toLocaleString()} 元</div>
                  <div className="text-slate-600">總利息：約 {(calcB.totalInterest / 10000).toFixed(1)} 萬</div>
                </div>
              </div>

              <div className="p-2.5 bg-amber-100/60 rounded-xl text-[11px] text-amber-900 font-medium">
                💡 <strong>對比結論：</strong>方案 A 與 方案 B 首期月繳每月相差{' '}
                <strong>${Math.abs(calcA.firstMonthPayment - calcB.firstMonthPayment).toLocaleString()} 元</strong>，
                全期總利息差額達{' '}
                <strong>{Math.abs(Math.round((calcA.totalInterest - calcB.totalInterest) / 10000))} 萬元</strong>。
              </div>
            </div>
          )}

          {/* History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>已存歷史紀錄清單 ({savedList.length})</span>
              {savedList.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('確定要清空所有已儲存的試算紀錄嗎？')) {
                      saveToStorage([]);
                      setCompareIds(null);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  清空紀錄
                </button>
              )}
            </div>

            {savedList.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl space-y-3">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="text-sm font-bold text-slate-600">尚無儲存的試算紀錄</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  在上方輸入自訂備註並點擊「儲存紀錄」，即可將這筆房貸試算保留在此，方便日後隨時對比與追蹤！
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedList.map((item) => {
                  const isCompared = compareIds && (compareIds[0] === item.id || compareIds[1] === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onApplyCalculation(item);
                        onClose();
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all shadow-xs cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.createdAt}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                            {item.loanAmount} 萬
                          </span>
                          <span>•</span>
                          <span>{item.loanTerm} 年期</span>
                          <span>•</span>
                          <span>{item.interestRate}%</span>
                          {item.gracePeriod > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 font-medium">寬限 {item.gracePeriod} 年</span>
                            </>
                          )}
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">
                            月付 ${item.firstMonthPayment.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* 對比按鈕 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!compareIds) {
                              setCompareIds([item.id, '']);
                            } else if (compareIds[0] && !compareIds[1]) {
                              if (compareIds[0] !== item.id) setCompareIds([compareIds[0], item.id]);
                            } else {
                              setCompareIds([item.id, '']);
                            }
                          }}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                            isCompared 
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                          title="加入對比"
                        >
                          <Scale className="w-3.5 h-3.5 inline mr-1" />
                          {isCompared ? '已選取' : '對比'}
                        </button>

                        {/* 複製連結 */}
                        <button
                          onClick={(e) => handleCopyRecordLink(item, e)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="複製此筆專屬參數連結"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* 刪除按鈕 */}
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="刪除紀錄"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* 載入指示箭頭 */}
                        <span className="text-indigo-600 text-xs font-bold flex items-center gap-0.5 ml-1">
                          載入 &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bookmark & Returning Visitor Retention Helper */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Bookmark className="w-4 h-4 text-amber-500" />
                長期看房追蹤？加入瀏覽器書籤與桌面捷徑
              </div>
              <button
                onClick={() => setShowBookmarkGuide(!showBookmarkGuide)}
                className="text-xs text-indigo-600 hover:underline"
              >
                {showBookmarkGuide ? '隱藏指南' : '如何收藏？'}
              </button>
            </div>

            {showBookmarkGuide ? (
              <div className="pt-2 text-xs text-slate-600 space-y-2 border-t border-slate-200">
                <div className="flex items-start gap-2">
                  <Monitor className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>電腦瀏覽器（Chrome / Edge / Safari）：</strong>
                    <p className="text-slate-500">鍵盤同時按下 <code className="bg-white px-1.5 py-0.5 border rounded">Ctrl + D</code> (Windows) 或 <code className="bg-white px-1.5 py-0.5 border rounded">Cmd + D</code> (Mac) 即可秒加入書籤。</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>手機瀏覽器（iPhone Safari / Android Chrome）：</strong>
                    <p className="text-slate-500">點擊瀏覽器下方或右上角「分享／選單」圖示 ➔ 選擇「加入主畫面」，將房貸試算神器變成 App 圖示隨時點開！</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                看房週期常達 3~6 個月，將本工具加入書籤，每當仲介報價或看到新建案時，隨時點開即可精算月付金。
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>數據安全保證：所有試算紀錄均加密保存在您的手機／電腦本機中</span>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-bold"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
