import { Network, Alchemy, NftMetadataBatchToken } from "alchemy-sdk";
import { cache } from "react";

const getEthereumAlchemy = (): Alchemy => {
  const settings = {
    apiKey: process.env.ALCHEMY_ETHEREUM_API_KEY,
    network: Network.ETH_MAINNET,
  };

  return new Alchemy(settings);
};

const getPolygonAlchemy = (): Alchemy => {
  const settings = {
    apiKey: process.env.ALCHEMY_POLYGON_API_KEY,
    network: Network.MATIC_MAINNET,
  };

  return new Alchemy(settings);
};

export const getEthereumNftsForOwner = cache(async (address: string, pageKey?: string) => {
  return await getEthereumAlchemy().nft.getNftsForOwner(address, { pageKey: pageKey });
});

export const getPolygonNftsForOwner = cache(async (address: string, pageKey?: string) => {
  return await getPolygonAlchemy().nft.getNftsForOwner(address, { pageKey: pageKey });
});

export const getNftMetadataBatch = cache(async (tokens: Array<NftMetadataBatchToken>) => {
  return await getEthereumAlchemy().nft.getNftMetadataBatch(tokens);
});
