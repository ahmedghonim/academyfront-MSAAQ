import { ReactNode, useCallback, useMemo } from "react";

import omit from "lodash/omit";
import pick from "lodash/pick";

import { useSectionStyles } from "@/hooks";
import { AnyObject, ImageBlockFields, PageBlock } from "@/types";
import Player from "@/ui/player";
import { classNames, stripHtmlTags } from "@/utils";

import { cn } from "@msaaqcom/abjad/dist/theme";

const objectKeysFromKebabToCamelCase = (obj: AnyObject) => {
  return Object.keys(obj).reduce((acc, key) => {
    return {
      ...acc,
      [key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())]: obj[key]
    };
  }, {});
};

export const formatStyles = (styles: AnyObject) => {
  return objectKeysFromKebabToCamelCase(
    omit(styles, ["text-align", "background-image", "opacity", "filters", "transform", "custom"])
  );
};

type BackgroundStyles = {
  backgroundImage: string;
  opacity?: number;
  filter?: string;
  transform: string;
};
export const backgroundStyles = (styles: PageBlock<any>["styles"]) => {
  if (!styles || !styles["background-image"]) return undefined;

  const obj = pick(styles, ["background-image", "opacity", "filters", "transform"]);

  const newObj: BackgroundStyles = {} as BackgroundStyles;

  if (obj.filters) {
    newObj.filter =
      (obj.filters.blur ? `blur(${obj.filters.blur}px)` : "") +
      (obj.filters.grayscale ? ` grayscale(${obj.filters.grayscale}%)` : "") +
      (obj.filters.contrast >= 0 && obj.filters.contrast < 100 ? ` contrast(${obj.filters.contrast}%)` : "");
  }
  if (obj.opacity < 1) {
    newObj.opacity = obj.opacity;
  }

  newObj["backgroundImage"] = `url(${styles["background-image"]})`;
  newObj.transform = obj.transform;

  if (!newObj.filter) {
    delete newObj.filter;
  }

  return newObj;
};

export const getStyle = (key: string, styles: AnyObject) => {
  return styles ? styles[key] ?? "" : null;
};

export const alignment = (block: PageBlock<any>) => {
  const alignment = getStyle("text-align", block.styles) || "center";

  return [
    alignment == "right"
      ? `text-end lg:col-start-5`
      : "" || alignment == "center"
      ? `text-center lg:col-start-3`
      : "" || alignment == "left"
      ? `text-start`
      : ""
  ];
};
export const justifyAlignment = (block: PageBlock<any>) => {
  const alignment = getStyle("text-align", block.styles) || "center";

  return [
    alignment == "right"
      ? `justify-end`
      : "" || alignment == "center"
      ? `justify-center`
      : "" || alignment == "left"
      ? `justify-start`
      : ""
  ];
};

export const getGrid = (block: PageBlock<"features" | "courses" | "reviews" | "articles" | "products">) => {
  const { col } = block.fields_values;

  if (col == 1) {
    return " grid-cols-1";
  } else if (col == 2) {
    return "lg:grid-cols-2 grid-cols-1";
  } else if (col == 3) {
    return "lg:grid-cols-3 grid-cols-1";
  } else {
    return "lg:grid-cols-4 grid-cols-1";
  }
};

export default function BaseSection({
  block,
  children,
  renderExtraContent
}: {
  block: PageBlock<any>;
  children?: ReactNode;
  renderExtraContent?: ReactNode;
}) {
  const isMediaAligned = (str: ImageBlockFields["position"]) => {
    return (block.fields_values as ImageBlockFields).position === str;
  };

  const mediaClasses = useMemo(() => {
    if ((block.fields_values as ImageBlockFields).position) {
      return [
        "items-center",
        isMediaAligned("top") || isMediaAligned("bottom") ? "flex-col" : "lg:!flex-row",
        isMediaAligned("top") || isMediaAligned("bottom") ? "lg:col-span-8 lg:col-start-3" : "",
        isMediaAligned("bottom") ? "flex-col-reverse" : "",
        isMediaAligned("left") ? "order-1" : "order-2"
      ];
    }
  }, [block]);

  const getField = useCallback(
    <K extends keyof PageBlock<any>["fields_values"]>(key: never | any) => {
      return block.fields_values[key as never] as PageBlock<any>["fields_values"][K];
    },
    [block]
  );

  const sectionStyles = useSectionStyles(block);
  const formattedStyles = useMemo(() => formatStyles(block.styles), [block.styles]);
  const bgStyles = useMemo(() => backgroundStyles(block.styles), [block.styles]);

  const showTitleSection = useMemo(() => {
    return Boolean(
      renderExtraContent || getField("title") || getField("subtitle") || stripHtmlTags(getField("content"))
    );
  }, [getField]);

  const showUpperSection = useMemo(() => {
    return Boolean(getField("img_url") || getField("video_url")) || showTitleSection;
  }, [getField]);

  return (
    <section
      id={`block-${block.id}`}
      className={classNames("relative overflow-hidden px-4 py-16 lg:!p-16", `block-type-${block.key}`)}
      style={formattedStyles}
    >
      {sectionStyles && (
        <style
          data-mq-style={`block-${block.id}`}
          dangerouslySetInnerHTML={{
            __html: sectionStyles
          }}
        />
      )}
      {bgStyles?.backgroundImage && (
        <div
          style={bgStyles}
          className="absolute inset-0 z-0 bg-cover bg-[center_center] bg-no-repeat"
        />
      )}
      {(children || showUpperSection || showTitleSection) && (
        <div className="container relative mx-auto flex h-full w-full items-center justify-center">
          <div className="grid w-full grid-cols-12 gap-3">
            {showUpperSection && (
              <div
                className={cn(
                  "col-span-12 flex flex-col gap-6",
                  mediaClasses,
                  block.key !== "image" && block.key !== "video" ? `lg:col-span-8  ${alignment(block)}` : "",
                  children && "mb-8"
                )}
              >
                {block.key === "image" && (
                  <div className={cn("w-full lg:w-1/2", getField("position") == "left" ? "order-2" : "")}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getField("img_url")}
                      className="mx-auto h-auto max-w-full"
                      alt={getField("title")}
                    />
                  </div>
                )}
                {block.key === "video" && (
                  <div
                    className={cn(
                      "custom-video-player-width w-full overflow-hidden rounded-lg lg:w-1/2",
                      getField("position") == "left" ? "order-2" : ""
                    )}
                    dir="ltr"
                  >
                    <Player
                      rel="0"
                      src={getField("video_url")}
                    />
                  </div>
                )}

                {showTitleSection && (
                  <div
                    className={cn(
                      "flex flex-col",
                      block.key == "image" || block.key === "video" ? "w-full lg:w-1/2" : "",
                      alignment(block)
                    )}
                  >
                    {getField("title") && (
                      <h2
                        className="section-title mb-2 text-4xl font-bold text-black"
                        children={getField("title")}
                      />
                    )}
                    {getField("subtitle") && (
                      <p
                        className="section-subtitle text-sm font-normal text-black"
                        children={getField("subtitle")}
                      />
                    )}
                    {stripHtmlTags(getField("content")) && (
                      <div
                        className="section-content prose prose-sm sm:prose-base lg:prose-lg !prose-currentColor prose-custom-blockquote !max-w-full"
                        dangerouslySetInnerHTML={{ __html: getField("content") }}
                      />
                    )}
                    {renderExtraContent}
                  </div>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      )}
    </section>
  );
}
