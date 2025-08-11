import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '../styles/styles.css'; // importa o CSS global
import { appWithTranslation } from "next-i18next"; // importa o wrapper
import SEOHead from '@/components/SEOHead';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (<>
    <SEOHead />
    <Component {...pageProps} />
  </>
  );
}

export default appWithTranslation(App);
