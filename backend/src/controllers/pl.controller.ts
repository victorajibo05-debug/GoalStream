import {Request, Response} from 'express';
import { getTodayMatches } from '../services/pl.service';

export const plcontroller = async (req: Request, res: Response) => {
    try {
        const data = await getTodayMatches();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Premier League matches' });
    }
}