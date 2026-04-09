export function calculatePoints(
  prediction: { homeScore: number; awayScore: number },
  actual: { home: number; away: number }
): number {
  if (prediction.homeScore === actual.home && prediction.awayScore === actual.away) {
    return 3;
  }
  const predictedOutcome = Math.sign(prediction.homeScore - prediction.awayScore);
  const actualOutcome = Math.sign(actual.home - actual.away);
  if (predictedOutcome === actualOutcome) {
    return 1;
  }
  return 0;
}

export function getPointsLabel(points: number): { text: string; color: string } {
  switch (points) {
    case 3:
      return { text: 'Exacto! +3', color: 'text-green-500' };
    case 1:
      return { text: 'Resultado +1', color: 'text-yellow-500' };
    default:
      return { text: 'Fallaste 0', color: 'text-red-500' };
  }
}
