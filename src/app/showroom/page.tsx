"use client";

import * as React from "react";
import { Lightbox, Slide } from "yet-another-react-lightbox";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Video from "yet-another-react-lightbox/plugins/video";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import { useSearchParams } from "next/navigation";
import { GetNftMetadataBatch, QueryTokens } from "@/actions/alchemy";

import Box from "@mui/material/Box";

export default function Showroom() {
  const initialSlides: Slide[] = [];
  const [nftSlides, setNftSlides] = React.useState(initialSlides);
  const [open, setOpen] = React.useState(false);

  const searchParams = useSearchParams();
  const searchTokens = searchParams.get("tokens");

  React.useEffect(() => {
    let tokens: QueryTokens = JSON.parse(searchTokens || "[]");
    GetNftMetadataBatch(tokens).then((nfts) => {
      const slides: Slide[] = [];
      nfts.map((nft) => {
        switch (nft.media[0]?.format) {
          case "jpeg":
          case "png":
          case "svg+xml":
            slides.push({ type: "image", src: nft.media[0]?.gateway });
            break;
          case "mp4":
            slides.push({ type: "video", sources: [{ src: nft.media[0]?.gateway, type: "video/mp4" }], autoPlay: true, loop: false, controls: false, muted: true });
            break;
        }
      });
      setNftSlides(slides);
      setOpen(true);
      console.log(slides);
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Lightbox
        open={open}
        plugins={[Fullscreen, Slideshow, Video]}
        slideshow={{ autoplay: true, delay: 5000 }}
        fullscreen={{ auto: true }}
        render={{
          iconSlideshowPlay: () => null,
          iconSlideshowPause: () => null,
          iconPrev: () => null,
          iconNext: () => null,
          iconClose: () => null,
          iconExitFullscreen: () => null,
          iconEnterFullscreen: () => null,
        }}
        slides={nftSlides}
        carousel={{
          finite: false,
          padding: 0,
          spacing: 0,
          imageFit: "contain",
        }}
      />
    </Box>
  );
}
