import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, Clock, Building2, ShieldAlert } from 'lucide-react';

export function InteractiveContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '網站內容與試算建議',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      topic: '網站內容與試算建議',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Contact Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
            <Mail className="w-4 h-4" />
            <span>官方電子信箱</span>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            <a href="mailto:contact@tryit.qzz.io" className="hover:underline">
              contact@tryit.qzz.io
            </a>
          </p>
          <p className="text-xs text-slate-500 mt-1">一般讀者反饋與政策勘誤</p>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>回覆時間承諾</span>
          </div>
          <p className="text-sm font-semibold text-slate-900">1 ~ 2 個工作天內</p>
          <p className="text-xs text-slate-500 mt-1">週一至週五 09:30 - 18:00</p>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
            <Building2 className="w-4 h-4" />
            <span>智庫編輯聯絡處</span>
          </div>
          <p className="text-sm font-semibold text-slate-900">台北市大安區敦化南路二段</p>
          <p className="text-xs text-slate-500 mt-1">台灣房貸指南與試算智庫編輯部</p>
        </div>
      </div>

      {/* Interactive Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-xl font-bold text-slate-900 mb-2">線上讀者反饋與編審勘誤表單</h3>
        <p className="text-sm text-slate-500 mb-6">
          若您發現任何銀行利率變動、法規最新修正，或對房貸計算機有任何功能改進建議，歡迎隨時留言告訴我們。
        </p>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-emerald-900">感謝您的寶貴反饋！</h4>
            <p className="text-sm text-emerald-700 max-w-md mx-auto">
              我們已收到您的訊息，編輯與顧問團隊會於 1~2 個工作天內儘速檢視並透過 Email 回覆。
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              填寫另一則反饋
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="contact-name">
                  您的稱呼 / 姓名 <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="例如：陳先生 / 林小姐"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="contact-email">
                  電子郵件 (Email) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="contact-topic">
                詢問主題類別
              </label>
              <select
                id="contact-topic"
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-white"
              >
                <option value="網站內容與試算建議">網站內容與試算功能建議</option>
                <option value="文章內容勘誤或法規更新">文章內容勘誤或法規更新通報</option>
                <option value="專家顧問專欄合作">專家顧問專欄合作洽詢</option>
                <option value="廣告政策與版權問題">廣告政策與版權相關問題</option>
                <option value="其他事項">其他事項</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="contact-message">
                詳細訊息內容 <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                placeholder="請描述您的建議、問題或發現需要更新的法規條文..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>我們尊重您的隱私，絕不會將您的聯絡資訊用於任何未經授權的商業行銷。</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? '送出中...' : '確認送出訊息'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-800 leading-relaxed">
        <strong>⚠️ 法律與財務提醒：</strong>
        本智庫為公共中立之房貸試算與不動產財稅知識庫，<strong>不提供個別私人借貸代辦或金融仲介服務</strong>。若您需要申辦貸款或了解特定物件核貸成數，請直接洽詢承貸金融機構或專業特考地政士。
      </div>
    </div>
  );
}
