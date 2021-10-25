import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import "@fontsource/source-serif-pro/400.css"
import { BigNumber, ethers } from "ethers"
import _ from "lodash"
import React, { useCallback, useMemo, useState } from "react"
import { ConnectWalletButton } from "../components/ConnectWalletButton"
import { ExternalLogos } from "../components/ExternalLogos"
import Layout from "../components/Layout"
import { LazyCanvas } from "../components/LazyCanvas"
import { SuccessDisplay } from "../components/SuccessDisplay"
import { useMainContract } from "../hooks/useMainContract"
import { useWallet } from "../hooks/useWallet"
import { COLOR_PALETTE } from "../utils/colors"
import { parseWalletError } from "../utils/error"
import { getBlockExplorerUrl } from "../utils/network"

const dimensionSize = 16
const paletteSize = 4

function initializePixels(): Array<number> {
  return _.range(dimensionSize ** 2).map(() => 0)
}

const initialPixels = initializePixels()

function initializePalette(): Array<string> {
  return _.range(paletteSize).map(() => COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)])
}

const initialPalette = initializePalette()

export function packPixels(pixels: Array<number>): [BigNumber, BigNumber] {
  const chunkCount = (2 * (dimensionSize ** 2)) / 256

  const chunks: Array<BigNumber> = []
  for (let chunkIndex = (chunkCount - 1); chunkIndex >= 0; chunkIndex--) {
    let output = BigNumber.from(0)

    for (let i = (((chunkIndex + 1) * 128) - 1); i >= (chunkIndex * 128); i--) {
      const pixelValue = pixels[i]
      output = output.shl(2).or(pixelValue)
    }

    chunks.push(output)
  }
  return chunks as [BigNumber, BigNumber]
}

export function unpackPixels(pixelChunks: Array<BigNumber>): Array<number> {
  const pixels = []
  for (let chunkIndex = (pixelChunks.length - 1); chunkIndex >= 0; chunkIndex--) {
    let chunk = pixelChunks[chunkIndex]
    for (let i = 0; i < 128; i++) {
      pixels.push(chunk.and(3).toNumber())
      chunk = chunk.shr(2)
    }
  }
  return pixels
}

export function mapToColorIds(colors: Array<string>): [number, number, number, number] {
  return colors.map((c) => COLOR_PALETTE.indexOf(c)) as [number, number, number, number]
}

export default function Home() {
  const { wallet, isConnected } = useWallet()
  const { mainContract } = useMainContract()
  const provider = wallet?.web3Provider

  const [pixels, setPixels] = useState<Array<number>>(initialPixels)
  const [colors, setColors] = useState<Array<string>>(initialPalette)

  const [isMinting, setIsMinting] = useState(false)
  const [mintingTxn, setMintingTxn] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [tokenId, setTokenId] = useState<number | null>(null)

  const handleResetState = useCallback(() => {
    setErrorMessage(null)
    setMintingTxn(null)
    setTokenId(null)
    setColors(initializePalette())
    setPixels(initializePixels())
  }, [setColors, setPixels])

  const handleReset = useCallback(() => {
    setPixels(initializePixels())
  }, [])

  const handleMint = useCallback(async () => {
    if (!provider) return
    if (pixels == initialPixels) {
      setErrorMessage("Unable to mint. Canvas unchanged. You must draw something.")
      return
    }
    try {
      setIsMinting(true)
      setErrorMessage(null)
      const signer = provider.getSigner()
      const contractWithSigner = mainContract.connect(signer)

      const result = await contractWithSigner.mint(packPixels(pixels), mapToColorIds(colors), { value: ethers.utils.parseEther("0.02") })

      setMintingTxn(result.hash)
      const receipt = await result.wait()

      const mintedBigNo: BigNumber = receipt.events?.[0]?.args?.[2]
      const mintedId = parseInt(mintedBigNo._hex, 16)
      setTokenId(mintedId)
    } catch (e) {
      // @ts-ignore
      window.MM_ERR = e
      console.error(`Error while minting: ${e.message}`)
      setMintingTxn(null)
      setErrorMessage(parseWalletError(e) ?? "Unexpected Error")
    } finally {
      setIsMinting(false)
    }
  }, [colors, mainContract, pixels, provider])

  const transactionUrl: string | undefined = useMemo(() => {
    if (!mintingTxn || !isMinting) {
      return
    }
    const blockExplorerUrl = getBlockExplorerUrl()
    if (!blockExplorerUrl) {
      return
    }
    return `${blockExplorerUrl}/tx/${mintingTxn}`
  }, [isMinting, mintingTxn])

  return (
    <Layout>
      <Box flex={1} width="full" maxWidth="700px" marginX="auto" textAlign="center">
        {(tokenId !== null) ? (
          <SuccessDisplay onDone={handleResetState} tokenId={tokenId} />
        ) : (
          <>
            <LazyCanvas
              dimensionSize={dimensionSize}
              colors={colors}
              onColorsChange={setColors}
              pixels={pixels}
              onPixelsChange={setPixels}
              containerProps={{}}
            />

            <Box maxWidth="500px" marginTop={4} marginX="auto">
              {(errorMessage) && (
                <Alert status="error">
                  <AlertIcon />
                  <Text fontWeight="semibold" marginRight={1}>Error:</Text>
                  {errorMessage}
                </Alert>
              )}
              {(transactionUrl) && (
                <Link
                  href={transactionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Alert status="info" flexDirection={["column", "row"]}>
                    <AlertIcon />
                    <Text fontWeight="semibold" marginRight={2}>Minting in progress</Text>
                    <Text>
                      Click to view transaction
                    </Text>
                  </Alert>
                </Link>
              )}
            </Box>

            <Box marginTop="24px" textAlign="center">
              <Popover placement="top">
                {({ onClose }) => {
                  return (
                    <>
                      <PopoverTrigger>
                        <Button
                          isLoading={isMinting}
                          variant="outline"
                          mr={2}
                        >
                          Reset
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody padding={2}>
                          <Box padding={2}>
                            Are you sure you want clear your drawing?
                          </Box>
                          <Flex>
                            <Button
                              flex={1}
                              variant="outline"
                              onClick={onClose}
                              mr={2}
                            >
                              Cancel
                            </Button>
                            <Button
                              flex={1}
                              variant="solid"
                              colorScheme="red"
                              onClick={() => {
                                onClose()
                                handleReset()
                              }}
                            >
                              Yes
                            </Button>
                          </Flex>
                        </PopoverBody>
                      </PopoverContent>
                    </>
                  )
                }}
              </Popover>

              {isConnected ? (
                <Button
                  onClick={handleMint}
                  isLoading={isMinting}
                  variant="outline"
                >
                  Mint for 0.02Ξ
                </Button>
              ) : (
                <Box display="inline-block">
                  <ConnectWalletButton />
                </Box>
              )}
            </Box>
          </>
        )}

      </Box>
      <Box marginTop={3}>
        <ExternalLogos />
      </Box>
    </Layout>
  )
}
