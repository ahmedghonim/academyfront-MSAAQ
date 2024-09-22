"use client";

import React, { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import TamaraWidget, { TamaraWidgetType } from "@/components/TamaraWidget";
import { Select } from "@/components/select";
import { useCart } from "@/components/store/CartProvider";
import {
  useAppDispatch,
  useFireAddPaymentInfoEvent,
  useFormatPrice,
  useResponseToastHandler,
  useServerAction
} from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { tamaraCheckoutMutation } from "@/server-actions/actions/checkout-actions";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { App, AppSlug } from "@/types";
import PhoneInput from "@/ui/inputs/phone-input";

import { Button, Form, Grid } from "@msaaqcom/abjad";

import PrivacyPolicyText from "./privacy-policy-text";

interface IFormInputs {
  name: string;
  email: string;
  phone: {
    phone_code: string;
    phone: string;
  };
  address: {
    country: {
      label: string;
      value: string;
    };
    city: string;
    line: string;
  };
}

interface IProps {
  app: App<AppSlug.Tamara>;
}

const TamaraCheckout = ({ app }: IProps) => {
  const t = useTranslations();

  const [checkout, { isError, data, error, isSuccess }] = useServerAction(tamaraCheckoutMutation);

  const cart = useCart()((s) => s.cart);
  const { formatPlainPrice } = useFormatPrice();
  const { member } = useSession();
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  const dispatch = useAppDispatch();

  const schema = yup.object({
    name: yup.string().when(([], schema) => {
      if (!member || (member && !member.name)) {
        return schema.required();
      }

      return schema.nullable().notRequired();
    }),
    email: yup.string().when(([], schema) => {
      if (!member || (member && !member.email)) {
        return schema.required();
      }

      return schema.nullable().notRequired();
    }),
    phone: yup.object().when(([], schema) => {
      if (!member || (member && !member.phone)) {
        return schema.shape({
          phone: yup.string().required(),
          phone_code: yup.string().required()
        });
      }

      return schema.shape({
        phone: yup.string().notRequired(),
        phone_code: yup.string().notRequired()
      });
    }),
    address: yup.object().shape({
      country: yup
        .object()
        .shape({
          label: yup.string().required(),
          value: yup.string().required()
        })
        .required(),
      city: yup.string().required(),
      line: yup.string().required()
    })
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  const { displayErrors } = useResponseToastHandler({
    setError
  });

  useEffect(() => {
    if (isError && error) {
      displayErrors({
        error
      });
      dispatch(setCheckoutProcessing(false));
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data) {
      const redirect_url = data.redirect_url;

      if (redirect_url) {
        fireAddPaymentInfoEvent();
        window.location.href = redirect_url;
      } else {
        dispatch(setCheckoutProcessing(false));
      }
    }
  }, [isSuccess, data, fireAddPaymentInfoEvent]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(setCheckoutProcessing(true));

    await checkout({
      ...data,
      address: {
        ...data.address,
        country: data.address.country.value
      },
      phone: data.phone.phone,
      phone_code: data.phone.phone_code
    });
  });

  return (
    <div className="overflow-hidden">
      <TamaraWidget
        price={formatPlainPrice(cart?.total ?? 0)}
        type={TamaraWidgetType.SPILT_AMOUNT_CART_PAGE}
      />
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4 py-4">
        <div className="flex flex-col space-y-4">
          {(!member || (member && !member.name)) && (
            <Controller
              name={"name"}
              control={control}
              render={({ field }) => (
                <Form.Input
                  className="mb-0"
                  isRequired
                  label={t("common.the_name")}
                  placeholder={t("common.the_name_input_placeholder")}
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />
          )}
          {(!member || (member && !member.email)) && (
            <Controller
              name={"email"}
              control={control}
              render={({ field }) => (
                <Form.Input
                  className="mb-0"
                  type="email"
                  isRequired
                  label={t("common.email")}
                  placeholder={t("common.email_input_placeholder")}
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
          )}
          {(!member || (member && !member.phone)) && (
            <Controller
              name={"phone"}
              control={control}
              render={({ field }) => (
                <PhoneInput
                  className="h-12 grow"
                  onlyCountries={["sa", "ae", "kw"]}
                  label={t("common.phone")}
                  placeholder={t("phone")}
                  error={errors.phone?.message}
                  {...field}
                />
              )}
            />
          )}
          <Grid
            columns={{
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2
            }}
            gap={{
              xs: "0.75rem",
              sm: "0.75rem",
              md: "0.75rem",
              lg: "0.75rem",
              xl: "0.75rem"
            }}
          >
            <Grid.Cell>
              <Controller
                name={"address.country"}
                control={control}
                render={({ field }) => (
                  <Form.Group
                    label={t("shopping_cart.tamara_country_input_label")}
                    errors={errors.address?.country?.message}
                    required
                    className="mb-0 space-y-2"
                  >
                    <Select
                      placeholder={t("shopping_cart.tamara_country_input_placeholder")}
                      options={[
                        {
                          label: t("countries.SA"),
                          value: "SA"
                        },
                        {
                          label: t("countries.AE"),
                          value: "AE"
                        },
                        {
                          label: t("countries.KW"),
                          value: "KW"
                        }
                      ]}
                      {...field}
                    />
                  </Form.Group>
                )}
              />
            </Grid.Cell>
            <Grid.Cell>
              <Controller
                name={"address.city"}
                control={control}
                render={({ field }) => (
                  <Form.Input
                    className="mb-0"
                    isRequired
                    label={t("shopping_cart.tamara_city_input_label")}
                    placeholder={t("shopping_cart.tamara_city_input_placeholder")}
                    error={errors.address?.city?.message}
                    {...field}
                  />
                )}
              />
            </Grid.Cell>
          </Grid>
          <Controller
            name={"address.line"}
            control={control}
            render={({ field }) => (
              <Form.Input
                className="mb-0"
                isRequired
                label={t("shopping_cart.tamara_address_input_label")}
                placeholder={t("shopping_cart.tamara_address_input_placeholder")}
                error={errors.address?.line?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>
      <div className="border-t border-gray-300 p-4">
        <Button
          isDisabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          onPress={() => onSubmit()}
          className="w-full"
        >
          {t("shopping_cart.checkout")}
        </Button>
        <PrivacyPolicyText />
      </div>
    </div>
  );
};

export default TamaraCheckout;
