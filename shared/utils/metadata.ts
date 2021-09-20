export type TokenMetadata = {
  name: string,
  description: string
  image: string
}

export function parseImage(imageStr: string): string {
  const svgHeader = "data:image/svg+xml;base64,"
  if (imageStr.startsWith(svgHeader)) {
    const imageContent = imageStr.substr(svgHeader.length)
    return Buffer.from(imageContent, "base64").toString()
  }
  return imageStr
}

export function parseMetadata(metadataStr: string, decodeImage = true): TokenMetadata {
  const metadataHeader = "data:application/json;base64,"
  const metadataBase64 = metadataStr.substr(metadataHeader.length)
  const decodedMetadata = Buffer.from(metadataBase64, "base64").toString()
  const metadata: TokenMetadata = JSON.parse(decodedMetadata)
  return {
    ...metadata,
    image: decodeImage ? metadata?.image && parseImage(metadata.image) : metadata.image,
  }
}

export function base64EncodeImageContent(content: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(content).toString("base64")}`
}
