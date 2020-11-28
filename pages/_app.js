import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";

const queryCache = new QueryCache();

function MyApp({ Component, pageProps }) {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ChakraProvider>
        <Head>
          <title>TimeMeasuring - dashboard organizatora</title>
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </ReactQueryCacheProvider>
  );
}

export default MyApp;
