import {Router} from 'express'
import { getAllmatchesController, getLivematchesController, getMatchDetailsController, getMatchLineupsController } from '../controllers/match.controller.ts'

const router = Router ()

router.get ("/All", getAllmatchesController);

router.get ("/Live", getLivematchesController);

router.get ("/Details", getMatchDetailsController);

router.get ("/Lineups", getMatchLineupsController);

export default router;