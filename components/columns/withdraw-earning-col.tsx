"use client";

import { useState } from "react";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import Trans from "@/components/i18n/trans";
import { useEncryptNumbers, useFormatPrice } from "@/hooks";
import { Bank, DAY_MON_YEAR_TIME_FORMAT, Payout, PaypalPayout } from "@/types";

import { Badge, Button, Title, Typography } from "@msaaqcom/abjad";

import { CellProps } from ".";
import { PayoutDetailsModal } from "../wallet";

interface CustomersColumnsProps {
  sortables: Array<string>;
}

export const withdrawEarningCol = ({ sortables = [] }: CustomersColumnsProps) => [
  {
    Header: <Trans i18nKey="wallet.id" />,
    id: "id",
    accessor: "id",
    width: 75,
    disableSortBy: !sortables?.includes("id"),
    Cell: ({ row: { original } }: CellProps<Payout>) => (
      <Typography.Body
        as="span"
        size="md"
        className="font-medium"
        children={original.id}
      />
    )
  },
  {
    Header: <Trans i18nKey="wallet.withdraw_earnings_amount" />,
    id: "amount",
    accessor: "amount",
    disableSortBy: !sortables?.includes("amount"),
    Cell: ({ row: { original } }: CellProps<Payout>) => {
      const { formatPrice } = useFormatPrice();

      return (
        <Typography.Body
          as="span"
          size="md"
          className="font-bold"
        >
          {formatPrice(original.amount)}
        </Typography.Body>
      );
    }
  },
  {
    Header: <Trans i18nKey="wallet.withdraw_earnings_method" />,
    id: "method",
    accessor: "method",
    width: 250,
    disableSortBy: !sortables?.includes("method"),
    Cell: ({ row: { original } }: CellProps<Payout>) => {
      const { result: bankAccountNumber } = useEncryptNumbers((original.payout_details as Bank).account_number ?? "");

      if (original.method === "wire") {
        return (
          <Title
            title={bankAccountNumber}
            subtitle={(original.payout_details as Bank).bank_name}
          />
        );
      } else {
        return (
          <Title
            title={(original.payout_details as PaypalPayout).paypal_email}
            subtitle={(original.payout_details as PaypalPayout).method}
          />
        );
      }
    }
  },
  {
    Header: <Trans i18nKey="wallet.status" />,
    id: "confirmed",
    accessor: "confirmed",
    disableSortBy: !sortables?.includes("confirmed"),
    Cell: ({ row: { original } }: CellProps<Payout>) => {
      return (
        <Badge
          color={original.confirmed ? "success" : "info"}
          rounded="full"
          size="sm"
          variant="soft"
          children={
            <>
              {original.confirmed ? (
                <Trans i18nKey="wallet.statuses_completed" />
              ) : (
                <Trans i18nKey="wallet.statuses_processing" />
              )}
            </>
          }
        />
      );
    }
  },
  {
    Header: <Trans i18nKey="wallet.created_at" />,
    id: "created_at",
    accessor: "created_at",
    disableSortBy: !sortables?.includes("created_at"),
    Cell: ({ row: { original } }: CellProps<Payout>) => (
      <Typography.Body
        size="sm"
        className="text-gray-800"
        dir="auto"
        children={dayjs(original.created_at).format(DAY_MON_YEAR_TIME_FORMAT)}
      />
    )
  },
  {
    id: "actions",
    className: "justify-end",
    Cell: ({ row: { original } }: CellProps<Payout>) => {
      const [show, setShow] = useState<boolean>(false);
      const t = useTranslations();

      return (
        <>
          <Button
            color="gray"
            size="sm"
            onPress={() => setShow(true)}
            children={t("common.display_details")}
          />
          <PayoutDetailsModal
            onDismiss={() => {
              setShow(false);
            }}
            open={show}
            payout={original}
          />
        </>
      );
    }
  }
];
