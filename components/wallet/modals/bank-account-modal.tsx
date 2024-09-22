"use client";

import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useResponseToastHandler } from "@/hooks";
import { createBank, updateBank } from "@/server-actions/actions/bank-actions";
import { Bank, Currencies } from "@/types";

import { Button, Form, Grid, Modal, ModalProps, Typography } from "@msaaqcom/abjad";

interface IFormInputs extends Omit<Bank, "id" | "created_at" | "updated_at"> {}

const BankAccountModal = ({
  open,
  onDismiss,
  currencies,
  bankAccountData
}: ModalProps & {
  currencies: Array<Currencies>;
  bankAccountData: Bank;
}) => {
  const t = useTranslations();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setShow(open ?? false);
  }, [open]);

  const schema = yup.object({
    bank_name: yup.string().required(),
    account_name: yup.string().required(),
    account_number: yup.string().required(),
    currency: yup.string().required(),
    iban: yup.string().required(),
    bic: yup.string().required()
  });

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onSubmit"
  });

  useEffect(() => {
    reset({
      bank_name: bankAccountData?.bank_name,
      account_name: bankAccountData?.account_name,
      account_number: bankAccountData?.account_number,
      currency:
        currencies.find((currency) => currency.country_code === bankAccountData?.currency)?.country_code ??
        currencies[0].country_code,
      iban: bankAccountData?.iban,
      bic: bankAccountData?.bic
    });
  }, [bankAccountData, currencies]);

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  const onSubmit = async (data: IFormInputs) => {
    const response = (await (bankAccountData?.id ? updateBank(data) : createBank(data))) as any;

    if (displayErrors(response)) return;
    displaySuccess(response);
    onDismiss?.();
  };

  return (
    <Modal
      open={show}
      size="3xl"
      onDismiss={onDismiss}
      bordered
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header title={t(bankAccountData?.id ? "bank:change_account" : "bank:add_account")} />
        <Modal.Body>
          <Typography.Body
            children={t("bank.details")}
            className="mb-4 block text-gray-800"
          />
          <Grid
            columns={{
              lg: 12,
              xl: 12,
              md: 12
            }}
            gap={{
              md: "1rem",
              lg: "1rem",
              xl: "1rem"
            }}
          >
            <Grid.Cell
              columnSpan={{
                md: 6
              }}
            >
              <Controller
                name="bank_name"
                control={control}
                render={({ field }) => (
                  <Form.Input
                    isRequired
                    error={errors.bank_name?.message}
                    label={t("bank.bank_name")}
                    type="text"
                    placeholder={t("bank.name_input_placeholder")}
                    className="mb-0"
                    {...field}
                  />
                )}
              />
            </Grid.Cell>
            <Grid.Cell
              columnSpan={{
                md: 6
              }}
            >
              <Controller
                name="account_name"
                control={control}
                render={({ field }) => (
                  <Form.Input
                    isRequired
                    error={errors.account_name?.message}
                    label={t("bank.account_name")}
                    type="text"
                    placeholder={t("bank.account_name_input_placeholder")}
                    className="mb-0"
                    {...field}
                  />
                )}
              />
            </Grid.Cell>
            <Grid.Cell
              columnSpan={{
                md: 6
              }}
            >
              <Controller
                name="account_number"
                control={control}
                render={({ field }) => (
                  <Form.Input
                    isRequired
                    error={errors.account_number?.message}
                    label={t("bank.account_number")}
                    type="text"
                    placeholder={t("bank.account_number_input_placeholder")}
                    className="mb-0"
                    {...field}
                  />
                )}
              />
            </Grid.Cell>
            <Grid.Cell
              columnSpan={{
                md: 6
              }}
            >
              <Form.Group
                required
                label={t("bank.account_currency")}
                className="mb-0"
              >
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="mb-0 mt-2 w-full rounded-md border border-gray px-3 py-[.63rem]"
                      {...field}
                      value={field.value}
                    >
                      {currencies.map((currency) => (
                        <option
                          key={currency.id}
                          value={currency.country_code}
                        >
                          {currency.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </Form.Group>
            </Grid.Cell>
            <Grid.Cell
              columnSpan={{
                md: 6
              }}
            >
              <Controller
                name="iban"
                control={control}
                render={({ field }) => (
                  <Form.Input
                    isRequired
                    error={errors.iban?.message}
                    label={t("bank.iban_number")}
                    type="text"
                    placeholder={t("bank.iban_number")}
                    className="mb-0"
                    {...field}
                  />
                )}
              />
            </Grid.Cell>
            <Grid.Cell
              columnSpan={{
                md: 6
              }}
            >
              <Controller
                name="bic"
                control={control}
                render={({ field }) => (
                  <Form.Input
                    isRequired
                    error={errors.bic?.message}
                    label={t("bank.swift_number")}
                    type="text"
                    placeholder={t("bank.swift_number_input_placeholder")}
                    className="mb-0"
                    {...field}
                  />
                )}
              />
            </Grid.Cell>
          </Grid>
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-between">
          <Button
            type="submit"
            isDisabled={!isDirty || isSubmitting || !isValid}
            isLoading={isSubmitting}
            children={t(bankAccountData?.id ? "common.edit" : "common.add")}
          />
          <Button
            color="gray"
            onPress={onDismiss}
            children={t("common.cancel")}
          />
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BankAccountModal;
