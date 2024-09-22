"use client";

import { useTranslations } from "next-intl";

import dayjs from "@/lib/dayjs";

import { ClockIcon } from "@heroicons/react/24/outline";

import EmptyState from "../../empty-state";
import PrevNextContentButtons from "../prev-next-content-buttons";

interface Props {
  dripableAt?: string | null;
  enrolledCourse: boolean;
}

const DripContentSection = ({ dripableAt, enrolledCourse = false }: Props) => {
  const t = useTranslations();

  return (
    <div className="border-t border-gray-400 pt-4">
      <EmptyState
        bordered
        color="gray"
        variant="solid"
        title={t("drip_content.title")}
        description={
          enrolledCourse
            ? t.rich("drip_content:description", {
                strong: (c) => <strong className="text-black">{c}</strong>,
                date: dayjs(dripableAt).format("D MMMM، YYYY")
              })
            : ""
        }
        icon={<ClockIcon />}
        actions={<PrevNextContentButtons />}
      />
    </div>
  );
};

export default DripContentSection;
