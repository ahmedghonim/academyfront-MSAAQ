"use client";

import { useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import { CertificateLibraryCard } from "@/components/library";
import { useInfiniteScroll } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchMemberCertificates } from "@/server-actions/services/member-service";
import { AnyObject, Certificate } from "@/types";

import { BookmarkIcon } from "@heroicons/react/24/outline";

import { Button, Grid } from "@msaaqcom/abjad";

interface Props {
  initialCertificates: APIFetchResponse<Certificate[]>;
  initialFilters: AnyObject;
}

const CertificatesListing = ({ initialCertificates, initialFilters }: Props) => {
  const t = useTranslations();
  const {
    data: certificates,
    canLoadMore,
    loadMore,
    isLoading
  } = useInfiniteScroll<Certificate>(initialCertificates, fetchMemberCertificates, initialFilters);

  if (!certificates.length) {
    return (
      <EmptyState
        className="mt-4"
        iconClassName="text-gray-700"
        title={t("empty_sections.no_certificates")}
        description={t("empty_sections.no_certificates_description")}
        icon={<BookmarkIcon />}
        actions={
          <Button
            href="/"
            className="w-full md:!w-auto"
            children={t("common.browse_academy")}
          />
        }
      />
    );
  }

  return (
    <>
      <Grid
        columns={{
          lg: 12,
          xl: 12,
          md: 12
        }}
        gap={{
          xs: "1rem",
          sm: "1rem",
          md: "1rem",
          lg: "1rem",
          xl: "1rem"
        }}
        className="mt-4"
      >
        {certificates.map((certificate: Certificate) => (
          <Grid.Cell
            key={certificate.course?.id ?? certificate.id}
            columnSpan={{
              lg: 4,
              md: 6
            }}
            className="h-full"
          >
            <CertificateLibraryCard certificate={certificate} />
          </Grid.Cell>
        ))}
      </Grid>
      <div className="mt-4 flex w-full justify-center">
        {canLoadMore && (
          <Button
            size="md"
            isLoading={isLoading}
            isDisabled={isLoading}
            onPress={loadMore}
            children={t("account.show_more")}
          />
        )}
      </div>
    </>
  );
};

export default CertificatesListing;
