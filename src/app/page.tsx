'use client';

import Link from 'next/link';
import { teams, groups, getFlagUrl } from '@/data/teams';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/fifa-wc-2026-logo.jpg"
            alt="FIFA World Cup 2026"
            className="mx-auto mb-8 w-36 md:w-44"
          />
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Mundial 2026
          </h1>
          <p className="text-lg text-gray-400 mb-1">
            FIFA World Cup 2026™
          </p>
          <p className="text-sm text-gray-400 mb-10">
            EE.UU. &bull; México &bull; Canadá &mdash; 11 Jun - 19 Jul
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
            Predice los marcadores de los 104 partidos.
            <span className="font-semibold text-primary"> 3 pts</span> por exacto,
            <span className="font-semibold text-primary"> 1 pt</span> por acertar ganador.
          </p>
          {!user ? (
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/register"
                className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Registrarse — $500 MXN
              </Link>
              <Link
                href="/login"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
            </div>
          ) : (
            <Link
              href="/predictions"
              className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors inline-block"
            >
              Ir a Predicciones
            </Link>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-brand-green via-primary to-brand-red"></div>

      {/* How it works */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Regístrate y Paga</h3>
            <p className="text-sm text-gray-500">
              Crea tu cuenta y realiza el pago de $500 MXN vía MercadoPago.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚽</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Predice Marcadores</h3>
            <p className="text-sm text-gray-500">
              Ingresa tu predicción para cada partido antes de que comience.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Gana Puntos</h3>
            <p className="text-sm text-gray-500">
              El que más puntos acumule al final del mundial, gana el pozo.
            </p>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Grupos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groups.map(group => {
              const groupTeams = teams.filter(t => t.group === group);
              return (
                <div key={group} className="bg-white rounded-xl p-4 border border-gray-100">
                  <h3 className="text-sm font-bold text-primary mb-3 text-center uppercase tracking-wide">
                    Grupo {group}
                  </h3>
                  <div className="space-y-2">
                    {groupTeams.map(team => (
                      <div key={team.id} className="flex items-center gap-2">
                        <img
                          src={getFlagUrl(team.flag)}
                          alt={team.name}
                          className="w-6 h-4 object-cover rounded-sm"
                        />
                        <span className="text-sm text-gray-600">{team.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 px-4 bg-white text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Listo para participar?</h2>
          <p className="text-gray-500 mb-8">
            Inscríbete ahora y demuestra que sabes de futbol.
          </p>
          <Link
            href="/register"
            className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors inline-block"
          >
            Registrarse — $500 MXN
          </Link>
        </section>
      )}
    </div>
  );
}
