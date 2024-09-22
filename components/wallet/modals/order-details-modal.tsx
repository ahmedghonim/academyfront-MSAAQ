"use client";

import Image from "next/image";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import PaymentMethodLogo from "@/components/payment-method-logo";
import { useDownloadFile, useFormatPrice } from "@/hooks";
import { Order } from "@/types";
import { getStatusColor } from "@/utils";

import { Badge, Button, Card, Modal, ModalProps, Title, Typography } from "@msaaqcom/abjad";

interface Props extends ModalProps {
  order: Order;
}

const OrderDetailsModal = ({ open, onDismiss, order }: Props) => {
  const t = useTranslations();
  const { formatPrice } = useFormatPrice();
  const { downloading, downloadFile } = useDownloadFile();

  if (!order || !order.transaction) {
    return null;
  }

  return (
    <Modal
      open={open}
      size="2xl"
      onDismiss={onDismiss}
      bordered
    >
      <Modal.Header
        dismissible
        title={t("wallet.orders_order_details_title", { order_id: order?.id })}
      />
      <Modal.Body>
        <Card className="rounded-lg">
          <Card.Body className="!py-8 px-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Typography.Text
                  as="span"
                  size="md"
                  className="me-2 font-normal text-gray-700"
                >
                  {formatPrice(order.total, order.currency, "name", false)}
                </Typography.Text>
                <Badge
                  color={getStatusColor(order.status)}
                  rounded="full"
                  variant="soft"
                  children={t(`wallet.statuses_${order.status}`)}
                />
              </div>
              <Button
                isLoading={downloading}
                onPress={() => downloadFile(`/account/orders/${order.uuid}/invoice`, String(order.id))}
                size="sm"
                color="gray"
                children={t("wallet.invoice")}
              />
            </div>
            <div className="my-8 h-px w-full bg-gray-400" />
            <div className="card-divide-x grid grid-cols-4">
              <Title
                reverse
                title={dayjs(order?.created_at).fromNow()}
                subtitle={t("wallet.created_at")}
              />
              <Title
                reverse
                title={<PaymentMethodLogo method={order?.payment_method} />}
                subtitle={t("wallet.orders_payment_method")}
              />
              <Title
                reverse
                subtitle={t("wallet.id")}
                title={order?.id}
              />
              <Title
                reverse
                subtitle={t("wallet.orders_transaction_number")}
                title={`#${order?.transaction.id}`}
              />
            </div>
          </Card.Body>
        </Card>
        <div className="mt-6">
          <Typography.Text
            size="sm"
            className="mb-2 block font-semibold"
            children={t("wallet.orders_products")}
          />
          <Card className="rounded-lg">
            <Card.Body className="grid gap-8">
              {order?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-400 pb-8 last:border-none last:pb-0"
                >
                  <div className="flex gap-4">
                    <Image
                      src={item.product?.thumbnail ?? "/images/check-success.gif"}
                      width={48}
                      height={48}
                      className="rounded-md border border-black object-cover"
                      alt={""}
                    />
                    <div className="grid">
                      <Typography.Body
                        as="span"
                        children={item.product?.title}
                      />
                      <Typography.Body
                        as="span"
                        size="md"
                        children={formatPrice(item.product?.price, order.currency, "name", false)}
                        className="font-normal text-gray-800"
                      />
                    </div>
                  </div>
                  {!item.product && (
                    <Badge
                      color="danger"
                      rounded="full"
                      variant="soft"
                      children="منتج محذوف"
                    />
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailsModal;
