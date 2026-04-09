'use client';

import { Prediction } from './types';
import { generateId } from '@/lib/utils';
import { calculatePoints } from '@/lib/scoring';

const PREDICTIONS_KEY = 'mundial2026_predictions';

function getPredictions(): Prediction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PREDICTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

function savePredictions(predictions: Prediction[]) {
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
}

export const predictionsService = {
  async getUserPredictions(userId: string): Promise<Prediction[]> {
    return getPredictions().filter(p => p.userId === userId);
  },

  async getPredictionForMatch(userId: string, matchId: number): Promise<Prediction | null> {
    return getPredictions().find(p => p.userId === userId && p.matchId === matchId) || null;
  },

  async savePrediction(userId: string, matchId: number, homeScore: number, awayScore: number): Promise<Prediction> {
    const predictions = getPredictions();
    const existing = predictions.find(p => p.userId === userId && p.matchId === matchId);

    if (existing) {
      existing.homeScore = homeScore;
      existing.awayScore = awayScore;
      existing.submittedAt = new Date().toISOString();
      savePredictions(predictions);
      return existing;
    }

    const prediction: Prediction = {
      id: generateId(),
      userId,
      matchId,
      homeScore,
      awayScore,
      submittedAt: new Date().toISOString(),
    };
    predictions.push(prediction);
    savePredictions(predictions);
    return prediction;
  },

  async calculatePointsForMatch(matchId: number, actualHome: number, actualAway: number): Promise<void> {
    const predictions = getPredictions();
    predictions.forEach(p => {
      if (p.matchId === matchId) {
        p.points = calculatePoints(
          { homeScore: p.homeScore, awayScore: p.awayScore },
          { home: actualHome, away: actualAway }
        );
      }
    });
    savePredictions(predictions);
  },

  async getAllPredictionsForMatch(matchId: number): Promise<Prediction[]> {
    return getPredictions().filter(p => p.matchId === matchId);
  },

  async getAllPredictions(): Promise<Prediction[]> {
    return getPredictions();
  },
};
