"use client";

import { useCallback, useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useEncryptNumbers, useFormatPrice, useResponseToastHandler } from "@/hooks";
import { withdrawAffiliateEarnings } from "@/server-actions/actions/bank-actions";
import { Affiliate, Bank, Currencies } from "@/types";

import { CreditCardIcon } from "@heroicons/react/24/outline";

import { Button, Card, Form, Icon, Modal, ModalProps, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import BankAccountModal from "./bank-account-modal";

interface IFormInputs {
  withdraw: "full" | "partial";
  method: "wire" | "paypal";
  paypal_email: string | undefined;
  amount: number;
}

const WithdrawEarningsModal = ({
  open,
  onDismiss,
  callback,
  bankAccountData,
  affiliate,
  currencies
}: ModalProps & {
  callback?: () => void;
  affiliate: Affiliate;
  bankAccountData: Bank;
  currencies: Array<Currencies>;
}) => {
  const t = useTranslations();
  const [showBankAccountModal, setShowBankAccountModal] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setShow(open ?? false);
  }, [open]);

  const { result: accountNumber } = useEncryptNumbers(bankAccountData?.account_number as string);
  const { formatPrice } = useFormatPrice();
  const toggleBankAccountModal = (isSwitcherFunc: boolean = false) => {
    if (isSwitcherFunc) {
      setShow(false);
    }
    setShowBankAccountModal((prev) => !prev);
  };

  const schema = yup.object({
    withdraw: yup.string(),
    method: yup.string(),
    paypal_email: yup.string(),
    amount: yup.number().min(0)
  });
  const {
    handleSubmit,
    watch,
    control,
    setError,
    reset,
    formState: { isSubmitting, isValid }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "all"
  });

  const resetForm = useCallback(() => {
    reset({
      withdraw: "full",
      method: affiliate?.payout.methods[0] ?? "wire",
      paypal_email: "",
      amount: 0
    });
  }, [affiliate]);

  useEffect(() => {
    if (affiliate) {
      resetForm();
    }
  }, [affiliate]);

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });
  const preferredPayPal = watch("method") === "paypal";

  const onSubmit = async (data: IFormInputs) => {
    const response = (await withdrawAffiliateEarnings({
      ...(data.method === "paypal" && { paypal_email: data.paypal_email }),
      ...(data.method === "wire" && {
        bank_id: bankAccountData?.id as number
      }),
      method: data.method,
      amount: data.withdraw === "full" && affiliate ? affiliate?.balance.earnings / 100 : data.amount
    })) as any;

    if (displayErrors(response)) return;

    displaySuccess(response);
    setShow(false);
    resetForm();
    callback?.();
  };

  return (
    <>
      <Modal
        open={show}
        size="lg"
        onDismiss={onDismiss}
        bordered
      >
        <Modal.Header title={t("wallet.affiliates_withdraw_earnings")} />
        <Modal.Body className="p-0">
          <div className="flex items-center justify-between bg-gray-100 p-4">
            <Typography.Body
              size="md"
              className="font-normal"
              children={t("wallet.affiliates_withdrawable_earnings")}
            />
            <Typography.Body
              size="md"
              className="font-normal"
              children={formatPrice((affiliate?.balance.earnings as number) ?? "")}
            />
          </div>
          <div className="flex flex-col gap-y-6 p-4">
            <div className="flex flex-col gap-4">
              <Typography.Text
                size="sm"
                children={t("wallet.affiliates_select_withdrawal_amount")}
              />
              <Controller
                name="withdraw"
                control={control}
                render={({ field: { value, ...rest } }) => (
                  <label
                    className={cn(
                      "w-full rounded-lg border p-4 transition-colors",
                      "flex items-center justify-between gap-8",
                      value === "full" ? "border-primary bg-primary-50" : "border-gray"
                    )}
                  >
                    <Form.Radio
                      id="withdraw-full"
                      color="primary"
                      value="full"
                      checked={value === "full"}
                      label={t("wallet.affiliates_withdraw_all_earnings")}
                      {...rest}
                    />
                    <Typography.Body
                      size="md"
                      className={cn("font-normal", value === "full" && "text-primary")}
                      children={formatPrice((affiliate?.balance.earnings as number) ?? "")}
                    />
                  </label>
                )}
              />

              <Controller
                name="withdraw"
                control={control}
                render={({ field: { value, ...rest } }) => (
                  <label
                    className={cn(
                      "w-full rounded-lg border p-4 transition-colors",
                      "grid gap-4",
                      value === "partial" ? "border-primary bg-primary-50" : "border-gray"
                    )}
                  >
                    <Form.Radio
                      id="withdraw-partial"
                      color="primary"
                      value="partial"
                      checked={value === "partial"}
                      label={t("wallet.affiliates_withdraw_partial_earnings")}
                      {...rest}
                    />
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <Form.Number
                          isRequired
                          isDisabled={value !== "partial"}
                          minValue={0}
                          label={t("wallet.affiliates_enter_withdrawal_amount")}
                          className="mb-0"
                          classNames={{
                            inputWrapper: "bg-white"
                          }}
                          {...field}
                        />
                      )}
                    />
                  </label>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography.Text
                size="sm"
                children={t("wallet.affiliates_withdraw_method")}
                className="mb-4 block"
              />

              {affiliate && affiliate.payout.methods.length > 1 && (
                <div className="mb-6 flex gap-4">
                  {affiliate.payout.methods.map((method, i) => (
                    <Controller
                      key={i}
                      name="method"
                      control={control}
                      render={({ field: { value, ...rest } }) => (
                        <label
                          className={cn(
                            "w-full rounded-lg border p-4 transition-colors",
                            "flex items-center justify-between gap-8",
                            value === method ? "border-primary bg-primary-50" : "border-gray"
                          )}
                        >
                          <Form.Radio
                            id={method}
                            color="primary"
                            value={method}
                            checked={value === method}
                            label={
                              <>
                                <Typography.Body
                                  as="p"
                                  size="md"
                                  children={t(
                                    `wallet.affiliates_withdraw_${method == "paypal" ? "paypal" : "bank_transfers"}`
                                  )}
                                />
                              </>
                            }
                            {...rest}
                            name="withdraw-way"
                          />
                        </label>
                      )}
                    />
                  ))}
                </div>
              )}

              {preferredPayPal ? (
                <Controller
                  name="paypal_email"
                  control={control}
                  render={({ field }) => (
                    <Form.Input
                      label={t("wallet.affiliates_paypal_input_label")}
                      isRequired={preferredPayPal}
                      placeholder={t("wallet.affiliates_paypal_input_placeholder")}
                      description={t("wallet.affiliates_paypal_input_description")}
                      type="email"
                      className="mb-0"
                      {...field}
                    />
                  )}
                />
              ) : (
                <Card className="rounded-lg">
                  <Card.Body>
                    {bankAccountData?.id && (
                      <div className="mb-8 flex">
                        <div className="flex grow flex-col">
                          <Typography.Body
                            size="sm"
                            className="font-normal text-gray-800"
                            children={t("bank.bank_name")}
                          />
                          <Typography.Body
                            size="sm"
                            className="font-medium"
                            children={bankAccountData?.bank_name}
                          />
                        </div>
                        <div className="flex grow flex-col">
                          <Typography.Body
                            size="sm"
                            className="font-normal text-gray-800"
                            children={t("bank.account_number")}
                          />
                          <Typography.Body
                            size="sm"
                            className="font-medium"
                            children={accountNumber}
                          />
                        </div>
                      </div>
                    )}
                    <Button
                      color="gray"
                      onPress={() => {
                        toggleBankAccountModal(true);
                      }}
                      className="w-full"
                      icon={
                        bankAccountData?.id ? undefined : (
                          <Icon>
                            <CreditCardIcon />
                          </Icon>
                        )
                      }
                      children={t(bankAccountData?.id ? "bank:change_account" : "bank:add_account")}
                    />
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-between">
          <Button
            onPress={() => handleSubmit(onSubmit)()}
            isDisabled={isSubmitting || !isValid}
            isLoading={isSubmitting}
            children={t("wallet.affiliates_withdraw_button_title")}
          />

          <Button
            color="gray"
            onPress={onDismiss}
            children={t("common.cancel")}
          />
        </Modal.Footer>
      </Modal>
      <BankAccountModal
        bankAccountData={bankAccountData}
        currencies={currencies}
        onDismiss={() => {
          onDismiss?.();
          setShowBankAccountModal(false);
        }}
        open={showBankAccountModal}
      />
    </>
  );
};

export default WithdrawEarningsModal;
