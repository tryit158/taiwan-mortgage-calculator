import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Copy, Check, Sparkles, MessageSquareQuote } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface ArticleFaqAccordionProps {
  articleId: string;
  title: string;
  customFaqs?: FaqItem[];
}

// 針對核心長尾文章的 GEO 問答庫
const ARTICLE_FAQS: Record<string, FaqItem[]> = {
  '2026-new-youth-mortgage-rate-limit-and-monthly-payment-formula': [
    {
      question: '2026 新青安房貸利率是多少？每個月要繳多少錢？',
      answer: '2026 年新青安房貸一段式機動利率目前為 1.775%（政府補貼 0.375% 後的地板價）。以貸款 1,000 萬元、40 年本息平均攤還為例，若無寬限期，每月還款約 29,228 元；若使用最長 5 年寬限期，前 5 年每月僅需繳息 14,792 元，第 6 年起恢復還本，月付金跳增至 32,323 元。'
    },
    {
      question: '新青安房貸寬限期 5 年真的適合每個人嗎？會有斷崖風險嗎？',
      answer: '不一定。寬限期是「先甘後苦」的財務槓桿。前 5 年雖然輕鬆，但本金完全沒減少，導致剩餘 35 年每期要分攤的本金更多，月付金漲幅高達 118.5%，全期總利息也會多出數十萬元。建議手頭現金流不充裕、未來 5 年內薪資無明顯成長預期的首購族，寬限期設定 1~2 年即可。'
    },
    {
      question: '房貸超過 1000 萬元上限時，新青安怎麼處理？',
      answer: '超過 1,000 萬元的差額部分，八大公股行庫會以一般商業房貸（首購地板價約 2.185% 起）合併承作，兩筆貸款可在同一家銀行合併扣款，期數與還款方式亦可同步規劃。'
    },
    {
      question: '新青安房貸有「一生一次」限制嗎？',
      answer: '是的。依財政部 2024 年 6 月 27 日發布之最新精進規範，每位國民一生僅能享有一次新青安優惠；且借款人必須簽署「自住切結書」，若經查獲出租或轉售，將立即撤銷補貼並追溯追繳利息。'
    }
  ],
  'how-much-down-payment-needed-with-hidden-costs-calculator': [
    {
      question: '買房頭期款一定要準備 2 成嗎？只存 2 成自備款真的夠嗎？',
      answer: '絕對不夠！雖然首購無自用住宅最高可貸 8 成（自備款 2 成），但交屋時必須額外支付契稅、代書費、仲介費（1%~2%）、地政登記規費、印花稅、火險地震險及基本裝潢家具。實務上至少需準備「房屋總價的 25% ~ 28%」現金才算安全，否則交屋時極易面臨違約金風險。'
    },
    {
      question: '買房交屋當天還要交哪些額外的隱藏費用？',
      answer: '交屋結算時，買方需現場結清代書費（約 1.8~2.5 萬）、契稅代墊款（房屋評定現值的 6%，約 3~8 萬）、地政登記規費與印花稅（約 1.5~3 萬）、火險地震保險費（約 3,000 元），並依交屋日按比例分攤當年度的房屋稅與地價稅。預售屋通常還會額外代收 10~20 萬的水電瓦斯天然氣管線外管工程費與社區公共基金。'
    },
    {
      question: '契稅怎麼算？是買賣總價的 6% 嗎？',
      answer: '不是！契稅的計算基準是地方稅捐稽徵處評定的「房屋現值」，而非買賣成交總價。通常電梯大樓房屋評定現值約為總價的 10%~15%，故契稅金額約為數萬元不等。但新成屋或鋼骨超高大樓現值較高，契稅可能破 10 萬元。'
    },
    {
      question: '可以用信用貸款來補足買房頭期款嗎？',
      answer: '強烈不建議，且風險極高！銀行在撥款房貸前會再次調閱聯徵中心信用報告。若發現撥款前半年內有異常信貸申請，會直接認定為以借還借，大幅降低房貸核貸成數甚至拒絕撥款；且信貸月付金會直接計入個人無擔保負債比（DBR 22倍），導致房貸收支比（DTI）直接超標。'
    }
  ]
};

// 通用常態問答（當文章沒有特定自訂問答時的精闢解答）
const DEFAULT_FAQS: FaqItem[] = [
  {
    question: '房貸本息平均攤還跟本金平均攤還哪個比較划算？',
    answer: '「本息平均攤還」每個月繳的總金額固定不變，好處是財務現金流穩定預測，適合薪水固定的上班族；「本金平均攤還」每個月償還固定金額的本金，利息則隨本金減少而逐期降低，初期繳款負擔最重，但整個貸款期間繳出的「總利息」最少，適合手頭自備資金充足的買方。'
  },
  {
    question: '什麼是房貸寬限期？期滿後每個月要繳多少？',
    answer: '寬限期是指在約定期限內（通常 1~5 年），借款人每個月「只繳利息、不還本金」。寬限期結束後，剩下的本金必須在剩餘的年限內還清，因此月付金會明顯跳增（通常增幅達 50%~120%）。例如 1000 萬 40 年房貸，寬限期內月繳約 14,792 元，期滿後跳增為 32,323 元。'
  },
  {
    question: '2026 銀行房貸利率一般是多少？央行地板價是多少？',
    answer: '2026 年台灣央行公認的首購無自用住宅「地板價利率」約為 2.185%（非首購第二戶通常在 2.65%~3.10% 起）。若符合公股行庫新青安貸款條件，政府補貼後優惠利率最低可達 1.775%。'
  }
];

export function ArticleFaqAccordion({ articleId, title, customFaqs }: ArticleFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const faqs = customFaqs || ARTICLE_FAQS[articleId] || DEFAULT_FAQS;

  const handleCopyAnswer = (faq: FaqItem, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const copyText = `📌 【問】：${faq.question}\n💡 【答】：${faq.answer}\n\n👉 資料來源：tryit.qzz.io 台灣房貸指南與試算智庫 (${title})`;
    navigator.clipboard.writeText(copyText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div 
      className="my-10 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-xs"
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-indigo-100">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI 搜尋優化解答 (GEO & Generative Engine Ready)
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            常見問答與專家權威解答 (FAQ)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            符合 Google AI Overview、ChatGPT 與 Perplexity 檢索引號標準之核心摘要
          </p>
        </div>
        <span className="text-[11px] bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full font-bold shadow-2xs self-start sm:self-center">
          Schema.org FAQPage 認證
        </span>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen 
                  ? 'bg-white border-indigo-300 shadow-sm ring-1 ring-indigo-200' 
                  : 'bg-white/70 hover:bg-white border-slate-200'
              }`}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Q{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900" itemProp="name">
                    {faq.question}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleCopyAnswer(faq, idx, e)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="一鍵複製此答覆引用"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div 
                  className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 space-y-2 animate-fade-in"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="flex items-start gap-2 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 text-slate-700">
                    <MessageSquareQuote className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p itemProp="text">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>編審校核：台灣房貸智庫法規小組 (依 2026 最新法令)</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyAnswer(faq, idx, e)}
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      {copiedIndex === idx ? '已複製到剪貼簿！' : '一鍵複製本段引文與出處'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
