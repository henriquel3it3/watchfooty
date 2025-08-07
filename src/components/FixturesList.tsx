import { useTranslation } from 'next-i18next';

type Props = {
  fixtures: any[];
  teamName: string;
};

export default function FixturesList({ fixtures, teamName }: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="bg-[#0D2C54]/90 p-5 rounded-xl max-w-lg mx-auto border border-[#FFB300]">
      <h2 className="text-xl font-semibold mb-4 text-[#FFB300] text-center">
        {t('upcoming_matches')} {teamName}
      </h2>
      <ul className="space-y-4">
        {fixtures.map(fixture => {
          const home = fixture.participants.find((p: any) => p.meta.location === 'home');
          const away = fixture.participants.find((p: any) => p.meta.location === 'away');
          const tvs = fixture.tvstations?.map((tv: any) => tv.name).join(', ') || t('without_transmition_label');

          return (
            <li
              key={fixture.id}
              className="border border-[#FFB300] rounded-lg p-4 shadow-sm bg-[#123A6F]/95 text-gray-200 text-center transition duration-200"
            >
              <div className="font-bold text-white text-lg mb-2">{home?.name} vs {away?.name}</div>
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
  );
}
