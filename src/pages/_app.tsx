import "@/styles/globals.css";
import "flowbite";
import type { AppProps } from "next/app";
import Head from "next/head";
import "moment/locale/id";
import moment from "moment";
import { useEffect } from "react";
import Script from "next/script";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

export default function App({ Component, pageProps }: AppProps) {
  moment.locale("id");
  // useEffect(() => {
  //   require("flowbite/dist/flowbite");
  //   require("flowbite/plugin");
  // });
  return (
    <>
      <Head>
        <title>Pofits - Personal Finance</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* <Script
          src="https://unpkg.com/flowbite@1.6.4/dist/flowbite.js"
          strategy="beforeInteractive"
        /> */}
      </Head>
      <Component {...pageProps} />
      {/* <Script src="https://kit.fontawesome.com/babb4f3fd7.js" crossOrigin="anonymous"></Script> */}
    </>
  );
}
