import { ProgressBarLink } from "@/providers/progress-bar";
import { MenuLink, MenuLocation } from "@/types";

import { ChevronUpIcon } from "@heroicons/react/24/outline";

import { Dropdown, Icon, Typography } from "@msaaqcom/abjad";

interface AppMenuILinkProps {
  link: MenuLink;
  location: MenuLocation;
}

const AppMenuDropdown = ({ link, location }: AppMenuILinkProps) => {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Typography.Body
          as="button"
          size="base"
          className={
            location == "header"
              ? "flex items-center gap-3 rounded-full px-6 py-2 font-medium text-gray-700 hover:bg-gray-300 hover:text-gray-900"
              : "flex items-center gap-3 px-3 py-2 font-medium text-primary hover:text-primary-600"
          }
        >
          {link.title}
          <Icon size="sm">
            <ChevronUpIcon />
          </Icon>
        </Typography.Body>
      </Dropdown.Trigger>
      <Dropdown.Menu className="!z-[1000] !min-w-[170px]">
        {link.children.map((child) => (
          <Dropdown.Item
            key={child.id}
            as="div"
            className="block px-4 py-1"
            children={
              <>
                <ProgressBarLink
                  className="w-full"
                  href={child.url ?? "#"}
                  target={link.new_tab ? "_blank" : "_self"}
                >
                  {child.title}
                </ProgressBarLink>
              </>
            }
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AppMenuDropdown;
