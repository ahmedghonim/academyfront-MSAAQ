import SocialIcon from "@/components/social-icons";

interface SocialLinksProps {
  links: {
    maroof: null | string;
    tiktok: null | string;
    podcast: null | string;
    twitter: null | string;
    youtube: null | string;
    facebook: null | string;
    snapchat: null | string;
    telegram: null | string;
    whatsapp: null | string;
    instagram: null | string;
    soundcloud: null | string;
  };
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(links).map(
        ([platform, url]) =>
          url && (
            <SocialIcon
              key={platform}
              kind={platform as keyof typeof links}
              href={url}
            />
          )
      )}
    </div>
  );
};

export { SocialLinks };
