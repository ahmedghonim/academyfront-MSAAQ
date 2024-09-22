import React, { useState } from "react";

import dynamic from "next/dynamic";

import { useIsRouteActive } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import { Menu, MenuLink } from "@/types";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import { Button, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface AppMenuProps {
  className?: string;
  menu: Menu | undefined;
}

const Drawer = dynamic(() => import("@/components/drawer").then((mod) => mod.Drawer), {
  ssr: false
});
const DropdownMenu = ({ link, isActive }: any) => {
  const [showChildren, setShowChildren] = useState(false);

  if (link.children.length) {
    return (
      <React.Fragment>
        <Typography.Body
          onClick={(e: any) => {
            e.preventDefault();
            setShowChildren(!showChildren);
          }}
          size="base"
          className={cn("flex cursor-pointer p-6 hover:bg-gray-200", showChildren && "bg-gray-200")}
          children={
            <span className="flex w-full items-center justify-between">
              {link.title}
              <Icon>{showChildren ? <ChevronUpIcon /> : <ChevronDownIcon />}</Icon>
            </span>
          }
        />

        {showChildren && (
          <ul>
            {link.children.map((child: MenuLink) => {
              return (
                <li key={child.id}>
                  <Typography.Body
                    as={ProgressBarLink}
                    size="base"
                    href={child.url ?? "#"}
                    target={child.new_tab ? "_blank" : "_self"}
                    className={cn("block bg-gray-200 px-6 py-3")}
                  >
                    {child.title}
                  </Typography.Body>
                </li>
              );
            })}
          </ul>
        )}
      </React.Fragment>
    );
  } else {
    return (
      <Typography.Body
        as={ProgressBarLink}
        size="base"
        href={link.url ?? "#"}
        target={link.new_tab ? "_blank" : "_self"}
        className={cn("flex cursor-pointer p-6 hover:bg-gray-200", isActive(link.url) ? "bg-gray-200" : "")}
      >
        {link.title}
      </Typography.Body>
    );
  }
};

const AppMenuMobile = ({ className, menu }: AppMenuProps) => {
  const { isActive } = useIsRouteActive();

  const [isOpen, setIsOpen] = useState(false);
  const closeNav = () => setIsOpen(false);

  if (!menu || !menu.links.length) {
    return null;
  }

  return (
    <>
      <Button
        variant="link"
        color="gray"
        size="sm"
        className="mobile-menu-toggle block lg:!hidden"
        onPress={() => setIsOpen(true)}
        icon={
          <Icon>
            <Bars3Icon />
          </Icon>
        }
      />
      <Drawer
        styleClass="navbar-drawer"
        onClose={closeNav}
        isOpen={isOpen}
      >
        <ul className={className}>
          {menu.links.map((link, index) => (
            <li key={index}>
              <DropdownMenu
                link={link}
                isActive={isActive}
              />
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
};

export default AppMenuMobile;
