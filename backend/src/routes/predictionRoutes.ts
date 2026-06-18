// src/routes/predictionsRoute.ts

import { Router, Request, Response } from "express";
import { getPrediction, PredictRequest } from "../services/predictionService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { home_team, away_team, match_date, stage, home_odds, draw_odds, away_odds } =
    req.body as PredictRequest;

  if (!home_team || !away_team) {
    return res.status(400).json({
      error: "home_team and away_team are required",
    });
  }

  try {
    const prediction = await getPrediction({
      home_team,
      away_team,
      match_date: match_date || "2026-06-01",
      stage,
      home_odds,
      draw_odds,
      away_odds,
    });

    return res.json(prediction);
  } catch (error) {
    console.error("Prediction failed:", error);
    return res.status(503).json({
      error: "Prediction service unavailable. Is the Python server running?",
    });
  }
});

export default router;