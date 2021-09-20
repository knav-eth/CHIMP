import "@nomiclabs/hardhat-ethers"
import { task } from "hardhat/config"
import { CHIMP__factory } from "../../shared/contract_types"
import { getMainContractAddress } from "../utils/contract"
import { promptForGasPrice } from "../utils/gas"

task("toggleMinting", "Toggles minting active", async (taskArgs, hre) => {
  const [signer] = await hre.ethers.getSigners()

  const contract = CHIMP__factory.connect(getMainContractAddress(hre), signer)
  const gasPrice = await promptForGasPrice(hre, signer)

  const isActive = await contract.mintingActive()

  const txn = await contract.toggleActive({ gasPrice })
  await txn.wait()
  console.log(isActive ? "Minting is now paused" : "Minting is now active")
})
