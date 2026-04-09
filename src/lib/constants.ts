export const APP_NAME = 'Mundial 2026';
export const ENTRY_FEE = 500;
export const CURRENCY = 'MXN';
export const TOURNAMENT_START = '2026-06-11';
export const TOURNAMENT_END = '2026-07-19';
export const POINTS_EXACT = 3;
export const POINTS_WINNER = 1;
export const LIVE_REFRESH_INTERVAL_MS = 120_000;
export const FOOTBALL_DATA_COMPETITION_ID = 'WC';

export const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE: 'Grupos',
  ROUND_OF_32: 'R32',
  ROUND_OF_16: 'Octavos',
  QUARTER_FINALS: 'Cuartos',
  SEMI_FINALS: 'Semis',
  THIRD_PLACE: '3er Lugar',
  FINAL: 'Final',
};

export const STAGE_FULL_LABELS: Record<string, string> = {
  GROUP_STAGE: 'Fase de Grupos',
  ROUND_OF_32: 'Treintaidosavos de Final',
  ROUND_OF_16: 'Octavos de Final',
  QUARTER_FINALS: 'Cuartos de Final',
  SEMI_FINALS: 'Semifinales',
  THIRD_PLACE: 'Tercer Lugar',
  FINAL: 'Final',
};

export const ALL_STAGES = [
  'GROUP_STAGE', 'ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINALS',
  'SEMI_FINALS', 'THIRD_PLACE', 'FINAL',
] as const;

export const KNOCKOUT_STAGES = [
  'ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINALS',
  'SEMI_FINALS', 'THIRD_PLACE', 'FINAL',
] as const;
