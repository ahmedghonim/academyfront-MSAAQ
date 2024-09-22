import { CategoryType, ProductType } from "@/types";

export enum MenuLinkType {
  URL = "url",
  COURSE = "course",
  PRODUCT = "product",
  PAGE = "page",
  TAXONOMY = "taxonomy",
  POST = "post"
}

export type MenuLink = {
  id: number;
  title: string;
  type: MenuLinkType;
  value: string;
  url: string;
  new_tab: boolean;
  item?: {
    id: number;
    slug: string;
    type: ProductType | CategoryType | null | "article";
  };
  children: Omit<MenuLink, "children">[];
};
