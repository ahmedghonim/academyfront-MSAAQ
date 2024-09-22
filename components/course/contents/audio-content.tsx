"use client";

import { useState } from "react";

import useCompleteContent from "@/hooks/use-complete-content";
import { Audio, Content, Course } from "@/types";

import Player from "../../player";
import MediaContentCompletedModal from "../modals/media-content-completed-modal";

interface Props {
  content: Content<Audio>;
  course: Course;
}

const AudioContent = ({ content }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [completeContent] = useCompleteContent();

  return (
    <>
      <Player
        onEnded={async () => {
          if (await completeContent(true)) {
            setShow(true);
          }
        }}
        src={content.contentable.file.url}
        className="audio"
      />
      <MediaContentCompletedModal
        open={show}
        onDismiss={() => setShow(false)}
      />
    </>
  );
};

export default AudioContent;
