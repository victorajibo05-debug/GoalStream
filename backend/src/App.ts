import cors from "cors"
import http from "http"
import express from "express"
import Router from './routes/match.routes'
import router from "./routes/pl.routes"
import { CONFIG } from "./config/env"
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const server = http.createServer(app);


// Allow your React frontend to talk to this backend
app.use(cors());

app.use(express.json());

// All football routes live under /api
app.use('/api', Router);
app.use('/plapi', router);

app.listen(CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${CONFIG.PORT}`);
});
