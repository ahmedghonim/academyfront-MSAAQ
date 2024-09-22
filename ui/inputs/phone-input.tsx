"use client";

import { forwardRef, useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { flushSync } from "react-dom";
import Phone, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Countries, classNames } from "@/utils";
import AppStorage from "@/utils/AppStorage";

import { Form } from "@msaaqcom/abjad";

const PhoneInput = forwardRef(
  ({ onChange, value, label, error, name, onlyCountries, ...props }: { [key: string]: any }, ref) => {
    const t = useTranslations();

    const [phone, setPhone] = useState<string | null>(null);
    const [langError, setLangError] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [isShown, setIsShown] = useState(false);

    const ar = Object.fromEntries(
      Countries.map(($country) => [$country.iso_3166_1_alpha2.toLocaleLowerCase(), $country.ar_name])
    );

    useEffect(() => {
      setLangError(error);
    }, [error]);

    useEffect(() => {
      if (typeof value === "string") {
        flushSync(() => {
          setPhone(value);
        });
        setIsShown(true);
      } else if (typeof value === "object") {
        flushSync(() => {
          setPhone(`${value?.phone_code}${value?.phone}`);
        });
        setIsShown(true);
      } else {
        setIsShown(true);
      }

      return () => {
        setIsShown(false);
      };
    }, [value]);

    useEffect(() => {
      const savedCountry = AppStorage.getItem("current_country") ?? "sa";

      if (onlyCountries && !onlyCountries.includes(savedCountry)) {
        setCountry(onlyCountries[0]);
      } else {
        setCountry(savedCountry.toLowerCase());
      }
    }, [setCountry]);

    return isShown ? (
      <div
        className={`flex flex-col space-y-2 overflow-visible ${
          !props.isReadOnly && props.isDisabled ? "opacity-30" : ""
        }`}
      >
        {label && (
          <Form.Label
            required={props.isRequired}
            children={label}
          />
        )}
        <Phone
          disabled={props.isDisabled}
          searchPlaceholder={t("common.search_country_name")}
          country={country}
          onlyCountries={onlyCountries}
          localization={ar}
          disableSearchIcon={true}
          jumpCursorToEnd={true}
          containerStyle={{
            direction: "ltr"
          }}
          searchStyle={{ margin: 0, border: 0, borderRadius: "0" }}
          buttonClass={"!bg-transparent !border-0 rounded-md"}
          dropdownClass={"!shadow-md  border border-gray-400 !rounded-md !px-3"}
          inputClass={classNames(
            "!h-full outline-0 !bg-transparent !w-full focus:ring-2 border",
            langError
              ? "focus:ring-danger-300 !bg-danger-50 !border-danger hover:border-danger-600"
              : "focus:ring-primary-300 border-gray hover:border-gray-600"
          )}
          inputProps={{
            ref,
            name
          }}
          enableSearch
          countryCodeEditable={true}
          onKeyDown={(e) => {
            if ((e.key >= "\u0600" && e.key <= "\u06FF") || (e.key >= "\uFE70" && e.key <= "\uFEFF")) {
              setLangError(t("validation.filed_must_be_valid_en_number"));
            } else {
              setLangError("");
            }
          }}
          onChange={(phone, country) => {
            setPhone(phone);
            const number = phone.slice((country as CountryData).dialCode?.length);

            if (!number) {
              onChange?.(null);

              return;
            }
            onChange?.({
              phone: phone.slice((country as CountryData).dialCode?.length),
              phone_code: (country as CountryData).dialCode
            });
          }}
          value={phone}
          {...props}
        />
        {langError && <Form.Errors errors={langError} />}
      </div>
    ) : null;
  }
);

export default PhoneInput;
