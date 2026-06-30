import { Router } from 'express'
import { getAllmatchesController, getLivematchesController, getMatchesbydateController } from '../controllers/match.controller'

const router = Router()

router.get("/All", getAllmatchesController);

router.get("/Live", getLivematchesController);

router.get("/ByDate", getMatchesbydateController);

export default router;