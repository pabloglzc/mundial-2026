import { Match } from './types';

export interface LiveMatch {
  id: number;
  status: string;
  minute: number | null;
  homeTeam: { name: string; shortName: string; crest: string };
  awayTeam: { name: string; shortName: string; crest: string };
  homeScore: number | null;
  awayScore: number | null;
  utcDate: string;
  stage: string;
  group: string | null;
  competition?: string;
}

function todayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Check if a UTC date string falls within "today" in the user's local timezone
function isToday(utcDate: string): boolean {
  const matchDate = new Date(utcDate);
  const now = new Date();
  return (
    matchDate.getFullYear() === now.getFullYear() &&
    matchDate.getMonth() === now.getMonth() &&
    matchDate.getDate() === now.getDate()
  );
}

function mapMatch(m: any, competition?: string): LiveMatch {
  return {
    id: m.id,
    status: m.status,
    minute: m.minute ?? null,
    homeTeam: {
      name: m.homeTeam?.name || 'TBD',
      shortName: m.homeTeam?.shortName || m.homeTeam?.tla || 'TBD',
      crest: m.homeTeam?.crest || '',
    },
    awayTeam: {
      name: m.awayTeam?.name || 'TBD',
      shortName: m.awayTeam?.shortName || m.awayTeam?.tla || 'TBD',
      crest: m.awayTeam?.crest || '',
    },
    homeScore: m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? null,
    awayScore: m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? null,
    utcDate: m.utcDate,
    stage: m.stage || '',
    group: m.group || null,
    competition,
  };
}

export async function fetchTodayMatches(): Promise<LiveMatch[]> {
  const today = todayDateString();
  try {
    const res = await fetch(
      `/api/football-data?endpoint=competitions/WC/matches&dateFrom=${today}&dateTo=${today}`
    );
    const data = await res.json();

    if (data.fallback || data.error || !data.matches) {
      return [];
    }

    return data.matches.map((m: any) => mapMatch(m, 'Copa del Mundo 2026'));
  } catch {
    return [];
  }
}

// Fetch upcoming WC matches (next 10)
export async function fetchUpcomingMatches(): Promise<LiveMatch[]> {
  const today = todayDateString();
  // Fetch scheduled matches from today onwards
  try {
    const res = await fetch(
      `/api/football-data?endpoint=competitions/WC/matches&dateFrom=${today}&status=SCHEDULED`
    );
    const data = await res.json();

    if (data.fallback || data.error || !data.matches) {
      return [];
    }

    // Return first 10 upcoming matches
    return data.matches
      .slice(0, 10)
      .map((m: any) => mapMatch(m, 'Copa del Mundo 2026'));
  } catch {
    return [];
  }
}

// Fetch today's matches from ALL competitions (to show something while WC hasn't started)
export async function fetchTodayAllCompetitions(): Promise<LiveMatch[]> {
  const today = todayDateString();
  try {
    const res = await fetch(
      `/api/football-data?endpoint=matches&dateFrom=${today}&dateTo=${today}`
    );
    const data = await res.json();

    if (data.fallback || data.error || !data.matches) {
      return [];
    }

    // Filter to only matches that are actually today in user's local timezone
    return data.matches
      .filter((m: any) => isToday(m.utcDate))
      .map((m: any) => mapMatch(m, m.competition?.name || ''));
  } catch {
    return [];
  }
}

// Fallback: show local matches for today from localStorage data
export function getLocalTodayMatches(matches: Match[]): Match[] {
  const today = todayDateString();
  return matches.filter(m => m.utcDate.startsWith(today))
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate));
}

export const liveResultsService = {
  fetchTodayMatches,
  fetchUpcomingMatches,
  fetchTodayAllCompetitions,
  getLocalTodayMatches,
};
