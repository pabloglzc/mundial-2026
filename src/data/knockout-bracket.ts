import { TeamRef } from '@/services/types';

export const TBD_TEAM: TeamRef = {
  id: 0,
  name: 'Por definir',
  shortName: 'TBD',
  tla: 'TBD',
  flag: '',
};

// Bracket position → match definition
// Round of 32: positions 1-16 (match IDs 73-88)
// Round of 16: positions 17-24 (match IDs 89-96)
// Quarter-finals: positions 25-28 (match IDs 97-100)
// Semi-finals: positions 29-30 (match IDs 101-102)
// Third place: position 31 (match ID 103)
// Final: position 32 (match ID 104)

export interface BracketSlot {
  matchId: number;
  bracketPosition: number;
  stage: 'ROUND_OF_32' | 'ROUND_OF_16' | 'QUARTER_FINALS' | 'SEMI_FINALS' | 'THIRD_PLACE' | 'FINAL';
  homeSource: string;
  awaySource: string;
  venue: string;
  dayOffset: number; // days after group stage ends (approx July 1)
  hourUTC: number;
}

// Round of 32 — Group winners vs runners-up (cross-group pairings)
// Plus 8 best third-place teams in dedicated slots
const ROUND_OF_32: BracketSlot[] = [
  { matchId: 73,  bracketPosition: 1,  stage: 'ROUND_OF_32', homeSource: '1A', awaySource: '2C', venue: 'MetLife Stadium, New Jersey', dayOffset: 0, hourUTC: 16 },
  { matchId: 74,  bracketPosition: 2,  stage: 'ROUND_OF_32', homeSource: '1B', awaySource: '2D', venue: 'SoFi Stadium, Los Angeles', dayOffset: 0, hourUTC: 19 },
  { matchId: 75,  bracketPosition: 3,  stage: 'ROUND_OF_32', homeSource: '1C', awaySource: '2A', venue: 'AT&T Stadium, Dallas', dayOffset: 0, hourUTC: 22 },
  { matchId: 76,  bracketPosition: 4,  stage: 'ROUND_OF_32', homeSource: '1D', awaySource: '2B', venue: 'NRG Stadium, Houston', dayOffset: 1, hourUTC: 16 },
  { matchId: 77,  bracketPosition: 5,  stage: 'ROUND_OF_32', homeSource: '1E', awaySource: '2G', venue: 'Mercedes-Benz Stadium, Atlanta', dayOffset: 1, hourUTC: 19 },
  { matchId: 78,  bracketPosition: 6,  stage: 'ROUND_OF_32', homeSource: '1F', awaySource: '2H', venue: 'Lincoln Financial Field, Philadelphia', dayOffset: 1, hourUTC: 22 },
  { matchId: 79,  bracketPosition: 7,  stage: 'ROUND_OF_32', homeSource: '1G', awaySource: '2E', venue: 'Hard Rock Stadium, Miami', dayOffset: 2, hourUTC: 16 },
  { matchId: 80,  bracketPosition: 8,  stage: 'ROUND_OF_32', homeSource: '1H', awaySource: '2F', venue: 'Lumen Field, Seattle', dayOffset: 2, hourUTC: 19 },
  { matchId: 81,  bracketPosition: 9,  stage: 'ROUND_OF_32', homeSource: '1I', awaySource: '2K', venue: 'Estadio Azteca, Ciudad de México', dayOffset: 2, hourUTC: 22 },
  { matchId: 82,  bracketPosition: 10, stage: 'ROUND_OF_32', homeSource: '1J', awaySource: '2L', venue: 'Levi\'s Stadium, San Francisco', dayOffset: 3, hourUTC: 16 },
  { matchId: 83,  bracketPosition: 11, stage: 'ROUND_OF_32', homeSource: '1K', awaySource: '2I', venue: 'Estadio Akron, Guadalajara', dayOffset: 3, hourUTC: 19 },
  { matchId: 84,  bracketPosition: 12, stage: 'ROUND_OF_32', homeSource: '1L', awaySource: '2J', venue: 'Estadio BBVA, Monterrey', dayOffset: 3, hourUTC: 22 },
  // Best third-place matchups (slots filled dynamically based on which groups qualify)
  { matchId: 85,  bracketPosition: 13, stage: 'ROUND_OF_32', homeSource: '3rd-1', awaySource: '3rd-2', venue: 'BC Place, Vancouver', dayOffset: 4, hourUTC: 16 },
  { matchId: 86,  bracketPosition: 14, stage: 'ROUND_OF_32', homeSource: '3rd-3', awaySource: '3rd-4', venue: 'Arrowhead Stadium, Kansas City', dayOffset: 4, hourUTC: 19 },
  { matchId: 87,  bracketPosition: 15, stage: 'ROUND_OF_32', homeSource: '3rd-5', awaySource: '3rd-6', venue: 'Gillette Stadium, Boston', dayOffset: 4, hourUTC: 22 },
  { matchId: 88,  bracketPosition: 16, stage: 'ROUND_OF_32', homeSource: '3rd-7', awaySource: '3rd-8', venue: 'BMO Field, Toronto', dayOffset: 5, hourUTC: 16 },
];

