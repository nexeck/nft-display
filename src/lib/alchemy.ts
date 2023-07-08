import { Network, Alchemy, NftMetadataBatchToken } from "alchemy-sdk";
import { cache } from "react";

export const getNftsForOwner = cache(async (address: string, pageKey?: string) => {
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);

  return await alchemy.nft.getNftsForOwner(address, { pageKey: pageKey });
});

export const getNftMetadataBatch = cache(async (tokens: Array<NftMetadataBatchToken>) => {
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);

  return await alchemy.nft.getNftMetadataBatch(tokens);
});
