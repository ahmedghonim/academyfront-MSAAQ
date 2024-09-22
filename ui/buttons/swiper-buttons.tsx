"use client";

import { useEffect, useState } from "react";

import { useSwiper } from "swiper/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import { Button, Icon } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  leftClassName?: string;
  rightClassName?: string;
  className?: string;
  color?: "gray" | "primary" | "secondary" | "warning" | "success" | "danger" | "info" | "gradient";
  slidesLength?: number;
}

const SwiperButtons = ({ color, className, leftClassName, rightClassName, slidesLength }: Props) => {
  const swiper = useSwiper();

  const [allowSlideNext, setAllowSlideNext] = useState(false);
  const [allowSlidePrev, setAllowSlidePrev] = useState(false);

  useEffect(() => {
    swiper.on("slideChange", () => {
      if (swiper.isBeginning) {
        setAllowSlidePrev(false);
      } else {
        setAllowSlidePrev(true);
      }
      if (swiper.isEnd) {
        setAllowSlideNext(false);
      } else {
        setAllowSlideNext(true);
      }
    });
  }, [swiper]);

  useEffect(() => {
    if (typeof slidesLength !== "undefined") {
      if (slidesLength > 2) {
        setAllowSlideNext(true);
      }
    } else {
      setAllowSlideNext(true);
    }
  }, [slidesLength]);

  return (
    <div className={className}>
      {allowSlideNext && (
        <Button
          rounded="full"
          color={color ?? "gray"}
          size="sm"
          className={cn("absolute top-1/2 z-10 -translate-y-1/2 ltr:right-0 rtl:left-0", leftClassName)}
          icon={
            <Icon size="md">
              <ChevronLeftIcon className="transform ltr:rotate-180" />
            </Icon>
          }
          onPress={() => {
            swiper.slideNext();
          }}
        />
      )}
      {allowSlidePrev && (
        <Button
          rounded="full"
          color={color ?? "gray"}
          size="sm"
          className={cn("absolute top-1/2 z-10 -translate-y-1/2 ltr:left-0 rtl:right-0", rightClassName)}
          icon={
            <Icon size="md">
              <ChevronRightIcon className="transform ltr:rotate-180" />
            </Icon>
          }
          onPress={() => {
            swiper.slidePrev();
          }}
        />
      )}
    </div>
  );
};

export default SwiperButtons;
