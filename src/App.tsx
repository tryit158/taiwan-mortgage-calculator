import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, Calculator, Info, Mail, Shield, FileText } from 'lucide-react';
import { Home, ArticlesPage, ArticleDetailPage, AboutPage, ContactPage, PrivacyPage, TermsPage } from './pages';
import { cn } from './utils';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navLinks = [
    { name: '首頁試算', path: '/', icon: Calculator },
    { name: '房貸專欄', path: '/articles', icon: BookOpen },
    { name: '關於我們', path: '/about', icon: Info },
    { name: '聯絡我們', path: '/contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <HomeIcon className="w-6 h-6" aria-hidden="true" />
            <span className="text-xl font-bold tracking-tight">台灣房貸試算神器</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={cn(
                    "flex items-center gap-1.5 transition-colors py-2 border-b-2",
                    isActive ? "text-white border-white" : "text-indigo-100 border-transparent hover:text-white hover:border-indigo-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HomeIcon className="w-5 h-5 text-indigo-600" />
                <span className="text-lg font-bold text-slate-800">台灣房貸試算神器</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                最專業的房貸試算工具，支援新青安、寬限期、本息攤還與本金攤還。提供詳細的圖表分析與每月還款明細，幫助您輕鬆規劃購屋財務。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-4">快速連結</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">首頁試算</Link></li>
                <li><Link to="/articles" className="hover:text-indigo-600 transition-colors">房貸專欄</Link></li>
                <li><Link to="/about" className="hover:text-indigo-600 transition-colors">關於我們</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">聯絡我們</Link></li>
                <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">網站地圖 (Sitemap)</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-4">法律與政策</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <Link to="/privacy" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <Shield className="w-4 h-4" />
                    隱私權政策
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <FileText className="w-4 h-4" />
                    服務條款
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
            <p>本試算結果僅供參考，實際貸款條件與還款金額請以各家銀行核貸結果為準。</p>
            <p className="mt-2">© 2026 台灣房貸試算神器. All rights reserved.</p>
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
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
