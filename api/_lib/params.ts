import { NextApiRequest } from "next"

export function getTokenId(req: NextApiRequest): number | undefined {
  const tokenIdStr = req.query["tokenId"]
  if (!tokenIdStr || typeof tokenIdStr !== "string") {
    return
  }
  const tokenId = parseInt(tokenIdStr)
  if (Number.isNaN(tokenId)) {
    return
  }
  return tokenId
}
