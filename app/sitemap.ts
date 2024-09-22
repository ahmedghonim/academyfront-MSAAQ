import { MetadataRoute } from "next";

import fetchBaseQuery from "@/server-actions/config/base-query";

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchBaseQuery<
    Array<{
      loc: string;
      lastmod: string;
      changefreq: string;
      priority: string;
      url: string;
    }>
  >({
    url: "/sitemap.json",
    method: "GET"
  });

  if (!data.data || data.error) {
    return [];
  }

  return data.data.map((item) => ({
    url: item.url,
    lastModified: item.lastmod,
    changeFrequency: item.changefreq,
    priority: parseFloat(item.priority)
  })) as MetadataRoute.Sitemap;
}
