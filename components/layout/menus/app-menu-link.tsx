import { useIsRouteActive } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import { MenuLink, MenuLocation } from "@/types";

import { Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface AppMenuILinkProps {
  link: MenuLink;
  location: MenuLocation;
}

const AppMenuLink = ({ link, location }: AppMenuILinkProps) => {
  const { isActive } = useIsRouteActive();

  return (
    <Typography.Body
      as={ProgressBarLink}
      size="base"
      href={link.url ?? "#"}
      target={link.new_tab ? "_blank" : "_self"}
      className={
        location == "header"
          ? cn(
              "block rounded-full px-6 py-2 font-medium text-gray-700",
              isActive(link.url) ? "bg-gray-300 text-gray-900" : "hover:bg-gray-300 hover:text-gray-900"
            )
          : cn("block px-3 py-2 font-medium text-primary", isActive(link.url) ? "" : "hover:text-primary-600")
      }
    >
      {link.title}
    </Typography.Body>
  );
};

export default AppMenuLink;
