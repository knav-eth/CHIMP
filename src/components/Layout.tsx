import { Box, Flex, FlexProps, Image, Text } from "@chakra-ui/react"
import React from "react"
import { useWallet } from "../hooks/useWallet"
import { ConnectWalletButton } from "./ConnectWalletButton"

export type LayoutProps = {
  requireWallet?: boolean
  containerProps?: Partial<FlexProps>
  hideLogo?: boolean
  headerContent?: React.ReactNode
  buttonContent?: React.ReactNode
}

const containerPadding = 8

const Layout: React.FC<LayoutProps> = ({
                                         children,
                                         headerContent,
                                         buttonContent,
                                         containerProps,
                                         requireWallet = false,
                                         hideLogo,
                                       }) => {
  const { isConnected } = useWallet()
  return (
    <Box minH={"100vh"}>
      <Flex flexDir="column" minH="100vh">
        <Flex p={containerPadding} zIndex={1} alignItems="center">
          {!hideLogo && (
            <Image
              src="/chimp_logo.svg"
              height="50px"
            />
          )}
          {headerContent}
          <Flex justifyContent="flex-end" flex={1}>
            {buttonContent}
            <ConnectWalletButton />
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          flex={1}
          p={containerPadding}
          {...containerProps}
        >
          {requireWallet && !isConnected ? (
            <Box textAlign="center" my={8} width="full">
              <Text marginTop={16} marginBottom={8}>
                Connect your wallet to continue
              </Text>
              <ConnectWalletButton />
            </Box>
          ) : (
            children
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Layout
