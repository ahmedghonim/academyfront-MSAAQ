"use client";

import { useTranslations } from "next-intl";

import { Instructor } from "@/types";

import { DocumentTextIcon } from "@heroicons/react/24/outline";

import { Avatar, Button, Icon, Title, Typography } from "@msaaqcom/abjad";

const Consultants = ({ consultants }: { consultants?: Array<Instructor> }) => {
  const t = useTranslations();

  if (!consultants) return null;

  return (
    <>
      {consultants.map((user) => (
        <div
          key={user.id}
          className="mb-4 flex flex-col items-start justify-between rounded-lg bg-white px-6 py-4 last:mb-0 md:!flex-row md:!items-center"
        >
          <Title
            prepend={
              <Avatar
                size="lg"
                imageUrl={user.avatar}
                name={user.name}
              />
            }
            title={
              <>
                <Typography.Body
                  as="h6"
                  size="base"
                  className="ms-2 font-medium"
                >
                  {user.name}
                </Typography.Body>
              </>
            }
            subtitle={
              user.bio && (
                <>
                  <Typography.Body
                    size="md"
                    className="me-4 ms-2 font-normal text-gray-700"
                    children={user.bio}
                  />
                </>
              )
            }
          />
          <Button
            color="gray"
            className="hidden md:!block"
            href={`/@${user.username ?? user.uuid}`}
            icon={
              <Icon>
                <DocumentTextIcon />
              </Icon>
            }
          />
          <Button
            color="gray"
            className="mt-3 block w-full text-center md:!hidden"
            href={`/@${user.username ?? user.uuid}`}
            children={t("sessions.view_profile")}
          />
        </div>
      ))}
    </>
  );
};

export default Consultants;
