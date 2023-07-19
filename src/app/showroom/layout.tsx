import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "NFT Display",
  description: "Display your NFTs",
};

const roboto = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
