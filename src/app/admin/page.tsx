'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import { authService } from '@/services/auth.service';
import { matchesService } from '@/services/matches.service';
import { paymentsService } from '@/services/payments.service';

function AdminContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, paid: 0, pending: 0, finished: 0 });

  useEffect(() => {
    Promise.all([
      authService.getAllUsers(),
      paymentsService.getPendingPayments(),
      matchesService.getFinishedMatches(),
    ]).then(([users, pending, finished]) => {
      setStats({
        users: users.filter(u => u.role !== 'admin').length,
        paid: users.filter(u => u.paymentStatus === 'verified' && u.role !== 'admin').length,
        pending: pending.length,
        finished: finished.length,
      });
    });
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-xl font-bold text-gray-900">Acceso Denegado</h2>
        <p className="text-gray-500">Solo administradores pueden acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-primary">{stats.users}</p>
          <p className="text-sm text-gray-500">Usuarios</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
          <p className="text-sm text-gray-500">Pagados</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pagos Pendientes</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.finished}</p>
          <p className="text-sm text-gray-500">Partidos Jugados</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/admin/matches"
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
        >
          <div className="text-4xl mb-4">⚽</div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
            Capturar Resultados
          </h2>
          <p className="text-gray-500 mt-2">
            Ingresa los marcadores reales de los partidos terminados.
          </p>
        </Link>

        <Link
          href="/admin/payments"
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
        >
          <div className="text-4xl mb-4">💳</div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
            Verificar Pagos
          </h2>
          <p className="text-gray-500 mt-2">
            Revisa y aprueba los pagos de los participantes.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <div className="py-12 px-4">
        <AdminContent />
      </div>
    </AuthGuard>
  );
}
