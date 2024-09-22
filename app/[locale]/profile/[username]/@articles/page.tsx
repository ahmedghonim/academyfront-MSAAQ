import { fetchArticles } from "@/server-actions/services/article-service";
import { AnyObject } from "@/types";

import ArticlesList from "../_lists/articles-list";

export default async function Page({ params }: { params: AnyObject }) {
  const filters = {
    page: 1,
    limit: 3,
    filters: {
      author: params.username as string
    }
  };

  const articles = await fetchArticles(filters);

  if (!articles || !articles.data.length) {
    return null;
  }

  return (
    <ArticlesList
      initialArticles={articles}
      initialFilters={filters}
    />
  );
}
