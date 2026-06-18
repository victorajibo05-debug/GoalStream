import { Router, Request, Response } from "express";
import { getMarketAnalysis } from "../services/geminiPrediction";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { home_team, away_team } = req.body;

  if (!home_team || !away_team) {
    return res.status(400).json({ error: "home_team and away_team are required" });
  }

  try {
    const analysis = await getMarketAnalysis(home_team, away_team);
    return res.json({ analysis });
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return res.status(503).json({ error: "AI analysis unavailable right now" });
  }
});

export default router;