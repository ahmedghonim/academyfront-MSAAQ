"use client";

import { useMemo } from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useAppSelector, useCopyToClipboard } from "@/hooks";
import { Bank } from "@/types";

import { DocumentCheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

import { Button, Form, Grid, Icon } from "@msaaqcom/abjad";

const BankField = ({ label, value }: { label: string; value: string }) => {
  const [copy, values] = useCopyToClipboard();

  return (
    <Form.Input
      className="relative mb-0"
      label={label}
      value={value}
      append={
        <Button
          onPress={() => copy(value)}
          variant="link"
          className="absolute left-3 z-10 bg-white px-0"
          color="gray"
          icon={
            !values.includes(value) ? (
              <Icon
                size="sm"
                children={<DocumentDuplicateIcon />}
              />
            ) : (
              <Icon
                size="sm"
                className="text-success"
                children={<DocumentCheckIcon />}
              />
            )
          }
        />
      }
      readOnly
    />
  );
};

const BankDetails = ({ bank }: { bank: Bank }) => {
  const t = useTranslations();
  const { locale } = useParams();
  const { currencies } = useAppSelector((state) => state.app);

  const currency = useMemo(() => {
    let c = null;

    try {
      c = currencies[locale as "ar" | "en"][bank.currency];
    } catch (e) {
      c = bank.currency;
    }

    return c;
  }, [currencies, locale]);

  if (!bank) {
    return null;
  }

  return (
    <Grid
      columns={{
        md: 2,
        sm: 2,
        xs: 1
      }}
      gap={{
        xl: "1rem",
        lg: "1rem",
        md: "1rem",
        sm: "1rem",
        xs: "1rem"
      }}
    >
      {[
        { value: bank.bank_name, label: t("bank.bank_name") },
        { value: bank.account_number, label: t("bank.account_number") },
        { value: bank.account_name, label: t("bank.account_name") },
        { value: bank.iban, label: t("bank.iban_number") },
        { value: bank.bic, label: "Swift / BIC" },
        { value: currency, label: t("bank.account_currency") }
      ].map(({ value, label }, index) => (
        <Grid.Cell key={index}>
          <BankField
            label={label as string}
            value={value}
          />
        </Grid.Cell>
      ))}
    </Grid>
  );
};

export default BankDetails;
