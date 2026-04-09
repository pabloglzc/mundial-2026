'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import { paymentsService } from '@/services/payments.service';
import { useRouter } from 'next/navigation';
import { ENTRY_FEE } from '@/lib/constants';

function PaymentContent() {
  const { user, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleSimulatePayment = async () => {
    setSubmitting(true);
    await paymentsService.submitPayment(user.id, 'mercadopago');
    await refreshUser();
    setSubmitting(false);
  };

  // For demo: auto-verify payment
  const handleDemoVerify = async () => {
    setSubmitting(true);
    const payment = await paymentsService.getUserPayment(user.id);
    if (payment) {
      await paymentsService.verifyPayment(payment.id, 'admin-1');
      await refreshUser();
    }
    setSubmitting(false);
    router.push('/predictions');
  };

  if (user.paymentStatus === 'verified') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago Verificado</h2>
          <p className="text-gray-600 mb-6">Tu pago ha sido confirmado. Ya puedes hacer tus predicciones.</p>
          <button
            onClick={() => router.push('/predictions')}
            className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
          >
            Ir a Predicciones
          </button>
        </div>
      </div>
    );
  }

  if (user.paymentStatus === 'submitted') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago en Revisión</h2>
          <p className="text-gray-600 mb-6">
            Tu pago está siendo verificado por el administrador. Recibirás acceso pronto.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            El administrador verificará tu pago manualmente.
          </div>
          {/* Demo button */}
          <button
            onClick={handleDemoVerify}
            disabled={submitting}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
          >
            (Demo: Verificar pago automáticamente)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Pago de Inscripción</h2>
        <p className="text-gray-500 text-center mb-8">
          Para participar en la quiniela necesitas realizar tu pago.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Quiniela Mundial 2026</span>
            <span className="text-2xl font-bold text-gray-900">${ENTRY_FEE} MXN</span>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>- Acceso a predicciones de los 104 partidos</p>
            <p>- Tabla de posiciones en tiempo real</p>
            <p>- Participa por el pozo acumulado</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* MercadoPago button (mock) */}
          <button
            onClick={handleSimulatePayment}
            disabled={submitting}
            className="w-full bg-[#009EE3] hover:bg-[#0087c4] text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            {submitting ? 'Procesando...' : `Pagar $${ENTRY_FEE} MXN con MercadoPago`}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Aceptamos tarjeta de crédito/débito, SPEI, y OXXO vía MercadoPago.
            <br />
            (En modo demo: el pago se simula automáticamente)
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <AuthGuard>
      <div className="py-12 px-4">
        <PaymentContent />
      </div>
    </AuthGuard>
  );
}
