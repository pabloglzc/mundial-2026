'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { matchesService } from '@/services/matches.service';
import { predictionsService } from '@/services/predictions.service';
import { fetchTodayMatches, getLocalTodayMatches, LiveMatch } from '@/services/live-results.service';
import { Match, Prediction } from '@/services/types';
import { getFlagUrl } from '@/data/teams';
import { formatTime, getMatchStatusLabel, isMatchLive } from '@/lib/utils';
import { LIVE_REFRESH_INTERVAL_MS, STAGE_FULL_LABELS } from '@/lib/constants';

export default function ResultsPage() {
  const { user } = useAuth();
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [localMatches, setLocalMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    // Try live API first
    const live = await fetchTodayMatches();
    if (live.length > 0) {
      setLiveMatches(live);
      setUsingFallback(false);
    } else {
      // Fallback to local data
      const allMatches = await matchesService.getAllMatches();
      const todayLocal = getLocalTodayMatches(allMatches);
      setLocalMatches(todayLocal);
      setUsingFallback(true);
    }
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

  const sortedLive = [...liveMatches].sort((a, b) =>
    (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5) || a.utcDate.localeCompare(b.utcDate)
  );

  const sortedLocal = [...localMatches].sort((a, b) =>
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
        <p className="text-gray-500 mb-1">Partidos de hoy y resultados recientes.</p>
        <p className="text-xs text-gray-400 mb-8">
          Última actualización: {lastRefresh.toLocaleTimeString('es-MX')}
          {usingFallback && ' (datos locales)'}
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : usingFallback ? (
          // Fallback: show local matches
          sortedLocal.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-5xl mb-4">📺</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sin partidos hoy</h2>
              <p className="text-gray-500">No hay partidos programados para hoy.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedLocal.map(match => (
                <LocalMatchCard key={match.id} match={match} prediction={predictions[match.id]} />
              ))}
            </div>
          )
        ) : (
          // Live API data
          sortedLive.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-5xl mb-4">📺</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sin partidos hoy</h2>
              <p className="text-gray-500">No hay partidos del Mundial programados para hoy.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedLive.map(match => (
                <LiveMatchCard key={match.id} match={match} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function LiveMatchCard({ match }: { match: LiveMatch }) {
  const live = isMatchLive(match.status);

  return (
    <div className={`bg-white rounded-xl shadow p-4 ${live ? 'border-l-4 border-green-500' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {live && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          )}
          <span className={`text-xs font-medium ${live ? 'text-green-600' : match.status === 'HALF_TIME' ? 'text-amber-600' : 'text-gray-400'}`}>
            {getMatchStatusLabel(match.status)}
            {match.minute ? ` ${match.minute}'` : ''}
          </span>
        </div>
        <span className="text-xs text-gray-400">{formatTime(match.utcDate)}</span>
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
            <span className="text-sm text-gray-400">{formatTime(match.utcDate)}</span>
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

function LocalMatchCard({ match, prediction }: { match: Match; prediction?: Prediction }) {
  const live = isMatchLive(match.status);
  const finished = match.status === 'FINISHED';

  return (
    <div className={`bg-white rounded-xl shadow p-4 ${live ? 'border-l-4 border-green-500' : finished ? 'border-l-4 border-gray-300' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">
          {match.group ? `Grupo ${match.group}` : STAGE_FULL_LABELS[match.stage]}
        </span>
        <span className={`text-xs font-medium ${finished ? 'text-gray-500' : 'text-gray-400'}`}>
          {finished ? 'Finalizado' : formatTime(match.utcDate)}
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
