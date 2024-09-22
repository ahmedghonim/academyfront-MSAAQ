"use client";

import { useTranslations } from "next-intl";

import { useDynamicSearchParams } from "@/hooks";

import { FunnelIcon } from "@heroicons/react/24/outline";

import { Button, Dropdown, Icon } from "@msaaqcom/abjad";

const FiltersDropdown = ({ filter }: { filter?: "past" | "upcoming" }) => {
  const t = useTranslations();
  const { set } = useDynamicSearchParams();

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button
          color="gray"
          icon={
            <Icon size="md">
              <FunnelIcon />
            </Icon>
          }
        />
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Item
          className={filter === "upcoming" ? "bg-gray-200" : ""}
          onClick={() => {
            set({
              filter: "upcoming"
            });
          }}
          children={t("account.session_status_upcoming")}
        />
        <Dropdown.Divider />
        <Dropdown.Item
          className={filter === "past" ? "bg-gray-200" : ""}
          onClick={() => {
            set({
              filter: "past"
            });
          }}
          children={t("account.session_status_past")}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FiltersDropdown;
