"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

import { useSession } from "@/providers/session-provider";
import { Academy } from "@/types";
import { getUserIp } from "@/utils/userIp";

const DynamicWatermark = ({
  children,
  tenant,
  provider
}: {
  children: ReactNode;
  tenant: Academy | undefined;
  provider: string;
}) => {
  const waterMarkRef = useRef<any>();
  const waterMarkRefWrapper = useRef<HTMLDivElement>(null);
  const [userIp, setUserIp] = useState<string>("");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const { member } = useSession();

  useEffect(() => {
    if (!member) {
      getUserIp().then((ip) => {
        setUserIp(ip);
      });
    }
  }, [member]);
  const waterMarkStyle = {
    position: "absolute",
    top: `50%`,
    left: `50%`,
    zIndex: 8,
    width: "fit-content",
    whiteSpace: "nowrap",
    borderRadius: "0.375rem",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#fff",
    transition: "all 0.3s ease-in-out",
    display: "block",
    visibility: "visible",
    userSelect: "none",
    pointerEvents: "none"
  };
  const createOrUpdateWatermarkElement = ({ top, left }: any) => {
    if (waterMarkRef.current) {
      Object.assign(waterMarkRef.current.style, {});
      waterMarkRef.current.className = "";
      waterMarkRef.current.id = "";

      try {
        if (isFullScreen) {
          waterMarkRef.current.popover = "";
          waterMarkRef.current.showPopover();
        } else {
          waterMarkRef.current.removeAttribute("popover");
        }
      } catch {
        // eslint-disable-next-line no-console
        console.warn("popover is not supported");
      }
      const isChild = waterMarkRefWrapper?.current?.children[0]?.contains(waterMarkRef.current);
      Object.assign(waterMarkRef.current.style, waterMarkStyle);
      waterMarkRef.current.style.top = `${top}%`;
      waterMarkRef.current.style.left = `${left}%`;
      waterMarkRef.current.innerHTML = `${tenant?.title}: ${member ? member?.id : userIp}`;
      if (!isChild) {
        waterMarkRefWrapper.current?.children[0]?.appendChild(waterMarkRef.current);
      }
    } else {
      const watermark = document.createElement("div");
      Object.assign(watermark.style, {});
      Object.assign(watermark.style, waterMarkStyle);
      watermark.style.top = `${top}%`;
      watermark.style.left = `${left}%`;
      watermark.innerHTML = `${tenant?.title}: ${member ? member?.id : userIp}`;
      waterMarkRef.current = watermark;

      waterMarkRefWrapper.current?.children[0]?.appendChild(watermark);
    }
  };

  const handleFullScreenChange = () => {
    const isCurrentlyFullScreen = document.fullscreenElement !== null;
    setIsFullScreen(isCurrentlyFullScreen);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (tenant?.meta.enable_watermark) {
      const updatePosition = () => {
        const newPosition = {
          top: Math.random() * 90,
          left: Math.random() * 90
        };

        createOrUpdateWatermarkElement(newPosition);
      };

      updatePosition();

      const intervalId = setInterval(updatePosition, 2000);

      return () => clearInterval(intervalId);
    }
  }, [waterMarkRef.current, tenant, provider, isFullScreen]);

  return (
    <div
      className="relative h-full w-full"
      ref={waterMarkRefWrapper}
      id="watermark-wrapper"
    >
      {children}
    </div>
  );
};

export default DynamicWatermark;
