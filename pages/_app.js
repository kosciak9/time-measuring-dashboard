import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryCache, ReactQueryCacheProvider, Box } from "react-query";
import { extendTheme } from "@chakra-ui/react";

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
