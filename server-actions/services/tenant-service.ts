import { Academy, AppSlug, CategoryType, IpInfo, MenuLink, MenuLinkType, ProductType } from "@/types";

import fetchBaseQuery from "../config/base-query";
import { tags } from "../config/tags";
import { getTenantHost } from "../config/utils";

const resolveURL = (link: MenuLink | Omit<MenuLink, "children">): string => {
  if (!link.item) {
    if (link.value) {
      return link.value;
    }

    switch (link.type) {
      case MenuLinkType.COURSE:
        return "/courses";
      case MenuLinkType.PRODUCT:
        return "/products";
      case MenuLinkType.POST:
        return "/blog";
      case MenuLinkType.PAGE:
      case MenuLinkType.TAXONOMY:
      default:
        return "/";
    }
  }

  switch (link.type) {
    case MenuLinkType.URL:
      return link.value || "/";
    case MenuLinkType.COURSE:
      return link.item.slug ? `/courses/${link.item.slug}` : "/courses";
    case MenuLinkType.PRODUCT:
      if (!link.item) {
        return "/products";
      }

      const productPaths = {
        [ProductType.BUNDLE]: `/bundles/${link.item.slug}`,
        [ProductType.COACHING_SESSION]: `/coaching-sessions/${link.item.slug}`,
        [ProductType.DIGITAL]: `/products/${link.item.slug}`
      };

      //@ts-expect-error
      return productPaths[link.item.type] || "/products";
    case MenuLinkType.PAGE:
      return link.item.slug ? `/${link.item.slug}` : "/";
    case MenuLinkType.TAXONOMY:
      if (!link.item) {
        return "/";
      }

      const taxonomyPaths = {
        [CategoryType.COURSE_CATEGORY]: `/courses/categories/${link.item.slug}`,
        [CategoryType.COURSE_DIFFICULTY]: `/courses/difficulties/${link.item.slug}`,
        [CategoryType.POST_CATEGORY]: `/blog/categories/${link.item.slug}`,
        [CategoryType.PRODUCT_CATEGORY]: `/products/categories/${link.item.slug}`
      };

      //@ts-expect-error
      return taxonomyPaths[link.item.type] || "/";
    case MenuLinkType.POST:
      return link.item.slug ? `/blog/${link.item.slug}` : "/blog";
    default:
      return "/";
  }
};

export async function fetchTenant() {
  const host = getTenantHost();
  const data = await fetchBaseQuery<Academy>({
    url: "",
    method: "GET",
    tags: [tags.fetchTenant(host)]
  });

  return {
    ...data.data,
    menus: data.data.menus.map((menu) => ({
      ...menu,
      links: menu.links.map((link): any => {
        if (link.children.length) {
          return {
            ...link,
            children: link.children.map((childLink) => {
              let url = resolveURL(childLink);

              return { ...childLink, url };
            })
          };
        }
        let url = resolveURL(link);

        return { ...link, url };
      })
    })),
    msaaqpay_enabled: !!data.data.apps.find((app) => app.slug === AppSlug.Msaaqpay),
    multi_lang_enabled: data.data.supported_locales ? data.data.supported_locales.length > 1 : false
  } as Academy;
}

export async function fetchIpInfo() {
  const port = process.env.PORT || process.env.APP_PORT || process.env.NEXT_PUBLIC_APP_PORT || 3000;

  const response = await fetchBaseQuery<IpInfo>({
    url: `http://localhost:${port}/api/v1/ip-info`,
    method: "GET",
    cache: "no-store"
  });

  return response.data;
}
