import {Router} from 'express';
import {getBillboard} from '../handlers/billboardHandler.js';

const router = Router();

router.get('/recent', getBillboard);

export default router;
