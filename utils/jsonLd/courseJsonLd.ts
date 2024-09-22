import { Course as CourseSchema } from "schema-dts";

import { Academy, Course } from "@/types";

function courseJsonLd(
  course: Course | null | undefined,
  tenant: Academy | undefined,
  ratingValue?: number | undefined,
  reviewCount?: number | undefined
): CourseSchema {
  if (!course || !tenant) {
    return {} as CourseSchema;
  }

  return {
    "@type": "Course",
    "@id": `https://${tenant.domain}/courses/${course.slug}`,
    url: `https://${tenant.domain}/courses/${course.slug}`,
    name: course.title,
    description: course.summary || course.description || course.meta_description || "",
    keywords: course.meta_keywords.length > 0 ? course.meta_keywords?.join(", ") : undefined,
    coursePrerequisites: course.requirements.length > 0 ? course.requirements : undefined,
    thumbnailUrl: course.thumbnail || undefined,
    educationalLevel: course.difficulty
      ? {
          "@type": "DefinedTerm",
          name: course.difficulty.name,
          url: `https://${tenant.domain}/courses/difficulties/${course.difficulty.slug}`
        }
      : undefined,
    courseCode: course.slug,
    totalHistoricalEnrollment: course.enrollments_count,
    assesses: course.outcomes.length > 0 ? course.outcomes : undefined,
    inLanguage: tenant.locale,
    timeRequired: `PT${course.duration}S`,
    dateCreated: course.created_at,
    dateModified: course.updated_at,
    datePublished: course.publish_at,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: `PT${course.duration}S`
    },
    genre: course.category ? course.category.name : undefined,
    syllabusSections:
      course.chapters && course.chapters.length > 0
        ? course.chapters.map((chapter) => ({
            "@type": "Syllabus",
            name: chapter.title
          }))
        : undefined,
    creator:
      course.settings && course.settings.show_content_instructor
        ? course.instructors?.map((instructor) => ({
            "@type": "Person",
            name: instructor.name
          }))
        : undefined,
    provider: {
      "@type": "Organization",
      name: tenant.title,
      description: tenant.meta_description || undefined,
      keywords: tenant.meta_keywords.length > 0 ? tenant.meta_keywords : undefined,
      logo: tenant.logo || tenant.favicon || undefined,
      url: `https://${tenant.domain}`
    },
    publisher: {
      "@type": "Organization",
      name: tenant.title,
      image: tenant.logo || tenant.favicon || undefined,
      url: `https://${tenant.domain}`
    },
    isAccessibleForFree: course.price === 0,
    offers: {
      "@type": "AggregateOffer",
      category: course.price === 0 ? "Free" : "Paid",
      availability: course.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceCurrency: tenant.currency,
      highPrice: course.sales_price ? course.sales_price / 100 : course.price ? course.price / 100 : 0,
      lowPrice: course.price ? course.price / 100 : 0
    },
    educationalCredentialAwarded:
      course.settings && course.settings.certificate_enabled
        ? {
            "@type": "EducationalOccupationalCredential",
            name: course.title,
            credentialCategory: "certificate"
          }
        : undefined,
    aggregateRating:
      ratingValue && reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: ratingValue,
            reviewCount: reviewCount
          }
        : undefined
  } as CourseSchema;
}

export default courseJsonLd;
