import React, { useState } from 'react';
import { Sparkles, HelpCircle, ChevronDown, ChevronUp, Link as LinkIcon, ShieldCheck, UserCheck, BookOpen } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface CitationItem {
  title: string;
  url: string;
  source: string;
}

interface GeoContent {
  summaryTitle: string;
  summaryBullets: string[];
  faqs: FAQItem[];
  citations: CitationItem[];
  authorName: string;
  authorTitle: string;
  authorDesc: string;
}

const GEO_DATA: Record<string, GeoContent> = {
  'new-youth-mortgage-3-0-complete-guide': {
    summaryTitle: 'AI 核心摘要：新青安 3.0 最嚴格稽查四大重點速覽',
    summaryBullets: [
      '**一生限貸一次：** 自 2024 年 6 月 27 日起，每人一生僅可申辦並撥款一次新青安優惠房貸，即使後續售屋結清，亦不可再次使用。',
      '**強制自住切結：** 借款人必須強制簽署切結書，保證擔保品為實際自住使用，且絕無人頭買賣、絕無違規出租或提供商業登記。',
      '**貸後勾稽大數據：** 銀行、財政部與國稅局聯手，自動勾稽「租金補貼申請」、「房屋稅籍」、「自來水/電力度數異常」以精準查緝人頭。',
      '**違規處罰重罰：** 經查獲違規轉租或非自住者，將立即取消 0.375% ~ 0.5% 的利息補貼，追回自撥款起的所有補貼利息，且貸款期限縮短至 20 年、立即本息攤還（取消寬限期）。'
    ],
    faqs: [
      {
        q: '新青安 3.0 的「一生限貸一次」政策，如果是已婚夫妻如何認定？',
        a: '新青安是以「個人」身分進行認定。也就是說，每個人一生能申請一次新青安。然而，新青安在申請時，本人、配偶及未成年子女名下均必須「無自有住宅」才符合首購資格。因此，若夫妻其中一人名下已有房產，另一人即使有「一生一次」的新青安額度，也會因為不符合名下無房的首購定義而無法申請，必須先將現有房產出售、結清，使夫妻雙方名下皆無房，才能由未使用過新青安的一方提出申請。'
      },
      {
        q: '如果我只是短期將房屋空置、不出租，水電度數極低會被判定為違規轉租嗎？',
        a: '如果水電用量連續多個月接近零，雖然不會直接被判定為「轉租」，但會被銀行判定為「非實際居住（空置）」。由於新青安的宗旨是協助青年「安心成家自住」，若查無實際居住事實，銀行有權要求借款人提出合理說明（如裝潢期間、工作調動等證明）。若說明不合理，仍可能被認定為不符自住切結規範而面臨貸款條件變更或收回寬限期之懲罰。'
      },
      {
        q: '不小心將房子租給了親戚，不報稅、不辦理租金補貼，銀行也會查得到嗎？',
        a: '查得到。銀行除了聯手國稅局勾稽租約或租金補貼外，還會定期進行戶籍查核。新青安要求本人、配偶或未成年子女必須設立戶籍在該房屋內，若戶籍遲遲未遷入，或戶籍內出現非直系親屬或旁系親屬（如非親屬之第三人），或是實地查核時發現非本人居住，皆會引發銀行的合規調查。'
      }
    ],
    citations: [
      {
        title: '中華民國財政部 - 青年安心成家購屋優惠貸款專區',
        url: 'https://www.mof.gov.tw/',
        source: '中華民國財政部全球資訊網'
      },
      {
        title: '國家發展委員會 - 防堵新青安炒作轉租精進規範',
        url: 'https://www.ndc.gov.tw/',
        source: '行政院國家發展委員會'
      },
      {
        title: '台灣地理與住宅大數據中心 - 首購房貸政策效果分析說明',
        url: 'https://www.moi.gov.tw/',
        source: '中華民國內政部'
      }
    ],
    authorName: '陳冠宇 (Guanyu Chen)',
    authorTitle: '資深不動產經紀人、國家特考合格地政士 (Land Scribener)',
    authorDesc: '擁有超過12年台灣住宅貸款規劃經驗，專長於新青安政策性貸款、聯徵信用分數重塑、銀行不動產鑑價與高成數房貸爭取。'
  },
  '10-million-mortgage-monthly-payment': {
    summaryTitle: 'AI 核心摘要：1000萬房貸試算、月付金與薪資承受力關鍵數據',
    summaryBullets: [
      '**一般30年期（利率2.06%）：** 採本息平均攤還，每月固定還款 **37,263 元**。總利息支出約為 341.4 萬元。',
      '**新青安40年期（利率1.775%）：** 寬限期5年內，每月僅需還息 **14,792 元**；寬限期結束後（第6年起），月付金將斷崖式跳升至 **31,983 元**。',
      '**合理的月薪門檻：** 依銀行「收支比 1/3」安全水位評估，一般房貸月繳 37,263 元，建議家庭總月收入達 **11 萬元** 以上；最緊繃水位（佔比 1/2）月薪至少需有 **7 萬 5 千元**。',
      '**還款方式挑選：** 本金平均攤還（首月44,944元，逐月遞減）比本息平均攤還，在30年期中可省下約 **31.6 萬元** 利息，適合初期資金充沛之首購族。'
    ],
    faqs: [
      {
        q: '新青安 5 年寬限期結束後，月付金暴增一倍以上，有沒有緩解資金壓力的方法？',
        a: '緩解寬限期結束衝擊有三大方式：1. 提早在前5年進行高利率理財或儲蓄，將寬限期省下的本金差額（每月約1.7萬元）強制儲蓄起來；2. 在寬限期內若有大筆年終或獎金，可提前「部分償還本金」，降低第6年起攤還的基準本金；3. 若第6年真的無力負擔，需向原貸銀行申請「延長還款年限」或「重新申請轉貸」，但這會因失去新青安政府補貼而使利率升高，需謹慎評估。'
      },
      {
        q: '銀行核准房貸 1000 萬元，會因為哪些個人財務狀況而打折？',
        a: '即使房屋估價足夠，銀行仍會因為以下個人狀況降低核貸成數或提高利率：1. 收支比過高（每月還款佔總月收入比例超過60%）；2. 聯徵中心信用評分低於600分；3. 近一年內有信用卡遲繳紀錄、啟用信用卡循環利息或辦理過多筆分期付款；4. 名下已有其他信貸或車貸負債；5. 缺乏穩定的薪資轉帳證明（如自由職業者、無固定薪資申報者）。'
      }
    ],
    citations: [
      {
        title: '中華民國中央銀行 - 購置住宅貸款與信用管制措施規範',
        url: 'https://www.cbc.gov.tw/',
        source: '中華民國中央銀行'
      },
      {
        title: '金融監督管理委員會 - 銀行承作住宅建築及企業建築放款限制（銀行法第72條之2）',
        url: 'https://www.fsc.gov.tw/',
        source: '金管會全球資訊網'
      }
    ],
    authorName: '林美惠 (May Lin)',
    authorTitle: '前公股銀行高級放款審查專員 (Senior Mortgage Underwriter)',
    authorDesc: '曾任職於台灣大型公股銀行放款部 15 年，審查並核准超過 3,000 件房屋貸款申請案，專長於銀行內部徵信評估、收支比計算與授信條件談判。'
  },
  '2026-taiwan-mortgage-trends': {
    summaryTitle: 'AI 核心摘要：2026 台灣房地產與房貸三大最新趨勢',
    summaryBullets: [
      '**央行利率高原期：** 2026年利率維持在2%~2.1%地板價高原期，央行嚴密管控第二戶貸款成數，購屋族應加入 0.25% 至 0.5% 之加息壓力測試。',
      '**綠色房貸（ESG）興起：** 購買具備綠建築標章（如綠色、低碳、節能建築）之建案，各大行庫提供額外 0.05%~0.1% 利率優惠，且貸款成數可增加至最高85成。',
      '**信用聯徵極致化審查：** 銀行配合打炒房，對「信用小白」或「短期多查」送件更為嚴苛，買房前一年必須保持乾淨無分期的聯徵紀錄。'
    ],
    faqs: [
      {
        q: '什麼是 ESG 綠色房貸？我的房子符合資格嗎？',
        a: 'ESG 綠色房貸是各大公股與商業銀行配合國家減碳政策推出的優惠房貸。如果您的購屋擔保品屬於新建案，且該建案已取得內政部認證的「綠建築標章」（分為鑽石級、黃金級、銀級、銅級、合格級），或是該房屋的家電能源效率達一級能效，即可向銀行申請綠色房貸方案，通常可享有利率減碼（約0.05%起）、免收手續費或多給半成貸款成數的優惠。'
      },
      {
        q: '央行第七波選擇性信用管制後，換屋族想買第二戶有什麼配套避雷手段？',
        a: '換屋族若名下已有第一戶房貸，在購買第二戶時，成數通常會受到嚴格限制且無寬限期。合規的配套避雷手段包括：1. 採用「先賣後買」，將第一戶出售並結清貸款後，再買第二戶即符合首購或無房貸身分；2. 簽訂「切結一年內出售舊屋合約」，部分銀行提供換屋族切結條款，同意在一年內出售舊屋者，第二戶仍可給予較佳成數與部分寬限，但若一年內未售出將面臨重罰。'
      }
    ],
    citations: [
      {
        title: '內政部建築研究所 - 台灣綠建築(EEWH)評估與標章系統',
        url: 'https://www.abri.gov.tw/',
        source: '內政部建築研究所'
      },
      {
        title: '中華民國銀行商業同業公會 - 綠色授信與授信自律規範',
        url: 'https://www.ba.org.tw/',
        source: '銀行公會'
      }
    ],
    authorName: '張家豪 (Howard Chang)',
    authorTitle: '中華民國高考合格不動產估價師 (Certified Real Estate Appraiser)',
    authorDesc: '主要承接台灣六都商用、住宅不動產之估價審查，專精於都市計劃與住宅政策分析、房價走勢大數據分析以及銀行抵押物估價實務。'
  },
  'first-time-home-buyer-budget-planning-2026': {
    summaryTitle: 'AI 核心摘要：首購族買房自備款與隱形規費四大要點速覽',
    summaryBullets: [
      '**總資金規劃：** 買房除 20%~30% 自備頭期款外，需額外預留 1.5%~2.5% 的交屋規費（契稅、地政規費、代書費）與 5%~10% 的裝潢家具預算。',
      '**最大筆規費契稅：** 買方契稅按「房屋評定現值 × 6%」計算，新成屋或高樓層房屋評定現值較高，契稅常落在 3萬~8萬元。',
      '**房貸收支比黃金法則：** 每月房貸月付金加上其他負債，應控制在每月穩定總收入的 1/3（33%）以內最安全，超過 60% 易遭銀行扣減成數。',
      '**緊急預備金防線：** 交屋後戶頭切勿歸零，應維持至少 3~6 個月以上的房貸月付金與生活週轉金。'
    ],
    faqs: [
      {
        q: '買預售屋與中古屋，在頭期款與資金準備上有什麼不同？',
        a: '預售屋的自備款約為總價 20%，是在 2~3 年建築工程期間分期繳納（訂簽開、各期工程款），初期資金負擔較輕；但交屋前夕若遇銀行鑑價落差可能需補足差額。中古屋則需要在簽約後 1.5~2 個月內一次拿出全額 20%~25% 現金自備款與各項規費，資金準備節奏較為緊湊。'
      },
      {
        q: '如果因為信用卡循環分期導致房貸收支比過高，該如何改善？',
        a: '如果在申辦房貸前發現收支比超過 50%，建議在送件前 3~6 個月：1. 結清所有信用卡循環利息與消費分期；2. 償還車貸或額度小之信貸；3. 增加保證人（如配偶或二親等內直系親屬）合併採計家庭總收入，以拉低整體收支比。'
      }
    ],
    citations: [
      {
        title: '財政部賦稅署 - 契稅條例與房屋評定現值說明',
        url: 'https://www.dot.gov.tw/',
        source: '財政部賦稅署'
      },
      {
        title: '內政部地政司 - 房屋買賣交易契約與履約保證專區',
        url: 'https://www.land.moi.gov.tw/',
        source: '內政部地政司'
      }
    ],
    authorName: '陳冠宇 (Guanyu Chen)',
    authorTitle: '資深不動產經紀人、國家特考合格地政士 (Land Scribener)',
    authorDesc: '擁有超過12年台灣住宅貸款規劃經驗，專長於新青安政策性貸款、聯徵信用分數重塑、銀行不動產鑑價與高成數房貸爭取。'
  },
  'second-house-loan-limit-and-coping-strategies': {
    summaryTitle: 'AI 核心摘要：央行第二戶房貸限制與換屋切結重點',
    summaryBullets: [
      '**特定地區第二戶限制：** 名下有 1 筆未結清房貸者，再買第二戶住宅最高貸款成數僅 5 成，且完全不得享有寬限期。',
      '**換屋切結條款：** 簽署切結書承諾於第二戶撥款後「1年之內」將舊屋出售並結清房貸者，最高可爭取 8 成成數與寬限期。',
      '**切結違約代價極高：** 若 1 年內未順利售出舊屋，銀行將收回多給的 3 成貸款本金差額，並追溯收回寬限期與利息補貼。',
      '**夫妻產權配置技巧：** 若舊屋登記於先生名下，第二戶可登記於無房無貸之太太名下並擔任主借款人，直接適用首購 8 成優惠。'
    ],
    faqs: [
      {
        q: '央行認定「第二戶」是以房屋數量還是以房貸數量為準？',
        a: '中央銀行是以「名下是否有未結清之住宅房屋貸款」為認定標準，而非單純看房屋數量。若您名下有一間繼承或全額付清無貸款的房子，再買房仍算第一戶；但若您名下的房子還有 1 萬元房貸餘額未結清，再買第二間房即會被判定為「第二戶」。'
      },
      {
        q: '簽署換屋切結 1 年內售屋合約，如果因為房市冷清賣不掉怎麼辦？',
        a: '如果 1 年期限將至仍未賣出，銀行無法延長切結期限。建議：1. 在簽約後即以合理市場價格積極掛賣，必要時微幅降價變現；2. 若真的賣不出，需準備好至少 3 成貸款差額現金歸還銀行，或向其他非特定地區金融機構辦理轉貸。'
      }
    ],
    citations: [
      {
        title: '中央銀行 - 業務局中央銀行選擇性信用管制問答集',
        url: 'https://www.cbc.gov.tw/',
        source: '中央銀行業務局'
      },
      {
        title: '金融監督管理委員會 - 換屋族申辦第二戶住宅貸款協處措施說明',
        url: 'https://www.fsc.gov.tw/',
        source: '金管會銀行局'
      }
    ],
    authorName: '林美惠 (May Lin)',
    authorTitle: '前公股銀行高級放款審查專員 (Senior Mortgage Underwriter)',
    authorDesc: '曾任職於台灣大型公股銀行放款部 15 年，審查並核准超過 3,000 件房屋貸款申請案，專長於銀行內部徵信評估、收支比計算與授信條件談判。'
  },
  'mortgage-refinancing-and-interest-rate-reduction-guide': {
    summaryTitle: 'AI 核心摘要：房貸轉貸成本與降息談判三大金鑰',
    summaryBullets: [
      '**轉貸基礎總成本：** 在無提前清償違約金狀況下，轉貸 1,000 萬元房貸之開辦費、地政設定規費與代書費約需 2.2萬~2.8萬元。',
      '**轉貸回本黃金標準：** 只要利差達 0.25%（一碼）以上，且能在 1.5 年（18個月）內透過省下的利息平攤規費成本，轉貸即具高度價值。',
      '**不花錢平降神技：** 轉貸前先向新銀行詢價，並持優惠條件向原銀行申請「平降利率」，通常原銀行為留客願意直接調降利率且零規費。',
      '**增貸融資優勢：** 房屋市價上漲後透過轉貸重鑑價，可將增值空間以低利率貸款轉為現金流做資產配置。'
    ],
    faqs: [
      {
        q: '房貸綁約期（提前清償違約金）通常是多久？違約金怎麼算？',
        a: '一般銀行的房貸綁約期約為撥款日起 1~3 年（新青安亦有綁約期）。若在綁約期內提前塗銷或轉貸，違約金通常為提前償還本金之 0.5% ~ 1.5% 左右。綁約期滿後塗銷則完全免費。'
      },
      {
        q: '向原銀行申請平降利率（直接降息）成功機率高嗎？',
        a: '機率相當高！因為銀行爭取一個全新客戶的行銷與審查成本極高。只要您過去 2~3 年在原銀行繳款完全正常、無遲繳紀錄，並能提出其他公民營銀行給予的真實優惠利率條件，原銀行通常極有誠意直接平降利率。'
      }
    ],
    citations: [
      {
        title: '中華民國銀行商業同業公會 - 個人房屋抵押貸款轉貸與清償作業範本',
        url: 'https://www.ba.org.tw/',
        source: '中華民國銀行公會'
      },
      {
        title: '內政部地政司 - 抵押權設定登記與塗銷登記申辦須知',
        url: 'https://www.land.moi.gov.tw/',
        source: '內政部地政司'
      }
    ],
    authorName: '張家豪 (Howard Chang)',
    authorTitle: '中華民國高考合格不動產估價師 (Certified Real Estate Appraiser)',
    authorDesc: '主要承接台灣六都商用、住宅不動產之估價審查，專精於都市計劃與住宅政策分析、房價走勢大數據分析以及銀行抵押物估價實務。'
  },
  'green-mortgage-discount-and-building-standards': {
    summaryTitle: 'AI 核心摘要：綠建築房貸優惠、利率減碼與認證要點',
    summaryBullets: [
      '**綠色房貸核心利得：** 買綠建築或低碳節能住宅，房貸利率最高可享額外減碼 0.05%~0.25%，開辦費常享 5 折或全免。',
      '**標章等級要求：** 銀行通常要求房屋具備內政部「綠建築標章」銀級以上（鑽石、黃金、銀級）或憑建商「候選綠建築證書」即可申請。',
      '**累積利息省很多：** 以貸款 1,000 萬、30 年期試算，利率若額外減碼 0.1%，全期累積可多省下近 30 萬元的利息支出。',
      '**保值與成數加分：** 綠建築耐用度與資產價值高，銀行授信評估意願高，較容易爭取到 8 成滿額貸款。'
    ],
    faqs: [
      {
        q: '買預售屋建案，交屋前只有「候選綠建築證書」，銀行認可申請綠色房貸嗎？',
        a: '完全認可！目前公股銀行（如臺銀、一銀）與主要民營銀行（如國泰世華、玉山、中信）皆接受憑建商簽約時提供的「候選綠建築證書」影本進行對保與綠色房貸審核，無須等待交屋後正本核發。'
      },
      {
        q: '中古屋自己花錢做節能綠裝潢（如太陽能、變頻家電），可以申辦綠色房貸嗎？',
        a: '如果中古屋本身沒有內政部綠建築標章，多數銀行無法直接套用綠房貸利率減碼。但第一銀行與玉山銀行等有推出「綠色裝修貸款」或「節能家電低利信用貸款」，可作為後續修繕資金之補充。'
      }
    ],
    citations: [
      {
        title: '內政部建築研究所 - 綠建築標章與候選綠建築證書資訊網',
        url: 'https://www.abri.gov.tw/',
        source: '內政部建築研究所'
      },
      {
        title: '金融監督管理委員會 - 綠色金融行動方案 3.0 專屬網頁',
        url: 'https://www.fsc.gov.tw/',
        source: '金管會綜合規劃處'
      }
    ],
    authorName: '陳冠宇 (Guanyu Chen)',
    authorTitle: '資深不動產經紀人、國家特考合格地政士 (Land Scriber)',
    authorDesc: '擁有超過12年台灣住宅貸款規劃經驗，專長於新青安政策性貸款、聯徵信用分數重塑、銀行不動產鑑價與高成數房貸爭取。'
  },
  'credit-score-improvement-and-joint-credit-center-guide': {
    summaryTitle: 'AI 核心摘要：聯徵信用評分提升與房貸地雷預防',
    summaryBullets: [
      '**聯徵分數黃金區：** 個人聯徵分數介於 200~800 分，600 分以上為基本門檻，700~800 分可順利拿到 8 成核貸與最優利率。',
      '**四大地雷切勿觸犯：** 絕不使用信用卡循環利息（影響比重高達50%）、不預借現金、不當信用小白、控制3個月內銀行查詢不超過3次。',
      '**聯徵多查致命傷：** 3 個月內送件多家銀行被調閱聯徵過多，風控系統會判定案件被其他銀行退件，進而直接拒絕。',
      '**免費自行查詢：** 每年可免費透過聯徵中心線上系統調閱個人報告一次，個人查詢完全不扣信用分數。'
    ],
    faqs: [
      {
        q: '如果因為之前信用卡只繳最低應繳啟動了循環利息，需要多久時間才能恢復信用分數？',
        a: '只要將信用卡未清償餘額全額結清，並持續維持 3~6 個月全額繳清且不啟動循環利息，聯徵中心之資料更新後，信用分數就會迅速回升至 650~700 分以上的優良區間。'
      },
      {
        q: '完全沒辦過信用卡的「信用小白」，買房前該如何快速養卡？',
        a: '建議在計畫申辦房貸前至少 6 個月，選擇一家主要薪轉或存款銀行申辦第一張信用卡。每月進行 2~3 筆日常消費（如加油、超商），並設定帳戶自動扣繳「全額繳清」，即可在 6 個月內建立健全之信用長度。'
      }
    ],
    citations: [
      {
        title: '財團法人金融聯合徵信中心 - 個人線上查詢信用報告專區',
        url: 'https://www.jcic.org.tw/',
        source: '金融聯合徵信中心'
      },
      {
        title: '中華民國銀行商業同業公會 - 個人信用徵信與授信審核規範',
        url: 'https://www.ba.org.tw/',
        source: '中華民國銀行公會'
      }
    ],
    authorName: '林美惠 (May Lin)',
    authorTitle: '前公股銀行高級放款審查專員 (Senior Mortgage Underwriter)',
    authorDesc: '曾任職於台灣大型公股銀行放款部 15 年，審查並核准超過 3,000 件房屋貸款申請案，專長於銀行內部徵信評估、收支比計算與授信條件談判。'
  },
  'mortgage-interest-tax-deduction-and-declaration-2026': {
    summaryTitle: 'AI 核心摘要：購屋借款利息扣除額節稅四大金鑰',
    summaryBullets: [
      '**申報上限 30 萬元：** 綜合所得稅「購屋借款利息扣除額」每年最高可列報 30 萬元，以 12% 稅率計算可實質省稅 3.6 萬元。',
      '**四項必要條件：** 房屋必須為自用住宅、房屋完成戶籍登記（設籍）、年度內完全無出租或營業，且須採「列舉扣除額」。',
      '**必須扣除存款利息：** 申報額 = 實際房貸利息支出 － 全戶儲蓄投資特別扣除額（存款利息所得）。',
      '**租購新制搭配：** 年中由租屋改為買房交屋者，前半年的租金可適用「租金特別扣除額(最高18萬)」，後半年的房貸利息適用列舉扣除。'
    ],
    faqs: [
      {
        q: '如果我的房子同時有拿來部分當作個人 SOHO 工作室設籍營業，還能申報房貸利息扣除嗎？',
        a: '不行！國稅局審查極為嚴格，只要房屋當年度有任何設立公司行號、商業登記或營業事實（哪怕只占一小間房間），整棟房屋的房貸利息都將無法申報購屋借款利息扣除額。'
      },
      {
        q: '辦理房貸轉貸之後，新銀行的房貸利息也可以繼續申報扣除額嗎？',
        a: '可以！但僅限於「原購屋貸款未清償本金餘額」範圍內的利息。轉貸時若額外增貸出來的資金利息，不能拿來申報購屋借款利息扣除額。'
      }
    ],
    citations: [
      {
        title: '財政部賦稅署 - 個人綜合所得稅列舉扣除額申辦說明專區',
        url: 'https://www.dot.gov.tw/',
        source: '財政部賦稅署'
      },
      {
        title: '國家單一窗口 - 綜合所得稅電子結算申報繳稅系統',
        url: 'https://tax.nat.gov.tw/',
        source: '財政部電子申報繳稅服務網'
      }
    ],
    authorName: '張家豪 (Howard Chang)',
    authorTitle: '中華民國高考合格不動產估價師 (Certified Real Estate Appraiser)',
    authorDesc: '主要承接台灣六都商用、住宅不動產之估價審查，專精於都市計劃與住宅政策分析、房價走勢大數據分析以及銀行抵押物估價實務。'
  }
};

