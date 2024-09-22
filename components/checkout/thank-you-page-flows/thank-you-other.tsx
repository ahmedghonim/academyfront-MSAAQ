"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { CartItem } from "@/components/cart";
import { useCartByUUID } from "@/components/store/cart-by-uuid-provider";
import { useSession } from "@/providers/session-provider";
import { TenantLogo } from "@/ui/images";

import { Button, Card, Typography } from "@msaaqcom/abjad";

const ThankYouOther = () => {
  const t = useTranslations();

  const { member } = useSession();

  const { cart } = useCartByUUID()((s) => s);

  return (
    <>
      <header className="bg-white py-6">
        <div className="container mx-auto flex items-center gap-4">
          <TenantLogo />
        </div>
      </header>
      <Card className="mx-auto sm:w-[418px] md:w-[518px] lg:w-[618px]">
        <Card.Body className="flex flex-col space-y-4 !py-6 px-4">
          <div className="flex items-center">
            <Image
              className="select-none"
              src={"/images/check-success.gif"}
              alt={"check-success"}
              width={100}
              height={100}
            />
            <div className="flex flex-col gap-1">
              <Typography.Text
                size="sm"
                className="font-semibold text-success"
                children={t("thank_you_page.other_title")}
              />
              <Typography.Body
                size="md"
                className="font-normal text-gray-950"
                children={t("thank_you_page.other_description")}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {cart?.items.map((item) => (
              <CartItem
                className="bg-gray-100"
                key={item.product.id}
                item={item}
              />
            ))}
          </div>
          {member ? (
            <Button
              href="/library/courses"
              variant="solid"
              color="primary"
              className="mx-auto"
            >
              {t("common.to_library")}
            </Button>
          ) : (
            <Button
              href="/login?callbackUrl=/library/courses"
              variant="solid"
              color="primary"
              className="mx-auto"
            >
              {t("common.to_library")}
            </Button>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ThankYouOther;
