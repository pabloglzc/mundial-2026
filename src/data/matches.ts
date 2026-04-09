import { Match } from '@/services/types';
import { teams } from './teams';

function teamRef(teamId: number) {
  const t = teams.find(t => t.id === teamId)!;
  return { id: t.id, name: t.name, shortName: t.shortName, tla: t.tla, flag: t.flag };
}

// Venues for World Cup 2026
const venues = {
  azteca: 'Estadio Azteca, Ciudad de México',
  guadalajara: 'Estadio Akron, Guadalajara',
  monterrey: 'Estadio BBVA, Monterrey',
  metlife: 'MetLife Stadium, New Jersey',
  sofi: 'SoFi Stadium, Los Angeles',
  dallas: 'AT&T Stadium, Dallas',
  houston: 'NRG Stadium, Houston',
  atlanta: 'Mercedes-Benz Stadium, Atlanta',
  philadelphia: 'Lincoln Financial Field, Philadelphia',
  miami: 'Hard Rock Stadium, Miami',
  seattle: 'Lumen Field, Seattle',
  sanfrancisco: 'Levi\'s Stadium, San Francisco',
  kansas: 'Arrowhead Stadium, Kansas City',
  boston: 'Gillette Stadium, Boston',
  toronto: 'BMO Field, Toronto',
  vancouver: 'BC Place, Vancouver',
};

const venueList = Object.values(venues);

// Generate group stage matches (3 matchdays per group, 72 matches total)
function generateGroupMatches(): Match[] {
  const matches: Match[] = [];
  let matchId = 1;
  const startDate = new Date('2026-06-11T16:00:00Z');

  const groupTeams: Record<string, number[]> = {};
  teams.forEach(t => {
    if (!groupTeams[t.group]) groupTeams[t.group] = [];
    groupTeams[t.group].push(t.id);
  });

  // For each group: MD1: 1v2, 3v4 | MD2: 1v3, 2v4 | MD3: 1v4, 2v3
  const matchdayPairings = [
    [[0, 1], [2, 3]], // Matchday 1
    [[0, 2], [1, 3]], // Matchday 2
    [[0, 3], [1, 2]], // Matchday 3
  ];

  const groupKeys = Object.keys(groupTeams).sort();

  groupKeys.forEach((group, groupIndex) => {
    const teamIds = groupTeams[group];

    matchdayPairings.forEach((pairings, mdIndex) => {
      pairings.forEach((pair, pairIndex) => {
        const dayOffset = mdIndex * 4 + Math.floor(groupIndex / 3);
        const hourOffset = (groupIndex % 3) * 3 + pairIndex * 1;
        const matchDate = new Date(startDate);
        matchDate.setDate(matchDate.getDate() + dayOffset);
        matchDate.setHours(matchDate.getHours() + hourOffset);

        matches.push({
          id: matchId++,
          utcDate: matchDate.toISOString(),
          status: 'SCHEDULED',
          matchday: mdIndex + 1,
          stage: 'GROUP_STAGE',
          group,
          homeTeam: teamRef(teamIds[pair[0]]),
          awayTeam: teamRef(teamIds[pair[1]]),
          homeScore: null,
          awayScore: null,
          venue: venueList[(groupIndex * 3 + mdIndex + pairIndex) % venueList.length],
        });
      });
    });
  });

  return matches;
}

export const mockMatches: Match[] = generateGroupMatches();

export function getMatchesByGroup(group: string): Match[] {
  return mockMatches.filter(m => m.group === group);
}

export function getMatchesByMatchday(matchday: number): Match[] {
  return mockMatches.filter(m => m.matchday === matchday);
}

export function getMatchById(id: number): Match | undefined {
  return mockMatches.find(m => m.id === id);
}
