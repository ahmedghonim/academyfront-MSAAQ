import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { MarketProvider } from "@/providers/store-market-provider";
import { fetchCourses } from "@/server-actions/services/course-service";
import { fetchTaxonomies } from "@/server-actions/services/taxonomy-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject, Course } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { breadcrumbListJsonLd, courseJsonLd } from "@/utils/jsonLd";

import Breadcrumbs from "./breadcrumbs";
import CoursesListing from "./courses-listing";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations("common");

  return generateCommonMetadata({
    tenant: data,
    asPath: "/courses",
    title: t("section_titles_courses")
  });
}

export default async function Page({
  params,
  searchParams
}: {
  params: AnyObject;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }
  type NestedObject = { [key: string]: any };

  const { hasOwnProperty } = Object.prototype;

  function unflatten(obj: { [key: string]: any }): NestedObject {
    const result: NestedObject = {};

    for (const key in obj) {
      if (!hasOwnProperty.call(obj, key)) {
        continue;
      }

      const keys = key.replace(/\]/g, "").split(/\[/);
      let current = result;

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          if (Array.isArray(current)) {
            current.push(obj[key]);
          } else {
            current[k] = obj[key];
          }
        } else {
          if (!current[k]) {
            current[k] = isNaN(Number(keys[index + 1])) ? {} : [];
          }
          current = current[k];
        }
      });
    }

    return result;
  }

  const courses = await fetchCourses({
    limit: 10,
    ...searchParams
  });

  const taxonomies = await fetchTaxonomies({
    filters: {
      type: "course_category"
    }
  });

  const difficulties = await fetchTaxonomies({
    filters: {
      type: "course_difficulty"
    }
  });

  const t = await getTranslations();

  return (
    <RootLayout
      className="courses-page"
      params={params}
    >
      <BaseLayout
        renderHeader={() => <Header />}
        renderFooter={() => <Footer />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                breadcrumbListJsonLd([
                  {
                    name: t("common.section_titles_home_page"),
                    id: `https://${tenant?.domain}`
                  },
                  { name: t("common.all_courses"), id: `https://${tenant?.domain}/courses` }
                ]),
                ...[
                  courses.data && courses.data.length > 0
                    ? {
                        "@type": "ItemList",
                        itemListElement: courses.data?.map((course: Course, index) => ({
                          "@type": "ListItem",
                          position: index + 1,
                          item: courseJsonLd(course, tenant)
                        }))
                      }
                    : {}
                ]
              ]
            })
          }}
        />
        <Container>
          <Breadcrumbs />
          <h1 className="mb-8 text-4xl font-bold text-black">{t("store.all_courses")}</h1>
          <div className="grid gap-8">
            <MarketProvider
              difficulties={difficulties?.data}
              taxonomies={taxonomies?.data}
            >
              <CoursesListing
                initialCourses={courses}
                initialFilters={unflatten(searchParams).filters}
              />
            </MarketProvider>
          </div>
        </Container>
      </BaseLayout>
    </RootLayout>
  );
}
