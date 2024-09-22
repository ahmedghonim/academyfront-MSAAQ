import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { BankDetails } from "@/components/payment-methods";
import {
  useAppDispatch,
  useFireAddPaymentInfoEvent,
  useResponseToastHandler,
  useServerAction,
  useValidateMemberBeforeMsaaqpayCheckout
} from "@/hooks";
import { bankTransferCheckoutMutation } from "@/server-actions/actions/checkout-actions";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { App, AppSlug, PAYMENT_GATEWAY } from "@/types";
import { useRouter } from "@/utils/navigation";

import { ChevronUpIcon } from "@heroicons/react/24/outline";

import { Alert, Button, Collapse, Form, Icon, SingleFile, Typography } from "@msaaqcom/abjad";

import PrivacyPolicyText from "../payment-methods/privacy-policy-text";

interface IFormInputs {
  account_owner: string;
  receipt: SingleFile[];
}

interface IProps {
  app: App<AppSlug.BankTransfer>;
}

const BankTransferCheckout = ({ app }: IProps) => {
  const t = useTranslations();

  const router = useRouter();
  const [checkout, { isError, data, isSuccess, error }] = useServerAction(bankTransferCheckoutMutation);

  const { isMemberValid } = useValidateMemberBeforeMsaaqpayCheckout();
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  const dispatch = useAppDispatch();

  const schema = yup.object({
    account_owner: yup.string().required(),
    receipt: yup.array().min(1).required()
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IFormInputs>({
    defaultValues: {
      account_owner: "",
      receipt: []
    },
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
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data) {
      const uuid = (
        data as {
          cart: {
            uuid: string;
          };
        }
      ).cart.uuid;

      fireAddPaymentInfoEvent();

      if (!uuid) {
        return;
      }

      router.replace(`/cart/${uuid}/thank-you`);

      return;
    }
  }, [isSuccess, data, fireAddPaymentInfoEvent]);
  const onSubmit = handleSubmit(async (data) => {
    const memberInfo = isMemberValid();

    if (!memberInfo) {
      return;
    }

    dispatch(setCheckoutProcessing(true));

    const fd = new FormData();

    fd.append("payment_gateway", PAYMENT_GATEWAY.BANK_TRANSFER);
    fd.append("account_owner", data.account_owner);
    fd.append("receipt", data.receipt[0].file as File);
    fd.append("email", memberInfo.email);

    await checkout(fd);

    dispatch(setCheckoutProcessing(false));
  });

  if (!app.banks[0]) {
    return null;
  }

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4 py-4">
        <div className="flex flex-col space-y-4 rounded border border-gray-300 p-4">
          <div className="flex flex-col">
            <Typography.Text
              size="sm"
              className="font-bold"
            >
              {t("shopping_cart.bank_transfer_account_details")}
            </Typography.Text>
            <Typography.Body
              size="md"
              className="font-normal text-gray-700"
            >
              {t("shopping_cart.bank_transfer_account_details_description")}
            </Typography.Body>
          </div>
          {app.banks.length > 1 ? (
            app.banks.map((bank, index) => (
              <Collapse
                key={bank.id}
                className="rounded-lg border border-gray-300"
                defaultOpen={index === 0}
              >
                {({ isOpen }) => (
                  <>
                    <Collapse.Button className="!px-4 !py-6">
                      <div className="flex flex-grow flex-row justify-between">
                        <div className="flex items-center">
                          <Typography.Body size="md">{bank.bank_name}</Typography.Body>
                        </div>
                        <Icon
                          className={`${
                            isOpen ? "rotate-180 transform" : ""
                          } text-purple-500 transition-all duration-300 ease-in-out`}
                        >
                          <ChevronUpIcon />
                        </Icon>
                      </div>
                    </Collapse.Button>
                    <Collapse.Content className="px-4 pb-6">
                      <BankDetails bank={bank} />
                    </Collapse.Content>
                  </>
                )}
              </Collapse>
            ))
          ) : (
            <BankDetails bank={app.banks[app.banks.length - 1]} />
          )}
        </div>
        <div className="flex flex-col space-y-4">
          <Alert
            title={
              <Typography.Text
                size="sm"
                className="font-normal"
              >
                {t("shopping_cart.bank_transfer_alert")}
              </Typography.Text>
            }
            variant="soft"
            color="info"
          />
          <Controller
            name={"account_owner"}
            control={control}
            render={({ field }) => (
              <Form.Input
                isRequired
                label={t("bank.account_name")}
                placeholder={t("bank.account_name_input_placeholder")}
                error={errors.account_owner?.message}
                {...field}
              />
            )}
          />
          <Form.Group
            label={t("shopping_cart.bank_transfer_receipt_input_label")}
            required
            className="mb-0"
          >
            <Controller
              name="receipt"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <Form.File
                  maxFiles={1}
                  onChange={(files: SingleFile[]) => {
                    onChange(files);
                  }}
                  {...rest}
                  accept={["image/*", "application/pdf"]}
                  className="mt-2"
                />
              )}
            />
          </Form.Group>
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

export default BankTransferCheckout;
