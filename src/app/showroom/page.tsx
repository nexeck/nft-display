"use client";

import * as React from "react";
import * as R from "ramda";
import { Lightbox, Slide } from "yet-another-react-lightbox";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import { useSearchParams } from "next/navigation";
import { GetNftMetadataBatch, QueryTokens } from "@/actions/alchemy";
import { Shuffle } from "@/lib/utils";

import Box from "@mui/material/Box";

type QueryConfig = {
  slideshow: { autoplay: boolean; delay: number };
};

export default function Showroom() {
  const initialSlides: Slide[] = [];
  const [nftSlides, setNftSlides] = React.useState(initialSlides);

  const initialConfig: QueryConfig = { slideshow: { autoplay: true, delay: 5000 } };
  const [config, setConfig] = React.useState(initialConfig);
  const [open, setOpen] = React.useState(false);

  const searchParams = useSearchParams();
  const searchTokens = searchParams.get("tokens") || "[]";
  const searchConfig = searchParams.get("config") || JSON.stringify(config);

  React.useEffect(() => {
    let tokens: QueryTokens = JSON.parse(searchTokens);
    setConfig(JSON.parse(searchConfig);
    GetNftMetadataBatch(tokens).then((nfts) => {
      let slides: Slide[] = [];
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
      slides = Shuffle(slides);
      setNftSlides(slides);
      setOpen(true);
    });
  }, [searchTokens, searchConfig, config]);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Lightbox
        open={open}
        plugins={[Slideshow, Video]}
        slideshow={{ autoplay: config.slideshow.autoplay, delay: config.slideshow.delay }}
        render={{
          iconSlideshowPlay: () => null,
          iconSlideshowPause: () => null,
          iconPrev: () => null,
          iconNext: () => null,
          iconClose: () => null,
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
