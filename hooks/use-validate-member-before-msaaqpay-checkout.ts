"use client";

import { useEffect, useRef } from "react";

import { useTranslations } from "next-intl";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { CheckoutSliceStateType, setCheckoutErrors } from "@/store/slices/checkout-slice";
import { isValidEmail } from "@/utils";

const useValidateMemberBeforeMsaaqpayCheckout = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { member } = useSession();
  const { email } = useAppSelector<CheckoutSliceStateType>((state) => state.checkout);

  const emailRef = useRef<any>(undefined);

  const memberRef = useRef<any>(undefined);

  useEffect(() => {
    emailRef.current = email;

    memberRef.current = member;
  }, [email, member]);

  const isMemberValid = () => {
    if (!memberRef.current && !emailRef.current) {
      dispatch(
        setCheckoutErrors({
          email: {
            message: !email
              ? t("validation.field_required")
              : isValidEmail(email)
              ? ""
              : t("validation.field_must_be_valid_email")
          }
        })
      );

      return false;
    }

    dispatch(
      setCheckoutErrors({
        email: {
          message: ""
        }
      })
    );

    return {
      email: emailRef.current
    };
  };

  return { isMemberValid };
};

export default useValidateMemberBeforeMsaaqpayCheckout;
