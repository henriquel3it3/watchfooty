import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Logo from '@/components/Logo';
import SearchInput from '@/components/SearchInput';
import TeamList from '@/components/TeamList';
import FixturesList from '@/components/FixturesList';
import InfoBanner from '@/components/InfoBanner';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function Home() {
  const { t } = useTranslation('common');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [teams, setTeams] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [justSelected, setJustSelected] = useState(false);

  const today = new Date('2023-12-01');
  const endOf2023 = new Date('2023-12-31');
  const from = formatDate(today);
  const to = formatDate(endOf2023);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (justSelected) {
      setJustSelected(false); // limpa após o ciclo
      return;
    }

    if (selectedTeam && debouncedSearch === selectedTeam.name) return;

    if (debouncedSearch.length < 3) {
      setTeams([]);
      return;
    }

    fetch(`/api/teams?search=${encodeURIComponent(debouncedSearch)}`)
      .then(res => res.json())
      .then(data => setTeams(data || []))
      .catch(() => setTeams([]));
  }, [debouncedSearch, selectedTeam, justSelected]);

  const fetchFixtures = async (teamId: number) => {
    try {
      const res = await fetch(`/api/fixtures?teamId=${teamId}&from=${from}&to=${to}`);
      const data = await res.json();
      setFixtures(data || []);
    } catch {
      setFixtures([]);
    }
  };

  return (
    <main className="relative w-full">
      <div className="absolute inset-0 z-0" />

      <div className="z-10 container-position relative pb-8">
        <Logo />

        <h1 className="text-2xl font-bold mb-6 text-center text-[#FFB300]">
          {t('title')}
        </h1>

        <SearchInput
          value={search}
          onChange={setSearch}
          onFocus={() => {
            window.scrollTo({ top: 0});
            if (fixtures.length > 0) {
              setFixtures([]);
              setSelectedTeam(null);
            }
          }}
        />

        {!selectedTeam && teams.length === 0 && (
          <InfoBanner />
        )}

        {teams.length > 0 && fixtures.length === 0 && (
          <TeamList
            teams={teams}
            onSelectTeam={(team) => {
              setSelectedTeam(team);
              if (search !== team.name) {
                setSearch(team.name);
              }
              setTeams([]); // oculta o TeamList
              fetchFixtures(team.id);
            }}
          />
        )}
        {selectedTeam && fixtures.length > 0 && (
          <FixturesList fixtures={fixtures} teamName={selectedTeam.name} />
        )}
      </div>
    </main>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
