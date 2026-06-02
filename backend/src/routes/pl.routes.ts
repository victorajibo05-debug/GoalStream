import {Router} from 'express';
import { plcontroller } from '../controllers/pl.controller';

const router = Router();
router.get("/Premierleague", plcontroller);

export default router;