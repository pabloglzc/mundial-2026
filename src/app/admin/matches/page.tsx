'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import { matchesService } from '@/services/matches.service';
import { predictionsService } from '@/services/predictions.service';
import { Match } from '@/services/types';
import { groups, getFlagUrl } from '@/data/teams';
import { sourceLabel } from '@/data/knockout-bracket';
import { formatDate } from '@/lib/utils';
import { ALL_STAGES, STAGE_LABELS, STAGE_FULL_LABELS } from '@/lib/constants';

function AdminMatchesContent() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>('GROUP_STAGE');
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    matchesService.getAllMatches().then(all => {
      setMatches(all);
      const scoreMap: Record<number, { home: string; away: string }> = {};
      all.forEach(m => {
        if (m.homeScore !== null && m.awayScore !== null) {
          scoreMap[m.id] = { home: String(m.homeScore), away: String(m.awayScore) };
        }
      });
      setScores(scoreMap);
    });
  }, []);

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-20 text-gray-500">Acceso denegado</div>;
  }

  const isKnockout = selectedStage !== 'GROUP_STAGE';

  const filtered = isKnockout
    ? matches.filter(m => m.stage === selectedStage)
    : matches.filter(m => m.group === selectedGroup);

  const handleSaveResult = async (matchId: number) => {
    const score = scores[matchId];
    if (!score || score.home === '' || score.away === '') return;
    const home = parseInt(score.home);
    const away = parseInt(score.away);
    if (isNaN(home) || isNaN(away)) return;

    // Validate: knockout matches cannot be draws
    const match = matches.find(m => m.id === matchId);
    if (match && match.stage !== 'GROUP_STAGE' && home === away) {
      setError(`Partido #${matchId}: Los partidos eliminatorios deben tener un ganador (no puede ser empate).`);
      setTimeout(() => setError(null), 4000);
      return;
    }

    setSaving(matchId);
    await matchesService.updateMatchResult(matchId, home, away);
    await predictionsService.calculatePointsForMatch(matchId, home, away);

    // Refresh matches (bracket may have been updated)
    const updated = await matchesService.getAllMatches();
    setMatches(updated);
    setSaving(null);
  };

  const handleRefreshBracket = async () => {
    await matchesService.refreshKnockoutBracket();
    const updated = await matchesService.getAllMatches();
    setMatches(updated);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Capturar Resultados</h1>
      <p className="text-gray-500 mb-6">Ingresa los marcadores reales. Los puntos se calculan automáticamente.</p>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

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

      {/* Group selector for group stage */}
      {!isKnockout && (
        <div className="mb-6">
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          >
            {groups.map(g => (
              <option key={g} value={g}>Grupo {g}</option>
            ))}
          </select>
        </div>
      )}

      {/* Knockout header */}
      {isKnockout && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">{STAGE_FULL_LABELS[selectedStage]}</h2>
          <button
            onClick={handleRefreshBracket}
            className="text-sm text-primary hover:underline"
          >
            Actualizar Bracket
          </button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No hay partidos en esta fase.</div>
        )}
        {filtered.map(match => {
          const isTBD = match.homeTeam.id === 0 || match.awayTeam.id === 0;

          return (
            <div key={match.id} className={`bg-white rounded-xl shadow p-4 ${match.status === 'FINISHED' ? 'border-l-4 border-green-500' : isTBD ? 'opacity-60' : ''}`}>
              <div className="text-xs text-gray-400 mb-2">
                {match.group ? `Grupo ${match.group} \u2022 Jornada ${match.matchday}` : STAGE_FULL_LABELS[match.stage]}
                {' \u2022 '}{formatDate(match.utcDate)}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-sm font-semibold text-gray-800">
                    {isTBD && match.homeTeamSource ? sourceLabel(match.homeTeamSource) : match.homeTeam.shortName}
                  </span>
                  {match.homeTeam.flag && (
                    <img src={getFlagUrl(match.homeTeam.flag)} alt="" className="w-7 h-5 object-cover rounded-sm" />
                  )}
                </div>

                {isTBD ? (
                  <div className="text-sm text-gray-400 px-4">vs</div>
                ) : (
                  <>
                    <input
                      type="number"
                      min="0"
                      value={scores[match.id]?.home ?? ''}
                      onChange={e => setScores(prev => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], home: e.target.value }
                      }))}
                      className="w-14 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary text-gray-900"
                      placeholder="-"
                    />
                    <span className="text-gray-400 font-bold">-</span>
                    <input
                      type="number"
                      min="0"
                      value={scores[match.id]?.away ?? ''}
                      onChange={e => setScores(prev => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], away: e.target.value }
                      }))}
                      className="w-14 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary text-gray-900"
                      placeholder="-"
                    />
                  </>
                )}

                <div className="flex items-center gap-2 flex-1">
                  {match.awayTeam.flag && (
                    <img src={getFlagUrl(match.awayTeam.flag)} alt="" className="w-7 h-5 object-cover rounded-sm" />
                  )}
                  <span className="text-sm font-semibold text-gray-800">
                    {isTBD && match.awayTeamSource ? sourceLabel(match.awayTeamSource) : match.awayTeam.shortName}
                  </span>
                </div>

                {!isTBD && (
                  <button
                    onClick={() => handleSaveResult(match.id)}
                    disabled={saving === match.id}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving === match.id ? '...' : match.status === 'FINISHED' ? 'Actualizar' : 'Guardar'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminMatchesPage() {
  return (
    <AuthGuard>
      <div className="py-12 px-4">
        <AdminMatchesContent />
      </div>
    </AuthGuard>
  );
}
