import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { articles } from '../data/articles';

export function GeoMetadataInjector() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // Clean up existing schema scripts
    const removeExistingSchemas = () => {
      const existingScripts = document.querySelectorAll('script[data-geo-schema="true"]');
      existingScripts.forEach(script => script.remove());
    };

    removeExistingSchemas();

    const path = location.pathname;
    let schemaData: any = null;

    // 1. General Site Info
    const siteUrl = window.location.origin;
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      '@id': `${siteUrl}/#organization`,
      'name': '台灣房貸試算神器',
      'url': siteUrl,
      'logo': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=200&h=200',
      'description': '提供台灣最專業、精準、直覺的房屋貸款試算與首購新青安3.0分析指南，支援本息攤還、本金攤還與寬限期大數據分析。',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'TW'
      }
    };

    if (path === '/' || path === '/1200w') {
      // Home Page - Financial Product / Calculator & FAQ Schema
      schemaData = [
        organizationSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': '台灣房屋貸款與新青安3.0線上精準計算機',
          'url': siteUrl,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'All',
          'browserRequirements': 'Requires JavaScript. Requires HTML5.',
          'description': '免費線上房貸計算機，秒算本息攤還、本金攤還、最長5年寬限期、40年貸款年限，完全符合台灣各公股與商業銀行最新核貸利率公式。'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': '如何計算台灣的房屋貸款月付金？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '計算房貸月付金主要分為「本息平均攤還」與「本金平均攤還」。本息平均攤還採用年金公式，將貸款期間的總本金與總利息平均分攤於每一期，使每期還款金額固定。本金平均攤還則是每期償還固定額度本金，利息則隨著未還本金減少而逐月遞減，呈現先甘後苦、總利息較省的特性。'
              }
            },
            {
              '@type': 'Question',
              'name': '新青安3.0有什麼最新政策規定與限制？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '新青安3.0（最新房貸新制）核心限制為「一生僅限申辦一次」。為防止投資客利用人頭戶投機或將房屋出租賺取差價，申請時必須強制簽署自住切結書。如果被銀行貸後大數據查核（如勾稽租金補貼、水電度數異常、設籍異常）發現違規轉租或非自住，將會即刻收回所有利息補貼、追繳既往補貼差額、並大幅縮短還款年限至20年且取消寬限期。'
              }
            },
            {
              '@type': 'Question',
              'name': '新青安貸款的最高額度與寬限期是多久？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '新青安貸款提供政府補貼後的超低利率（1.775%起），最高貸款額度為新台幣 1,000 萬元，最長還款年限為 40 年，並且享有最長 5 年的寬限期。寬限期內僅需繳納利息，本金自第 6 年起開始平均攤還。'
              }
            }
          ]
        }
      ];
    } else if (path.startsWith('/blog/')) {
      // Blog Detail Page Schema
      const article = articles.find(a => a.id === id);
      if (article) {
        // Specific Article Meta
        const isNewYouth = article.id === 'new-youth-mortgage-3-0-complete-guide';
        
        const faqEntities = isNewYouth ? [
          {
            '@type': 'Question',
            'name': '新青安3.0的「一生一次」條款是什麼意思？',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': '一生限貸一次條款規定，自 2024 年 6 月 27 日起，每位國民此生只能申辦並撥款一次新青安房貸。即使未來將房屋轉售結清房貸，或進行轉貸，該身分證字號未來亦無法再次享有新青安利息補貼與長年期優惠。'
            }
          },
          {
            '@type': 'Question',
            'name': '銀行是如何查核新青安是否違規轉租或非自住？',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': '銀行、財政部與國稅局建立多重稽查大數據系統：1. 自動勾稽房客申請的300億租金補貼或年度報稅房租支出；2. 定期核對本人、配偶及未成年子女是否實際設籍遷入；3. 篩選台電與自來水帳單，若用電量或用水量連續多月趨近於零，或有異常大用電，會被列為高風險名單實地調查。'
            }
          },
          {
            '@type': 'Question',
            'name': '新青安如果被查到違規轉租，會有什麼嚴重後果？',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': '一旦查獲不符自住規定，銀行會祭出三大重罰：1. 立即終止政府補貼的利息優惠；2. 追溯既往，一次追回自撥款第一天起享受過的所有利息補貼差額；3. 重新談判條件，包含取消5年寬限期、將40年貸款期強制腰斬縮短至20年，並調升至一般非首購高利率。'
            }
          }
        ] : [
          {
            '@type': 'Question',
            'name': '1000萬房貸一個月要還多少錢？',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': '以2026年利率2.06%、30年期、無寬限期試算：採本息平均攤還，每月還款金額固定約為 37,263 元；若採新青安40年期、利率1.775%、5年寬限期，則寬限期內每月僅需繳息 14,792 元，第 6 年起本息攤還月繳金額跳升至約 31,983 元。'
            }
          }
        ];

        schemaData = [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': `${siteUrl}/blog/${article.id}`
            },
            'headline': article.title,
            'description': article.excerpt,
            'image': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200&h=600',
            'datePublished': `${article.date}T08:00:00+08:00`,
            'dateModified': `2026-07-19T23:57:00+08:00`,
            'author': {
              '@type': 'Organization',
              'name': '台灣房貸試算神器專業金融編輯團隊',
              'url': siteUrl
            },
            'publisher': {
              '@type': 'Organization',
              'name': '台灣房貸試算神器',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=200&h=200'
              }
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqEntities
          }
        ];
      }
    } else if (path === '/blog') {
      // Blog Directory Schema
      schemaData = [
        organizationSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          'name': '台灣房貸與置產知識部落格',
          'url': `${siteUrl}/blog`,
          'description': '彙整最新台灣房地產趨勢、央行信用管制、新青安3.0規範、個人信用聯徵分數提升指南，由金融與估價師專業審核把關。',
          'blogPost': articles.map(a => ({
            '@type': 'BlogPosting',
            'headline': a.title,
            'url': `${siteUrl}/blog/${a.id}`,
            'datePublished': a.date
          }))
        }
      ];
    } else if (path === '/about') {
      schemaData = [
        organizationSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          'name': '關於台灣房貸試算神器團隊',
          'url': `${siteUrl}/about`,
          'description': '關於我們的創立宗旨、隱私安全聲明與台灣標準房貸年金法計算邏輯。'
        }
      ];
    } else if (path === '/contact') {
      schemaData = [
        organizationSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          'name': '聯絡台灣房貸試算神器團隊',
          'url': `${siteUrl}/contact`,
          'description': '如果您有關於房屋貸款計算、新青安試算或廣告合作等需求，歡迎隨時與我們聯絡。'
        }
      ];
    }

    if (schemaData) {
      const schemas = Array.isArray(schemaData) ? schemaData : [schemaData];
      schemas.forEach((schema, idx) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-geo-schema', 'true');
        script.id = `geo-jsonld-schema-${idx}`;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    // Dynamic Title & Meta Description optimization for GEO crawlers
    let docTitle = '青年安心成家購屋優惠貸款3.0方案';
    let docDesc = '全台最專業直覺的房貸試算工具。支援2026最新新青安3.0、首購房貸、寬限期本息攤還、本金攤還計算。完全無廣告干擾，資料留於本地，安全隱私。';

    if (path.startsWith('/blog/')) {
      const article = articles.find(a => a.id === id);
      if (article) {
        docTitle = `${article.title} - 青年安心成家購屋優惠貸款3.0方案`;
        docDesc = article.excerpt;
      }
    } else if (path === '/blog') {
      docTitle = '房貸與新青安3.0最新知識部落格 - 青年安心成家購屋優惠貸款3.0方案';
      docDesc = '彙整最新台灣首購族房貸政策、新青安3.0一生一次限制、聯徵中心信用評分提升祕訣與央行最新信用管制指南。';
    } else if (path === '/about') {
      docTitle = '關於我們 - 青年安心成家購屋優惠貸款3.0方案';
      docDesc = '了解青年安心成家購屋優惠貸款3.0方案試算工具的創立使命、安全無虞的純前端本地運算技術架構，以及嚴謹的房貸計算公式。';
    } else if (path === '/contact') {
      docTitle = '聯絡我們 - 青年安心成家購屋優惠貸款3.0方案';
      docDesc = '有任何房貸試算建議、金融諮詢、政策勘誤或商業合作需求？歡迎隨時與我們取得聯繫。';
    }

    document.title = docTitle;
    
    // Update Meta Description
    let metaDescriptionElement = document.querySelector('meta[name="description"]');
    if (!metaDescriptionElement) {
      metaDescriptionElement = document.createElement('meta');
      metaDescriptionElement.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionElement);
    }
    metaDescriptionElement.setAttribute('content', docDesc);

    // Update OpenGraph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', docTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', docDesc);

  }, [location.pathname, id]);

  return null;
}
