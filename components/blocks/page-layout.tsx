import { notFound } from "next/navigation";

import Page from "@/components/blocks/dynamic-page";
import BaseLayout from "@/components/layout/base-layout";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { fetchPage } from "@/server-actions/services/page-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject } from "@/types";
import { organizationJsonLd, webPageJsonLd, webSiteJsonLd } from "@/utils/jsonLd";

export default async function PageLayout({ params }: { params: AnyObject }) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const page = await fetchPage(params.slug);

  if (!page) {
    notFound();
  }
  const jsonLd =
    params.slug === "home"
      ? {
          "@context": "https://schema.org",
          "@graph": [organizationJsonLd("/", tenant), webSiteJsonLd(tenant)]
        }
      : {
          "@context": "https://schema.org",
          "@graph": [
            organizationJsonLd(`/${page.slug}`, tenant),
            webPageJsonLd(page, `/${page.slug}`, tenant),
            webSiteJsonLd(tenant)
          ]
        };

  const className = ["page", !page.slug ? "page-home" : "", `page-${page.id}`].join(" ");

  if (page.mode === "blank") {
    return (
      <RootLayout
        params={params}
        className={className}
      >
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd)
            }}
          />
        )}
        <Page page={page} />
      </RootLayout>
    );
  }

  return (
    <RootLayout
      params={params}
      className={className}
    >
      <BaseLayout
        renderHeader={() => (page.mode !== "body" ? <Header className="mb-0" /> : null)}
        renderFooter={() => (page.mode !== "body" ? <Footer className="!mt-0" /> : null)}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd)
            }}
          />
        )}
        <Page page={page} />
      </BaseLayout>
    </RootLayout>
  );
}
