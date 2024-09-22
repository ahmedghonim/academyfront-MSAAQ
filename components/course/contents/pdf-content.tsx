"use client";

import { useTranslations } from "next-intl";

import { Content, PDF } from "@/types";

interface Props {
  content: Content<PDF>;
}

const PDFContent = ({ content }: Props) => {
  const t = useTranslations();

  return (
    <iframe
      src={`https://cdn.msaaq.com/assets/js/pdf.js/web/viewer.html?file=${content.contentable.file.url}`}
      frameBorder="0"
      className="print-container mb-9 h-[600px] w-full"
      onContextMenu={(e) => e.preventDefault()}
    >
      {t("course_player.pdf_not_supported")}
    </iframe>
  );
};

export default PDFContent;
