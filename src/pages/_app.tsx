import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '../styles/styles.css';
import { appWithTranslation } from "next-i18next";
import SEOHead from '@/components/SEOHead';
import { Analytics } from "@vercel/analytics/react"; // aqui o import correto

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SEOHead />
      <Component {...pageProps} />
      <Analytics /> {/* aqui o componente do Vercel Analytics */}
    </>
  );
}

export default appWithTranslation(App);
