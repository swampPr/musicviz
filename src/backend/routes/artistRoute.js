import { getArtists } from '../handlers/artistSearchHandler.js';
import { getArtistInfo } from '../handlers/artistInfoHandler.js';
import { Router } from 'express';

const router = Router();

router.get('/search', getArtists);
router.get('/info/:id', getArtistInfo);

export default router;
