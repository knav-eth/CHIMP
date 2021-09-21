import { SERVER_URL } from "../config/base"

export function getTokenImageURL(tokenId: string | number): string {
  return `${SERVER_URL}render/${tokenId}`
}
