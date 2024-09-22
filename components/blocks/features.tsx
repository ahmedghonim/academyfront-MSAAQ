import { PageBlock } from "@/types";
import { stripHtmlTags } from "@/utils";

import { cn } from "@msaaqcom/abjad/dist/theme";

import BaseSection, { getGrid } from "./base-section";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

export default function Features({ block }: { block: PageBlock<"features"> }) {
  return (
    <BaseSection block={block}>
      <div className="col-span-12">
        <div className={cn("grid w-full gap-8", getGrid(block))}>
          {block.fields_values.features.map((feature: Feature, index: number) => (
            <div
              key={index}
              className="feature-card flex h-full flex-col items-center gap-4"
            >
              {feature.icon && (
                <div className="feature-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="mx-auto w-full"
                    src={feature.icon}
                    alt={feature.title}
                  />
                </div>
              )}
              {(feature.title || stripHtmlTags(feature.description)) && (
                <div className="feature-text text-center">
                  {feature.title && (
                    <h3
                      className="feature-title text-2xl font-semibold text-black"
                      children={feature.title}
                    />
                  )}
                  {stripHtmlTags(feature.description) && (
                    <div
                      className="feature-description text-base text-gray-800"
                      dangerouslySetInnerHTML={{ __html: feature.description }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BaseSection>
  );
}
