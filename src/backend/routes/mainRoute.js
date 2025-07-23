import { Router } from 'express';
import newsRouter from './newsRoute.js';
import billboardRouter from './billboardRoute.js';
import artistRouter from './artistRoute.js';

const router = Router();

router.use('/news', newsRouter);
router.use('/billboard', billboardRouter);
router.use('/artist', artistRouter);

export default router;
