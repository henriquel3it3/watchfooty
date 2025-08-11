import { useTranslation } from 'next-i18next';

export default function InfoBanner() {
  const { t } = useTranslation('common');

  return (
    <div className="max-w-lg mx-auto mb-6 pt-6 pb-6 rounded-xl text-center text-[#FFB300]">
      <p className="text-sm text-[#FFB300] mt-4">
        {t('info_banner_email')}{' '}
        <a href="mailto:geral@watch-footy.com" className="underline hover:text-[#cc9003]">
          info@watch-footy.com.
        </a>
      </p>
    </div>
  );
}
