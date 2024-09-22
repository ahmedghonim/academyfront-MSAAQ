import { ReactNode, useEffect, useId, useRef } from "react";

import { useLocale } from "next-intl";
import { createPortal } from "react-dom";
import { isRtlLang } from "rtl-detect";

import { useMountTransition } from "@/hooks";
import { classNames } from "@/utils";

import { XMarkIcon } from "@heroicons/react/24/solid";

import { Button, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

function createPortalRoot(id: string) {
  const drawerRoot = document.createElement("div");

  drawerRoot.setAttribute("id", id);

  return drawerRoot;
}

interface DrawerProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  styleClass?: string;
  onClose: () => void;
  action?: ReactNode;
  title?: string;
  removeWhenClosed?: boolean;
}

const Drawer = ({
  isOpen,
  children,
  className,
  onClose,
  title,
  styleClass,
  action,
  removeWhenClosed = true
}: DrawerProps) => {
  const bodyRef = useRef(document.body);
  const uuid = useId();
  const portalRootRef = useRef(document.getElementById(uuid) || createPortalRoot(uuid));
  const isTransitioning = useMountTransition(isOpen, 300);
  const locale = useLocale();

  const isRTL = isRtlLang(locale);

  // Append portal root on mount
  useEffect(() => {
    bodyRef.current.appendChild(portalRootRef.current);
    const portal = portalRootRef.current;
    const bodyEl = bodyRef.current;

    return () => {
      // Clean up the portal when drawer component unmounts
      portal.remove();
      // Ensure scroll overflow is removed
      bodyEl.style.overflow = "";
    };
  }, []);

  // Prevent page scrolling when the drawer is open
  useEffect(() => {
    const updatePageScroll = () => {
      if (isOpen) {
        bodyRef.current.style.overflow = "hidden";
      } else {
        bodyRef.current.style.overflow = "";
      }
    };

    updatePageScroll();
  }, [isOpen]);

  // Allow Escape key to dismiss the drawer
  useEffect(() => {
    const onKeyPress = (e: any) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keyup", onKeyPress);
    }

    return () => {
      window.removeEventListener("keyup", onKeyPress);
    };
  }, [isOpen, onClose]);

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden={isOpen ? "false" : "true"}
      className={cn("drawer-container", isOpen && "open", isTransitioning && "in", className)}
    >
      <div
        className={classNames(styleClass, "flex flex-col bg-white", isRTL ? "drawer--right" : "drawer--left")}
        role="dialog"
      >
        <div className="flex justify-between border-b border-gray-200 bg-white p-4">
          <Typography.Title
            size="sm"
            className="font-semibold"
            children={title}
          />
          <Button
            variant="solid"
            rounded="full"
            size="sm"
            color="gray"
            onPress={onClose}
            icon={
              <Icon>
                <XMarkIcon />
              </Icon>
            }
          />
        </div>
        {children}
        {action && <div className="mt-auto flex justify-between border-t border-gray-200 bg-white p-4">{action}</div>}
      </div>
      <div
        className="backdrop"
        onClick={onClose}
      />
    </div>,
    portalRootRef.current
  );
};

export { Drawer };
