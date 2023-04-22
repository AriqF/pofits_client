import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import "flowbite";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://unpkg.com/flowbite@1.6.4/dist/flowbite.js"
          strategy="beforeInteractive"></Script>
      </body>
    </Html>
  );
}
