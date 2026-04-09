'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">⚽</span>
            <span>Mundial 2026</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/leaderboard" className="hover:text-brand-green transition-colors">
              Tabla de Posiciones
            </Link>
            <Link href="/results" className="hover:text-brand-green transition-colors">
              Resultados
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-brand-green transition-colors">
                  Dashboard
                </Link>
                <Link href="/predictions" className="hover:text-brand-green transition-colors">
                  Predicciones
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hover:text-brand-green transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm text-brand-green/80">{user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="hover:text-brand-green transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-brand-green hover:bg-brand-green-hover text-white font-semibold px-4 py-1.5 rounded transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
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
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/leaderboard" className="block py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>
              Tabla de Posiciones
            </Link>
            <Link href="/results" className="block py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>
              Resultados
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/predictions" className="block py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>
                  Predicciones
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="block py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2 text-brand-green/80">
                  Salir ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="block py-2 text-brand-green font-semibold" onClick={() => setMenuOpen(false)}>
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
