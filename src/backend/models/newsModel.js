import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cacheFile = path.join(__dirname, '../DB/newsCache.json');

export async function readNewsCache() {
    try {
        const cachedData = await readFile(cacheFile, 'utf-8');
        return cachedData;
    } catch (err) {
        throw err;
    }
}

export async function writeNewsCache(data) {
    try {
        await writeFile(cacheFile, JSON.stringify(data, null, 2));
        console.log('WROTE TO CACHE');
    } catch (err) {
        throw err;
    }
}
