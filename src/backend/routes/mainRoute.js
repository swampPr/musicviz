import {Router} from 'express';
import newsRouter from './newsRoute.js';
import billboardRouter from './billboardRoute.js';

const router = Router();

router.use('/news', newsRouter);
router.use('/billboard', billboardRouter);

export default router;
