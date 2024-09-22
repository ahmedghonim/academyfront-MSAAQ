import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { OtherArticles } from "@/components/article";
import { Comments } from "@/components/comments";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { ProductSectionCard } from "@/components/product";
import { CommentsStoreProvider } from "@/providers/comments-store-provider";
import fetchBaseQuery from "@/server-actions/config/base-query";
import { fetchArticle, fetchArticleComments, fetchArticles } from "@/server-actions/services/article-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { Comment } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { articleJsonLd, breadcrumbListJsonLd } from "@/utils/jsonLd";

import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import AuthorCard from "./author-card";
import Breadcrumbs from "./breadcrumbs";

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata | null> {
  const data = await fetchTenant();
  const article = await fetchArticle(slug);

  if (!data || !article) {
    return null;
  }

  return generateCommonMetadata({
    tenant: data,
    asPath: `/blog/${slug}`,
    title: article.title,
    description: article.meta_description,
    keywords: article.meta_keywords,
    image: article.thumbnail
  });
}

export default async function Page({
  params: { locale, slug }
}: {
  params: {
    locale: string;
    slug: string;
  };
}) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const article = await fetchArticle(slug);

  if (!article) {
    notFound();
  }

  const comments = await fetchArticleComments({ slug });

  const articles = await fetchArticles({
    limit: 3,
    filters: {
      exclude: slug as string
    }
  });

  const createCommentAction = async ({ content }: { content: string }) => {
    return await fetchBaseQuery<Comment>({
      url: `/articles/${slug}/comments`,
      method: "POST",
      body: {
        content
      }
    });
  };

  const createCommentReplayAction = async ({
    content,
    comment_id
  }: {
    content: string;
    comment_id: string | number;
  }) => {
    return await fetchBaseQuery<Comment>({
      url: `/articles/${slug}/comments/${comment_id}/replies`,
      method: "POST",
      body: {
        content
      }
    });
  };

  const updateCommentAction = async ({ content, comment_id }: { content: string; comment_id: string | number }) => {
    return await fetchBaseQuery<Comment>({
      url: `/articles/${slug}/comments/${comment_id}`,
      method: "POST",
      params: {
        _method: "PATCH"
      },
      body: {
        content
      }
    });
  };

  const deleteCommentAction = async ({ id }: { id: string | number }) => {
    return await fetchBaseQuery<Comment>({
      url: `/articles/${slug}/comments/${id}`,
      method: "POST",
      params: {
        _method: "DELETE"
      }
    });
  };

  const t = await getTranslations("common");

  return (
    <BaseLayout
      className={`blog-single blog-${article?.id}`}
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderMobileNavigation={() => <MobileNavigation />}
    >
      <Container className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  breadcrumbListJsonLd([
                    {
                      name: t("section_titles_home_page"),
                      id: `https://${tenant.domain}`
                    },
                    {
                      name: t("section_titles_blog"),
                      id: `https://${tenant.domain}/blog`
                    },
                    {
                      name: article?.title,
                      id: `https://${tenant.domain}/blog/${article.slug}`
                    }
                  ]),
                  articleJsonLd(article, tenant)
                ]
              })
            }}
          />
          <Breadcrumbs title={article.title} />
          <div className="flex flex-col gap-4 lg:gap-8">
            <AuthorCard article={article} />
            <div className="abjad-card relative box-border flex h-auto flex-col rounded-3xl border-0 border-gray-300 bg-gray-100">
              <div className="abjad-card-body p-6">
                <div
                  className="prose prose-sm prose-stone sm:prose-base lg:prose-lg [&_iframe]:h-48 [&_iframe]:max-w-full sm:[&_iframe]:h-64 md:[&_iframe]:h-64 lg:[&_iframe]:h-80"
                  dangerouslySetInnerHTML={{
                    __html: article.content
                  }}
                />
              </div>
            </div>
            <ProductSectionCard
              align="center"
              vertical
              title={t("comments")}
              icon={<ChatBubbleLeftRightIcon />}
              children={
                <CommentsStoreProvider
                  comments={comments.data}
                  createComment={createCommentAction}
                  createCommentReplay={createCommentReplayAction}
                  updateComment={updateCommentAction}
                  deleteComment={deleteCommentAction}
                >
                  <Comments />
                </CommentsStoreProvider>
              }
              hasDivider
              dividerPosition="top"
              className="!py-12 md:!px-8"
            />
            <OtherArticles articles={articles?.data || null} />
          </div>
        </div>
      </Container>
    </BaseLayout>
  );
}
