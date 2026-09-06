import React from 'react';
import { ShieldCheck, BookOpen, AlertCircle, Award, CheckCircle2 } from 'lucide-react';

export function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">透明度與發布商標準</span>
        <h1 className="text-3xl font-bold text-slate-900 mt-1 mb-4">編審方針與廣告獨立性政策 (Editorial Policy)</h1>
        <p className="text-slate-600 leading-relaxed text-sm">
          「台灣房貸指南與試算智庫」遵循嚴謹的新聞專業與金融資訊發布準則。本政策詳細說明我們的資訊產製流程、利益衝突防範原則，以及第三方廣告（包括 Google AdSense）之運作標準。
        </p>
      </div>

      <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            一、編輯獨立性與零商業干預原則
          </h2>
          <p>
            我們堅持<strong>「編輯與廣告完全分離」</strong>。任何刊登於本站的第三方廣告、贊助聯播或合作夥伴，均無法對本站的計算公式、文章結論、銀行利率比較或購屋風險評估產生任何干涉與影響。
          </p>
          <p>
            我們的文章與試算工具旨在提供客觀、平衡、符合中華民國現行法令的真實數據。我們不會為了特定銀行、建商或房仲利益，隱瞞任何房貸風險（如寬限期暴增支出、央行信用管制第二戶限制或銀行法第 72 條之 2 滿水位限制）。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            二、YMYL 與 E-E-A-T 專業審核標準
          </h2>
          <p>
            房地產貸款與資產處分涉及個人重大財務決策（Google 定義之 YMYL 領域）。為確保內容品質達到業界最高標準，本站每一篇知識專文均實施嚴格的專家署名與審核制度：
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>專業資格審核：</strong> 文章作者與審閱者均具備合格地政士、不動產估價師或 CFP® 國際認證理財規劃顧問執照。</li>
            <li><strong>法規一手來源檢核：</strong> 引述法令條文（如銀行法、遺產及贈與稅法、所得稅法等）時，必須直接核對立法院及法務部最新公告生效條文。</li>
            <li><strong>計算模型定期回溯驗證：</strong> 房貸試算公式採用中央銀行公佈之標準年金法，並於每次央行升降息時同步校正。</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            三、Google AdSense 與第三方廣告遵循標準
          </h2>
          <p>
            本網站參與 Google AdSense 廣告聯播計畫。為了維護純淨優質的閱讀體驗，我們承諾遵循以下規範：
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>明確標示：</strong> 所有由 Google 或第三方聯播網展示之廣告欄位均有清楚的「廣告」或「贊助商」字樣，絕不使用誤導性標籤或偽裝成網站導覽元件。</li>
            <li><strong>杜絕干擾與誤點：</strong> 嚴格禁止彈跳廣告遮蔽核心試算工具、強制點擊或虛假點擊引導。</li>
            <li><strong>隱私權保護：</strong> 廣告 Cookie 遵循 GDPR、CCPA 與 Google 合作夥伴規範，讀者可隨時透過本站 Cookie 橫幅或 Google 廣告設定停用個人化追蹤。</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            四、更正與勘誤政策 (Correction Policy)
          </h2>
          <p>
            若本站發布之文章、利率數據或政策說明出現錯誤，我們承諾以最快速度予以公開更正，並於文章頂端或底端標註最後更新與修訂時間。讀者若發現任何疑問或需修正之處，歡迎透過 <a href="mailto:contact@tryit.qzz.io" className="text-indigo-600 underline">contact@tryit.qzz.io</a> 向編輯部反映。
          </p>
        </section>
      </div>
    </div>
  );
}
