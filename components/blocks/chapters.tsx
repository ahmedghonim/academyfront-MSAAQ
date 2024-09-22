import { ChapterItem } from "@/components/course";
import { Chapter, PageBlock } from "@/types";

import BaseSection from "./base-section";

export default function Chapters({ block }: { block: PageBlock<"chapters">; children?: React.ReactNode }) {
  return (
    <BaseSection block={block}>
      <div className="col-span-12 flex flex-col gap-8 md:col-span-8 md:col-start-3">
        {block.data.map((chapter: Chapter, index: number) => {
          return (
            <ChapterItem
              defaultOpen={index === 0}
              courseRef={block.fields_values.course}
              className="bg-gray-100"
              key={chapter.id}
              chapter={chapter}
            />
          );
        })}
      </div>
    </BaseSection>
  );
}
