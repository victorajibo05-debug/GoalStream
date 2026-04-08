import type { Request, Response } from 'express';
import { getAllmatches, getLivematches, getMatchDetails, getMatchLineups, getPremierleague } from '../services/match.service.ts';

export const getAllmatchesController = async (req: Request, res: Response) => {
    try {
        const matches = await getAllmatches()
        res.status(200).json(matches)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch matches' })
    }
};

export const getLivematchesController = async (req: Request, res: Response) => {
    try {
        const matches = await getLivematches()
        res.status(200).json(matches)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get live matches' })
    }
};

export const getPremierleagueController = async (req: Request, res: Response) => {
    try {
        const matches = await getPremierleague(req.params.leagueId, req.params.season)
        res.status(200).json(matches)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get premier league matches' })
    }
};

export const getMatchDetailsController = async (req: Request, res: Response) => {
    try {
        const matches = await getMatchDetails(req.params.matchId)
        res.status(200).json(matches)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get live match details' })
    }
};

export const getMatchLineupsController = async (req: Request, res: Response) => {
    try {
        const matches = await getMatchLineups(req.params.matchId)
        res.status(200).json(matches)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get lineups' })
    }
};