import * as React from "react";

import { Connected } from "@/components/Connected";
import { NFTTable } from "@/components/NFTTable/NFTTable";

import Box from "@mui/material/Box";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Connected>
        <NFTTable></NFTTable>
      </Connected>
    </Box>
  );
}
