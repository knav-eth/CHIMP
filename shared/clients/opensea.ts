import axios from "axios"
import { getNetworkConfig } from "../../src/utils/network"

export async function forceRefreshMetadata(tokenId: string | number): Promise<void> {
  const { openSeaBaseApiUrl, contractConfig: { mainContractAddress } } = getNetworkConfig()
  await axios.get(`${openSeaBaseApiUrl}/asset/${mainContractAddress}/${tokenId}/?force_update=true`)
}
