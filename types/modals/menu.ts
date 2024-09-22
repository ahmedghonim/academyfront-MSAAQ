import { MenuLink } from "@/types";

export type MenuLocation = "header" | "footer";
export type MenuLocationsArray = MenuLocation[];

export type Menu = {
  id: number;
  name: string;
  location: MenuLocationsArray;
  links: MenuLink[];
  updated_at: string;
  created_at: string;
};
