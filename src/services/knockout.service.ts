import { Match, TeamRef } from './types';
import { KNOCKOUT_BRACKET, TBD_TEAM, parseSource } from '@/data/knockout-bracket';
import { calculateGroupStandings, isGroupStageComplete, getQualifiedTeams } from './standings.service';

function getWinner(match: Match): TeamRef | null {
  if (match.status !== 'FINISHED' || match.homeScore === null || match.awayScore === null) return null;
  if (match.homeScore > match.awayScore) return match.homeTeam;
  if (match.awayScore > match.homeScore) return match.awayTeam;
  // Draws in knockout shouldn't happen (admin enters final score after ET/penalties)
  // But if it does, return home team as default
  return match.homeTeam;
}

function getLoser(match: Match): TeamRef | null {
  if (match.status !== 'FINISHED' || match.homeScore === null || match.awayScore === null) return null;
  if (match.homeScore > match.awayScore) return match.awayTeam;
  if (match.awayScore > match.homeScore) return match.homeTeam;
  return match.awayTeam;
}

function resolveTeam(
  source: string,
  matches: Match[],
  winners: Record<string, TeamRef>,
  runnersUp: Record<string, TeamRef>,
  bestThirds: TeamRef[],
): TeamRef | null {
  const parsed = parseSource(source);

  if (parsed.type === 'group-pos') {
    if (parsed.position === 1) return winners[parsed.group] || null;
    if (parsed.position === 2) return runnersUp[parsed.group] || null;
    return null;
  }

  if (parsed.type === 'third') {
    const idx = parsed.slot - 1; // 1-indexed to 0-indexed
    return bestThirds[idx] || null;
  }

  if (parsed.type === 'winner') {
    const feederMatch = matches.find(m => m.id === parsed.matchId);
    return feederMatch ? getWinner(feederMatch) : null;
  }

  if (parsed.type === 'loser') {
    const feederMatch = matches.find(m => m.id === parsed.matchId);
    return feederMatch ? getLoser(feederMatch) : null;
  }

  return null;
}

export function fillKnockoutBracket(matches: Match[]): Match[] {
  const groupStageComplete = isGroupStageComplete(matches);

  let winners: Record<string, TeamRef> = {};
  let runnersUp: Record<string, TeamRef> = {};
  let bestThirds: TeamRef[] = [];

  if (groupStageComplete) {
    const standings = calculateGroupStandings(matches);
    const qualified = getQualifiedTeams(standings);
    winners = qualified.winners;
    runnersUp = qualified.runnersUp;
    bestThirds = qualified.bestThirds;
  }

  let updated = false;

  KNOCKOUT_BRACKET.forEach(slot => {
    const match = matches.find(m => m.id === slot.matchId);
    if (!match) return;

    // Skip if teams are already set (non-TBD)
    if (match.homeTeam.id !== 0 && match.awayTeam.id !== 0) return;

    // For R32, we need group stage complete
    if (slot.stage === 'ROUND_OF_32' && !groupStageComplete) return;

    const homeTeam = resolveTeam(slot.homeSource, matches, winners, runnersUp, bestThirds);
    const awayTeam = resolveTeam(slot.awaySource, matches, winners, runnersUp, bestThirds);

    if (homeTeam && match.homeTeam.id === 0) {
      match.homeTeam = homeTeam;
      updated = true;
    }
    if (awayTeam && match.awayTeam.id === 0) {
      match.awayTeam = awayTeam;
      updated = true;
    }
  });

  return matches;
}

export const knockoutService = {
  fillKnockoutBracket,
  getWinner,
  getLoser,
};
