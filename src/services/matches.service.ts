'use client';

import { Match } from './types';
import { mockMatches } from '@/data/matches';

const MATCHES_KEY = 'mundial2026_matches';

function getMatches(): Match[] {
  if (typeof window === 'undefined') return mockMatches;
  const data = localStorage.getItem(MATCHES_KEY);
  if (!data) {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(mockMatches));
    return mockMatches;
  }
  return JSON.parse(data);
}

function saveMatches(matches: Match[]) {
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
}

export const matchesService = {
  async getAllMatches(): Promise<Match[]> {
    return getMatches();
  },

  async getMatchesByGroup(group: string): Promise<Match[]> {
    return getMatches().filter(m => m.group === group);
  },

  async getMatchesByMatchday(matchday: number): Promise<Match[]> {
    return getMatches().filter(m => m.matchday === matchday);
  },

  async getMatch(id: number): Promise<Match | undefined> {
    return getMatches().find(m => m.id === id);
  },

  async updateMatchResult(matchId: number, homeScore: number, awayScore: number): Promise<void> {
    const matches = getMatches();
    const match = matches.find(m => m.id === matchId);
    if (match) {
      match.homeScore = homeScore;
      match.awayScore = awayScore;
      match.status = 'FINISHED';
      saveMatches(matches);
    }
  },

  async getUpcomingMatches(limit: number = 5): Promise<Match[]> {
    const now = new Date().toISOString();
    return getMatches()
      .filter(m => m.status === 'SCHEDULED' && m.utcDate > now)
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
      .slice(0, limit);
  },

  async getFinishedMatches(): Promise<Match[]> {
    return getMatches().filter(m => m.status === 'FINISHED');
  },
};
