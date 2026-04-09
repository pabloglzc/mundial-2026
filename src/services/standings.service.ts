import { Match, GroupStanding, TeamRef } from './types';
import { teams } from '@/data/teams';

export function calculateGroupStandings(matches: Match[]): Record<string, GroupStanding[]> {
  const groupMatches = matches.filter(m => m.stage === 'GROUP_STAGE');
  const standings: Record<string, GroupStanding[]> = {};

  // Initialize standings for all groups
  teams.forEach(team => {
    if (!standings[team.group]) standings[team.group] = [];
    standings[team.group].push({
      teamId: team.id,
      teamName: team.shortName,
      teamFlag: team.flag,
      group: team.group,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  // Process finished matches
  groupMatches
    .filter(m => m.status === 'FINISHED' && m.homeScore !== null && m.awayScore !== null)
    .forEach(m => {
      const group = m.group!;
      const home = standings[group]?.find(s => s.teamId === m.homeTeam.id);
      const away = standings[group]?.find(s => s.teamId === m.awayTeam.id);
      if (!home || !away) return;

      home.played++;
      away.played++;
      home.goalsFor += m.homeScore!;
      home.goalsAgainst += m.awayScore!;
      away.goalsFor += m.awayScore!;
      away.goalsAgainst += m.homeScore!;

      if (m.homeScore! > m.awayScore!) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (m.homeScore! < m.awayScore!) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.points += 1;
        away.points += 1;
      }

      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;
    });

  // Sort each group
  Object.keys(standings).forEach(group => {
    standings[group].sort((a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.teamName.localeCompare(b.teamName)
    );
  });

  return standings;
}

export function isGroupStageComplete(matches: Match[]): boolean {
  const groupMatches = matches.filter(m => m.stage === 'GROUP_STAGE');
  return groupMatches.length === 72 && groupMatches.every(m => m.status === 'FINISHED');
}

function teamRefFromId(teamId: number): TeamRef {
  const t = teams.find(t => t.id === teamId)!;
  return { id: t.id, name: t.name, shortName: t.shortName, tla: t.tla, flag: t.flag };
}

export function getQualifiedTeams(standings: Record<string, GroupStanding[]>): {
  winners: Record<string, TeamRef>;
  runnersUp: Record<string, TeamRef>;
  bestThirds: TeamRef[];
} {
  const winners: Record<string, TeamRef> = {};
  const runnersUp: Record<string, TeamRef> = {};
  const allThirds: GroupStanding[] = [];

  Object.keys(standings).sort().forEach(group => {
    const sorted = standings[group];
    if (sorted.length >= 3) {
      winners[group] = teamRefFromId(sorted[0].teamId);
      runnersUp[group] = teamRefFromId(sorted[1].teamId);
      allThirds.push(sorted[2]);
    }
  });

  // Rank third-place teams: points → goal diff → goals for
  allThirds.sort((a, b) =>
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor
  );

  // Top 8 third-place teams qualify
  const bestThirds = allThirds.slice(0, 8).map(s => teamRefFromId(s.teamId));

  return { winners, runnersUp, bestThirds };
}

export const standingsService = {
  calculateGroupStandings,
  isGroupStageComplete,
  getQualifiedTeams,
};
