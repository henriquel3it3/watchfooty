import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function Home() {
  const { t } = useTranslation('common');

  const [search, setSearch] = useState('');
  const [teams, setTeams] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  const today = new Date('2023-12-01');
  const endOf2023 = new Date('2023-12-31');
  const from = formatDate(today);
  const to = formatDate(endOf2023);

  useEffect(() => {
    if (search.length < 3 || (selectedTeam && search === selectedTeam.name)) {
      setTeams([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`/api/teams?search=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => setTeams(data || []))
        .catch(() => setTeams([]));
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, selectedTeam]);

  const fetchFixtures = async (teamId: number) => {
    try {
      const res = await fetch(
        `/api/fixtures?teamId=${teamId}&from=${from}&to=${to}`
      );
      const data = await res.json();
      setFixtures(data || []);
    } catch (error) {
      setFixtures([]);
    }
  };

  return (
    <main className="relative w-full">
      {/* Overlay escuro no background */}
      <div className="absolute inset-0 z-0"></div>

      <div className="z-10 container-position relative padding-bottom-l">
        {/* LOGO */}
        <div className="mb-8 w-full flex justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={512}
            height={140}
            priority
            className="w-full max-w-[400px] object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center text-[#FFB300]">
          {t('title')}
        </h1>

        {/* SEARCH INPUT */}
        <div className="relative w-full max-w-lg mb-6 mx-auto">
          {/* Left search icon */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-[#FFB300]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </div>

          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => {
              if (fixtures.length > 0) {
                setFixtures([]);
                setSelectedTeam(null);
              }
            }}
            className="w-full h-12 pl-10 pr-14 
                       bg-[#123A6F]/90 text-white placeholder-gray-300 
                       rounded-xl border border-[#0D2C54] focus:outline-none 
                       focus:ring-2 focus:ring-[#FFB300] text-[15px]
                       shadow-md transition duration-200"
          />

          {/* Right button */}
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 
                       bg-[#FFB300] rounded-full flex items-center justify-center 
                       hover:bg-[#FF8F00] transition duration-200"
          >
            <svg
              className="w-4 h-4 text-black"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.817-4.817A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* DROPDOWN RESULTS */}
        {teams.length > 0 && (
          <ul
            className="bg-[#123A6F]/95 border border-[#0D2C54] rounded-xl shadow-lg 
                       max-h-80 overflow-auto mx-auto w-full max-w-lg animate-fade-in"
          >
            {teams.map(team => (
              <li
                key={team.id}
                className="p-3 hover:bg-[#0D2C54] cursor-pointer flex items-center gap-3 text-gray-100 transition"
                onClick={() => {
                  setSelectedTeam(team);
                  setSearch(team.name);
                  setTeams([]);
                  fetchFixtures(team.id);
                }}
              >
                <Image
                  src={team.image_path}
                  alt={team.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                  unoptimized
                />
                <span className="text-[15px]">{team.name}</span>
              </li>
            ))}
          </ul>
        )}

        {/* FIXTURES */}
        {selectedTeam && fixtures.length > 0 && (
          <div className="bg-[#0D2C54]/90 p-5 rounded-xl max-w-lg mx-auto border border-[#FFB300]">
            <h2 className="text-xl font-semibold mb-4 text-[#FFB300] text-center">
              Próximos jogos do {selectedTeam.name}
            </h2>
            <ul className="space-y-4">
              {fixtures.map(fixture => {
                const home = fixture.participants.find(
                  (p: any) => p.meta.location === 'home'
                );
                const away = fixture.participants.find(
                  (p: any) => p.meta.location === 'away'
                );
                const venue = fixture.venue;
                const tvs =
                  fixture.tvstations?.map((tv: any) => tv.name).join(', ') ||
                  'Transmissão por confirmar';

                return (
                  <li
                    key={fixture.id}
                    className="border border-[#FFB300] rounded-lg p-4 shadow-sm bg-[#123A6F]/95 text-gray-200 text-center transition duration-200"
                  >
                    <div className="font-bold text-white text-lg mb-2">
                      {home?.name} vs {away?.name}
                    </div>
                    <div className="text-sm text-gray-300 leading-5">
                      📅 {new Date(fixture.starting_at).toLocaleString()}
                      <br />
                      📺 {tvs}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

// Para carregar as traduções no lado do servidor:
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}