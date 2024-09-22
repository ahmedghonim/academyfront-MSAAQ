"use client";

import { useState } from "react";

import dayjs from "dayjs";

import Trans from "@/components/i18n/trans";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { OrderDetailsModal } from "@/components/wallet";
import { useFormatPrice } from "@/hooks";
import { DAY_MON_YEAR_TIME_FORMAT, Order, Payout } from "@/types";
import { getStatusColor } from "@/utils";

import { EyeIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Icon, Typography } from "@msaaqcom/abjad";

import { CellProps } from ".";

interface CustomersColumnsProps {
  sortables: Array<string>;
  columns?: Array<string>;
  isMobile?: boolean;
}

export const orderHistoryCol = ({ sortables = [], isMobile }: CustomersColumnsProps) => {
  const columns = [
    {
      Header: <Trans i18nKey="wallet.id" />,
      id: "id",
      accessor: "id",
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
      Header: <Trans i18nKey="wallet.orders_total_amount" />,
      id: "total",
      accessor: "total",
      disableSortBy: !sortables?.includes("total"),
      Cell: ({ row: { original } }: CellProps<Order>) => {
        const { formatPrice } = useFormatPrice();

        return (
          <Typography.Body
            as="span"
            size="md"
            className="font-bold"
          >
            {formatPrice(original.total, original.currency, "name", false)}
          </Typography.Body>
        );
      }
    },
    {
      Header: <Trans i18nKey="wallet.status" />,
      id: "status",
      accessor: "status",
      disableSortBy: !sortables?.includes("status"),
      Cell: ({ row: { original } }: CellProps<Order>) => (
        <Badge
          color={getStatusColor(original.status)}
          rounded="full"
          size="sm"
          variant="soft"
          children={<Trans i18nKey={`wallet.statuses_${original.status}`} />}
        />
      )
    },
    {
      Header: <Trans i18nKey="wallet.orders_products_count" />,
      id: "items",
      accessor: "items",
      disableSortBy: !sortables?.includes("items"),
      Cell: ({ row: { original } }: CellProps<Order>) => {
        return (
          <Typography.Body
            as="span"
            size="md"
            className="font-medium"
            children={original.items.length}
          />
        );
      }
    },
    {
      Header: <Trans i18nKey="wallet.orders_payment_method" />,
      id: "payment_method",
      accessor: "payment_method",
      disableSortBy: !sortables?.includes("payment_method"),
      Cell: ({ row: { original } }: CellProps<Order>) => <PaymentMethodLogo method={original.payment_method} />
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
      Cell: ({ row: { original } }: CellProps<Order>) => {
        const [show, setShow] = useState<boolean>(false);

        if (!original.transaction) return null;

        return (
          <>
            <Button
              color="gray"
              onPress={() => setShow(true)}
              size="sm"
              children={<Trans i18nKey="common.display_details" />}
            />
            <OrderDetailsModal
              onDismiss={() => {
                setShow(false);
              }}
              order={original}
              open={show}
            />
          </>
        );
      }
    }
  ];
  const filteredColumns = [
    {
      Header: <Trans i18nKey="wallet.orders_total_amount" />,
      id: "total",
      accessor: "total",
      width: 100,
      disableSortBy: !sortables?.includes("total"),
      Cell: ({ row: { original } }: CellProps<Order>) => {
        const { formatPrice } = useFormatPrice();

        return (
          <Typography.Body
            as="span"
            size="md"
            className="font-bold"
          >
            {formatPrice(original.total)}
          </Typography.Body>
        );
      }
    },
    {
      Header: <Trans i18nKey="wallet.status" />,
      id: "status",
      accessor: "status",
      disableSortBy: !sortables?.includes("status"),
      Cell: ({ row: { original } }: CellProps<Order>) => {
        const [show, setShow] = useState<boolean>(false);

        return (
          <div className="flex items-center gap-4">
            <PaymentMethodLogo method={original.payment_method} />
            <Badge
              color={getStatusColor(original.status)}
              rounded="full"
              size="sm"
              variant="soft"
              children={<Trans i18nKey={`wallet.statuses_${original.status}`} />}
            />
            {original.transaction && (
              <div>
                <Button
                  color="gray"
                  onPress={() => setShow(true)}
                  size="sm"
                  icon={
                    <Icon>
                      <EyeIcon />
                    </Icon>
                  }
                />
                <OrderDetailsModal
                  onDismiss={() => {
                    setShow(false);
                  }}
                  order={original}
                  open={show}
                />
              </div>
            )}
          </div>
        );
      }
    }
  ];

  return isMobile ? filteredColumns : columns;
};
