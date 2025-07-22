import { fetchNews } from '../services/newsService.js';

export async function getNews(req, res) {
    console.log(`NEWS HANDLER GOT REQUEST`);
    try {
        const newsOBJ = await fetchNews();

        console.log('RETURNING NEWS DATA TO CLIENT');
        res.json(newsOBJ);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Something went wrong...'
        });
    }
}
