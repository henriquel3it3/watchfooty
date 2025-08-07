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

      <button className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center hover:bg-[#FF8F00] transition duration-200">
        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.817-4.817A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
