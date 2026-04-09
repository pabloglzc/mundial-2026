export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: 'user' | 'admin';
  paymentStatus: 'pending' | 'submitted' | 'verified';
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  flag: string;
  group: string;
}

export interface Match {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'IN_PLAY' | 'FINISHED' | 'POSTPONED';
  matchday: number;
  stage: 'GROUP_STAGE' | 'ROUND_OF_32' | 'ROUND_OF_16' | 'QUARTER_FINALS' | 'SEMI_FINALS' | 'THIRD_PLACE' | 'FINAL';
  group: string | null;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  homeScore: number | null;
  awayScore: number | null;
  venue: string;
}

export interface TeamRef {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  flag: string;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: number;
  homeScore: number;
  awayScore: number;
  submittedAt: string;
  points?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  totalPoints: number;
  exactScores: number;
  correctWinners: number;
  totalPredictions: number;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: 'pending' | 'submitted' | 'verified';
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}
