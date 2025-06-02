import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Providers from "@/providers/PrivyProvider";
import SubGraphProviders from "@/providers/SubgraphProvider";

export default function App({ Component, pageProps }: AppProps) {
  return( 
    <Providers>
      <SubGraphProviders>
        <Component {...pageProps} />
      </SubGraphProviders>
    </Providers> 
  );
}
