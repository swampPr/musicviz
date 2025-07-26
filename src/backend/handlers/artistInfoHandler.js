import { fetchArtistInfo } from '../services/artistInfoService.js';

export async function getArtistInfo(req, res) {
    try {
        const artistId = req.params.id;
        const artistInfo = await fetchArtistInfo(artistId);

        res.json(artistInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Something went wrong...'
        });
    }
}
