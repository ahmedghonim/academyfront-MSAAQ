import { fetchCourses } from "@/server-actions/services/course-service";
import { AnyObject } from "@/types";

import CoursesList from "../_lists/courses-list";

export default async function Page({ params }: { params: AnyObject }) {
  const filters = {
    page: 1,
    limit: 3,
    filters: {
      instructor: params.username as string
    }
  };

  const courses = await fetchCourses(filters);

  if (!courses || !courses.data.length) {
    return null;
  }

  return (
    <CoursesList
      initialCourses={courses}
      initialFilters={filters}
    />
  );
}
