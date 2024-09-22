export type Video = {
  id: number;
  provider: "youtube" | "gumlet" | "vimeo" | "stream" | "unknown";
  provider_id: string;
  url: string;
  thumbnail: string | null;
  duration: number;
};
