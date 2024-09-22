"use client";

import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import { useAppDispatch, useResponseToastHandler } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { APIFetchResponse, FetchErrorType, FetchReturnValue } from "@/server-actions/config/base-query";
import { useCheckoutMutation } from "@/store/slices/api/cartSlice";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { Cart, PAYMENT_GATEWAY, SaveCard } from "@/types";
import { PaymentLogos } from "@/ui/images";
import { useRouter } from "@/utils/navigation";

import { Button, Form } from "@msaaqcom/abjad";

import PrivacyPolicyText from "../payment-methods/privacy-policy-text";

type RedirectResponse = {
  redirect_url: string;
};

type CartResponse = {
  cart: {
    uuid: Pick<Cart, "uuid">;
  };
};

const SavedCardsCheckout = () => {
  const t = useTranslations();
  const router = useRouter();
  const [checkout, { isLoading }] = useCheckoutMutation();
  const dispatch = useAppDispatch();
  const { member } = useSession();

  const [savedCard, setSavedCard] = useState<SaveCard | null>(null);
  const cvvRef = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  const { displayErrors } = useResponseToastHandler({});

  useEffect(() => {
    if (savedCard) {
      const input = cvvRef.current.find((ref) => ref && ref.id === `cvv${savedCard.last_four}_${savedCard.id}`);

      if (input) {
        input.focus();
      }
    }
  }, [savedCard, cvvRef, cvvRef.current]);

  const onSubmit = async () => {
    if (isLoading || !savedCard) {
      return;
    }

    await dispatch(setCheckoutProcessing(true));

    const response = (await checkout({
      payment_gateway: PAYMENT_GATEWAY.MSAAQ_PAY,
      source: {
        ...savedCard,
        cvv,
        token: `src_${savedCard.id}`
      }
    })) as APIFetchResponse<RedirectResponse | CartResponse>;

    if (displayErrors(response)) {
      dispatch(setCheckoutProcessing(false));

      setError(t("validation.unexpected_error"));

      return;
    }

    if (response.data) {
      const redirect_url = (response.data as RedirectResponse).redirect_url;

      const uuid = (response.data as CartResponse).cart?.uuid;

      if (redirect_url) {
        window.location.href = redirect_url;
      } else if (uuid) {
        router.replace(`/cart/${uuid}/thank-you`);
        dispatch(setCheckoutProcessing(false));
      } else {
        dispatch(setCheckoutProcessing(false));
      }
    }
  };

  return (
    <div className="rounded-lg border border-gray-300">
      <div className="flex flex-col gap-4 p-4">
        {member?.saved_cards?.map((card, index) => (
          <div
            className="flex h-12 items-center justify-between gap-4"
            key={card.id}
          >
            <Form.Radio
              id={`${card.last_four}${card.id}`}
              name="saved_card"
              label={
                <div className="flex gap-2">
                  <span>{card.last_four}****</span>
                  <PaymentLogos
                    methods={[card.scheme.toUpperCase()]}
                    bordered
                  />
                </div>
              }
              checked={card.id === savedCard?.id}
              onChange={() => {
                setSavedCard(card);
                setCvv("");
              }}
              value={card.id}
            />
            {card.id === savedCard?.id && (
              <Form.Input
                ref={(ref) => {
                  cvvRef.current[index] = ref as HTMLInputElement;
                }}
                id={`cvv${card.last_four}_${card.id}`}
                className="mb-0"
                aria-labelledby={`${card.last_four}${card.id}`}
                placeholder={t("shopping_cart.saved_card_input_label")}
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value.substring(0, 3).replace(/^!\d+$/, ""));
                }}
              />
            )}
          </div>
        ))}
        <Form.Errors errors={error} />
      </div>
      <div className="border-t border-gray-300 p-4">
        <Button
          isDisabled={cvv.length !== 3}
          className="w-full"
          onPress={() => onSubmit()}
        >
          {t("shopping_cart.checkout")}
        </Button>
        <PrivacyPolicyText />
      </div>
    </div>
  );
};

export default SavedCardsCheckout;
