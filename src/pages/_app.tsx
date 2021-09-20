import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/700.css"
import "@fontsource/roboto/900.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import * as React from "react"
import { BackupProviderProvider } from "../hooks/useBackupProvider"
import { WalletProvider } from "../hooks/useWallet"
import "../styles/globals.css"
import theme from "../styles/theme"

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CHIMP: On-Chain Image Manipulation Program</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <BackupProviderProvider>
          <WalletProvider>
            <Component {...pageProps} />
          </WalletProvider>
        </BackupProviderProvider>
      </ChakraProvider>
    </>
  )
}

export default App
