"use client";

import { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { useIsRouteActive } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";

import { Navbar, Typography } from "@msaaqcom/abjad";
import {
  Calendar02Icon,
  Certificate01Icon,
  Home05Icon,
  ShoppingBag02Icon,
  Video02Icon
} from "@msaaqcom/hugeicons/rounded/stroke";

interface LibraryLayoutProps {
  actions?: ReactNode;
}

const LibraryLayout = ({ actions }: LibraryLayoutProps) => {
  const t = useTranslations();
  const { isActive } = useIsRouteActive();

  return (
    <>
      <div className="mb-6 flex flex-col space-y-6 md:mb-0">
        <Typography.Title
          size="sm"
          className="font-bold"
          children={t("common.my_library")}
        />
        <div className="flex w-full items-center justify-between">
          <Navbar className="scrollbar-hide w-fit overflow-x-scroll">
            <Navbar.Item
              as={ProgressBarLink}
              href="/library"
              isActive={isActive(["/library"])}
              className="account-library"
              iconAlign="start"
              icon={<Home05Icon className={`h-6 w-6 text-inherit`} />}
            >
              {t("account.tabs_library")}
            </Navbar.Item>
            <Navbar.Item
              as={ProgressBarLink}
              href="/library/courses"
              isActive={isActive(["/library/courses"])}
              className="account-courses"
              iconAlign="start"
              icon={<Video02Icon className="h-6 w-6 text-inherit" />}
            >
              {t("account.tabs_courses")}
            </Navbar.Item>
            <Navbar.Item
              as={ProgressBarLink}
              href="/library/products"
              isActive={isActive(["/library/products"])}
              className="account-products"
              iconAlign="start"
              icon={<ShoppingBag02Icon className="h-6 w-6 text-inherit" />}
            >
              {t("account.tabs_products")}
            </Navbar.Item>
            <Navbar.Item
              as={ProgressBarLink}
              href="/library/coaching-sessions"
              isActive={isActive(["/library/coaching-sessions"])}
              className="account-coaching-sessions"
              iconAlign="start"
              icon={<Calendar02Icon className="h-6 w-6 text-inherit" />}
            >
              {t("account.tabs_coaching_sessions")}
            </Navbar.Item>
            <Navbar.Item
              as={ProgressBarLink}
              href="/library/certificates"
              isActive={isActive(["/library/certificates"])}
              className="account-certificates"
              iconAlign="start"
              icon={<Certificate01Icon className="h-6 w-6 text-inherit" />}
            >
              {t("account.tabs_certificates")}
            </Navbar.Item>
          </Navbar>
          {actions}
        </div>
      </div>
      <div className="my-6 hidden h-px w-full bg-gray-400 md:block" />
    </>
  );
};

export default LibraryLayout;
