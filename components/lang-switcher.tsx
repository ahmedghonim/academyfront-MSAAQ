"use client";

import { useParams } from "next/navigation";
// eslint-disable-next-line no-restricted-imports
import { usePathname, useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useTenant } from "@/components/store/TenantProvider";
import { useProgressBar } from "@/providers/progress-bar";

import { Icon, Tooltip } from "@msaaqcom/abjad";

export default function LangSwitcher() {
  let progress = useProgressBar();
  const fullPath = usePathname();
  const { replace } = useRouter();
  const lang = useLocale();

  const redirectedPathName = async (locale: "ar" | "en") => {
    const path = fullPath.replace(lang, "");

    replace("/" + locale + "/" + path);
  };

  const t = useTranslations();
  const { locale } = useParams();

  const tenant = useTenant()((s) => s.tenant);

  return tenant?.multi_lang_enabled ? (
    <Tooltip>
      <Tooltip.Trigger>
        <button
          onClick={(e) => {
            e.preventDefault();
            progress.start();

            redirectedPathName(lang === "en" ? "ar" : "en");
          }}
          className="forced-colors:outline-[Highlight] pressed:ring-1 pressed:ring-gray abjad-btn abjad-btn-solid abjad-btn-gray relative inline-flex h-10 items-center justify-center gap-x-2 whitespace-nowrap rounded-lg bg-gray-400 px-3 py-1.5 font-extrabold text-gray-900 outline outline-0 outline-offset-2 outline-blue-600 transition hover:bg-gray dark:outline-blue-500 [&.abjad-btn-is-fetching>[data-slot=children]]:invisible [&.abjad-btn-is-fetching_[data-slot=icon]]:invisible [&.abjad-btn-is-loading>[data-slot=children]]:invisible [&.abjad-btn-is-loading_[data-slot=icon]]:invisible"
        >
          <div className="pe-1">
            <Icon size="md">
              <div
                style={{
                  backgroundImage: `url(https://cdn.msaaq.com/assets/flags/${locale == "ar" ? "us" : "sa"}.svg)`
                }}
                className="my-[3px] h-5 w-7 rounded bg-cover bg-center bg-no-repeat"
              />
            </Icon>
          </div>
          {locale === "en" ? "عربي" : "English"}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content children={t("common.click_to_change_language")} />
    </Tooltip>
  ) : null;
}
