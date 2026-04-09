'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { matchesService } from '@/services/matches.service';
import { predictionsService } from '@/services/predictions.service';
import {
  fetchTodayAllCompetitions,
  LiveMatch,
} from '@/services/live-results.service';
import { Match, Prediction } from '@/services/types';
import { getFlagUrl } from '@/data/teams';
import { formatTime, formatDate, getMatchStatusLabel, isMatchLive } from '@/lib/utils';
import { LIVE_REFRESH_INTERVAL_MS, STAGE_FULL_LABELS } from '@/lib/constants';

type Tab = 'today' | 'upcoming';

export default function ResultsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('today');
  const [todayAllMatches, setTodayAllMatches] = useState<LiveMatch[]>([]);
  const [upcomingLocal, setUpcomingLocal] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // Fetch today's matches from all competitions via API
    const allToday = await fetchTodayAllCompetitions();
    setTodayAllMatches(allToday);

    // Always load local matches for "Próximos del Mundial"
    const allMatches = await matchesService.getAllMatches();
    const now = new Date();
    const upcoming = allMatches
      .filter(m => m.status !== 'FINISHED' && new Date(m.utcDate) >= now && m.homeTeam.id !== 0)
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
      .slice(0, 12);
    setUpcomingLocal(upcoming);

    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, LIVE_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  // Load user predictions
  useEffect(() => {
    if (!user) return;
    predictionsService.getUserPredictions(user.id).then(preds => {
      const map: Record<number, Prediction> = {};
      preds.forEach(p => { map[p.matchId] = p; });
      setPredictions(map);
    });
  }, [user]);

  // Sort: live first, then half-time, then scheduled, then finished
  const statusOrder: Record<string, number> = {
    IN_PLAY: 0, PAUSED: 0, HALF_TIME: 1, TIMED: 2, SCHEDULED: 2, FINISHED: 3, POSTPONED: 4,
  };

  const todayMatches = [...todayAllMatches].sort((a, b) =>
    (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5) || a.utcDate.localeCompare(b.utcDate)
  );

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Resultados</h1>
          <button
            onClick={refresh}
            className="text-sm text-primary hover:underline"
          >
            Actualizar
          </button>
        </div>
        <p className="text-gray-500 mb-1">Resultados en vivo y próximos partidos.</p>
        <p className="text-xs text-gray-400 mb-6">
          Última actualización: {lastRefresh.toLocaleTimeString('es-MX')}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('today')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'today'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Hoy en Vivo
          </button>
          <button
            onClick={() => setTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'upcoming'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Próximos del Mundial
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : tab === 'today' ? (
          todayMatches.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-5xl mb-4">📺</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sin partidos hoy</h2>
              <p className="text-gray-500">No hay partidos en vivo en este momento.</p>
              <p className="text-gray-400 text-sm mt-2">Revisa "Próximos del Mundial" para ver los siguientes partidos.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayMatches.map(match => (
                <LiveMatchCard key={match.id} match={match} showCompetition />
              ))}
            </div>
          )
        ) : (
          // Upcoming WC matches from local data
          upcomingLocal.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-5xl mb-4">🏟️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sin partidos próximos</h2>
              <p className="text-gray-500">Todos los partidos han sido jugados o aún no hay equipos definidos.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingLocal.map(match => (
                <LocalMatchCard key={match.id} match={match} prediction={predictions[match.id]} showDate />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function LiveMatchCard({ match, showCompetition, showDate }: { match: LiveMatch; showCompetition?: boolean; showDate?: boolean }) {
  const live = isMatchLive(match.status);
  const finished = match.status === 'FINISHED';

  return (
    <div className={`bg-white rounded-xl shadow p-4 ${live ? 'border-l-4 border-green-500' : finished ? 'border-l-4 border-gray-300' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {live && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          )}
          <span className={`text-xs font-medium ${live ? 'text-green-600' : finished ? 'text-gray-500' : 'text-gray-400'}`}>
            {finished ? 'Finalizado' : getMatchStatusLabel(match.status)}
            {match.minute ? ` ${match.minute}'` : ''}
          </span>
          {showCompetition && match.competition && (
            <span className="text-xs text-gray-300 ml-1">• {match.competition}</span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {showDate ? formatDate(match.utcDate) + ' • ' : ''}{formatTime(match.utcDate)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm font-semibold text-gray-800">{match.homeTeam.shortName}</span>
          {match.homeTeam.crest && (
            <img src={match.homeTeam.crest} alt="" className="w-7 h-7 object-contain" />
          )}
        </div>

        <div className="flex items-center gap-2 min-w-[80px] justify-center">
          {match.homeScore !== null ? (
            <>
              <span className="text-2xl font-bold text-gray-900">{match.homeScore}</span>
              <span className="text-gray-400">-</span>
              <span className="text-2xl font-bold text-gray-900">{match.awayScore}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">vs</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1">
          {match.awayTeam.crest && (
            <img src={match.awayTeam.crest} alt="" className="w-7 h-7 object-contain" />
          )}
          <span className="text-sm font-semibold text-gray-800">{match.awayTeam.shortName}</span>
        </div>
      </div>
    </div>
  );
}

function LocalMatchCard({ match, prediction, showDate }: { match: Match; prediction?: Prediction; showDate?: boolean }) {
  const live = isMatchLive(match.status);
  const finished = match.status === 'FINISHED';

  return (
    <div className={`bg-white rounded-xl shadow p-4 ${live ? 'border-l-4 border-green-500' : finished ? 'border-l-4 border-gray-300' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">
          {match.group ? `Grupo ${match.group}` : STAGE_FULL_LABELS[match.stage]}
        </span>
        <span className={`text-xs font-medium ${finished ? 'text-gray-500' : 'text-gray-400'}`}>
          {finished ? 'Finalizado' : (showDate ? formatDate(match.utcDate) + ' • ' : '') + formatTime(match.utcDate)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm font-semibold text-gray-800">{match.homeTeam.shortName}</span>
          {match.homeTeam.flag && (
            <img src={getFlagUrl(match.homeTeam.flag)} alt="" className="w-7 h-5 object-cover rounded-sm" />
          )}
        </div>

        <div className="flex items-center gap-2 min-w-[80px] justify-center">
          {match.homeScore !== null ? (
            <>
              <span className="text-2xl font-bold text-gray-900">{match.homeScore}</span>
              <span className="text-gray-400">-</span>
              <span className="text-2xl font-bold text-gray-900">{match.awayScore}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">{formatTime(match.utcDate)}</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1">
          {match.awayTeam.flag && (
            <img src={getFlagUrl(match.awayTeam.flag)} alt="" className="w-7 h-5 object-cover rounded-sm" />
          )}
          <span className="text-sm font-semibold text-gray-800">{match.awayTeam.shortName}</span>
        </div>
      </div>

      {/* User's prediction comparison */}
      {prediction && finished && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          Tu predicción: {prediction.homeScore} - {prediction.awayScore}
          {prediction.points !== undefined && (
            <span className={`ml-2 font-bold ${prediction.points === 3 ? 'text-green-600' : prediction.points === 1 ? 'text-yellow-600' : 'text-red-500'}`}>
              (+{prediction.points} pts)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
