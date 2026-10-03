import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { articles } from '../data/articles';

export function GeoMetadataInjector() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // 1. Remove previous dynamic schema scripts
    const removeExistingSchemas = () => {
      const existingScripts = document.querySelectorAll('script[data-geo-schema="true"]');
      existingScripts.forEach(script => script.remove());
    };
    removeExistingSchemas();

    const path = location.pathname;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tryit.qzz.io';
    const canonicalUrl = `${origin}${path === '/' ? '' : path}`;

    // Base Organization Schema (E-E-A-T credentials)
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      'name': '台灣房貸指南與試算智庫編輯部',
      'url': `${origin}/`,
      'logo': `${origin}/favicon.svg`,
      'email': '111@tryit.qzz.io',
      'description': '台灣最專業權威的房屋貸款試算、首購新青安政策與不動產置產決策智庫。由國家特考合格地政士、估價師與理財顧問團隊共同編審。',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '敦化南路二段',
        'addressLocality': '台北市大安區',
        'addressCountry': 'TW'
      },
      'knowsAbout': [
        '房屋貸款利率與本息本金攤還',
        '青年安心成家購屋優惠貸款精進方案 (新青安)',
        '銀行法第72條之2住宅建築放款30%限額',
        '中央銀行選擇性信用管制第7波措施',
        '房屋買賣過戶規費、契稅與地政登記規費',
        '不動產估價與銀行擔保品鑑價折算率',
        '房貸轉貸省息與違約金損益平衡分析'
      ]
    };

    let title = '台灣房貸指南與試算智庫｜2026新青安、購屋能力與本息攤還分析';
    let description = '台灣最專業權威的房貸試算與購屋智庫，支援2026新青安40年推演、購屋能力逆推、轉貸省息回本精算、銀行法72-2排隊水位實況與本息攤還圖表。由合格地政士與理財顧問團隊嚴謹編審。';
    let pageSchemas: any[] = [organizationSchema];

    // Breadcrumb Helper
    const createBreadcrumbs = (items: { name: string; url: string }[]) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    });

    if (path === '/') {
      title = '台灣房貸指南與試算智庫｜2026新青安、購屋能力與本息攤還分析';
      description = '台灣最專業權威的房貸試算與購屋智庫，支援2026新青安40年推演、購屋能力逆推、轉貸省息回本精算、銀行法72-2排隊水位實況與本息攤還圖表。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': '台灣房屋貸款與新青安線上精準計算機',
          'url': `${origin}/`,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'All',
          'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'TWD' },
          'description': '免費線上房貸計算機，秒算本息攤還、本金攤還、最長5年寬限期、40年貸款年限，完全符合台灣各行庫最新核貸利率公式。'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': '1000萬房貸一個月要還多少錢？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '以新青安貸款優惠利率 1.775%、30年期、無寬限期試算，本息平均攤還每月約需繳款 35,847 元；若採一般商業銀行房貸利率約 2.185%，每月繳款約 37,890 元。若享有 5 年寬限期，新青安寬限期內每月僅需繳息約 14,792 元，第 6 年起開始還本息，月付金增至約 41,200 元。'
              }
            },
            {
              '@type': 'Question',
              'name': '本息平均攤還跟本金平均攤還哪個比較划算？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '「本息平均攤還」每個月繳的總金額完全相同，好處是財務現金流穩定預測，適合薪水固定的上班族；「本金平均攤還」每個月償還固定金額的本金，利息則隨本金減少而逐期降低，初期繳款負擔最重，但整個貸款期間繳出的「總利息」最少，適合手頭自備資金較充足的買方。'
              }
            },
            {
              '@type': 'Question',
              'name': '什麼是銀行法第 72 條之 2 滿水位？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '中華民國《銀行法》第72條之2規定，商業銀行辦理住宅建築及企業建築放款總額，不得超過放款時所收存款總餘額及金融債券發售額之和的30%。當各銀行房貸接近警戒水位（通常為28%~28.5%）時，便會啟動限貸管制、拉高利率或排隊審查撥款，造成撥款週期延長至 45~60 天。'
              }
            }
          ]
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` }
        ])
      );
    } else if (path === '/affordability') {
      title = '購屋能力評估與自備款逆推計算機｜買多少房才不吃緊？房貸負擔能力試算';
      description = '依據家庭月收入、現有自備款與 333 購屋法則，精算您能負擔的合理房屋總價與安全月付金，避開房貸成數不足與現金流斷水危機。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': '購屋負擔能力與自備款逆推計算機',
          'url': `${origin}/affordability`,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'All',
          'description': '依據月薪所得、每月可支配支出及現有頭期款，精算購屋最高預算、首購成數及每月安全房貸償還金額。'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': '買房自備款到底要準備幾成？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '一般住宅建議自備款至少準備總價的 2 成至 2.5 成。除了房屋頭期款之外，還需預留約總價 3%~5% 作為交屋代書規費、契稅、印花稅、履約保證手續費及初期基本家電裝潢準備金。'
              }
            },
            {
              '@type': 'Question',
              'name': '什麼是 333 購屋黃金法則？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '「333 法則」是指：自備款準備房屋總價的 1/3；每月房貸支出不超過家庭每月總淨收入的 1/3；剩餘的 1/3 作為日常生活開銷、家庭育兒與緊急預備金，以確保家庭財務穩健不受升息衝擊。'
              }
            }
          ]
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '購屋能力評估', url: `${origin}/affordability` }
        ])
      );
    } else if (path === '/closing-costs') {
      title = '買房交屋總成本與隱形規費精算機｜契稅、代書費、登記規費與裝潢準備金';
      description = '首購族必看！全台最詳細的交屋隱形支出計算器：房屋契稅(6%)、地政規費(0.1%)、印花稅、代書費、履約保證金及管委會預繳款完整明細一鍵試算。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': '買房交屋總成本與隱形規費精算機',
          'url': `${origin}/closing-costs`,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'All',
          'description': '全台首創包含契稅、地政登記規費、代書簽約過戶費、履保金與社區管理費預繳之買房交屋全費用計算機。'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': '買房交屋時，契稅是怎麼計算的？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '買方需繳納的契稅計算公式為：房屋移轉現值（非實價登錄市價，而是地方稅捐稽徵處評定的房屋課稅現值）× 契稅稅率 6%。契稅通常在過戶前由承辦代書開立稅單通知買方繳納。'
              }
            },
            {
              '@type': 'Question',
              'name': '買賣不動產代書費通常是多少？買賣雙方如何分攤？',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': '代書簽約費約 2,000~3,000 元（雙方均分）；所有權買賣移轉登記代書費約 15,000~20,000 元（買方負擔）；若有辦理銀行房貸，抵押權設定代書費約 5,000~8,000 元（買方負擔）；實價登錄代辦費約 2,000~3,000 元（買方負擔）。'
              }
            }
          ]
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '買房總規費精算', url: `${origin}/closing-costs` }
        ])
      );
    } else if (path === '/early-repay-vs-invest') {
      title = '房貸提早還清 vs 存股 0050 投資決策模型｜提早還本金還是定期定額ETF？';
      description = '有額外資金或年終該先還房貸還是買ETF？精算 30 年終端資產差距、房貸省息與存股 0050/高股息的機會成本、升息風險與年齡適配指南。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': '房貸提早還清 vs 存股 0050 決策模型',
          'url': `${origin}/early-repay-vs-invest`,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'All',
          'description': '比較加速償還房貸所節省的房貸利息支出 vs 將資金長期定期定額投入台灣50 (0050) 或全球股票市場之資產終端價值對比。'
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '房貸vs存股0050', url: `${origin}/early-repay-vs-invest` }
        ])
      );
    } else if (path === '/refinance-calc') {
      title = '房貸轉貸損益與回本期精算器｜降息幅度能打平違約金與代書規費嗎？';
      description = '輸入現有房貸餘額、各行庫新轉貸利率與違約金，精算每月省息金額、轉貸總規費成本，並得出精確損益平衡回本月數。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': '房貸轉貸損益與回本期精算器',
          'url': `${origin}/refinance-calc`,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'All',
          'description': '提供轉貸新舊利率對比、違約金評估、塗銷抵押權設定規費、精算轉貸省息回本所需月數。'
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '轉貸省息試算', url: `${origin}/refinance-calc` }
        ])
      );
    } else if (path === '/new-youth-compare') {
      title = '2026新青安40年 vs 30年房貸利息與月繳沙盤推演｜寬限期月付金大剖析';
      description = '全面剖析新青安 40 年與 30 年月付金差距、寬限期 5 年後月繳暴增幅度、一生一次自住切結書與大數據稽查違規轉租風險。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': '新青安 40年 vs 30年 試算比較器',
          'url': `${origin}/new-youth-compare`,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'All'
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '新青安推演', url: `${origin}/new-youth-compare` }
        ])
      );
    } else if (path === '/bank-quota') {
      title = '銀行法 72-2 滿水位即時排隊看板｜全台銀行房貸額度與撥款天數實況';
      description = '即時追蹤臺灣銀行、土地銀行、富邦、國泰等全台公私立行庫最新房貸額度狀態、排隊撥款天數 (30~60天)、收件限制與地板利率。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          'name': '台灣各大金融機構房貸授信與銀行法72-2放款額度水位表',
          'description': '收錄台灣主要公股與民營商業銀行房屋貸款最新地板利率、銀行法72-2水位狀態及審核撥款預估工作天數。',
          'url': `${origin}/bank-quota`
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '72-2 銀行看板', url: `${origin}/bank-quota` }
        ])
      );
    } else if (path.startsWith('/blog/')) {
      const article = articles.find(a => a.id === id);
      if (article) {
        title = `${article.title}｜台灣房貸指南與試算智庫`;
        description = article.excerpt;

        const isNewYouth = article.id === 'new-youth-mortgage-3-0-complete-guide';
        const articleFaqs = isNewYouth ? [
          {
            '@type': 'Question',
            'name': '新青安 3.0 的「一生限貸一次」政策如何認定？',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': '自 2024 年 6 月 27 日起，每人一生僅可申辦並撥款一次新青安優惠房貸，即使後續售屋結清，亦不可再次使用。申請時，本人、配偶及未成年子女名下均必須無自有住宅。'
            }
          },
          {
            '@type': 'Question',
            'name': '銀行是如何查核新青安是否違規轉租或非自住？',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': '銀行、財政部與國稅局建立多重勾稽大數據系統：1. 自動勾稽租金補貼申請資料；2. 核對設籍異常；3. 篩選台電與自來水帳單度數，若用水用電極低或無居住事實，將進行實地調查。'
            }
          }
        ] : [
          {
            '@type': 'Question',
            'name': '1000萬房貸一個月要還多少錢？',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': '以2026年利率約2.185%、30年期無寬限期試算，每月本息平均攤還約37,890元；若採新青安1.775%、30年期，每月繳約35,847元。'
            }
          }
        ];

        pageSchemas.push(
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': `${origin}/blog/${article.id}#article`,
            'isPartOf': {
              '@type': 'WebPage',
              '@id': `${origin}/blog/${article.id}`
            },
            'headline': article.title,
            'description': article.excerpt,
            'image': `${origin}/og-image.jpg`,
            'datePublished': `${article.date}T08:00:00+08:00`,
            'dateModified': '2026-09-28T12:00:00+08:00',
            'author': {
              '@type': 'Person',
              'name': '陳冠宇 地政士',
              'jobTitle': '國家特考合格地政士 / 智庫資深不動產法規顧問',
              'worksFor': {
                '@type': 'Organization',
                'name': '台灣房貸指南與試算智庫'
              }
            },
            'publisher': {
              '@id': `${origin}/#organization`
            },
            'mainEntityOfPage': `${origin}/blog/${article.id}`,
            'isAccessibleForFree': true,
            'citation': [
              'https://www.mof.gov.tw/',
              'https://www.cbc.gov.tw/',
              'https://www.fsc.gov.tw/',
              'https://www.land.moi.gov.tw/'
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': articleFaqs
          },
          createBreadcrumbs([
            { name: '首頁', url: `${origin}/` },
            { name: '房貸知識庫', url: `${origin}/blog` },
            { name: article.title, url: `${origin}/blog/${article.id}` }
          ])
        );
      }
    } else if (path === '/blog') {
      title = '房貸知識庫與買房政策專題庫｜56篇地政士與估價師專業審定文章';
      description = '深入淺出的房貸知識、央行選擇性信用管制、新青安一生一次防坑指南、聯徵分數提升法與重購退稅全攻略。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          'name': '台灣房貸指南與試算智庫專題知識庫',
          'url': `${origin}/blog`,
          'description': '彙整最新台灣房地產趨勢、央行信用管制、新青安3.0規範、個人信用聯徵分數提升指南，由金融與估價師專業審核把關。',
          'blogPost': articles.slice(0, 30).map(a => ({
            '@type': 'BlogPosting',
            'headline': a.title,
            'url': `${origin}/blog/${a.id}`,
            'datePublished': a.date
          }))
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '房貸知識庫', url: `${origin}/blog` }
        ])
      );
    } else if (path === '/about') {
      title = '關於智庫與專業編審團隊資歷｜台灣房貸指南與試算智庫';
      description = '認識台灣房貸指南與試算智庫的國家特考合格地政士、估價師與 CFP® 理財規劃顧問團隊，秉持客觀透明與專業查核。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          'name': '關於台灣房貸指南與試算智庫編審團隊',
          'url': `${origin}/about`,
          'description': '智庫創立宗旨、國家特考合格地政士與估價師資歷說明，遵循金融消費者保護精神。'
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '關於智庫', url: `${origin}/about` }
        ])
      );
    } else if (path === '/editorial-policy') {
      title = '編審方針、事實查核與廣告政策｜台灣房貸指南與試算智庫';
      description = '說明本智庫 YMYL 財務法規審核標準、國家證照專家事實查核流程與 Google 網站發布商廣告品質自律政策。';
      pageSchemas.push(
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '編審方針', url: `${origin}/editorial-policy` }
        ])
      );
    } else if (path === '/contact') {
      title = '讀者反饋與政策勘誤聯絡處｜台灣房貸指南與試算智庫';
      description = '如果您發現任何法規異動、銀行授信政策更動或有功能建議，歡迎隨時向智庫編審團提出。';
      pageSchemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          'name': '聯絡台灣房貸指南與試算智庫',
          'url': `${origin}/contact`
        },
        createBreadcrumbs([
          { name: '首頁', url: `${origin}/` },
          { name: '讀者反饋', url: `${origin}/contact` }
        ])
      );
    }

    // 2. Inject Schemas into document.head
    pageSchemas.forEach((schema, idx) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-geo-schema', 'true');
      script.id = `geo-jsonld-schema-${idx}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // 3. Update DOM Title
    document.title = title;

    // 4. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 5. Update Canonical Tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 6. Update OpenGraph Tags
    const setMetaProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', canonicalUrl);
    setMetaProperty('og:site_name', '台灣房貸指南與試算智庫');
    setMetaProperty('og:type', path.startsWith('/blog/') ? 'article' : 'website');

    // 7. Update Twitter Tags
    const setMetaName = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);
    setMetaName('twitter:url', canonicalUrl);

  }, [location.pathname, id]);

  return null;
}
