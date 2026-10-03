import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Calculator, Info, Mail, Shield, FileText, Menu, X, Award, 
  Wallet, RefreshCw, TrendingUp, Landmark, ExternalLink, Building2, Scale
} from 'lucide-react';
import { Home, ArticlesPage, ArticleDetailPage, AboutPage, ContactPage, PrivacyPage, TermsPage, Landing1200WPage } from './pages';
import { EditorialPolicyPage } from './components/EditorialPolicyPage';
import { AffordabilityCalculator } from './components/AffordabilityCalculator';
import { RefinanceCalculator } from './components/RefinanceCalculator';
import { NewYouthSimulator } from './components/NewYouthSimulator';
import { BankQuotaTracker } from './components/BankQuotaTracker';
import { HomePurchaseCostCalculator } from './components/HomePurchaseCostCalculator';
import { MortgageVsInvestmentSimulator } from './components/MortgageVsInvestmentSimulator';
import { cn } from './utils';
import { GeoMetadataInjector } from './components/GeoMetadataInjector';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function CookieBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookie_consent');
    if (!hasAccepted) {
      setAccepted(false);
    }
  }, []);

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4 md:p-6 z-[100] flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-full duration-500">
      <div className="text-slate-300 text-sm leading-relaxed max-w-5xl">
        <strong className="text-white block mb-1 text-base">本網站使用 Cookies 與追蹤技術</strong>
        我們使用 cookies 與其他追蹤技術來提升您的使用者體驗、分析網站流量，並透過 Google AdSense 提供個人化的廣告內容。為了符合 Google 廣告計畫政策，我們在此向您說明我們的資料使用方式。繼續使用本網站即表示您同意我們的 <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">隱私權政策</Link> 與 <Link to="/terms" className="text-indigo-400 hover:text-indigo-300 underline">服務條款</Link>。
      </div>
      <div className="flex shrink-0 gap-3 w-full md:w-auto mt-2 md:mt-0">
        <button 
          onClick={() => {
            localStorage.setItem('cookie_consent', 'true');
            setAccepted(true);
          }}
          className="w-full md:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          我了解並同意 (Accept)
        </button>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: '房貸試算', path: '/', icon: Calculator },
    { name: '購屋能力評估', path: '/affordability', icon: Wallet },
    { name: '買房總規費精算', path: '/closing-costs', icon: Building2 },
    { name: '房貸vs存股0050', path: '/early-repay-vs-invest', icon: Scale },
    { name: '轉貸省息試算', path: '/refinance-calc', icon: RefreshCw },
    { name: '新青安推演', path: '/new-youth-compare', icon: TrendingUp },
    { name: '72-2 銀行看板', path: '/bank-quota', icon: Landmark },
    { name: '知識庫', path: '/blog', icon: BookOpen },
  ];

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
            <HomeIcon className="w-6 h-6 text-white" aria-hidden="true" />
            <span className="text-base sm:text-lg font-bold tracking-tight">台灣房貸指南與試算智庫</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={cn(
                    "flex items-center gap-1.5 transition-colors py-1.5 px-2.5 rounded-lg",
                    isActive ? "bg-indigo-700 text-white shadow-xs" : "text-indigo-100 hover:bg-indigo-500/50 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/about"
              className="text-indigo-200 hover:text-white text-xs pl-2 border-l border-indigo-500/70"
            >
              關於智庫
            </Link>
          </nav>

          {/* Medium screen navigation (condensed) */}
          <nav className="hidden md:flex xl:hidden items-center gap-3 text-xs font-medium">
            <Link to="/" className={cn("px-2 py-1 rounded", location.pathname === '/' ? "bg-indigo-700 text-white" : "text-indigo-100")}>
              房貸試算
            </Link>
            <Link to="/affordability" className={cn("px-2 py-1 rounded", location.pathname === '/affordability' ? "bg-indigo-700 text-white" : "text-indigo-100")}>
              購屋能力
            </Link>
            <Link to="/bank-quota" className={cn("px-2 py-1 rounded", location.pathname === '/bank-quota' ? "bg-indigo-700 text-white" : "text-indigo-100")}>
              72-2看板
            </Link>
            <Link to="/blog" className={cn("px-2 py-1 rounded", location.pathname.startsWith('/blog') ? "bg-indigo-700 text-white" : "text-indigo-100")}>
              知識庫
            </Link>
            <Link to="/about" className="text-indigo-200 hover:text-white">
              關於
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 -mr-2 text-indigo-100 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-indigo-700 border-t border-indigo-500">
            <nav className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-indigo-600 space-y-1">
                <Link to="/about" className="block px-3 py-2 text-xs text-indigo-200 hover:text-white">
                  關於智庫與編審團
                </Link>
                <Link to="/editorial-policy" className="block px-3 py-2 text-xs text-indigo-200 hover:text-white">
                  編審方針與廣告政策
                </Link>
                <Link to="/contact" className="block px-3 py-2 text-xs text-indigo-200 hover:text-white">
                  讀者反饋與勘誤
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <HomeIcon className="w-5 h-5 text-indigo-600" />
                <span className="text-base font-bold text-slate-800">台灣房貸指南與試算智庫</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                由中華民國國家特考合格地政士、不動產估價師與 CFP® 國際認證理財顧問共同編審。堅持客觀中立、零個資收集、即時同步中央銀行與各大行庫最新授信規程，保障全台購屋者的財務知情權。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-4">核心試算工具</h3>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">台灣房貸本息平均攤還試算</Link></li>
                <li><Link to="/affordability" className="hover:text-indigo-600 transition-colors">購屋負擔能力與自備款推算器</Link></li>
                <li><Link to="/closing-costs" className="hover:text-indigo-600 transition-colors">買房交屋總成本與隱形規費精算</Link></li>
                <li><Link to="/early-repay-vs-invest" className="hover:text-indigo-600 transition-colors">房貸提早還清 vs 存股 0050 決策模型</Link></li>
                <li><Link to="/refinance-calc" className="hover:text-indigo-600 transition-colors">房貸轉貸損益與回本期精算器</Link></li>
                <li><Link to="/new-youth-compare" className="hover:text-indigo-600 transition-colors">新青安 40年 vs 30年 沙盤推演</Link></li>
                <li><Link to="/bank-quota" className="hover:text-indigo-600 transition-colors">全台銀行 72-2 滿水位排隊看板</Link></li>
                <li><Link to="/1200w" className="hover:text-indigo-600 transition-colors">1200萬房貸專題精算</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-4">知識庫與組織</h3>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link to="/blog" className="hover:text-indigo-600 transition-colors">房貸知識專題庫 (56篇完整專文)</Link></li>
                <li><Link to="/about" className="hover:text-indigo-600 transition-colors">關於智庫與編審團證照資歷</Link></li>
                <li><Link to="/editorial-policy" className="hover:text-indigo-600 transition-colors">編審方針與事實查核流程</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">讀者反饋與政策勘誤聯絡處</Link></li>
                <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">網站地圖 (Sitemap) <ExternalLink className="w-3 h-3" /></a></li>
                <li><a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1 text-indigo-600 font-semibold">AI 模型引用檔案 (llms.txt) <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-4">法規與隱私權規範</h3>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>
                  <Link to="/editorial-policy" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    編審方針與廣告政策 (Editorial Policy)
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    隱私權政策 (Privacy Policy)
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    服務條款與免責聲明 (Terms)
                  </Link>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                <p>Google AdSense 認證發布商合作夥伴</p>
                <p>遵守 Google 網站發布商品質與垃圾內容防制政策</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-xs leading-relaxed">
            <p>本智庫所有試算結果與分析專文僅供購屋與個人財務規劃參考，實際借貸條件、利率成數與還款金額請以各承貸金融機構正式徵信核貸合約為準。</p>
            <p className="mt-2">© 2026 台灣房貸指南與試算智庫 (Taiwan Mortgage Intelligence Hub). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <GeoMetadataInjector />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/affordability" element={<AffordabilityCalculator />} />
          <Route path="/closing-costs" element={<HomePurchaseCostCalculator />} />
          <Route path="/early-repay-vs-invest" element={<MortgageVsInvestmentSimulator />} />
          <Route path="/refinance-calc" element={<RefinanceCalculator />} />
          <Route path="/new-youth-compare" element={<NewYouthSimulator />} />
          <Route path="/bank-quota" element={<BankQuotaTracker />} />
          <Route path="/1200w" element={<Landing1200WPage />} />
          <Route path="/blog" element={<ArticlesPage />} />
          <Route path="/blog/:id" element={<ArticleDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Layout>
      <CookieBanner />
    </Router>
  );
}
