"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";

import { useTranslations } from "next-intl";

import LangSwitcher from "@/components/lang-switcher";
import { SearchModal } from "@/components/modals";
import { useTenant } from "@/components/store/TenantProvider";
import { useAppDispatch, useAppSelector, useMediaQuery, useProfileCompleteStatus } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import { useSession } from "@/providers/session-provider";
import { AppSliceStateType, setOpenCompleteProfileModal } from "@/store/slices/app-slice";
import { BREAKPOINTS, Menu } from "@/types";
import { TenantLogo } from "@/ui/images";
import { firstName } from "@/utils";

import {
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  ArrowUpRightIcon,
  BookmarkSquareIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  EyeIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { InformationCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { Avatar, Button, Dropdown, Icon, Progress, Title, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import AppMenu from "./menus/app-menu";
import AppMenuMobile from "./menus/app-menu-mobile";

const Cart = dynamic(() => import("@/components/cart/cart-modal"), {
  ssr: false
});

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);

  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  const headerRef = useRef<HTMLHeadElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [headerPlacement, setHeaderPlacement] = useState<number>(0);

  const { completedProfilePercentage } = useAppSelector<AppSliceStateType>((state) => state.app);
  const dispatch = useAppDispatch();
  const { member, logout } = useSession();

  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const isMD = useMediaQuery(BREAKPOINTS.md);
  const { profileFieldsCompleted } = useProfileCompleteStatus();

  const getHeaderHeight = useCallback(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, [headerRef]);

  useEffect(() => {
    setIsClient(true);
    getHeaderHeight();

    window.addEventListener("resize", getHeaderHeight);

    return () => {
      window.removeEventListener("resize", getHeaderHeight);
    };
  }, [getHeaderHeight]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (headerRef && headerRef.current) {
        if (prevScrollPos > currentScrollPos) {
          headerRef.current.style.top = "0";
          setHeaderPlacement(headerHeight);
        } else {
          headerRef.current.style.top = `-${headerRef.current.clientHeight + 20}px`;
          setHeaderPlacement(0);
        }
      }
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, headerRef, headerHeight]);

  const headerMenu = useMemo<Menu | undefined>(
    () => tenant?.menus.find((m) => m.location.includes("header")),
    [tenant]
  );

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-[999] mb-4 flex !min-h-[48px] items-center border-b border-gray-400 bg-white px-4 py-2 transition-all md:!min-h-[90px] md:!px-8 lg:!min-h-[98px] lg:!px-6",
        className
      )}
    >
      <style
        global
        jsx
      >
        {`
          :root {
            --header-height: ${headerHeight}px;
            --header-placement: ${headerPlacement}px;
          }
        `}
      </style>
      <div className="mx-auto flex w-full items-center justify-between">
        <TenantLogo className="header-logo me-2 !h-8 md:!me-6 lg:h-10" />
        <div className="header-actions ms-auto flex items-center gap-2 md:order-2 md:!gap-6">
          {member && isClient && isMD && (
            <Button
              variant="solid"
              color="gray"
              size="sm"
              className="library-button"
              href="/library"
            >
              {t("common.my_library")}
            </Button>
          )}
          <LangSwitcher />
          <Button
            variant="link"
            color="gray"
            size="sm"
            className="search-button"
            onPress={() => setShowSearchModal(true)}
            icon={
              <Icon
                size="sm"
                className="relative"
              >
                <MagnifyingGlassIcon />
              </Icon>
            }
          />
          <SearchModal
            open={showSearchModal}
            onDismiss={() => {
              setShowSearchModal(false);
            }}
          />
          <Cart showMobileToggle={false} />
          {member ? (
            <>
              {isMD && isClient && (
                <Dropdown>
                  {/*//@ts-ignore*/}
                  <Dropdown.Trigger className="member-dropdown-trigger">
                    <button
                      role="button"
                      className="member-dropdown-button"
                    >
                      <Title
                        className="member-dropdown-title"
                        title={
                          <>
                            <div className="member-dropdown-greetings flex flex-col text-start">
                              <Typography.Body
                                children={t("common.greetings")}
                                as="span"
                                size="md"
                                className="member-dropdown-greeting-text"
                              />
                              <Typography.Body
                                children={firstName(member?.name)}
                                as="span"
                                size="base"
                                className="member-dropdown-name max-w-[6rem] truncate font-medium"
                              />
                            </div>
                          </>
                        }
                        prepend={
                          <Avatar
                            name={member?.name}
                            imageUrl={member?.avatar}
                            className="member-dropdown-avatar"
                          />
                        }
                        append={
                          <Icon className="member-dropdown-icon">
                            <ChevronDownIcon />
                          </Icon>
                        }
                      />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu className="member-dropdown-menu !z-[1000]">
                    <Dropdown.Item
                      onClick={() => dispatch(setOpenCompleteProfileModal(true))}
                      wrapperClassName="relative bg-gray-100 member-dropdown-item"
                      as="div"
                      iconAlign="start"
                      className="member-dropdown-profile-status-item flex w-full flex-col gap-2 !p-2"
                    >
                      <Fragment>
                        <div className="member-dropdown-profile-status flex w-full items-center gap-2">
                          <Icon
                            size="sm"
                            className="member-dropdown-profile-status-icon"
                          >
                            <InformationCircleIcon />
                          </Icon>
                          <span className="member-dropdown-profile-status-text">
                            {profileFieldsCompleted
                              ? t("common.your_profile_is_completed")
                              : t("common.complete_your_profile")}
                          </span>
                          <Icon
                            size="xs"
                            className="member-dropdown-profile-status-arrow ms-auto"
                          >
                            <ArrowRightIcon className="rtl:rotate-180" />
                          </Icon>
                        </div>
                        <Progress.Bar
                          value={completedProfilePercentage}
                          color={completedProfilePercentage >= 100 ? "success" : "warning"}
                        />
                      </Fragment>
                    </Dropdown.Item>
                    <Dropdown.Item
                      wrapperClassName="relative member-dropdown-item"
                      as="div"
                      iconAlign="start"
                      className="member-dropdown-library-item !justify-start gap-2"
                      icon={
                        <Icon
                          size="sm"
                          className="member-dropdown-library-icon"
                        >
                          <BookmarkSquareIcon />
                        </Icon>
                      }
                    >
                      <ProgressBarLink
                        href="/library"
                        className="member-dropdown-library-link w-full"
                      >
                        <span className="absolute inset-0" />
                        {t("common.to_library")}
                      </ProgressBarLink>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      wrapperClassName="relative member-dropdown-item"
                      iconAlign="start"
                      className="member-dropdown-wallet-item !justify-start gap-2"
                      icon={
                        <Icon
                          size="sm"
                          className="member-dropdown-wallet-icon"
                        >
                          <CurrencyDollarIcon />
                        </Icon>
                      }
                    >
                      <ProgressBarLink
                        href={member?.is_affiliate_open ? "/account/affiliates" : "/account/orders"}
                        className="member-dropdown-wallet-link w-full"
                      >
                        <span className="absolute inset-0" />

                        {t("common.wallet")}
                      </ProgressBarLink>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      wrapperClassName="relative member-dropdown-item"
                      iconAlign="start"
                      className="member-dropdown-account-item !justify-start gap-2"
                      icon={
                        <Icon
                          size="sm"
                          className="member-dropdown-account-icon"
                        >
                          <UserCircleIcon />
                        </Icon>
                      }
                    >
                      <ProgressBarLink
                        href="/account"
                        className="member-dropdown=account-link w-full"
                      >
                        <span className="absolute inset-0" />

                        {t("common.profile")}
                      </ProgressBarLink>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      wrapperClassName="relative member-dropdown-item"
                      iconAlign="start"
                      className="member-dropdown-academy-item !justify-start gap-2"
                      icon={
                        <Icon
                          size="sm"
                          className="member-dropdown-academy-icon"
                        >
                          <EyeIcon />
                        </Icon>
                      }
                    >
                      <Fragment>
                        <ProgressBarLink
                          href="/"
                          className="member-dropdown-academy-link flex w-full items-center justify-between"
                        >
                          <span className="absolute inset-0" />
                          <Typography.Body
                            as="span"
                            className="member-dropdown-academy-text"
                          >
                            {t("common.browse_academy")}
                          </Typography.Body>
                          <Icon
                            size="sm"
                            className="member-dropdown-academy-arrow"
                          >
                            <ArrowUpRightIcon />
                          </Icon>
                        </ProgressBarLink>
                      </Fragment>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      icon={
                        <Icon
                          size="sm"
                          color="danger"
                          className="member-dropdown-logout-icon"
                        >
                          <ArrowRightOnRectangleIcon />
                        </Icon>
                      }
                      onClick={() => logout()}
                      wrapperClassName="member-dropdown-item"
                      className="member-dropdown-logout-item"
                    >
                      <Fragment>
                        <Typography.Body
                          as="span"
                          className="member-dropdown-logout-text text-danger"
                        >
                          {t("common.logout")}
                        </Typography.Body>
                      </Fragment>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </>
          ) : (
            <Button
              variant="solid"
              color="primary"
              size="sm"
              className="login-button hidden md:!flex"
              href="/login"
            >
              {t("common.login_register")}
            </Button>
          )}

          <AppMenuMobile menu={headerMenu} />
        </div>
        <nav
          className="hidden w-auto lg:!flex"
          id="navbar-default"
        >
          <AppMenu
            menu={headerMenu}
            className="flex flex-row flex-wrap items-center gap-x-2 gap-y-3.5  rounded-lg bg-white"
            location="header"
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;
