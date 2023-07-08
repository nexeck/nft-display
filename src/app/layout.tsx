import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { Roboto } from "next/font/google";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

import { Providers } from "@/components/Wagmi/providers";
import { ConnectButton } from "@/components/ConnectButton";

export const metadata: Metadata = {
  title: "NFT Display",
  description: "Display your NFTs",
};

const roboto = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>
          <ThemeRegistry>
            <Box sx={{ display: "flex" }}>
              <AppBar position="fixed" sx={{ zIndex: 2000 }}>
                <Toolbar sx={{ backgroundColor: "background.paper" }}>
                  <Button href="/" sx={{ flexGrow: 1 }}>
                    Table
                  </Button>
                  <Button href="/showroom" sx={{ flexGrow: 1 }}>
                    Showroom
                  </Button>
                  <Box sx={{ textAlign: "right" }}>
                    <ConnectButton />
                  </Box>
                </Toolbar>
              </AppBar>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.default",
                  mt: ["48px", "56px", "64px"],
                  p: 3,
                }}
              >
                {children}
              </Box>
            </Box>
          </ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}
