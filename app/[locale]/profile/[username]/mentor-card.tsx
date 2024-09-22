"use client";

import { useTranslations } from "next-intl";

import { ProductSectionCard } from "@/components/product";
import { SocialLinks } from "@/components/social-links";
import { Mentor } from "@/types";
import transWithCount from "@/utils/trans-with-count";

import { InformationCircleIcon, UsersIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

import { Avatar, Card, Grid, Icon, Title, Typography } from "@msaaqcom/abjad";

const MentorCard = ({ mentor, totalCourses }: { mentor: Mentor; totalCourses: number }) => {
  const t = useTranslations();

  return (
    <Card className="instructor-card border-0 bg-gray-100">
      <Card.Body className="instructor-card-body grid gap-4">
        <Grid
          columns={{
            md: 10,
            sm: 1
          }}
          gap={{
            xs: "1rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1rem"
          }}
          className="instructor-grid"
        >
          <Grid.Cell
            columnSpan={{
              md: 4
            }}
            className="instructor-profile-cell"
          >
            <Title
              className="instructor-profile h-full rounded-2xl bg-white p-4"
              prepend={
                <Avatar
                  size="xl"
                  imageUrl={mentor?.avatar}
                  name={mentor?.name ?? ""}
                  className="instructor-avatar"
                />
              }
              title={
                <Typography.Body
                  size="base"
                  className="instructor-name font-medium"
                >
                  {mentor?.name}
                </Typography.Body>
              }
              subtitle={
                <div className="instructor-info flex flex-col space-y-4">
                  {mentor?.education && (
                    <Typography.Body
                      size="md"
                      className="instructor-education font-normal text-gray-700"
                      children={mentor?.education}
                    />
                  )}
                  <div className="instructor-social-links flex items-center gap-2">
                    {mentor?.social_links && <SocialLinks links={mentor.social_links} />}
                  </div>
                </div>
              }
            />
          </Grid.Cell>
          <Grid.Cell
            columnSpan={{
              md: 3
            }}
            className="instructor-students-cell"
          >
            <Card className="instructor-student-stats border-1.5 bg-gray-100">
              <Card.Body className="flex flex-col items-start">
                <Icon
                  rounded="full"
                  size="xs"
                  color="primary"
                  variant="solid"
                  className="instructor-student-icon mb-4"
                >
                  <UsersIcon />
                </Icon>
                <Typography.Text
                  size="md"
                  children={t(transWithCount("students.WithCount", mentor?.enrollments), {
                    count: mentor?.enrollments
                  })}
                  className="instructor-students-count font-semibold"
                />
                <Typography.Text
                  size="xs"
                  children={t("instructors.student_count")}
                  className="instructor-students-label text-gray-700"
                />
              </Card.Body>
            </Card>
          </Grid.Cell>
          <Grid.Cell
            columnSpan={{
              md: 3
            }}
            className="instructor-courses-cell"
          >
            <Card className="instructor-course-stats border-1.5 bg-gray-100">
              <Card.Body className="flex flex-col items-start">
                <Icon
                  rounded="full"
                  size="xs"
                  color="primary"
                  variant="solid"
                  className="instructor-course-icon mb-4"
                >
                  <VideoCameraIcon />
                </Icon>
                <Typography.Text
                  size="md"
                  children={t(transWithCount("common.courses_count_WithCount", totalCourses), { count: totalCourses })}
                  className="instructor-courses-count font-semibold"
                />
                <Typography.Text
                  size="xs"
                  children={t("instructors.course_count")}
                  className="instructor-course-label text-gray-700"
                />
              </Card.Body>
            </Card>
          </Grid.Cell>
        </Grid>
        {mentor?.bio && (
          <ProductSectionCard
            title={t("instructors.about_trainer")}
            icon={<InformationCircleIcon />}
            children={
              <Typography.Body
                as="p"
                className="instructor-bio font-normal text-gray-700"
                children={mentor?.bio}
              />
            }
            className="instructor-bio-section bg-white"
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default MentorCard;
