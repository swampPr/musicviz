import { getArtists } from '../handlers/artistSearchHandler.js';
import { Router } from 'express';

const router = Router();

router.get('/search', getArtists);

export default router;
