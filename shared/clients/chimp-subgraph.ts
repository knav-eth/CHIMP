import { gql, GraphQLClient } from "graphql-request"
import { getNetworkConfig } from "../../src/utils/network"

const client = new GraphQLClient(getNetworkConfig().chimpGraphUrl)

export type SubgraphCHIMP = {
  id: string
  numericId: number
  owner: string
  author: string
  name: string
  image: string
}

type GetOneResponse = {
  chimpimage: SubgraphCHIMP
}

const TOKEN_FRAGMENT = `
  id
  numericId
  owner
  author
  name
  image
`

export async function getTokenById(tokenId: number): Promise<SubgraphCHIMP | undefined> {
  const query = gql`
      query getTokenById($tokenId: Int!) {
          chimpimage(id: $tokenId) {
              ${TOKEN_FRAGMENT}
          }
      }
  `
  const variables = {
    tokenId,
  }

  const data = await client.request<GetOneResponse>(query, variables)
  return data?.chimpimage
}

type ListTokensResponse = {
  chimpimages: Array<SubgraphCHIMP>
}

export async function getTokensAfterId(mostRecentTokenId: number): Promise<Array<SubgraphCHIMP>> {
  const query = gql`
      query getTokensAfterId($mostRecentTokenId: Int!) {
          chimpimages(
              where:{ numericId_gt: $mostRecentTokenId }
              orderBy: id
              orderDirection: asc
          ) {
              ${TOKEN_FRAGMENT}
          }
      }
  `
  const variables = {
    mostRecentTokenId,
  }
  const data = await client.request<ListTokensResponse>(query, variables)
  return data?.chimpimages
}

export async function getAllTokens(): Promise<Array<SubgraphCHIMP>> {
  const query = gql`
      query getAllTokens {
          chimpimages(
              orderBy: id
              orderDirection: asc
          ) {
              ${TOKEN_FRAGMENT}
          }
      }
  `
  const data = await client.request<ListTokensResponse>(query)
  return data?.chimpimages
}
