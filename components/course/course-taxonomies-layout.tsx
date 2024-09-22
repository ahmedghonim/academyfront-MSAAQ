import EmptyCard from "@/app/[locale]/products/categories/[slug]/empty-card";
import { CourseTaxonomiesBreadcrumbs, CoursesSectionCard } from "@/components/course/index";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { AnyObject, Category, Course } from "@/types";

type Props = {
  taxonomy: Category;
  courses: APIFetchResponse<Course[]>;
  filters: AnyObject;
  title: string;
  emptyCardTitle: string;
};
const CourseTaxonomiesLayout = ({ taxonomy, courses, title, emptyCardTitle, filters }: Props) => {
  const isEmpty = courses.data.length === 0;

  return (
    <>
      <CourseTaxonomiesBreadcrumbs taxonomy={taxonomy} />
      {isEmpty ? (
        <EmptyCard title={emptyCardTitle} />
      ) : (
        <CoursesSectionCard
          title={title}
          initialFilters={filters}
          initialCourses={courses}
          columns={{
            md: 3
          }}
          className="p-0 lg:!p-6"
        />
      )}
    </>
  );
};

export default CourseTaxonomiesLayout;
