"use client";

import { useEffect, useRef } from "react";

import dynamic from "next/dynamic";

import { useTranslations } from "next-intl";

import { ProgressBarLink } from "@/providers/progress-bar";

import { BookmarkSquareIcon, HomeIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import { Icon, Typography } from "@msaaqcom/abjad";

const Cart = dynamic(() => import("@/components/cart/cart-modal"), {
  ssr: false
});

const MobileNavigation = () => {
  const t = useTranslations();

  const mobileActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const floatingActions = document.getElementById("floating-actions");

    const detectCollisions = () => {
      if (floatingActions && mobileActionsRef.current) {
        floatingActions.style.bottom = `${mobileActionsRef.current.getBoundingClientRect().height}px`;
      }
    };

    detectCollisions();
    window.addEventListener("scroll", detectCollisions);
    window.addEventListener("resize", detectCollisions);

    return () => {
      window.removeEventListener("scroll", detectCollisions);
      window.removeEventListener("resize", detectCollisions);
    };
  }, []);

  return (
    <>
      <div
        id="mobile-actions"
        ref={mobileActionsRef}
        className="sticky left-0 z-50 w-full border-t border-gray-300 bg-white min-[768px]:hidden"
        style={{
          bottom: "0",
          paddingBottom: "calc(env(safe-area-inset-bottom,0) + 0.75rem)"
        }}
      >
        <div className="mobile-nav mx-auto grid h-full max-w-lg grid-cols-4 px-4 pt-3">
          <ProgressBarLink
            href="/"
            className="group inline-flex flex-col items-center justify-center gap-1 rounded p-1 text-center hover:bg-gray-200"
          >
            <Icon>
              <HomeIcon />
            </Icon>
            <Typography.Body
              size="sm"
              className="text-[12px] font-normal text-gray-800"
            >
              {t("common.section_titles_home_page")}
            </Typography.Body>
          </ProgressBarLink>
          <ProgressBarLink
            /*@ts-ignore*/
            href={"/login"}
            className="group inline-flex flex-col items-center justify-center gap-1 rounded p-1 text-center hover:bg-gray-200"
          >
            <Icon>
              <UserCircleIcon />
            </Icon>
            <Typography.Body
              size="sm"
              className="text-[12px] font-normal text-gray-800"
            >
              {t("common.login")}
            </Typography.Body>
          </ProgressBarLink>
          <ProgressBarLink
            href={"/login?callbackUrl=/library"}
            className="group inline-flex flex-col items-center justify-center gap-1 rounded p-1 text-center hover:bg-gray-200"
          >
            <Icon>
              <BookmarkSquareIcon />
            </Icon>
            <Typography.Body
              size="sm"
              className="text-[12px] font-normal text-gray-800"
            >
              {t("common.my_library")}
            </Typography.Body>
          </ProgressBarLink>
          <Cart showMobileToggle={true} />
        </div>
      </div>
    </>
  );
};

export { MobileNavigation };
