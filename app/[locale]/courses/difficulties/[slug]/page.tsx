import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { CourseTaxonomiesLayout } from "@/components/course";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { fetchCourses } from "@/server-actions/services/course-service";
import { fetchTaxonomy } from "@/server-actions/services/taxonomy-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { breadcrumbListJsonLd, courseJsonLd, searchActionJsonLd } from "@/utils/jsonLd";

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata | null> {
  const data = await fetchTenant();
  const taxonomy = await fetchTaxonomy(slug);

  if (!data || !taxonomy) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: `/courses/difficulties/${slug}`,
    title: t("common.taxonomy_courses", {
      taxonomy: taxonomy.name
    }) as string
  });
}

export default async function Page({ params }: { params: AnyObject }) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const taxonomy = await fetchTaxonomy(params.slug);

  if (!taxonomy) {
    notFound();
  }

  const filters = {
    limit: 12,
    filters: {
      difficulty: params.slug as string
    },
    page: 1
  };

  const courses = await fetchCourses(filters);

  const t = await getTranslations();

  return (
    <RootLayout params={params}>
      <BaseLayout
        className={`course-difficulty-${taxonomy.id}`}
        renderHeader={() => <Header />}
        renderFooter={() => <Footer />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: t("common.taxonomy_courses", {
                taxonomy: taxonomy.name
              }) as string,
              description: taxonomy.description || undefined,
              url: `https://${tenant.domain}/courses/difficulties/${taxonomy.slug}`,
              breadcrumb: breadcrumbListJsonLd([
                { name: t("common.section_titles_home_page"), id: `https://${tenant.domain}` },
                {
                  name: t("common.section_titles_courses"),
                  id: `https://${tenant.domain}/courses`
                },
                {
                  name: taxonomy.name as string,
                  id: `https://${tenant.domain}/courses/difficulties/${taxonomy.slug}`
                }
              ]),
              mainEntity:
                courses.data && courses.data?.length > 0
                  ? {
                      "@type": "ItemList",
                      itemListElement: courses.data?.map((course, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        item: courseJsonLd(course, tenant)
                      }))
                    }
                  : undefined,
              potentialAction: searchActionJsonLd(tenant)
            })
          }}
        />
        <Container>
          <CourseTaxonomiesLayout
            emptyCardTitle={t("empty_sections.no_courses")}
            title={
              t("common.taxonomy_courses", {
                taxonomy: taxonomy.name
              }) as string
            }
            taxonomy={taxonomy}
            courses={courses}
            filters={filters}
          />
        </Container>
      </BaseLayout>
    </RootLayout>
  );
}
