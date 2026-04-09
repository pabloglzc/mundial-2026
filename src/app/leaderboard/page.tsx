'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { leaderboardService } from '@/services/leaderboard.service';
import { LeaderboardEntry } from '@/services/types';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardService.getLeaderboard().then(lb => {
      setEntries(lb);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabla de Posiciones</h1>
        <p className="text-gray-500 mb-8">Ranking actualizado de todos los participantes.</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56042C]"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aún no hay participantes</h2>
            <p className="text-gray-500 mb-6">
              Sé el primero en registrarte y hacer tus predicciones.
            </p>
            {!user && (
              <Link
                href="/register"
                className="bg-[#56042C] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#6d0538] transition-colors inline-block"
              >
                Registrarse
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Participante</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Pts</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Exactos</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Ganadores</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Predicciones</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr
                    key={entry.userId}
                    className={`border-b border-gray-100 last:border-0 ${
                      user && entry.userId === user.id ? 'bg-amber-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className={`font-bold ${
                        entry.rank === 1 ? 'text-amber-500' : entry.rank === 2 ? 'text-gray-400' : entry.rank === 3 ? 'text-amber-700' : 'text-gray-400'
                      }`}>
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{entry.userName}</span>
                      {user && entry.userId === user.id && (
                        <span className="ml-2 text-xs bg-[#56042C] text-white px-2 py-0.5 rounded-full">Tú</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-lg font-bold text-[#56042C]">{entry.totalPoints}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-sm text-green-600 font-medium">{entry.exactScores}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-sm text-yellow-600 font-medium">{entry.correctWinners}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="text-sm text-gray-500">{entry.totalPredictions}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
