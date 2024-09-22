import { Menu, MenuLocation } from "@/types";
import { chunkArray } from "@/utils/object";

import AppMenuItem from "./app-menu-item";

interface AppMenuProps {
  location: MenuLocation;
  className?: string;
  menu: Menu | undefined;
}

const AppMenu = ({ location, className, menu }: AppMenuProps) => {
  if (!menu) {
    return null;
  }

  if (location === "footer") {
    const chunk = chunkArray(menu.links, 3);

    return (
      <div className={className}>
        {chunk.map((links, index) => (
          <ul
            key={index}
            className="grid auto-rows-min grid-cols-1 items-start gap-2"
          >
            {links.map((link, index) => (
              <AppMenuItem
                key={index}
                link={link}
                location={location}
              />
            ))}
          </ul>
        ))}
      </div>
    );
  }

  return (
    <ul className={className}>
      {menu.links.map((link) => (
        <AppMenuItem
          location={location}
          link={link}
          key={link.id}
        />
      ))}
    </ul>
  );
};

export default AppMenu;
