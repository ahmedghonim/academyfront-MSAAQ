import { cn } from "@msaaqcom/abjad/dist/theme";

import {
  Facebook,
  Instagram,
  Linkedin,
  Maroof,
  Podcast,
  Snapchat,
  Soundcloud,
  Telegram,
  Tiktok,
  Twitter,
  Whatsapp,
  Youtube
} from "./icons";

const components = {
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: Tiktok,
  podcast: Podcast,
  snapchat: Snapchat,
  telegram: Telegram,
  whatsapp: Whatsapp,
  instagram: Instagram,
  soundcloud: Soundcloud,
  maroof: Maroof
};

type SocialIconProps = {
  kind: keyof typeof components;
  href?: string | undefined;
  className?: string;
};

const SocialIcon = ({ kind, href, className }: SocialIconProps) => {
  const SocialSvg = components[kind];

  return href ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg className={cn("h-4 w-4 fill-current text-gray-700 hover:text-primary", `icon-${kind}`, className)} />
    </a>
  ) : (
    <SocialSvg className={cn("h-4 w-4 fill-current text-gray-700 hover:text-primary", `icon-${kind}`, className)} />
  );
};

export default SocialIcon;
