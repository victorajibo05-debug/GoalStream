import cors from "cors"
import http from "http"
import express from "express"
import Router from './routes/match.routes'
import predictionRouter from "./routes/predictionRoutes"
import geminiRouter from "./routes/geminiRoutes"
import { CONFIG } from "./config/env"
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const server = http.createServer(app);


// Allow your React frontend to talk to this backend
app.use(cors());

app.use(express.json());
app.use((req, res, next) => {
  console.log(`>>> INCOMING REQUEST: ${req.method} ${req.url}`);
  next();
});

// All football routes live under /api
app.use('/api', Router);
app.use("/api/groq", geminiRouter);
app.use("/api/predict", predictionRouter);
app.listen(CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${CONFIG.PORT}`);
});
