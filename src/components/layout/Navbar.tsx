'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <span className="text-2xl">⚽</span>
            <span>Mundial 2026</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/leaderboard" className="text-gray-600 hover:text-primary transition-colors">
              Tabla de Posiciones
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/predictions" className="text-gray-600 hover:text-primary transition-colors">
                  Predicciones
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-gray-600 hover:text-primary transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm text-gray-500">{user.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary-hover text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-2">
            <Link href="/leaderboard" className="block py-2 text-gray-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
              Tabla de Posiciones
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 text-gray-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/predictions" className="block py-2 text-gray-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
                  Predicciones
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="block py-2 text-gray-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2 text-gray-400">
                  Salir ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-gray-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="block py-2 text-primary font-semibold" onClick={() => setMenuOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
