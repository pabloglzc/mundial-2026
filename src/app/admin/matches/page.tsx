'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import { matchesService } from '@/services/matches.service';
import { predictionsService } from '@/services/predictions.service';
import { Match } from '@/services/types';
import { groups, getFlagUrl } from '@/data/teams';
import { formatDate } from '@/lib/utils';

function AdminMatchesContent() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});
  const [saving, setSaving] = useState<number | null>(null);

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

  const filtered = matches.filter(m => m.group === selectedGroup);

  const handleSaveResult = async (matchId: number) => {
    const score = scores[matchId];
    if (!score || score.home === '' || score.away === '') return;
    const home = parseInt(score.home);
    const away = parseInt(score.away);
    if (isNaN(home) || isNaN(away)) return;

    setSaving(matchId);
    await matchesService.updateMatchResult(matchId, home, away);
    await predictionsService.calculatePointsForMatch(matchId, home, away);

    // Refresh matches
    const updated = await matchesService.getAllMatches();
    setMatches(updated);
    setSaving(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Capturar Resultados</h1>
      <p className="text-gray-500 mb-8">Ingresa los marcadores reales. Los puntos se calculan automáticamente.</p>

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

      <div className="space-y-3">
        {filtered.map(match => (
          <div key={match.id} className={`bg-white rounded-xl shadow p-4 ${match.status === 'FINISHED' ? 'border-l-4 border-green-500' : ''}`}>
            <div className="text-xs text-gray-400 mb-2">
              Jornada {match.matchday} &bull; {formatDate(match.utcDate)}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-sm font-semibold text-gray-800">{match.homeTeam.shortName}</span>
                <img src={getFlagUrl(match.homeTeam.flag)} alt="" className="w-7 h-5 object-cover rounded-sm" />
              </div>

              <input
                type="number"
                min="0"
                value={scores[match.id]?.home ?? ''}
                onChange={e => setScores(prev => ({
                  ...prev,
                  [match.id]: { ...prev[match.id], home: e.target.value }
                }))}
                className="w-14 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#56042C] text-gray-900"
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
                className="w-14 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#56042C] text-gray-900"
                placeholder="-"
              />

              <div className="flex items-center gap-2 flex-1">
                <img src={getFlagUrl(match.awayTeam.flag)} alt="" className="w-7 h-5 object-cover rounded-sm" />
                <span className="text-sm font-semibold text-gray-800">{match.awayTeam.shortName}</span>
              </div>

              <button
                onClick={() => handleSaveResult(match.id)}
                disabled={saving === match.id}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving === match.id ? '...' : match.status === 'FINISHED' ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        ))}
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
