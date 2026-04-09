'use client';

import { LeaderboardEntry } from './types';
import { predictionsService } from './predictions.service';
import { authService } from './auth.service';

export const leaderboardService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = await authService.getAllUsers();
    const allPredictions = await predictionsService.getAllPredictions();

    const entries: LeaderboardEntry[] = users
      .filter(u => u.paymentStatus === 'verified' && u.role !== 'admin')
      .map(user => {
        const userPreds = allPredictions.filter(p => p.userId === user.id && p.points !== undefined);
        const totalPoints = userPreds.reduce((sum, p) => sum + (p.points || 0), 0);
        const exactScores = userPreds.filter(p => p.points === 3).length;
        const correctWinners = userPreds.filter(p => p.points === 1).length;

        return {
          rank: 0,
          userId: user.id,
          userName: user.name,
          totalPoints,
          exactScores,
          correctWinners,
          totalPredictions: allPredictions.filter(p => p.userId === user.id).length,
        };
      });

    entries.sort((a, b) => b.totalPoints - a.totalPoints || b.exactScores - a.exactScores);
    entries.forEach((entry, i) => { entry.rank = i + 1; });

    return entries;
  },
};
