import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '../styles/styles.css'; // importa o CSS global
import { appWithTranslation } from "next-i18next"; // importa o wrapper

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(App);
