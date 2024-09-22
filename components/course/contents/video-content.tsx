"use client";

import { useState } from "react";

import MediaContentCompletedModal from "@/components/course/modals/media-content-completed-modal";
import DynamicWatermark from "@/components/dynamic-watermark";
import GumletPlayer from "@/components/gumlet-player";
import Player from "@/components/player";
import { useTenant } from "@/components/store/TenantProvider";
import { useAppSelector } from "@/hooks";
import useCompleteContent from "@/hooks/use-complete-content";
import { CourseSliceStateType } from "@/store/slices/courses-slice";
import { Content, Course, Video } from "@/types";
import { classNames } from "@/utils";

interface Props {
  content: Content<Video>;
  course: Course;
}

const VideoContent = ({ content }: Props) => {
  const [completeContent] = useCompleteContent();
  const [show, setShow] = useState<boolean>(false);

  const { toggleContentSideBar } = useAppSelector<CourseSliceStateType>((state) => state.courses);
  const tenant = useTenant()((state) => state.tenant);

  return (
    <>
      <div
        className={classNames(
          content.contentable.provider != "gumlet" && "flex",
          "mb-2 items-center justify-center overflow-hidden rounded-3xl bg-black",
          toggleContentSideBar ? "ms-player-wrapper-full-width" : "ms-player-wrapper-toggled-width"
        )}
        dir="ltr"
      >
        {tenant && (
          <DynamicWatermark
            tenant={tenant}
            provider={content.contentable.provider}
          >
            {content.contentable.provider == "gumlet" ? (
              <GumletPlayer videoId={content.contentable.provider_id} />
            ) : (
              <Player
                rel="0"
                dir="ltr"
                title={content.title}
                src={content.contentable.url}
                onEnded={async () => {
                  if (await completeContent(true)) {
                    setShow(true);
                  }
                }}
              />
            )}
          </DynamicWatermark>
        )}
      </div>
      <MediaContentCompletedModal
        open={show}
        onDismiss={() => setShow(false)}
      />
    </>
  );
};

export default VideoContent;
