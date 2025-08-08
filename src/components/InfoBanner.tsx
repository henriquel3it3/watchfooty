export default function InfoBanner() {
  return (
    <div className="max-w-lg mx-auto mb-6 pt-6 pb-6 rounded-xl text-center text-[#FFB300]">
      <p>
        Este projeto é completamente grátis para ti. Tudo isto é possível graças ao apoio da Marca Patrocinadora.
      </p>

      {/* Logo com link */}
      <a
        href="https://www.marcapatrocinadora.pt"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <img
          src="/sponsor-logo.png"
          alt="Marca Patrocinadora"
          className="mx-auto h-32"
        />
      </a>

      <p className="text-sm text-[#FFB300]">
        Informações ou sugestões contacta{' '}
        <a href="mailto:geral@watch-footy.com" className="underline hover:text-[#cc9003]">
          geral@watch-footy.com
        </a>
      </p>
    </div>
  );
}
