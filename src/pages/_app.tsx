import "@/styles/globals.css";
import "flowbite";
import type { AppProps } from "next/app";
import Head from "next/head";
import "moment/locale/id";
import moment from "moment";

export default function App({ Component, pageProps }: AppProps) {
  moment.locale("id");
  return (
    <>
      <Head>
        <title>Pofits - Personal Finance</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
      {/* <Script src="https://kit.fontawesome.com/babb4f3fd7.js" crossOrigin="anonymous"></Script> */}
    </>
  );
}
