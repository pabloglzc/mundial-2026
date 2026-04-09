'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import { authService } from '@/services/auth.service';
import { paymentsService } from '@/services/payments.service';
import { User, Payment } from '@/services/types';

function AdminPaymentsContent() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [verifying, setVerifying] = useState<string | null>(null);

  const loadData = async () => {
    const [allUsers, allPayments] = await Promise.all([
      authService.getAllUsers(),
      paymentsService.getAllPayments(),
    ]);
    setUsers(allUsers.filter(u => u.role !== 'admin'));
    setPayments(allPayments);
  };

  useEffect(() => { loadData(); }, []);

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-20 text-gray-500">Acceso denegado</div>;
  }

  const handleVerify = async (paymentId: string) => {
    setVerifying(paymentId);
    await paymentsService.verifyPayment(paymentId, user.id);
    await loadData();
    setVerifying(null);
  };

  const getPaymentForUser = (userId: string) => payments.find(p => p.userId === userId);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">Verificado</span>;
      case 'submitted':
        return <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">Por verificar</span>;
      default:
        return <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full">Pendiente</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Verificar Pagos</h1>
      <p className="text-gray-500 mb-8">Revisa y aprueba los pagos de los participantes.</p>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const payment = getPaymentForUser(u.id);
              return (
                <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-center">{statusBadge(u.paymentStatus)}</td>
                  <td className="px-4 py-3 text-center">
                    {payment && payment.status === 'submitted' && (
                      <button
                        onClick={() => handleVerify(payment.id)}
                        disabled={verifying === payment.id}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {verifying === payment.id ? 'Verificando...' : 'Aprobar'}
                      </button>
                    )}
                    {u.paymentStatus === 'verified' && (
                      <span className="text-green-600 text-sm">✓ Aprobado</span>
                    )}
                    {u.paymentStatus === 'pending' && !payment && (
                      <span className="text-gray-400 text-sm">Sin pago</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No hay usuarios registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPaymentsPage() {
  return (
    <AuthGuard>
      <div className="py-12 px-4">
        <AdminPaymentsContent />
      </div>
    </AuthGuard>
  );
}
