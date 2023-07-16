"use client";

import { OwnedNft } from "alchemy-sdk";

import { GetOwnedNfts } from "@/actions/alchemy";

import * as React from "react";
import { DataGrid, GridColDef, GridRowSelectionModel, useGridApiRef } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Link from "next/link";

import Image from "next/image";
import { QueryTokens } from "@/actions/alchemy";

export function NFTTable() {
  const initialOwnedNfts: OwnedNft[] = [];
  const [ownedNfts, setOwnedNfts] = React.useState(initialOwnedNfts);
  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

  const initialQueryTokens: QueryTokens = [];
  const [queryTokens, setQueryTokens] = React.useState(initialQueryTokens);

  const [imagePreview, setImagePreview] = React.useState({ open: false, imageUrl: "" });

  const handleImagePreviewOpen = (imageUrl: string) => setImagePreview({ open: true, imageUrl: imageUrl });
  const handleImagePreviewClose = () => setImagePreview({ open: false, imageUrl: "" });

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
  }, [apiRef, rowSelectionModel]);

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
      field: "type",
      headerName: "Type",
      valueGetter: (params) => {
        return params.row.media[0]?.format;
      },
    },
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
              <Box>
                <Button
                  onClick={() => {
                    handleImagePreviewOpen(params.row.media[0]?.gateway);
                  }}
                >
                  <img src={params.row.media[0]?.gateway} height="67" width="67" alt={params.row.title} />
                </Button>
              </Box>
            );
          case "mp4":
            return (
              <Box>
                <Button>
                  <video src={params.row.media[0]?.gateway} autoPlay muted loop height="67" width="67" />
                </Button>
              </Box>
            );
          default:
            return null;
        }
      },
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Alert severity="success">
        <Link
          href={{
            pathname: "/showroom",
            query: { tokens: JSON.stringify(queryTokens) },
          }}
        >
          {JSON.stringify(queryTokens)}
        </Link>
      </Alert>
      <Modal open={imagePreview.open} onClose={handleImagePreviewClose} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ position: "absolute" as "absolute", top: "50%", transform: "translate(-50%, -50%)", width: 400 }}>
          <img src={imagePreview.imageUrl} height={"800px"} />
        </Box>
      </Modal>
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
        disableRowSelectionOnClick
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
