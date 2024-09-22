"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { AnyObject } from "yup";

import { CoursesSectionCard } from "@/components/course";
import {
  CourseDifficultiesFilter,
  CourseDurationFilter,
  PriceFilter,
  ProductFilters,
  RatingFilter,
  TaxonomiesFilter
} from "@/components/filters";
import { useDynamicSearchParams } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { Course } from "@/types";

import { ChevronUpIcon, FunnelIcon } from "@heroicons/react/24/outline";

import { Card, Collapse, Grid, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

type Props = {
  initialCourses: APIFetchResponse<Course[]>;
  initialFilters: AnyObject;
};
const CoursesListing = ({ initialCourses, initialFilters }: Props) => {
  const t = useTranslations();

  const [filters, setFilters] = useState<AnyObject>(initialFilters);
  const { set } = useDynamicSearchParams();

  const handleFilter = () => {
    set({ filters }, "all");
  };

  const Filters = () => (
    <ProductFilters
      filters={filters}
      setFilters={setFilters}
      handleFilter={handleFilter}
    >
      {(handleParams, handleCheckboxInput) => (
        <>
          <RatingFilter
            onChange={(value) => {
              setFilters((prev: any) => {
                return { ...prev, rating: value };
              });
            }}
            defaultValue={filters?.rating}
          />

          <CourseDurationFilter
            onChange={(checked, value, key) => handleParams(checked, value, key)}
            checked={(value) => handleCheckboxInput("duration", value)}
          />
          <TaxonomiesFilter
            onChange={(checked, value, key) => handleParams(checked, value, key)}
            checked={(value) => handleCheckboxInput("category", value)}
          />
          <PriceFilter
            onChange={(checked, value, key) => handleParams(checked, value, key)}
            checked={(value) => handleCheckboxInput("price", value)}
          />
          <CourseDifficultiesFilter
            onChange={(checked, value, key) => handleParams(checked, value, key)}
            checked={(value) => handleCheckboxInput("difficulty", value)}
          />
        </>
      )}
    </ProductFilters>
  );

  return (
    <Card
      id="all"
      className="bg-gray-100 lg:!border-none lg:!bg-transparent"
    >
      <Card.Body className="lg:!p-0">
        <Grid
          columns={{
            xl: 4,
            lg: 6
          }}
        >
          <Grid.Cell columnSpan={{ xl: 1, lg: 2 }}>
            <div className="hidden lg:!block">
              <Filters />
            </div>
            <Collapse className="mb-4 block rounded-2xl border border-gray-400 bg-white lg:!hidden">
              {({ isOpen }) => (
                <>
                  <Collapse.Button>
                    <div className="flex flex-grow flex-row items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex flex-col items-start">
                          <Typography.Text
                            size="sm"
                            className="line-clamp-1 font-bold"
                            children={
                              <div className="flex items-center gap-2">
                                <Icon
                                  color="gray"
                                  variant="soft"
                                >
                                  <FunnelIcon />
                                </Icon>
                                <Typography.Body
                                  as="p"
                                  size="md"
                                  children={t("common.filter")}
                                />
                              </div>
                            }
                          />
                        </div>
                      </div>
                      <Icon
                        size="sm"
                        variant="soft"
                        color="gray"
                      >
                        <ChevronUpIcon
                          className={cn(
                            "transition-all duration-300 ease-in-out",
                            !isOpen ? "rotate-180 transform" : ""
                          )}
                        />
                      </Icon>
                    </div>
                  </Collapse.Button>
                  <Collapse.Content className="mt-2 gap-3 p-4">
                    <Filters />
                  </Collapse.Content>
                </>
              )}
            </Collapse>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xl: 3, lg: 4 }}>
            <CoursesSectionCard
              initialFilters={{
                limit: 10,
                filters
              }}
              initialCourses={initialCourses}
              columns={{
                md: 2
              }}
              className="p-0 lg:!p-6"
            />
          </Grid.Cell>
        </Grid>
      </Card.Body>
    </Card>
  );
};

export default CoursesListing;
