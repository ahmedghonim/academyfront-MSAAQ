import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useContent } from "@/components/store/content-provider";
import { useAppSelector } from "@/hooks";
import { AppSliceStateType } from "@/store/slices/app-slice";

import { ArrowSmallLeftIcon, ArrowSmallRightIcon } from "@heroicons/react/24/outline";

import { Button, Icon } from "@msaaqcom/abjad";

export default function PrevNextContentButtons() {
  const params = useParams<{ slug: string }>();
  const t = useTranslations();
  const content = useContent()((s) => s.content);
  const { appLocale } = useAppSelector<AppSliceStateType>((state) => state.app);

  const handleNextPrevButtonIcons = (isPreviousButton: boolean) => {
    if (appLocale === "ar") {
      return isPreviousButton ? <ArrowSmallRightIcon /> : <ArrowSmallLeftIcon />;
    } else {
      return isPreviousButton ? <ArrowSmallLeftIcon /> : <ArrowSmallRightIcon />;
    }
  };

  return (
    <div className="mt-5 flex items-center justify-between md:mt-0 md:!justify-end md:gap-x-4">
      {!content.prev.is_first && content.prev.prevable && (
        <Button
          href={`/courses/${params?.slug}/chapters/${content.prev.chapter_id}/contents/${content.prev.content_id}`}
          color="gray"
          variant="link"
          size="sm"
          className="gap-2 md:!gap-0"
          icon={<Icon className="flex md:hidden">{handleNextPrevButtonIcons(true)}</Icon>}
          children={t("common.prev")}
        />
      )}
      {!content.next.is_last && content.next.nextable && (
        <Button
          href={`/courses/${params?.slug}/chapters/${content.next.chapter_id}/contents/${content.next.content_id}`}
          color="gray"
          size="sm"
          className="gap-2 md:!gap-0"
          icon={<Icon className="flex md:hidden">{handleNextPrevButtonIcons(false)}</Icon>}
          iconAlign="end"
          children={t("common.next")}
        />
      )}
    </div>
  );
}
