"use client";

import { useTranslations } from "next-intl";

import { Card, Tab, Tabs } from "@msaaqcom/abjad";

import LoginData from "./login-data";
import PersonalData from "./personal-data";

const AccountData = () => {
  const t = useTranslations();

  return (
    <Card className="mb-10 border-0 md:!border">
      <Card.Body className="p-0 pt-4 md:!p-4">
        <Tabs
          aria-label="Profile tabs"
          classNames={{
            panel: "mt-8"
          }}
          defaultSelectedKey="personal-data"
        >
          <Tab
            key="personal-data"
            title={t("profile.personal_data_title")}
          >
            <PersonalData />
          </Tab>
          <Tab
            key="account-data"
            title={t("profile.login_data_title")}
          >
            <LoginData />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default AccountData;
