"use client";

import { useEffect, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { useTenant } from "@/components/store/TenantProvider";
import { WithdrawEarningsModal } from "@/components/wallet";
import { useCopyToClipboard, useFormatPrice } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { Affiliate, Bank, Currencies } from "@/types";
import transWithCount from "@/utils/trans-with-count";

import { CheckCircleIcon, ClipboardDocumentIcon, DocumentCheckIcon, LinkIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

import { Badge, Button, Card, Form, Grid, Icon, Tooltip, Typography } from "@msaaqcom/abjad";

const AffiliateData = ({
  affiliate,
  bankAccountData,
  currencies
}: {
  affiliate: Affiliate;
  bankAccountData: Bank;
  currencies: Array<Currencies>;
}) => {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);

  const { member } = useSession();

  const [copy, values] = useCopyToClipboard();
  const [canWithdraw, setCanWithdraw] = useState<boolean>(true);
  const { formatPrice } = useFormatPrice();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (affiliate) {
      setCanWithdraw(affiliate.can_withdraw_funds);
    }
  }, [affiliate]);

  const affiliateLink = useMemo(
    () => (tenant && member ? `https://${tenant.domain}?ref=${member.id}&utm_medium=affiliate` : ""),
    [tenant, member]
  );

  return (
    <>
      <div className="grid gap-6">
        <Grid
          columns={{
            md: 2
          }}
          gap={{
            md: "1rem",
            lg: "1rem",
            xl: "1rem"
          }}
        >
          <Grid.Cell
            columnSpan={{
              md: 1
            }}
          >
            <Card className="rounded">
              <Card.Body className="flex flex-col items-start justify-center">
                <Typography.Text
                  size="xs"
                  className="font-bold"
                  children={`${affiliate?.affiliates_commission}%`}
                />
                <Typography.Body
                  size="sm"
                  className="text-gray-800"
                  children={t("wallet.affiliates_commission")}
                />
              </Card.Body>
            </Card>
          </Grid.Cell>
          <Grid.Cell
            columnSpan={{
              md: 1
            }}
            className="order-1 md:order-2"
          >
            <Card className="rounded">
              <Card.Body className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Typography.Text
                    size="xs"
                    className="flex items-center gap-2 font-bold"
                  >
                    {formatPrice(affiliate?.balance.earnings ?? 0, tenant?.currency, "name", false)}
                    <Tooltip placement="top-start">
                      <Tooltip.Trigger>
                        <Icon
                          size="sm"
                          className="text-gray-600"
                        >
                          <ExclamationCircleIcon />
                        </Icon>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        children={t("wallet.affiliates_withdraw_threshold", {
                          threshold: affiliate?.payout.threshold
                        })}
                      />
                    </Tooltip>
                  </Typography.Text>
                  <Typography.Body
                    size="sm"
                    className="text-gray-800"
                    children={t("wallet.affiliates_earnings")}
                  />
                </div>
                <Button
                  size="sm"
                  isDisabled={!canWithdraw}
                  onPress={() => setShow(true)}
                  children={t("wallet.affiliates_withdraw_earnings")}
                />
              </Card.Body>
            </Card>
          </Grid.Cell>
        </Grid>
        <Card className="rounded bg-gray-100">
          <Card.Body>
            <Form.Input
              isRequired
              label={t("wallet.affiliates_referral_link_input_label")}
              dir="auto"
              isReadOnly
              defaultValue={affiliateLink}
              prepend={
                <Button
                  onPress={() => copy(affiliateLink)}
                  variant="link"
                  size="md"
                  className="px-0"
                  color="gray"
                  icon={
                    !values.includes(affiliateLink) ? (
                      <Icon
                        size="sm"
                        children={<ClipboardDocumentIcon />}
                      />
                    ) : (
                      <Icon
                        size="sm"
                        className="text-success"
                        children={<DocumentCheckIcon />}
                      />
                    )
                  }
                />
              }
              description={
                <Typography.Body
                  size="md"
                  className="!leading-7 text-gray-700"
                >
                  {t.rich("wallet.affiliates_referral_link_input_description", {
                    ref: member?.id,
                    domain: `https://${tenant?.domain}`,
                    code: (c) => (
                      <Badge
                        color="gray"
                        size="sm"
                        variant="soft"
                        className="break-all"
                      >
                        {c}
                      </Badge>
                    )
                  })}
                </Typography.Body>
              }
              classNames={{
                inputWrapper: "rounded-lg bg-white"
              }}
            />
          </Card.Body>
        </Card>
        <div className="border-t border-gray-400 pt-6">
          <Typography.Body
            size="base"
            className="font-medium"
            children={t("wallet.affiliates_marketing_statistics")}
          />
          <div className="flex flex-col md:!flex-row">
            <div className="mt-4 flex flex-1 flex-col items-start justify-center border-b border-gray-400 pb-6 md:!border-b-0 md:!border-s md:!pb-0 md:!ps-4">
              <Icon
                size="sm"
                className="mb-3"
              >
                <LinkIcon />
              </Icon>
              <Typography.Body
                size="sm"
                className="font-normal text-gray-800"
                children={t("wallet.affiliates_total_referrals")}
              />
              <Typography.Body
                size="md"
                className="font-bold"
                children={t("wallet.affiliates_referrals_count", {
                  count: affiliate?.stats.total_referrals
                })}
              />
            </div>
            <div className="mt-4 flex flex-1 flex-col items-start justify-center border-b border-gray-400 pb-6 md:!border-b-0 md:!border-s md:!pb-0 md:!ps-4">
              <Icon
                size="sm"
                className="mb-3"
              >
                <CheckCircleIcon />
              </Icon>
              <Typography.Body
                size="sm"
                className="font-normal text-gray-800"
                children={t("wallet.affiliates_buyers_number")}
              />
              <Typography.Body
                size="md"
                className="font-bold"
                children={t(
                  transWithCount(
                    "wallet.affiliates_buyers_count_WithCount",
                    affiliate?.stats.total_referrals_with_purchases
                  ),
                  {
                    count: affiliate?.stats.total_referrals_with_purchases
                  }
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <WithdrawEarningsModal
        currencies={currencies}
        onDismiss={() => setShow(false)}
        callback={() => {
          setCanWithdraw(false);
        }}
        affiliate={affiliate}
        bankAccountData={bankAccountData}
        open={show}
      />
    </>
  );
};

export default AffiliateData;
