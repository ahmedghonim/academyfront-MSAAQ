"use client";

import { FC, useRef } from "react";

import { useParams } from "next/navigation";

import {
  MediaPlayer,
  MediaPlayerInstance,
  type MediaPlayerProps,
  MediaProvider,
  TimeSlider,
  TimeSliderInstance,
  useStore
} from "@vidstack/react";
import { DefaultAudioLayout, DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/default/theme.css";

import "@vidstack/react/player/styles/default/layouts/video.css";

interface VideoPlayerProps extends Omit<MediaPlayerProps, "children"> {
  hasFullscreenButton?: boolean;
  src: string;
}

const Player: FC<VideoPlayerProps> = ({ src, title, loop = false, ...reset }) => {
  const player = useRef<MediaPlayerInstance>(null);
  const { locale } = useParams();
  const timeSliderRef = useRef<TimeSliderInstance>(null),
    {} = useStore(TimeSliderInstance, timeSliderRef);

  const ARABIC = {
    Audio: "الصوت",
    Auto: "تلقائي",
    Continue: "استكمال",
    Default: "",
    "Enter Fullscreen": "وضع الشاشة الكاملة",
    "Exit Fullscreen": "الخروج من الشاشة الكاملة",
    LIVE: "بث حي",
    Mute: "كتم الصوت",
    Normal: "طبيعي",
    Off: "إيقاف",
    Pause: "إيقاف",
    Play: "تشغيل",
    Quality: "الجودة",
    Replay: "إعادة تشغيل",
    Reset: "إعادة تعيين",
    Seek: "بحث",
    Settings: "الإعدادات",
    "Seek Backward": "",
    "Seek Forward": "",
    "Skip To Live": "",
    Speed: "السرعة",
    Unmute: "إلغاء كتم الصوت",
    Volume: "الصوت",
    Connected: "متصل",
    Connecting: "جار الاتصال",
    Disconnected: "غير متصل",
    Fullscreen: "شاشة كاملة"
  };
  const ENGLISH = {
    Audio: "Audio",
    Auto: "Auto",
    Continue: "Continue",
    Default: "",
    "Enter Fullscreen": "Enter Fullscreen",
    "Exit Fullscreen": "Exit Fullscreen",
    LIVE: "Live",
    Mute: "Mute",
    Normal: "Normal",
    Off: "Off",
    Pause: "Pause",
    Play: "Play",
    Quality: "Quality",
    Replay: "Replay",
    Reset: "Reset",
    Seek: "Seek",
    Settings: "Settings",
    "Seek Backward": "Seek Backward",
    "Seek Forward": "Seek Forward",
    "Skip To Live": "Skip to live",
    Speed: "Speed",
    Unmute: "Unmute",
    Volume: "Volume",
    Connected: "Connected",
    Connecting: "Connecting",
    Disconnected: "Disconnected",
    Fullscreen: "Fullscreen"
  };

  const vimeoIdMatch = src?.match(/vimeo\.com\/(\d+)\/(\w+)/);

  return (
    <MediaPlayer
      title={title}
      src={vimeoIdMatch ? `https://vimeo.com/video/${vimeoIdMatch[1]}?hash=${vimeoIdMatch[2]}` : src}
      ref={player}
      loop={loop}
      {...reset}
      playsInline
      className="video-player-wrapper "
    >
      <MediaProvider className="video-player" />
      <DefaultAudioLayout
        icons={defaultLayoutIcons}
        slots={{
          timeSlider: (
            <TimeSlider.Root
              ref={timeSliderRef}
              className="vds-time-slider vds-slider"
            >
              <TimeSlider.Track className="vds-slider-track" />
              <TimeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
              <TimeSlider.Progress className="vds-slider-progress vds-slider-track" />
              <TimeSlider.Thumb className="vds-slider-thumb" />
            </TimeSlider.Root>
          ),
          pipButton: null,
          googleCastButton: null
        }}
      />
      <DefaultVideoLayout
        translations={locale == "ar" ? ARABIC : ENGLISH}
        icons={defaultLayoutIcons}
        slots={{
          timeSlider: (
            <TimeSlider.Root
              ref={timeSliderRef}
              className="vds-time-slider vds-slider"
            >
              <TimeSlider.Track className="vds-slider-track" />
              <TimeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
              <TimeSlider.Progress className="vds-slider-progress vds-slider-track" />
              <TimeSlider.Thumb className="vds-slider-thumb ltr:-ml-3 rtl:-ml-3" />
            </TimeSlider.Root>
          ),
          pipButton: null,
          googleCastButton: null
        }}
      />
    </MediaPlayer>
  );
};

export default Player;
