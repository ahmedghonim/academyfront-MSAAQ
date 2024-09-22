import Image from "next/image";

import { cn } from "@msaaqcom/abjad/dist/theme";

type BaseImageProps = {
  alt: string;
  src: string | null;
  className?: string;
  objectFit?: "cover" | "contain";
  size?: "md" | "lg";
  rounded?: "none" | "md" | "lg" | "xl" | "2xl";
  bordered?: boolean;
};

const BaseImage = ({ src, alt, className, bordered = true, rounded = "2xl", objectFit = "cover" }: BaseImageProps) => {
  return (
    <div
      className={cn(
        "aspect-h-9 aspect-w-16 overflow-hidden",
        `rounded-${rounded}`,
        bordered && "border border-gray-300",
        className
      )}
    >
      <Image
        alt={alt}
        src={src as string}
        placeholder="empty"
        fill
        sizes="100%, 100%"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          inset: 0,
          maxWidth: "100%",
          objectFit: objectFit
        }}
      />
    </div>
  );
};

const PlaceHolderImage = ({ size = "md", alt, className, rounded = "2xl" }: BaseImageProps) => {
  return (
    <div className={cn("place-holder-image aspect-h-9 aspect-w-16 overflow-hidden", `rounded-${rounded}`, className)}>
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center bg-gray-100"
        )}
      >
        <span className="sr-only">{alt}</span>
        <svg
          width={size === "md" ? 64 : 96}
          height={size === "md" ? 64 : 96}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M41.3332 18.6665H22.6665C20.4574 18.6665 18.6665 20.4574 18.6665 22.6665V37.3332C18.6665 39.5423 20.4574 41.3332 22.6665 41.3332H41.3332C43.5423 41.3332 45.3332 39.5423 45.3332 37.3332V22.6665C45.3332 20.4574 43.5423 18.6665 41.3332 18.6665Z"
            fill="#C7C7C7"
          />
          <path
            d="M43.333 45.3332H20.6663C20.3127 45.3332 19.9736 45.1927 19.7235 44.9426C19.4735 44.6926 19.333 44.3535 19.333 43.9998C19.333 43.6462 19.4735 43.3071 19.7235 43.057C19.9736 42.807 20.3127 42.6665 20.6663 42.6665H43.333C43.6866 42.6665 44.0258 42.807 44.2758 43.057C44.5259 43.3071 44.6663 43.6462 44.6663 43.9998C44.6663 44.3535 44.5259 44.6926 44.2758 44.9426C44.0258 45.1927 43.6866 45.3332 43.333 45.3332Z"
            fill="#C7C7C7"
          />
          <path
            d="M40.9714 34.7004L38.9154 28.5318C38.8118 28.2187 38.6323 27.9362 38.3929 27.7093C38.1535 27.4825 37.8617 27.3185 37.5435 27.2318C37.2253 27.1452 36.8906 27.1386 36.5693 27.2128C36.2479 27.287 35.9499 27.4395 35.7019 27.6568L31.935 30.9511L30.5951 29.9472C30.2092 29.6608 29.7335 29.522 29.2541 29.5561C28.7747 29.5901 28.3234 29.7947 27.9818 30.1327L24.1954 33.9186C23.9158 34.1983 23.7254 34.5547 23.6483 34.9427C23.5711 35.3306 23.6107 35.7327 23.7621 36.0981C23.9134 36.4636 24.1697 36.7759 24.4985 36.9958C24.8273 37.2156 25.2139 37.333 25.6094 37.3332H39.0756C39.3925 37.3332 39.7048 37.2578 39.9868 37.1134C40.2689 36.9689 40.5125 36.7594 40.6977 36.5023C40.8828 36.2451 41.0042 35.9477 41.0518 35.6344C41.0994 35.3211 41.0719 35.001 40.9714 34.7004Z"
            fill="#FAFAFA"
          />
          <path
            d="M26.6667 27.9998C28.1394 27.9998 29.3333 26.8059 29.3333 25.3332C29.3333 23.8604 28.1394 22.6665 26.6667 22.6665C25.1939 22.6665 24 23.8604 24 25.3332C24 26.8059 25.1939 27.9998 26.6667 27.9998Z"
            fill="#E6E6E6"
          />
        </svg>
      </div>
    </div>
  );
};

const Thumbnail = ({ src, bordered = true, ...props }: BaseImageProps) => {
  return src ? (
    <BaseImage
      src={src}
      bordered={bordered}
      {...props}
    />
  ) : (
    <PlaceHolderImage
      {...props}
      src={null}
    />
  );
};

export { Thumbnail };
