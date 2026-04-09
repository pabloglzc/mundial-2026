'use client';

import { Match } from './types';
import { mockMatches } from '@/data/matches';
import { fillKnockoutBracket } from './knockout.service';

const MATCHES_KEY = 'mundial2026_matches';
const DATA_VERSION_KEY = 'mundial2026_data_version';
const CURRENT_VERSION = 2; // v1 = 72 group matches, v2 = 104 with knockout

function getMatches(): Match[] {
  if (typeof window === 'undefined') return mockMatches;

  const version = localStorage.getItem(DATA_VERSION_KEY);
  const data = localStorage.getItem(MATCHES_KEY);

  // Fresh install or version upgrade: seed from mock data
  if (!data || !version || parseInt(version) < CURRENT_VERSION) {
    if (data && version) {
      // Migration: preserve existing match results
      const existing: Match[] = JSON.parse(data);
      const merged = migrateMatches(existing);
      saveMatches(merged);
    } else {
      saveMatches(mockMatches);
    }
    localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_VERSION));
  }

  return JSON.parse(localStorage.getItem(MATCHES_KEY)!);
}

function migrateMatches(existing: Match[]): Match[] {
  // Keep existing match data (scores, statuses) and add missing knockout matches
  const existingIds = new Set(existing.map(m => m.id));
  const newMatches = mockMatches.filter(m => !existingIds.has(m.id));
  return [...existing, ...newMatches];
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

  async getMatchesByStage(stage: string): Promise<Match[]> {
    return getMatches().filter(m => m.stage === stage);
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

      // After saving, try to fill knockout bracket
      fillKnockoutBracket(matches);
      saveMatches(matches);
    }
  },

  async getUpcomingMatches(limit: number = 5): Promise<Match[]> {
    const now = new Date().toISOString();
    return getMatches()
      .filter(m => m.status === 'SCHEDULED' && m.utcDate > now && m.homeTeam.id !== 0)
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
      .slice(0, limit);
  },

  async getFinishedMatches(): Promise<Match[]> {
    return getMatches().filter(m => m.status === 'FINISHED');
  },

  async refreshKnockoutBracket(): Promise<void> {
    const matches = getMatches();
    fillKnockoutBracket(matches);
    saveMatches(matches);
  },
};
