"use server";

import { getNftsForOwner, getNftMetadataBatch } from "@/lib/alchemy";
import { OwnedNft, NftMetadataBatchToken, Nft } from "alchemy-sdk";
import { DelegateCash } from "delegatecash";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GetOwnedNfts(): Promise<OwnedNft[]> {
  const session = await getServerSession(authOptions);

  const dc = new DelegateCash();
  const delegate = session?.user?.name;
  if (delegate == null) {
    return [];
  }

  const delegationsByDelegate = await dc.getDelegationsByDelegate(delegate);

  const addresses: string[] = [];
  addresses.push(delegate);

  delegationsByDelegate.map((delegation) => {
    switch (delegation.type) {
      case "ALL":
        addresses.push(delegation.vault);
        break;
    }
  });

  const ownedNfts: OwnedNft[] = [];

  await Promise.all(
    addresses.map(async (address) => {
      let pageKey: string | undefined = undefined;
      do {
        const data = await getNftsForOwner(address, pageKey);
        ownedNfts.push(...data.ownedNfts);
        pageKey = data.pageKey;
      } while (pageKey);
    })
  );
  return ownedNfts;
}

export type QueryToken = {
  c: string;
  t: Array<string>;
};

export type QueryTokens = QueryToken[];

export async function GetNftMetadataBatch(tokensInput: QueryTokens = []): Promise<Array<Nft>> {
  const tokens: Array<NftMetadataBatchToken> = [];

  if (tokensInput.length === 0) {
    return [];
  }

  tokensInput.map((tokenInput) => {
    tokenInput.t.map((tokenId) => {
      tokens.push({ contractAddress: tokenInput.c, tokenId: tokenId });
    });
  });

  return getNftMetadataBatch(tokens);
}
