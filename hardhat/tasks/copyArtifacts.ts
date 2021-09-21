import { writeFileSync } from "fs"
import { task } from "hardhat/config"
import path from "path"

task("copyArtifacts", "Copies generated contract artifacts to the frontend", async (taskArgs, hre) => {
  if (!(await hre.artifacts.artifactExists("CHIMP"))) {
    await hre.run("compile")
  }

  const contractArtifact = await hre.artifacts.readArtifact("CHIMP")
  const abi = contractArtifact.abi

  writeFileSync(path.join(__dirname, "../../artifacts/CHIMP.json"), JSON.stringify(abi, null, 2))
})
