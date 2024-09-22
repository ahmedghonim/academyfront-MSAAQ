import { MenuLink, MenuLocation } from "@/types";

import AppMenuDropdown from "./app-menu-dropdown";
import AppMenuLink from "./app-menu-link";

interface AppMenuItemProps {
  link: MenuLink;
  location: MenuLocation;
}

const AppMenuItem = ({ link, location }: AppMenuItemProps) => {
  return (
    <li>
      {link.children.length ? (
        <AppMenuDropdown
          location={location}
          link={link}
        />
      ) : (
        <AppMenuLink
          location={location}
          link={link}
        />
      )}
    </li>
  );
};

export default AppMenuItem;
