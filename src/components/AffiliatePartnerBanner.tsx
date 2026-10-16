import React, { useState } from 'react';
import { ShoppingBag, Sparkles, ExternalLink, ArrowRight, Gift, Home, X } from 'lucide-react';

export const AFFILIATE_LINK = 'https://affclk.site/track/clicks/5282/c627c2bc9b0023dafb8fec23d62e9742246a45df2aabebf10568b013234652eed671a3ea103a9e71';

/**
 * 1. 全站頂部公告列 (Top Announcement Banner)
 * 位於 Header 最上方，全站每個頁面與所有文章皆可見，行動與桌機均極具點擊率
 */
export function TopAnnouncementBanner() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <aside aria-label="成家專屬優惠公告" className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs py-2 px-3 sm:px-4 relative z-50 shadow-xs flex items-center justify-between">
      <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
        <span className="hidden sm:inline-flex items-center gap-1 bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
          <Gift className="w-3 h-3" /> 2026 成家好康
        </span>
        <span className="truncate font-medium text-amber-50">
          買房成家必備：新居家電、品牌家具與入厝好物官方商城特惠專區
        </span>
        <a
          href={AFFILIATE_LINK}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-1 bg-white text-orange-700 hover:bg-amber-50 px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-colors shrink-0 shadow-xs ml-1"
        >
          點此領取專屬特惠 <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
      <button
        onClick={() => setClosed(true)}
        className="text-white/80 hover:text-white p-1 rounded transition-colors ml-2 shrink-0"
        aria-label="關閉通知"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}

/**
 * 2. 房貸試算機結果區「成家預算精省推薦卡」 (Calculator Partner Card)
 * 位於試算結果與每月還款金額正下方，抓準使用者精打細算、規劃買房現金流的關鍵時刻
 */
export function CalculatorPartnerCard() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-white border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden my-4">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-200/20 to-orange-300/20 rounded-full blur-xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3" /> 成家省錢指南
            </span>
            <span className="text-xs font-bold text-slate-800">
              交屋裝潢家電預算動輒數十萬？
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            房貸每分錢都要精打細算！新居冷氣、冰箱、洗衣機與軟裝家具，善用<strong className="text-orange-700 font-semibold">【官方商城品牌成家專區】</strong>大額滿額折價券與免運回饋，現省數萬元入厝預算。
          </p>
        </div>

        <a
          href={AFFILIATE_LINK}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md shrink-0 w-full sm:w-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>前往成家特惠專區</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

/**
 * 3. 專題文章內文與文末「讀者成家福利卡」 (Article Partner Card)
 * 嵌入在 60+ 篇乾貨文章中，針對高意圖看房、交屋與法規讀者進行高轉化導流
 */
export function ArticlePartnerCard() {
  return (
    <aside aria-label="讀者專屬成家優惠" className="my-8 p-5 sm:p-6 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/70 border border-amber-200 rounded-2xl shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                讀者成家專屬福利：2026 入厝家電家具精選特惠
              </h3>
              <p className="text-[11px] text-slate-500">
                買房交屋後荷包見底？官方品牌旗艦特案補助與大額優惠券一鍵領取
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pl-10">
            無論是挑選一級能效節能冷氣、大容量變頻冰箱、洗脫烘衣機或北歐簡約家具，搭配官方商城專屬成家補貼與品牌日折價，幫新家打造高質感生活同時省下大筆開支。
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0 pl-10 md:pl-0">
          <a
            href={AFFILIATE_LINK}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Gift className="w-4 h-4" />
            <span>點此領取商城專屬特惠</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}

/**
 * 4. 買房總規費精算專用「裝潢家電採購省錢卡」 (RenovationPartnerCallout)
 * 位於總規費計算機的「裝潢與新居家電預備金」處，精準命中正在計算家電花費的使用者
 */
export function RenovationPartnerCallout() {
  return (
    <div className="mt-3 p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-900">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
        <span>
          <strong className="font-bold text-orange-800">新居家電省錢技巧：</strong>
          大型家電（冷氣/冰箱/洗衣機）利用官方商城品牌日與成家特惠券採購，可再省 10%~20% 現金。
        </span>
      </div>
      <a
        href={AFFILIATE_LINK}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-1 text-orange-700 hover:text-orange-900 font-bold underline shrink-0 whitespace-nowrap self-end sm:self-auto"
      >
        查看成家家電優惠 <ArrowRight className="w-3 h-3" />
      </a>
    </div>
  );
}
