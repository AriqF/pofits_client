import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pofits - Personal Finance</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <Script src="https://kit.fontawesome.com/babb4f3fd7.js" crossOrigin="anonymous"></Script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