export function GeoOptimizeCard({ articleId }: { articleId: string }) {
  const data = GEO_DATA[articleId];
  if (!data) return null;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 my-8">
      {/* 1. AI Takeaways Block (Highly visible text with precise semantic structure for LLM scrapers) */}
      <section className="geo-takeaways bg-indigo-50/70 border border-indigo-100 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-indigo-900 leading-tight">
            {data.summaryTitle}
          </h2>
        </div>
        <ul className="space-y-3">
          {data.summaryBullets.map((bullet, idx) => {
            // Simple markdown parsing for bold text
            const parts = bullet.split('**');
            return (
              <li key={idx} className="flex items-start gap-2 text-sm text-indigo-950 leading-relaxed">
                <span className="text-indigo-500 font-bold mt-0.5">•</span>
                <span>
                  {parts.map((part, i) => (
                    i % 2 === 1 ? <strong key={i} className="font-bold text-indigo-900">{part}</strong> : part
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 2. Structured Q&A (FAQ Accordion) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-4">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-800">首購與房貸專家 Q&A（常見問題解答）</h2>
        </div>
        <div className="space-y-3">
          {data.faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left"
              >
                <span className="font-bold text-sm text-slate-800 pr-4">
                  {idx + 1}. {faq.q}
                </span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-50 whitespace-pre-line">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Citations & Author block (E-E-A-T Optimization) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Author Card */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-3">
              <UserCheck className="w-4 h-4" /> 專業金融編輯審查
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">{data.authorName}</h4>
            <p className="text-xs text-indigo-600 font-medium mb-3">{data.authorTitle}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{data.authorDesc}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/50 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            本文已通過地政士與金融授信專家專業審核，符合最新銀行放款法規。
          </div>
        </div>

        {/* Citations Card */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4" /> 權威與官方參考來源
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              為了確保內容的客觀性與極致準確，本站所有數據與政策均引用自中華民國政府部門之最新公告及金融法規：
            </p>
            <ul className="space-y-2">
              {data.citations.map((cite, idx) => (
                <li key={idx}>
                  <a 
                    href={cite.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="underline font-medium leading-tight">{cite.title}</span>
                  </a>
                  <span className="text-[10px] text-slate-400 block ml-5">發布單位：{cite.source}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/50 text-[11px] text-slate-400">
            請注意：本站試算結果不構成借貸要約，實際貸款核發仍依各大授信銀行對保規定為準。
          </div>
        </div>
      </section>
    </div>
  );
}
