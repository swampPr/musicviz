import { fetchArtists } from '../services/artistSearchService.js';

export async function getArtists(req, res) {
    try {
        const input = req.query.q;
        const artistsInfo = await fetchArtists(input);

        res.json(artistsInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Something went wrong...'
        });
    }
}
