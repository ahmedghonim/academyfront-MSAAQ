"use client";

import { useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import { CoachingSessionLibraryCard } from "@/components/library";
import { RateProductModal } from "@/components/modals";
import { useInfiniteScroll } from "@/hooks";
import { useAppSelector } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchMemberAppointments } from "@/server-actions/services/member-service";
import { CourseSliceStateType } from "@/store/slices/courses-slice";
import { AnyObject, Appointment, Product } from "@/types";

import { BookmarkIcon } from "@heroicons/react/24/outline";

import { Button, Grid } from "@msaaqcom/abjad";

interface Props {
  initialData: APIFetchResponse<Appointment[]>;
  initialFilters: AnyObject;
}

const CoachingSessionsListing = ({ initialData, initialFilters }: Props) => {
  const t = useTranslations();
  const { productToReview } = useAppSelector<CourseSliceStateType>((state) => state.courses);

  const {
    data: sessions,
    canLoadMore,
    loadMore,
    isLoading
  } = useInfiniteScroll<Appointment>(initialData, fetchMemberAppointments, initialFilters);

  if (!sessions.length) {
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
        {sessions.map((appointment: Appointment, i: number) => (
          <Grid.Cell
            key={i}
            columnSpan={{
              lg: 4,
              md: 6
            }}
            className="h-full"
          >
            <CoachingSessionLibraryCard appointment={appointment} />
          </Grid.Cell>
        ))}
      </Grid>
      {canLoadMore && (
        <div className="mt-4 flex w-full justify-center">
          <Button
            size="md"
            isLoading={isLoading}
            isDisabled={isLoading}
            onPress={loadMore}
            children={t("account.show_more")}
          />
        </div>
      )}
      <RateProductModal
        product={productToReview as Product}
        title={t("reviews.review_session")}
        callback={() => {
          //TODO:update reviews list after review from Products page
        }}
      />
    </>
  );
};

export default CoachingSessionsListing;
