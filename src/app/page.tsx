'use client';

import Link from 'next/link';
import { teams, groups, getFlagUrl } from '@/data/teams';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-green via-primary to-brand-red text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            Mundial 2026
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-2">
            FIFA World Cup 2026™
          </p>
          <p className="text-lg text-yellow-300 mb-8">
            EE.UU. &bull; México &bull; Canadá &mdash; 11 Jun - 19 Jul
          </p>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Predice los marcadores de los 104 partidos del mundial.
            <br />
            <strong className="text-yellow-300">3 puntos</strong> por marcador exacto &bull;{' '}
            <strong className="text-yellow-300">1 punto</strong> por acertar ganador.
          </p>
          {!user ? (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                className="bg-white hover:bg-brand-gray-light text-primary font-bold px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Registrarse — $500 MXN
              </Link>
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
            </div>
          ) : (
            <Link
              href="/predictions"
              className="bg-white hover:bg-brand-gray-light text-primary font-bold px-8 py-3 rounded-lg text-lg transition-colors inline-block"
            >
              Ir a Predicciones
            </Link>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. Regístrate y Paga</h3>
            <p className="text-gray-600">
              Crea tu cuenta y realiza el pago de $500 MXN vía MercadoPago para participar.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl mb-4">⚽</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">2. Predice Marcadores</h3>
            <p className="text-gray-600">
              Ingresa tu predicción del marcador para cada partido antes de que comience.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3. Gana Puntos</h3>
            <p className="text-gray-600">
              3 pts por marcador exacto, 1 pt por acertar el resultado. El que más puntos acumule, gana.
            </p>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Grupos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groups.map(group => {
              const groupTeams = teams.filter(t => t.group === group);
              return (
                <div key={group} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-primary mb-3 text-center">
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
                        <span className="text-sm text-gray-700">{team.name}</span>
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
        <section className="py-16 px-4 bg-primary text-white text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para participar?</h2>
          <p className="text-lg text-white/80 mb-8">
            Inscríbete ahora y demuestra que sabes de futbol.
          </p>
          <Link
            href="/register"
            className="bg-white hover:bg-brand-gray-light text-primary font-bold px-8 py-3 rounded-lg text-lg transition-colors inline-block"
          >
            Registrarse — $500 MXN
          </Link>
        </section>
      )}
    </div>
  );
}
