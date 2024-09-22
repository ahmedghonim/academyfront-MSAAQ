import { Article as ArticleSchema } from "schema-dts";

import { Academy, Article } from "@/types";

function articleJsonLd(article: Article | null, tenant?: Academy): ArticleSchema {
  if (!article || !tenant) {
    return {} as ArticleSchema;
  }

  return {
    "@id": `https://${tenant?.domain}/blog/${article.slug}`,
    url: `https://${tenant?.domain}/blog/${article.slug}`,
    "@type": "Article",
    image: article.thumbnail || undefined,
    thumbnailUrl: article.thumbnail || undefined,
    headline: article.title,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    description: article.meta_description || "",
    keywords: article.meta_keywords?.length > 0 ? article.meta_keywords?.join(", ") : undefined,
    author: article.created_by
      ? [
          {
            "@type": "Person",
            name: article.created_by.name,
            url: `https://${tenant.domain}/@${article.created_by.username ?? article.created_by.uuid}`
          }
        ]
      : undefined,
    publisher: {
      "@type": "Organization",
      name: tenant.title,
      logo: tenant.logo || tenant.favicon || undefined,
      url: `https://${tenant.domain}`
    }
  } as ArticleSchema;
}

export default articleJsonLd;
