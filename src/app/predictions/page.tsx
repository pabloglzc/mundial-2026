'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import PaymentGate from '@/components/layout/PaymentGate';
import { matchesService } from '@/services/matches.service';
import { predictionsService } from '@/services/predictions.service';
import { Match, Prediction } from '@/services/types';
import { groups, getFlagUrl } from '@/data/teams';
import { sourceLabel } from '@/data/knockout-bracket';
import { formatDate, formatTime, isMatchStarted } from '@/lib/utils';
import { getPointsLabel } from '@/lib/scoring';
import { ALL_STAGES, STAGE_LABELS, STAGE_FULL_LABELS } from '@/lib/constants';

function PredictionsContent() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [selectedStage, setSelectedStage] = useState<string>('GROUP_STAGE');
  const [selectedGroup, setSelectedGroup] = useState<string>('A');
  const [selectedMatchday, setSelectedMatchday] = useState<number>(1);
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [savedMsg, setSavedMsg] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    matchesService.getAllMatches().then(all => {
      setMatches(all);
    });

    predictionsService.getUserPredictions(user.id).then(preds => {
      const map: Record<number, Prediction> = {};
      preds.forEach(p => { map[p.matchId] = p; });
      setPredictions(map);

      const scoreMap: Record<number, { home: string; away: string }> = {};
      preds.forEach(p => {
        scoreMap[p.matchId] = { home: String(p.homeScore), away: String(p.awayScore) };
      });
      setScores(scoreMap);
    });
  }, [user]);

  const filteredMatches = selectedStage === 'GROUP_STAGE'
    ? matches.filter(m => m.group === selectedGroup && m.matchday === selectedMatchday)
    : matches.filter(m => m.stage === selectedStage);

  const handleSave = async (matchId: number) => {
    if (!user) return;
    const score = scores[matchId];
    if (!score || score.home === '' || score.away === '') return;

    const home = parseInt(score.home);
    const away = parseInt(score.away);
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) return;

    setSaving(matchId);
    const pred = await predictionsService.savePrediction(user.id, matchId, home, away);
    setPredictions(prev => ({ ...prev, [matchId]: pred }));
    setSaving(null);
    setSavedMsg(matchId);
    setTimeout(() => setSavedMsg(null), 2000);
  };

  const handleSaveAll = async () => {
    if (!user) return;
    for (const match of filteredMatches) {
      if (isMatchStarted(match.utcDate)) continue;
      if (match.homeTeam.id === 0 || match.awayTeam.id === 0) continue;
      const score = scores[match.id];
      if (score && score.home !== '' && score.away !== '') {
        await handleSave(match.id);
      }
    }
  };

  const updateScore = (matchId: number, team: 'home' | 'away', value: string) => {
    if (value !== '' && (isNaN(Number(value)) || Number(value) < 0)) return;
    setScores(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [team]: value },
    }));
  };

  const isKnockout = selectedStage !== 'GROUP_STAGE';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Predicciones</h1>
      <p className="text-gray-500 mb-6">Ingresa tu marcador para cada partido.</p>

      {/* Stage Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {ALL_STAGES.map(stage => (
          <button
            key={stage}
            onClick={() => setSelectedStage(stage)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedStage === stage
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {STAGE_LABELS[stage]}
          </button>
        ))}
      </div>

      {/* Group Filters (only for group stage) */}
      {!isKnockout && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-gray-600 mr-2">Grupo:</label>
              <select
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900"
              >
                {groups.map(g => (
                  <option key={g} value={g}>Grupo {g}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map(md => (
                <button
                  key={md}
                  onClick={() => setSelectedMatchday(md)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedMatchday === md
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Jornada {md}
                </button>
              ))}
            </div>
            <button
              onClick={handleSaveAll}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors"
            >
              Guardar Todos
            </button>
          </div>
        </div>
      )}

      {/* Knockout header */}
      {isKnockout && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{STAGE_FULL_LABELS[selectedStage]}</h2>
          <button
            onClick={handleSaveAll}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            Guardar Todos
          </button>
        </div>
      )}

      {/* Matches */}
      <div className="space-y-4">
        {filteredMatches.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No hay partidos en esta fase.
          </div>
        )}
        {filteredMatches.map(match => {
          const started = isMatchStarted(match.utcDate);
          const prediction = predictions[match.id];
          const finished = match.status === 'FINISHED';
          const score = scores[match.id] || { home: '', away: '' };
          const isTBD = match.homeTeam.id === 0 || match.awayTeam.id === 0;

          return (
            <div
              key={match.id}
              className={`bg-white rounded-xl shadow p-4 ${
                finished ? 'border-l-4 border-gray-300' : started ? 'border-l-4 border-amber-400' : isTBD ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">
                  {match.group ? `Grupo ${match.group} \u2022 Jornada ${match.matchday}` : STAGE_FULL_LABELS[match.stage]}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(match.utcDate)} &bull; {formatTime(match.utcDate)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Home Team */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-sm font-semibold text-gray-800">
                    {isTBD && match.homeTeamSource ? sourceLabel(match.homeTeamSource) : match.homeTeam.shortName}
                  </span>
                  {match.homeTeam.flag && (
                    <img src={getFlagUrl(match.homeTeam.flag)} alt="" className="w-8 h-5 object-cover rounded-sm" />
                  )}
                </div>

                {/* Score Inputs or Result */}
                <div className="flex items-center gap-2">
                  {finished ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 w-10 text-center">{match.homeScore}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-2xl font-bold text-gray-900 w-10 text-center">{match.awayScore}</span>
                    </div>
                  ) : started ? (
                    <div className="text-sm text-amber-600 font-medium px-4">En juego</div>
                  ) : isTBD ? (
                    <div className="text-sm text-gray-400 font-medium px-4">vs</div>
                  ) : (
                    <>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={score.home}
                        onChange={e => updateScore(match.id, 'home', e.target.value)}
                        className="w-14 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900"
                        placeholder="-"
                      />
                      <span className="text-gray-400 font-bold">-</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={score.away}
                        onChange={e => updateScore(match.id, 'away', e.target.value)}
                        className="w-14 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900"
                        placeholder="-"
                      />
                    </>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-2 flex-1">
                  {match.awayTeam.flag && (
                    <img src={getFlagUrl(match.awayTeam.flag)} alt="" className="w-8 h-5 object-cover rounded-sm" />
                  )}
                  <span className="text-sm font-semibold text-gray-800">
                    {isTBD && match.awayTeamSource ? sourceLabel(match.awayTeamSource) : match.awayTeam.shortName}
                  </span>
                </div>

                {/* Save Button */}
                <div className="w-24 text-right">
                  {!started && !finished && !isTBD && (
                    <button
                      onClick={() => handleSave(match.id)}
                      disabled={saving === match.id || score.home === '' || score.away === ''}
                      className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30"
                    >
                      {saving === match.id ? '...' : savedMsg === match.id ? 'Listo!' : 'Guardar'}
                    </button>
                  )}
                </div>
              </div>

              {/* Prediction result for finished matches */}
              {finished && prediction && prediction.points !== undefined && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Tu predicción: {prediction.homeScore} - {prediction.awayScore}
                  </span>
                  <span className={`text-sm font-bold ${getPointsLabel(prediction.points).color}`}>
                    {getPointsLabel(prediction.points).text}
                  </span>
                </div>
              )}

              {/* Existing prediction badge for scheduled matches */}
              {!finished && prediction && !started && !isTBD && (
                <div className="mt-2 text-xs text-green-600">
                  Predicción guardada: {prediction.homeScore} - {prediction.awayScore}
                </div>
              )}

              <div className="mt-1 text-xs text-gray-300">{match.venue}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PredictionsPage() {
  return (
    <AuthGuard>
      <PaymentGate>
        <div className="py-12 px-4">
          <PredictionsContent />
        </div>
      </PaymentGate>
    </AuthGuard>
  );
}
