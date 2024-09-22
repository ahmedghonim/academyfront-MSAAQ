"use client";

import { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { useIsRouteActive } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import { useSession } from "@/providers/session-provider";

import { Card, Navbar } from "@msaaqcom/abjad";

interface Props {
  children: ReactNode;
}

const WalletTabs = ({ children }: Props) => {
  const t = useTranslations();
  const { isActive } = useIsRouteActive();
  const { member } = useSession();

  return (
    <Card className="mb-10 border-0 md:!border">
      <Card.Body className="px-0 md:!p-4">
        <Navbar
          aria-label="Tabs example"
          classNames={{
            base: "mb-6"
          }}
        >
          {member?.is_affiliate_open && (
            <>
              <Navbar.Item
                as={ProgressBarLink}
                href="/account/affiliates"
                children={t("wallet.affiliates_title")}
                isActive={isActive(["/account/affiliates"])}
              />
              <Navbar.Item
                as={ProgressBarLink}
                href="/account/billing"
                children={t("wallet.withdraw_earnings_title")}
                isActive={isActive(["/account/billing"])}
              />
            </>
          )}
          <Navbar.Item
            as={ProgressBarLink}
            href="/account/orders"
            children={t("wallet.orders_title")}
            isActive={isActive(["/account/orders"])}
          />
        </Navbar>
        {children}
      </Card.Body>
    </Card>
  );
};

export default WalletTabs;
