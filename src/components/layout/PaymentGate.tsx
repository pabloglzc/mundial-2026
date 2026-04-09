'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function PaymentGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return null;

  if (user.paymentStatus !== 'verified') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago Requerido</h2>
          <p className="text-gray-600 mb-6">
            {user.paymentStatus === 'pending'
              ? 'Necesitas realizar tu pago de $500 MXN para acceder a las predicciones.'
              : 'Tu pago está siendo verificado por el administrador. Te notificaremos cuando sea aprobado.'}
          </p>
          {user.paymentStatus === 'pending' ? (
            <Link
              href="/payment"
              className="inline-block bg-[#56042C] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#6d0538] transition-colors"
            >
              Ir a Pagar
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pago en revisión
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
