"use client";

import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import { Frames } from "@/components/frames";
import {
  useAppDispatch,
  useFireAddPaymentInfoEvent,
  useResponseToastHandler,
  useServerAction,
  useValidateMemberBeforeMsaaqpayCheckout
} from "@/hooks";
import { checkoutMutation } from "@/server-actions/actions/checkout-actions";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { App, AppSlug, PAYMENT_GATEWAY } from "@/types";
import { useRouter } from "@/utils/navigation";

import { Button, Form } from "@msaaqcom/abjad";

import PrivacyPolicyText from "../payment-methods/privacy-policy-text";

interface IProps {
  app: App<AppSlug.Msaaqpay>;
}

const CardCheckout = ({ app }: IProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [checkout, { isError, error: resError, data, isSuccess, isLoading }] = useServerAction(checkoutMutation);
  const dispatch = useAppDispatch();

  const [canCheckout, setCanCheckout] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const saveCard = useRef<boolean>(false);

  const { isMemberValid } = useValidateMemberBeforeMsaaqpayCheckout();
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  const { displayErrors } = useResponseToastHandler({});

  useEffect(() => {
    if (isError && resError) {
      if (
        displayErrors({
          error: resError
        })
      ) {
        dispatch(setCheckoutProcessing(false));
        setCanCheckout(true);
        Frames.enableSubmitForm();
      }
    }
  }, [isError, resError]);

  useEffect(() => {
    if (isSuccess && data) {
      const redirect_url = (
        data as {
          redirect_url: string;
        }
      ).redirect_url;

      const uuid = (
        data as {
          cart: {
            uuid: string;
          };
        }
      ).cart?.uuid;

      if (redirect_url) {
        fireAddPaymentInfoEvent();
        window.location.href = redirect_url;
      } else if (uuid) {
        fireAddPaymentInfoEvent();
        router.replace(`/cart/${uuid}/thank-you`);
        dispatch(setCheckoutProcessing(false));
      } else {
        dispatch(setCheckoutProcessing(false));
      }
    }
  }, [data, isSuccess, fireAddPaymentInfoEvent]);

  const onCardTokenized = async (source: any) => {
    const memberInfo = isMemberValid();

    if (isLoading || !memberInfo) {
      return;
    }

    dispatch(setCheckoutProcessing(true));

    await checkout({
      payment_gateway: PAYMENT_GATEWAY.MSAAQ_PAY,
      source: source,
      save_card: saveCard.current ? "1" : "0",
      ...memberInfo
    });
  };

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4 py-4">
        <div className="flex flex-col gap-y-2">
          <Form.Label required>{t("shopping_cart.card_input_label")}</Form.Label>
          <div className="flex flex-col space-y-4">
            <Frames
              config={{
                publicKey: app.public_key as string,
                localization: {
                  cardNumberPlaceholder: "0000 0000 0000 0000",
                  expiryMonthPlaceholder: "MM",
                  expiryYearPlaceholder: "YY",
                  cvvPlaceholder: "CVC"
                },
                style: {
                  base: {
                    height: "46px",
                    color: "#000000",
                    fontSize: ".875rem",
                    lineHeight: "1.7",
                    fontWeight: "500"
                  },
                  invalid: {
                    color: "#ef4444"
                  },
                  placeholder: {
                    base: {
                      color: "#000000",
                      opacity: "28%"
                    }
                  }
                }
              }}
              cardValidationChanged={(e) => {
                setCanCheckout(e.isValid);
              }}
              frameValidationChanged={(e) => {
                if (e.isValid && !e.isEmpty) {
                  setError("");
                } else {
                  setError(t(`shopping_cart.${e.element}`) as string);
                }
              }}
              cardSubmitted={() => {
                setCanCheckout(false);
                dispatch(setCheckoutProcessing(true));
              }}
              cardTokenizationFailed={() => {
                setCanCheckout(true);
                Frames.enableSubmitForm();
                dispatch(setCheckoutProcessing(false));
              }}
              cardTokenized={(e) => {
                onCardTokenized(e);
              }}
            >
              <Frames.Card />
            </Frames>
            <Form.Checkbox
              id={t("shopping_cart.save_card")}
              name="save_card"
              label={t("shopping_cart.save_card")}
              onChange={(e) => {
                saveCard.current = e.target.checked;
              }}
            />
          </div>
          <Form.Errors errors={error} />
        </div>
      </div>
      <div className="border-t border-gray-300 p-4">
        <Button
          isDisabled={!canCheckout}
          className="w-full"
          onPress={() => {
            if (!isMemberValid()) {
              return;
            }
            Frames.submitCard();
          }}
        >
          {t("shopping_cart.checkout")}
        </Button>
        <PrivacyPolicyText />
      </div>
    </div>
  );
};

export default CardCheckout;
