import { Team } from '@/services/types';

export const teams: Team[] = [
  // Group A
  { id: 1, name: 'México', shortName: 'México', tla: 'MEX', flag: 'mx', group: 'A' },
  { id: 2, name: 'Sudáfrica', shortName: 'Sudáfrica', tla: 'RSA', flag: 'za', group: 'A' },
  { id: 3, name: 'Corea del Sur', shortName: 'Corea del Sur', tla: 'KOR', flag: 'kr', group: 'A' },
  { id: 4, name: 'República Checa', shortName: 'Rep. Checa', tla: 'CZE', flag: 'cz', group: 'A' },

  // Group B
  { id: 5, name: 'Canadá', shortName: 'Canadá', tla: 'CAN', flag: 'ca', group: 'B' },
  { id: 6, name: 'Bosnia y Herzegovina', shortName: 'Bosnia', tla: 'BIH', flag: 'ba', group: 'B' },
  { id: 7, name: 'Qatar', shortName: 'Qatar', tla: 'QAT', flag: 'qa', group: 'B' },
  { id: 8, name: 'Suiza', shortName: 'Suiza', tla: 'SUI', flag: 'ch', group: 'B' },

  // Group C
  { id: 9, name: 'Brasil', shortName: 'Brasil', tla: 'BRA', flag: 'br', group: 'C' },
  { id: 10, name: 'Marruecos', shortName: 'Marruecos', tla: 'MAR', flag: 'ma', group: 'C' },
  { id: 11, name: 'Haití', shortName: 'Haití', tla: 'HAI', flag: 'ht', group: 'C' },
  { id: 12, name: 'Escocia', shortName: 'Escocia', tla: 'SCO', flag: 'gb-sct', group: 'C' },

  // Group D
  { id: 13, name: 'Estados Unidos', shortName: 'EE.UU.', tla: 'USA', flag: 'us', group: 'D' },
  { id: 14, name: 'Paraguay', shortName: 'Paraguay', tla: 'PAR', flag: 'py', group: 'D' },
  { id: 15, name: 'Australia', shortName: 'Australia', tla: 'AUS', flag: 'au', group: 'D' },
  { id: 16, name: 'Turquía', shortName: 'Turquía', tla: 'TUR', flag: 'tr', group: 'D' },

  // Group E
  { id: 17, name: 'Alemania', shortName: 'Alemania', tla: 'GER', flag: 'de', group: 'E' },
  { id: 18, name: 'Curazao', shortName: 'Curazao', tla: 'CUW', flag: 'cw', group: 'E' },
  { id: 19, name: 'Costa de Marfil', shortName: 'C. de Marfil', tla: 'CIV', flag: 'ci', group: 'E' },
  { id: 20, name: 'Ecuador', shortName: 'Ecuador', tla: 'ECU', flag: 'ec', group: 'E' },

  // Group F
  { id: 21, name: 'Países Bajos', shortName: 'Países Bajos', tla: 'NED', flag: 'nl', group: 'F' },
  { id: 22, name: 'Japón', shortName: 'Japón', tla: 'JPN', flag: 'jp', group: 'F' },
  { id: 23, name: 'Suecia', shortName: 'Suecia', tla: 'SWE', flag: 'se', group: 'F' },
  { id: 24, name: 'Túnez', shortName: 'Túnez', tla: 'TUN', flag: 'tn', group: 'F' },

  // Group G
  { id: 25, name: 'Bélgica', shortName: 'Bélgica', tla: 'BEL', flag: 'be', group: 'G' },
  { id: 26, name: 'Egipto', shortName: 'Egipto', tla: 'EGY', flag: 'eg', group: 'G' },
  { id: 27, name: 'Irán', shortName: 'Irán', tla: 'IRN', flag: 'ir', group: 'G' },
  { id: 28, name: 'Nueva Zelanda', shortName: 'N. Zelanda', tla: 'NZL', flag: 'nz', group: 'G' },

  // Group H
  { id: 29, name: 'España', shortName: 'España', tla: 'ESP', flag: 'es', group: 'H' },
  { id: 30, name: 'Cabo Verde', shortName: 'Cabo Verde', tla: 'CPV', flag: 'cv', group: 'H' },
  { id: 31, name: 'Arabia Saudita', shortName: 'A. Saudita', tla: 'KSA', flag: 'sa', group: 'H' },
  { id: 32, name: 'Uruguay', shortName: 'Uruguay', tla: 'URU', flag: 'uy', group: 'H' },

  // Group I
  { id: 33, name: 'Francia', shortName: 'Francia', tla: 'FRA', flag: 'fr', group: 'I' },
  { id: 34, name: 'Senegal', shortName: 'Senegal', tla: 'SEN', flag: 'sn', group: 'I' },
  { id: 35, name: 'Irak', shortName: 'Irak', tla: 'IRQ', flag: 'iq', group: 'I' },
  { id: 36, name: 'Noruega', shortName: 'Noruega', tla: 'NOR', flag: 'no', group: 'I' },

  // Group J
  { id: 37, name: 'Argentina', shortName: 'Argentina', tla: 'ARG', flag: 'ar', group: 'J' },
  { id: 38, name: 'Argelia', shortName: 'Argelia', tla: 'ALG', flag: 'dz', group: 'J' },
  { id: 39, name: 'Austria', shortName: 'Austria', tla: 'AUT', flag: 'at', group: 'J' },
  { id: 40, name: 'Jordania', shortName: 'Jordania', tla: 'JOR', flag: 'jo', group: 'J' },

  // Group K
  { id: 41, name: 'Portugal', shortName: 'Portugal', tla: 'POR', flag: 'pt', group: 'K' },
  { id: 42, name: 'RD Congo', shortName: 'RD Congo', tla: 'COD', flag: 'cd', group: 'K' },
  { id: 43, name: 'Uzbekistán', shortName: 'Uzbekistán', tla: 'UZB', flag: 'uz', group: 'K' },
  { id: 44, name: 'Colombia', shortName: 'Colombia', tla: 'COL', flag: 'co', group: 'K' },

  // Group L
  { id: 45, name: 'Inglaterra', shortName: 'Inglaterra', tla: 'ENG', flag: 'gb-eng', group: 'L' },
  { id: 46, name: 'Croacia', shortName: 'Croacia', tla: 'CRO', flag: 'hr', group: 'L' },
  { id: 47, name: 'Ghana', shortName: 'Ghana', tla: 'GHA', flag: 'gh', group: 'L' },
  { id: 48, name: 'Panamá', shortName: 'Panamá', tla: 'PAN', flag: 'pa', group: 'L' },
];

export const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export function getTeamsByGroup(group: string): Team[] {
  return teams.filter(t => t.group === group);
}

export function getTeamById(id: number): Team | undefined {
  return teams.find(t => t.id === id);
}

export function getFlagUrl(flagCode: string): string {
  return `https://flagcdn.com/w40/${flagCode}.png`;
}
