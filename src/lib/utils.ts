export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isMatchStarted(utcDate: string): boolean {
  return new Date(utcDate) <= new Date();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getMatchStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: 'Programado',
    TIMED: 'Programado',
    IN_PLAY: 'En Juego',
    PAUSED: 'En Juego',
    HALF_TIME: 'Medio Tiempo',
    FINISHED: 'Finalizado',
    POSTPONED: 'Aplazado',
  };
  return labels[status] || status;
}

export function getMatchStatusColor(status: string): string {
  if (status === 'IN_PLAY' || status === 'PAUSED') return 'text-green-600';
  if (status === 'HALF_TIME') return 'text-amber-600';
  if (status === 'FINISHED') return 'text-gray-500';
  return 'text-gray-400';
}

export function isMatchLive(status: string): boolean {
  return ['IN_PLAY', 'PAUSED', 'HALF_TIME'].includes(status);
}
