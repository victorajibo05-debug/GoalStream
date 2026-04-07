import cors from "cors"
import express from "express"
import Router from "./routes/match.routes.ts"
import {CONFIG} from "./config/env.ts"
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Allow your React frontend to talk to this backend
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

// All football routes live under /api
// e.g. /api/matches/live, /api/standings, etc.
app.use('/api', Router);

app.listen(CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${CONFIG.PORT}`);
});
