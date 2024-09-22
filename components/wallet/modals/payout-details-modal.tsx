"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { useFormatPrice } from "@/hooks";
import { DAY_MON_YEAR_TIME_FORMAT, Payout } from "@/types";

import { BanknotesIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

import { Badge, Button, Icon, Modal, ModalProps, Title, Typography } from "@msaaqcom/abjad";

interface Props extends ModalProps {
  payout: Payout;
}

const PayoutDetailsModal = ({ payout, open, onDismiss }: Props) => {
  const t = useTranslations();
  const { formatPrice } = useFormatPrice();

  return (
    <Modal
      open={open}
      size="3xl"
      onDismiss={onDismiss}
      bordered
    >
      <Modal.Header
        title={t("wallet.withdraw_earnings_transaction_details_title")}
        className="rounded-none border-0 !pb-0"
      />
      <Modal.Body>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Typography.Text
              as="span"
              size="md"
              className="me-2 font-normal text-gray-700"
            >
              {formatPrice(payout?.amount)}
            </Typography.Text>
            <Badge
              color={payout.type === "withdraw" ? "purple" : "info"}
              rounded="full"
              variant="soft"
              children={t("wallet.withdraw_earnings_transaction_type")}
            />
          </div>
          {payout.receipt && (
            <Button
              href={payout.receipt.url}
              target="_blank"
              download
              size="sm"
              color="gray"
              children={t("wallet.invoice")}
            />
          )}
        </div>
        <div className="card-divide-x grid grid-cols-2">
          <Title
            reverse
            title={payout?.id}
            subtitle={t("wallet.id")}
          />
          <Title
            reverse
            title={dayjs(payout?.created_at).fromNow(false)}
            subtitle={t("wallet.created_at")}
          />
        </div>
        <div className="my-6 h-px w-full bg-gray-400" />

        <div className="flex flex-col space-y-4">
          <Typography.Body
            size="md"
            children={t("wallet.withdraw_earnings_transaction_timeline")}
          />
          <div className="flex flex-col space-y-6">
            {payout.confirmed && (
              <Title
                title={
                  <div className="flex items-center gap-3">
                    <Icon
                      color="success"
                      size="sm"
                    >
                      <CheckCircleIcon />
                    </Icon>
                    {t("wallet.withdraw_earnings_transaction_success")}
                  </div>
                }
                subtitle={
                  <span
                    className="pr-[calc(theme(spacing.5)+theme(spacing.3))]"
                    children={dayjs(payout?.updated_at).format(DAY_MON_YEAR_TIME_FORMAT)}
                  />
                }
              />
            )}
            <Title
              title={
                <div className="flex items-center gap-3">
                  <Icon
                    color="inherit"
                    className="text-gray-600"
                    size="sm"
                  >
                    <BanknotesIcon />
                  </Icon>
                  {t("wallet.withdraw_earnings_transaction_created")}
                </div>
              }
              subtitle={
                <span
                  className="pr-[calc(theme(spacing.5)+theme(spacing.3))]"
                  children={dayjs(payout?.created_at).format(DAY_MON_YEAR_TIME_FORMAT)}
                />
              }
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PayoutDetailsModal;
