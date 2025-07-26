import puppeteer from 'puppeteer';
import { readNewsCache } from '../models/newsModel.js';
import { writeNewsCache } from '../models/newsModel.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cacheFile = path.join(__dirname, '../DB/newsCache.json');
const oneHour = 1000 * 60 * 60;

//NOTE: This function uses puppeteer to scrape music news from billboard.com
//NOTE: Check out the puppeteer docs to figure out what this all means
async function scrapeNews() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const url = 'https://www.billboard.com/c/music/music-news/';

        page.setRequestInterception(true);

        page.on('request', (req) => {
            const resourceType = req.resourceType();

            if (['stylesheet', 'font', 'media', 'image', 'other'].includes(resourceType)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.setExtraHTTPHeaders({
            From: `${process.env.EMAIL}`,
            'User-Agent': 'RespectfulScraper28/1.0'
        });

        await page.goto(url);

        const articles = await page.evaluate(() => {
            const articleElements = document.querySelectorAll('.a-story-grid ');
            //NOTE: This horrendously ugly object basically loops through each article in the website and pulls out the cover image, headline and link to the article and returns it as a array of objects where each object is an article
            return {
                website: 'https://www.billboard.com/c/music/music-news/',
                data: Array.from(articleElements).map((article) => {
                    const imageLink = article.querySelector('img.c-lazy-image__img').src;
                    const imageAlt = article.querySelector('img.c-lazy-image__img').alt;
                    const headline = article.querySelector('h3 a').textContent.trim();
                    const link = article.querySelector('h3 a').href;

                    return {
                        img: {
                            src: imageLink,
                            alt: imageAlt
                        },
                        headline: headline,
                        link: link
                    };
                })
            };
        });

        await browser.close();
        return articles;
    } catch (err) {
        throw err;
    }
}

//NOTE: This is the main function. It checks for whether the information has been cached, if so it returns the cached data, if not it will scrape for the data
export async function fetchNews() {
    if (fs.existsSync(cacheFile)) {
        const stats = fs.statSync(cacheFile);
        const modifiedTime = new Date(stats.mtime).getTime();
        const now = Date.now();

        if (now - modifiedTime < oneHour) {
            const cachedData = await readNewsCache();
            if (!cachedData.trim()) {
                const freshData = await scrapeNews();
                writeNewsCache(freshData);
                return freshData;
            }

            return JSON.parse(cachedData);
        } else {
            const freshData = await scrapeNews();
            writeNewsCache(freshData);
            return freshData;
        }
    } else {
        const freshData = await scrapeNews();
        writeNewsCache(freshData);
        return freshData;
    }
}
