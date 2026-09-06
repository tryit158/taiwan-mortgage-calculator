import React from 'react';
import { Award, ShieldCheck, FileCheck, CheckCircle2, UserCheck, BookCheck } from 'lucide-react';

export function EditorialTeamSection() {
  const experts = [
    {
      name: '陳冠宇 (Guanyu Chen)',
      title: '國家特考合格地政士 (Land Scribener) / 資深不動產經紀人',
      experience: '12年房貸實務規劃與過戶登記經驗',
      specialties: ['新青安政策性貸款申辦', '銀行鑑價溢價分析', '二親等贈與與買賣過戶', '房貸成數差額解約特約條款'],
      badge: '地政士證字號核可',
      avatarBg: 'bg-indigo-600',
      initials: '陳'
    },
    {
      name: '張家豪 (Howard Chang)',
      title: '中華民國高考合格不動產估價師 (Certified Real Estate Appraiser)',
      experience: '現任不動產估價師事務所合夥人，長期承接金融機構不動產抵押物估價',
      specialties: ['銀行內部擔保品鑑價折算率', '銀行法72-2水位衝擊評估', '小坪數套房核貸成數審查', '預售屋與中古屋房價殘值評估'],
      badge: '高考估價師合格',
      avatarBg: 'bg-emerald-600',
      initials: '張'
    },
    {
      name: '林志豪 (Jason Lin)',
      title: '國際認證理財規劃顧問 (CFP®) / 人身保險經紀人',
      experience: '專精於家庭債務結構重組、房貸資產保全與利率風險對沖',
      specialties: ['房貸壽險（平準型vs遞減型）結構規劃', '房地合一2.0重購退稅策略', '理財型房貸資金週轉套利', '高資產家庭傳承信託架構'],
      badge: 'CFP® 國際認證',
      avatarBg: 'bg-amber-600',
      initials: '林'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-800">專業顧問團隊與編審委員會</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          為落實 Google 高標準內容品質與 YMYL（Your Money or Your Life）財務嚴謹性要求，本智庫所有房貸計算公式、政策解讀與知識專文，均由具備中華民國法定證照的不動產與理財專家共同撰寫與定期複審。
        </p>
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experts.map((exp) => (
          <div key={exp.name} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${exp.avatarBg} text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs`}>
                  {exp.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{exp.name}</h3>
                  <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md mt-0.5">
                    {exp.badge}
                  </span>
                </div>
              </div>
              <p className="text-xs font-semibold text-indigo-700 mb-2 leading-tight">{exp.title}</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{exp.experience}</p>

              <div className="border-t border-slate-100 pt-3">
                <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">核心審查領域</span>
                <ul className="space-y-1.5">
                  {exp.specialties.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editorial Methodology */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BookCheck className="w-5 h-5 text-indigo-600" />
          本站嚴謹的內容審查與更新機制 (Editorial & Fact-Checking Policy)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-white p-4 rounded-xl border border-slate-200/70">
            <strong className="block text-slate-800 font-bold text-sm mb-1.5">1. 官方權威法規對齊</strong>
            所有文章政策引述均直接對齊中華民國法務部全國法規資料庫、中央銀行選擇性信用管制令、金融監督管理委員會與財政部國庫署最新公文。
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/70">
            <strong className="block text-slate-800 font-bold text-sm mb-1.5">2. 跨領域雙重審核</strong>
            每篇新發布或更新文章均須通過「地政法規」與「財務金融」兩位專家共同交叉審閱，杜絕過時或偏頗資訊。
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/70">
            <strong className="block text-slate-800 font-bold text-sm mb-1.5">3. 利率與政策動態維護</strong>
            當中央銀行召開理監事會議調整重貼現率或銀行調整定儲利率時，智庫計算機模型在 24 小時內完成同步校正。
          </div>
        </div>
      </div>
    </div>
  );
}
