/* eslint-disable @next/next/no-img-element */
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { base64EncodeImageContent } from "../../shared/utils/metadata"
import { useMainContract } from "../hooks/useMainContract"
import { getNetworkConfig } from "../utils/network"

export type SuccessDisplayProps = {
  tokenId: number
  onDone: () => void
}


export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({ tokenId, onDone }) => {
  const { mainContract } = useMainContract()
  const [svgContent, setSvgContent] = useState<string | null>(null)

  const retrieveTokenAsset = useCallback(
    async (tokenId: number) => {
      const svgString = await mainContract.tokenSVG(tokenId)
      const base64EncodedImage = base64EncodeImageContent(svgString)
      setSvgContent(base64EncodedImage)
    },
    [mainContract],
  )

  useEffect(() => {
    retrieveTokenAsset(tokenId)
  }, [retrieveTokenAsset, tokenId])

  const openSeaUrl: string | undefined = useMemo(() => {
    if (!process.browser) return

    const {
      openSeaBaseUrl,
      contractConfig: { mainContractAddress },
    } = getNetworkConfig()
    if (!openSeaBaseUrl) return

    return `${openSeaBaseUrl}/assets/${mainContractAddress}/${tokenId}`
  }, [tokenId])

  return (
    <Box textAlign="center" width="full">
      <Heading as="h1" size="4xl" fontSize={["4xl", "5xl", "6xl"]} mb={4}>
        Success!
      </Heading>
      <Text>You have minted CHIMP #{tokenId}</Text>
      <Box maxWidth="400px" width="90%" marginX="auto" marginY={3}>
        <Box
          backgroundColor="gray.800"
          borderWidth="4px"
          borderColor="transparent"
          borderStyle="solid"
          width="full"
        >
          <img src={svgContent ?? undefined} />
        </Box>
      </Box>

      {openSeaUrl && (
        <Flex justifyContent="center" marginTop={12}>
          <Link href={openSeaUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">View on OpenSea</Button>
          </Link>
        </Flex>
      )}

      <Box marginTop={8}>
        <Button
          onClick={onDone}
          letterSpacing="3px"
          textTransform="uppercase"
        >
          Done
        </Button>
      </Box>
    </Box>
  )
}
