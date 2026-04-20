import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

async function getLatestRate() {
    try {
        console.log("正在抓取最新利率...");
        // 台灣銀行公告利率網頁
        const url = 'https://rate.bot.com.tw/ir?strType=1'; 
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // 根據台銀網頁結構定位利率
        // 抓「一年期定期儲蓄存款」機動利率作為基準之一，或找特定房貸指標
        // 這裡採用您的提示，抓取一年期定儲機動利率或固定利率
        // 實際可根據 tbody tr 找尋對應欄位
        
        // 找出包含「一年期定期儲蓄存款」的 tr
        let targetRate = null;
        $('table tbody tr').each((i, el) => {
            const rowText = $(el).text();
            if (rowText.includes('一年期定期儲蓄存款')) {
                // 找到對應的固定或機動利率，通常機動或固定在後面欄位
                targetRate = $(el).find('td.text-right').first().text().trim();
            }
        });

        // 轉換為我們顯示用的數字或保底 2.06
        const rateToUse = targetRate || "2.06";

        const result = {
            updateDate: new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }),
            baseRate: rateToUse
        };

        // 確保資料夾存在
        const dir = path.join(process.cwd(), 'public', 'data');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        // 寫入 JSON 檔案案供前端讀取
        const outputPath = path.join(dir, 'rate.json');
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`數據已更新: ${result.updateDate}, 利率: ${result.baseRate}%`);

    } catch (error) {
        console.error('爬取失敗:', error);
    }
}

getLatestRate();
