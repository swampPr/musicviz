import { existsSync, statSync } from 'fs';
import chalk from 'chalk';
import { readBillBoardCache, writeBillBoardCache } from '../models/billboardModel.js';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cacheFile = join(__dirname, '../DB/billboardCache.json');

const threeDays = 3 * 24 * 60 * 60 * 1000; // 259200000

async function fetchBillboard(retries = 3) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main/recent.json', {
            mode: 'cors',
            headers: {
                Accept: 'application/json'
            }
        });

        const billboardJSON = await response.json();

        return billboardJSON;
    } catch (err) {
        if (retries <= 0) {
            throw err;
        }
        console.warn(chalk.blueBright(`API Call to billboard failed, retrying... attempt number ${3 - retries + 1}`));
        return await fetchBillboard(retries - 1);
    }
}

export async function serveBillboard() {
    if (existsSync(cacheFile)) {
        const stats = statSync(cacheFile);
        const modifiedTime = new Date(stats.mtime).getTime();
        const now = Date.now();

        if (modifiedTime - now < threeDays) {
            const cachedData = await readBillBoardCache();
            if (!cachedData.trim()) {
                try {
                    const freshData = await fetchBillboard();
                    writeBillBoardCache(freshData);
                } catch (err) {
                    return freshData;
                }
            }

            return JSON.parse(cachedData);
        } else {
            try {
                const freshBillBoard = await fetchBillboard();
                return freshBillBoard;
            } catch (err) {
                throw err;
            }
        }
    } else {
        try {
            const freshData = await fetchBillboard();
            writeBillBoardCache(freshData);

            return freshData;
        } catch (err) {
            throw err;
        }
    }
}

export default serveBillboard;
