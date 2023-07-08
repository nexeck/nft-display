import { NextResponse } from "next/server";

import { getNftsForOwner } from "@/lib/alchemy";
import { OwnedNft } from "alchemy-sdk";
import { DelegateCash } from "delegatecash";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const dc = new DelegateCash();
  const delegate = session?.user?.name;
  if (delegate == null) {
    return null;
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
      const data = await getNftsForOwner(address);
      ownedNfts.push(...data.ownedNfts);
    })
  );

  return NextResponse.json(ownedNfts);
}
