import { useTranslation } from 'next-i18next';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
};

export default function SearchInput({ value, onChange, onFocus }: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="relative w-full max-w-lg mb-6 mx-auto">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-[#FFB300]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
        </svg>
      </div>

      <input
        type="text"
        placeholder={t('search_placeholder')}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        className="w-full h-12 pl-10 pr-14 bg-[#123A6F]/90 text-white placeholder-gray-300 rounded-xl border border-[#0D2C54] focus:outline-none focus:ring-2 focus:ring-[#FFB300] text-[15px] shadow-md transition duration-200"
      />
    </div>
  );
}
