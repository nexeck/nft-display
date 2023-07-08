"use client";

import { OwnedNft } from "alchemy-sdk";

import { GetOwnedNfts } from "@/actions/alchemy";

import * as React from "react";
import { DataGrid, GridColDef, GridRowSelectionModel, useGridApiRef } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";

import Image from "next/image";
import { QueryTokens } from "@/actions/alchemy";

export function NFTTable() {
  const initialOwnedNfts: OwnedNft[] = [];
  const [ownedNfts, setOwnedNfts] = React.useState(initialOwnedNfts);
  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

  const initialQueryTokens: QueryTokens = [];
  const [queryTokens, setQueryTokens] = React.useState(initialQueryTokens);

  const apiRef = useGridApiRef();

  React.useEffect(() => {
    GetOwnedNfts().then((value) => {
      setOwnedNfts(value);
    });
  }, []);

  React.useEffect(() => {
    //console.log(apiRef.current.getSelectedRows());
    let tokens = new Map<string, string[]>();
    let newQueryTokens: QueryTokens = [];

    apiRef.current.getSelectedRows().forEach((value, key, map) => {
      let currentTokens = tokens.get(value.contract.address) || [];
      currentTokens.push(value.tokenId);
      tokens.set(value.contract.address, currentTokens);
    });
    tokens.forEach((tokenIds, contractAddress) => {
      newQueryTokens.push({ c: contractAddress, t: tokenIds });
    });
    setQueryTokens(newQueryTokens);
  }, [rowSelectionModel]);

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "contract.name",
      headerName: "Collection",
      valueGetter: (params) => {
        return params.row.contract.name;
      },
      width: 200,
    },
    { field: "tokenId", headerName: "Token", width: 100 },
    {
      field: "art",
      headerName: "Art",
      width: 100,
      renderCell: (params) => {
        switch (params.row.media[0]?.format) {
          case "jpeg":
          case "png":
          case "svg+xml":
          case "gif":
            return (
              <div>
                <img src={params.row.media[0]?.gateway} height="67" width="67" alt={params.row.title} />
              </div>
            );
          case "mp4":
            return (
              <div>
                <video src={params.row.media[0]?.gateway} autoPlay muted loop height="67" width="67" />
              </div>
            );
          default:
            return null;
        }
      },
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Alert severity="success">{JSON.stringify(queryTokens)}</Alert>
      <DataGrid
        rows={ownedNfts}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        density="comfortable"
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        apiRef={apiRef}
        getRowId={(row) => row.contract.address + "-" + row.tokenId}
      />
    </div>
  );
}
