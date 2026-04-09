'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = await login(email, password);
    setLoading(false);

    if (user) {
      router.push('/dashboard');
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Iniciar Sesión</h1>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56042C] focus:border-transparent outline-none text-gray-900"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56042C] focus:border-transparent outline-none text-gray-900"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#56042C] text-white font-semibold py-3 rounded-lg hover:bg-[#6d0538] transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#56042C] font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              Admin demo: admin@mundial2026.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
