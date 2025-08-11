import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

type Fixture = {
  homeTeam: string;
  awayTeam: string;
  date: string; // ISO string
  competition?: string;
  stadium?: string;
  channels?: { name: string; url?: string }[]; // opcional
};

type Props = {
  fixtures?: Fixture[]; // opcional: se fornecido, gera JSON-LD para eventos
};

const domain = 'https://watch-footy.com'; // <<< substitui pelo teu domínio
const defaultOgImage = `${domain}/public/watchfooty-og.jpg`; // coloca a imagem em /public/
const twitterHandle = '@watch-footy'; // substitui se tiveres outro

const supportedLocales = ['pt', 'en', 'de', 'fr', 'it', 'es', 'nl'] as const;
type Locale = typeof supportedLocales[number];

const seoMeta: Record<
  Locale,
  { title: string; description: string; keywords: string }
> = {
  pt: {
    title: 'Onde ver jogos de futebol ao vivo — WatchFooty',
    description:
      'Saiba onde assistir aos jogos ao vivo dos principais clubes da Liga Portuguesa: Porto, Benfica, Sporting, Braga. Horários, canais e próximos jogos sempre atualizados.',
    keywords:
      'assistir futebol ao vivo, ver jogos ao vivo, Liga Portuguesa, Porto, Benfica, Sporting, Braga',
  },
  es: {
    title: 'Dónde ver partidos de fútbol en vivo — WatchFooty',
    description:
      'Descubre dónde ver en vivo los partidos de los clubes más importantes de La Liga: Real Madrid, Barcelona, Atlético Madrid, Sevilla. Horarios, canales y próximos encuentros actualizados.',
    keywords:
      'ver fútbol en vivo, partidos en vivo, La Liga, Real Madrid, Barcelona, Atlético Madrid, Sevilla',
  },
  en: {
    title: 'Where to watch live football matches — WatchFooty',
    description:
      'Find out where to watch live matches of top Premier League clubs like Liverpool, Manchester United, Chelsea, and Arsenal. Updated schedules, channels, and upcoming games.',
    keywords:
      'live football, watch football live, Premier League, Liverpool, Manchester United, Chelsea, Arsenal',
  },
  de: {
    title: 'Wo man Live-Fußballspiele sehen kann — WatchFooty',
    description:
      'Erfahren Sie, wo Sie die Live-Spiele der wichtigsten Bundesliga-Clubs sehen können: Bayern, Dortmund, RB Leipzig, Leverkusen. Spielpläne, Kanäle und kommende Spiele immer aktuell.',
    keywords:
      'Fußball live, Bundesliga, Bayern, Dortmund, RB Leipzig, Leverkusen',
  },
  fr: {
    title: 'Où regarder les matchs de football en direct — WatchFooty',
    description:
      'Découvrez où regarder les matchs en direct des principaux clubs de Ligue 1 : PSG, Lyon, Monaco, Marseille. Horaires, chaînes et prochains matchs mis à jour régulièrement.',
    keywords:
      'football en direct, Ligue 1, PSG, Lyon, Monaco, Marseille',
  },
  it: {
    title: 'Dove guardare le partite di calcio in diretta — WatchFooty',
    description:
      'Scopri dove guardare le partite in diretta dei club più importanti di Serie A: Juventus, Inter, Milan, Napoli. Orari, canali e prossime partite aggiornate.',
    keywords:
      'calcio in diretta, Serie A, Juventus, Inter, Milan, Napoli',
  },
  nl: {
    title: 'Waar live voetbalwedstrijden kijken — WatchFooty',
    description:
      "Ontdek waar je live wedstrijden kunt kijken van de top Eredivisie-clubs: Ajax, PSV, Feyenoord, AZ. Speelschema's, kanalen en aankomende wedstrijden altijd actueel.",
    keywords:
      'live voetbal, Eredivisie, Ajax, PSV, Feyenoord, AZ',
  },
};

export default function SEOHead({ fixtures }: Props) {
  const router = useRouter();
  const locale = (router.locale as Locale) || ('pt' as Locale); // fallback
  const meta = seoMeta[locale] || seoMeta['pt'];
  const canonicalUrl = `${domain}/${locale}`; // canonical por idioma

  // JSON-LD para fixtures (opcional)
  let jsonLd = null;
  if (fixtures && fixtures.length > 0) {
    const events = fixtures.map((f) => {
      const offers =
        f.channels && f.channels.length > 0
          ? f.channels.map((c) => ({
              '@type': 'Offer',
              name: c.name,
              ...(c.url ? { url: c.url } : {}),
            }))
          : [];

      return {
        '@type': 'SportsEvent',
        name: `${f.homeTeam} vs ${f.awayTeam}`,
        startDate: f.date,
        location: {
          '@type': 'Place',
          name: f.stadium || 'Estádio',
        },
        competitor: [
          { '@type': 'SportsTeam', name: f.homeTeam },
          { '@type': 'SportsTeam', name: f.awayTeam },
        ],
        ...(f.competition ? { eventStatus: f.competition } : {}),
        ...(offers.length > 0 ? { offers } : {}),
      };
    });

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': events,
    };
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang para cada idioma */}
      {supportedLocales.map((loc) => (
        <link key={loc} rel="alternate" hrefLang={loc} href={`${domain}/${loc}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={domain} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="WatchFooty" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={defaultOgImage} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />

      {/* JSON-LD (opcional) */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}