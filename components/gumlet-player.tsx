"use client";

import { useRef } from "react";

interface Props {
  videoId: string;
  iframeClass?: string;
}

const GumletPlayer = ({ videoId, iframeClass }: Props) => {
  const gumletRef = useRef<any>(null);

  return (
    <div className="abjad-player-wrapper">
      <div className="abjad-player">
        <iframe
          className={iframeClass}
          src={`https://play.gumlet.io/embed/${videoId}?preload=false&autoplay=false&loop=false&disable_player_controls=false`}
          style={{ border: "none", position: "absolute", top: "0", left: "0", height: "100%", width: "100%" }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
          allowFullScreen
          ref={gumletRef}
        />
      </div>
    </div>
  );
};

export default GumletPlayer;