const ROUND_OF_16: BracketSlot[] = [
  { matchId: 89,  bracketPosition: 17, stage: 'ROUND_OF_16', homeSource: 'W73',  awaySource: 'W74',  venue: 'MetLife Stadium, New Jersey', dayOffset: 7, hourUTC: 16 },
  { matchId: 90,  bracketPosition: 18, stage: 'ROUND_OF_16', homeSource: 'W75',  awaySource: 'W76',  venue: 'SoFi Stadium, Los Angeles', dayOffset: 7, hourUTC: 20 },
  { matchId: 91,  bracketPosition: 19, stage: 'ROUND_OF_16', homeSource: 'W77',  awaySource: 'W78',  venue: 'AT&T Stadium, Dallas', dayOffset: 8, hourUTC: 16 },
  { matchId: 92,  bracketPosition: 20, stage: 'ROUND_OF_16', homeSource: 'W79',  awaySource: 'W80',  venue: 'NRG Stadium, Houston', dayOffset: 8, hourUTC: 20 },
  { matchId: 93,  bracketPosition: 21, stage: 'ROUND_OF_16', homeSource: 'W81',  awaySource: 'W82',  venue: 'Estadio Azteca, Ciudad de México', dayOffset: 9, hourUTC: 16 },
  { matchId: 94,  bracketPosition: 22, stage: 'ROUND_OF_16', homeSource: 'W83',  awaySource: 'W84',  venue: 'Mercedes-Benz Stadium, Atlanta', dayOffset: 9, hourUTC: 20 },
  { matchId: 95,  bracketPosition: 23, stage: 'ROUND_OF_16', homeSource: 'W85',  awaySource: 'W86',  venue: 'Hard Rock Stadium, Miami', dayOffset: 10, hourUTC: 16 },
  { matchId: 96,  bracketPosition: 24, stage: 'ROUND_OF_16', homeSource: 'W87',  awaySource: 'W88',  venue: 'Lumen Field, Seattle', dayOffset: 10, hourUTC: 20 },
];

const QUARTER_FINALS: BracketSlot[] = [
  { matchId: 97,  bracketPosition: 25, stage: 'QUARTER_FINALS', homeSource: 'W89',  awaySource: 'W90',  venue: 'MetLife Stadium, New Jersey', dayOffset: 13, hourUTC: 16 },
  { matchId: 98,  bracketPosition: 26, stage: 'QUARTER_FINALS', homeSource: 'W91',  awaySource: 'W92',  venue: 'SoFi Stadium, Los Angeles', dayOffset: 13, hourUTC: 20 },
  { matchId: 99,  bracketPosition: 27, stage: 'QUARTER_FINALS', homeSource: 'W93',  awaySource: 'W94',  venue: 'Estadio Azteca, Ciudad de México', dayOffset: 14, hourUTC: 16 },
  { matchId: 100, bracketPosition: 28, stage: 'QUARTER_FINALS', homeSource: 'W95',  awaySource: 'W96',  venue: 'AT&T Stadium, Dallas', dayOffset: 14, hourUTC: 20 },
];

const SEMI_FINALS: BracketSlot[] = [
  { matchId: 101, bracketPosition: 29, stage: 'SEMI_FINALS', homeSource: 'W97',  awaySource: 'W98',  venue: 'MetLife Stadium, New Jersey', dayOffset: 16, hourUTC: 20 },
  { matchId: 102, bracketPosition: 30, stage: 'SEMI_FINALS', homeSource: 'W99',  awaySource: 'W100', venue: 'AT&T Stadium, Dallas', dayOffset: 17, hourUTC: 20 },
];

const THIRD_AND_FINAL: BracketSlot[] = [
  { matchId: 103, bracketPosition: 31, stage: 'THIRD_PLACE', homeSource: 'L101', awaySource: 'L102', venue: 'Hard Rock Stadium, Miami', dayOffset: 18, hourUTC: 18 },
  { matchId: 104, bracketPosition: 32, stage: 'FINAL',       homeSource: 'W101', awaySource: 'W102', venue: 'MetLife Stadium, New Jersey', dayOffset: 19, hourUTC: 20 },
];

export const KNOCKOUT_BRACKET: BracketSlot[] = [
  ...ROUND_OF_32,
  ...ROUND_OF_16,
  ...QUARTER_FINALS,
  ...SEMI_FINALS,
  ...THIRD_AND_FINAL,
];

// Given a source string like "W73", "L101", "1A", "2C", "3rd-1", resolve it.
// Returns the source type and reference.
export function parseSource(source: string): { type: 'group-pos'; position: number; group: string } | { type: 'winner'; matchId: number } | { type: 'loser'; matchId: number } | { type: 'third'; slot: number } {
  if (source.startsWith('W')) {
    return { type: 'winner', matchId: parseInt(source.slice(1)) };
  }
  if (source.startsWith('L')) {
    return { type: 'loser', matchId: parseInt(source.slice(1)) };
  }
  if (source.startsWith('3rd-')) {
    return { type: 'third', slot: parseInt(source.slice(4)) };
  }
  // "1A" = 1st in group A, "2C" = 2nd in group C
  const position = parseInt(source[0]);
  const group = source.slice(1);
  return { type: 'group-pos', position, group };
}

// Human-readable source label
export function sourceLabel(source: string): string {
  const parsed = parseSource(source);
  if (parsed.type === 'group-pos') {
    const pos = parsed.position === 1 ? '1°' : '2°';
    return `${pos} Grupo ${parsed.group}`;
  }
  if (parsed.type === 'winner') return `Gan. #${parsed.matchId}`;
  if (parsed.type === 'loser') return `Perd. #${parsed.matchId}`;
  return `Mejor 3° #${parsed.slot}`;
}
