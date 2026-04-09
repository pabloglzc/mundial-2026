'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import { matchesService } from '@/services/matches.service';
import { predictionsService } from '@/services/predictions.service';
import { leaderboardService } from '@/services/leaderboard.service';
import { Match, LeaderboardEntry } from '@/services/types';
import { getFlagUrl } from '@/data/teams';
import { formatDate, formatTime } from '@/lib/utils';

function DashboardContent() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [topLeaderboard, setTopLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState({ predictions: 0, points: 0, exact: 0 });

  useEffect(() => {
    if (!user) return;

    matchesService.getUpcomingMatches(5).then(setUpcoming);
    leaderboardService.getLeaderboard().then(lb => setTopLeaderboard(lb.slice(0, 5)));
    predictionsService.getUserPredictions(user.id).then(preds => {
      const scored = preds.filter(p => p.points !== undefined);
      setStats({
        predictions: preds.length,
        points: scored.reduce((s, p) => s + (p.points || 0), 0),
        exact: scored.filter(p => p.points === 3).length,
      });
    });
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {user.name}!</h1>
      <p className="text-gray-500 mb-8">Bienvenido a tu quiniela del Mundial 2026.</p>

      {/* Payment Banner */}
      {user.paymentStatus !== 'verified' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800">
              {user.paymentStatus === 'pending' ? 'Pago pendiente' : 'Pago en verificación'}
            </p>
            <p className="text-sm text-amber-600">
              {user.paymentStatus === 'pending'
                ? 'Realiza tu pago para poder hacer predicciones.'
                : 'Tu pago está siendo revisado por el admin.'}
            </p>
          </div>
          {user.paymentStatus === 'pending' && (
            <Link
              href="/payment"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Ir a Pagar
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-[#56042C]">{stats.points}</p>
          <p className="text-sm text-gray-500">Puntos</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-[#56042C]">{stats.predictions}</p>
          <p className="text-sm text-gray-500">Predicciones</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.exact}</p>
          <p className="text-sm text-gray-500">Exactos</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upcoming Matches */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Próximos Partidos</h2>
            <Link href="/predictions" className="text-sm text-[#56042C] hover:underline">Ver todos</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay partidos próximos.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(match => (
                <div key={match.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 flex-1">
                    <img src={getFlagUrl(match.homeTeam.flag)} alt="" className="w-5 h-3.5 object-cover rounded-sm" />
                    <span className="text-sm font-medium text-gray-700">{match.homeTeam.shortName}</span>
                  </div>
                  <div className="text-xs text-gray-400 px-3 text-center">
                    <div>{formatDate(match.utcDate)}</div>
                    <div>{formatTime(match.utcDate)}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-sm font-medium text-gray-700">{match.awayTeam.shortName}</span>
                    <img src={getFlagUrl(match.awayTeam.flag)} alt="" className="w-5 h-3.5 object-cover rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mini Leaderboard */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top 5</h2>
            <Link href="/leaderboard" className="text-sm text-[#56042C] hover:underline">Ver tabla</Link>
          </div>
          {topLeaderboard.length === 0 ? (
            <p className="text-gray-400 text-sm">Aún no hay datos en la tabla.</p>
          ) : (
            <div className="space-y-2">
              {topLeaderboard.map(entry => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                    entry.userId === user.id ? 'bg-amber-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-5">{entry.rank}</span>
                    <span className="text-sm font-medium text-gray-700">{entry.userName}</span>
                  </div>
                  <span className="text-sm font-bold text-[#56042C]">{entry.totalPoints} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="py-12 px-4">
        <DashboardContent />
      </div>
    </AuthGuard>
  );
}
