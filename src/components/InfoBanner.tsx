import Image from 'next/image';
import { useTranslation } from 'next-i18next';

export default function InfoBanner() {
  const { t } = useTranslation('common');

  return (
    <div className="max-w-lg mx-auto mb-6 pt-6 pb-6 rounded-xl text-center text-[#FFB300]">
      {/* Logo com link */}
      <a
        href="https://www.marcapatrocinadora.pt"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <Image
          src="/sponsor-logo.png"
          alt="Marca Patrocinadora"
          width={250}   // Ajusta para o tamanho correto da imagem
          height={128}  // Ajusta para o tamanho correto da imagem
          className="mx-auto"
          priority={true} // Como é logo, prioriza o carregamento
        />
      </a>

      <p className="text-sm text-[#FFB300] mt-4">
        {t('info_banner_email')}{' '}
        <a href="mailto:geral@watch-footy.com" className="underline hover:text-[#cc9003]">
          info@watch-footy.com
        </a>
      </p>
    </div>
  );
}
