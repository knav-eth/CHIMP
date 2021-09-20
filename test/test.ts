import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { writeFileSync } from "fs"
import { ethers } from "hardhat"
import path from "path"
import { CHIMP, CHIMP__factory } from "../shared/contract_types"
import { parseMetadata } from "../shared/utils/metadata"


const IMAGE_PIXELS: [BigNumber, BigNumber] = [
  BigNumber.from("0xb4b4b4b4d2d2d2d24b4b4b4b2d2d2d2db4b4b4b4d2d2d2d24b4b4b4b2d2d2d2d"),
  BigNumber.from("0xb4b4b4b4d2d2d2d24b4b4b4b2d2d2d2db4b4b4b4d2d2d2d24b4b4b4b2d2d2d2d"),
]
const IMAGE_COLORS: [number, number, number, number] = [19, 28, 37, 12]

describe("CHIMP", function() {
  let owner: SignerWithAddress
  let contract: CHIMP

  beforeEach(async function() {
    owner = (await ethers.getSigners())[0]

    const contractFactory = (await ethers.getContractFactory("CHIMP", owner)) as CHIMP__factory
    contract = await contractFactory.deploy()
    await contract.deployed()
  })

  it("minting should work when active", async function() {
    await contract.toggleActive()
    const minted = await contract.mint(IMAGE_PIXELS, IMAGE_COLORS, { value: ethers.utils.parseEther("0.02") })
  })

  it("svg generation should work", async function() {
    await contract.toggleActive()
    const minted = await contract.mint(IMAGE_PIXELS, IMAGE_COLORS, { value: ethers.utils.parseEther("0.02") })
    const svgContent = await contract.tokenSVG(0)
    writeFileSync(path.join(__dirname, "test.svg"), svgContent)
  })

  it("metadata should work", async function() {
    await contract.toggleActive()
    await contract.mint(IMAGE_PIXELS, IMAGE_COLORS, { value: ethers.utils.parseEther("0.02") })
    const metadata = await contract.tokenURI(0)
    const parsedMetadata = parseMetadata(metadata)
    expect(parsedMetadata.name).to.equal("CHIMP #0")
  })
})
