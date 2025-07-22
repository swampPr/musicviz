import {Router} from 'express';
import {getNews} from '../handlers/newsHandler.js';

const router = Router();

router.get('/all', getNews);

export default router;
