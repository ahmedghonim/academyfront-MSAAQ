"use clint";

import React, { useEffect, useMemo } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import clone from "lodash/clone";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useTenant } from "@/components/store/TenantProvider";
import { useProfileCompleteStatus, useResponseToastHandler } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { useUpdateProfileMutation } from "@/store/slices/api/memberSlice";
import {
  AppSliceStateType,
  setCompletedProfilePercentage,
  setOpenCompleteProfileModal
} from "@/store/slices/app-slice";
import { PhoneInput } from "@/ui/inputs";
import { Countries } from "@/utils";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

import { Button, Form, Icon, Modal, Progress } from "@msaaqcom/abjad";

import CustomProfileFields, {
  ICustomProfileFieldsFormInputs,
  customProfileFieldsSchema,
  resetCustomProfileFields
} from "./custom-profile-fields";

interface IFormInputs extends ICustomProfileFieldsFormInputs {
  name: string;
  english_name: string;
  email: string;
  phone: {
    phone_code: string | number;
    phone: string | number;
  };
  national_id?: string;
}

const CompleteProfileModal = () => {
  const tenant = useTenant()((state) => state.tenant);

  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { member } = useSession();

  const [updateProfile] = useUpdateProfileMutation();
  const { openCompleteProfileModal, completedProfilePercentage } = useAppSelector<AppSliceStateType>(
    (state) => state.app
  );

  const isNationalIdRequired = useMemo(
    () =>
      tenant &&
      tenant.nelc_compliant &&
      member &&
      member.country_code &&
      !member.national_id &&
      member.country_code.toLowerCase() === "sa",
    [tenant, member]
  );

  const arabicRegex = /^[\u0600-\u06FF\s]+$/;

  const schema = customProfileFieldsSchema(tenant).shape({
    name: yup
      .string()
      .matches(arabicRegex, () => t("validation.name_must_be_in_arabic"))
      .required(),
    email: yup.string().required(),
    phone: yup.object().shape({
      phone_code: yup.string().required(),
      phone: yup.string().required()
    }),
    national_id: yup.string().when(([], schema) => {
      if (isNationalIdRequired) {
        return schema.required();
      }

      return schema.nullable().notRequired();
    })
  });

  const countryCallingCode = useMemo(() => {
    return Countries.find((country) => country.calling_code == member?.phone_code)?.iso_3166_1_alpha2;
  }, [member]);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onSubmit"
  });

  const { displayErrors, displaySuccess } = useResponseToastHandler({
    setError
  });
  const { profileRequiredFieldsCompleted } = useProfileCompleteStatus();

  useEffect(() => {
    if (member && tenant) {
      reset({
        name: member.name,
        // english_name: member.english_name,
        email: member.email,
        phone: {
          phone_code: member.phone_code,
          phone: member.phone
        },
        national_id: member.national_id,
        ...resetCustomProfileFields(tenant, member)
      });
    }
  }, [reset, member, tenant]);

  const onSubmit = handleSubmit(async (data) => {
    const $data = clone(data);

    Object.keys($data?.meta?.complete_profile ?? {}).map((key) => {
      if (typeof $data?.meta?.complete_profile[key] === "object" && $data?.meta?.complete_profile[key] !== null) {
        const obj = $data?.meta?.complete_profile[key];

        if ("label" in obj) {
          $data.meta.complete_profile[key] = obj.value;
        }
      }
    });

    const response = (await updateProfile({
      ...$data,
      meta: {
        complete_profile: $data.meta?.complete_profile
      },
      phone_code: $data.phone.phone_code,
      phone: $data.phone.phone
    })) as any;

    if (displayErrors(response)) {
      return;
    }

    displaySuccess(response);
    dispatch(setOpenCompleteProfileModal(false));
    dispatch(setCompletedProfilePercentage(100));
    dispatch({ type: "auth/setMember", payload: response.data.data });
  });

  return (
    <Modal
      open={false}
      onDismiss={() => {
        dispatch(setOpenCompleteProfileModal(false));
      }}
      bordered
      size="xl"
      className="lg:my-4"
      // @ts-ignore
      dismissible={profileRequiredFieldsCompleted}
    >
      <Modal.Header
        dismissible={profileRequiredFieldsCompleted}
        title={t("common.complete_your_profile")}
      />
      <Modal.Body className="flex flex-col space-y-6 overflow-y-auto lg:max-h-[600px]">
        <div className="flex flex-col gap-3.5 rounded-xl bg-gray-100 p-4">
          <div className="flex w-full items-center gap-2">
            <Icon size="sm">
              <InformationCircleIcon />
            </Icon>
            {t("common.complete_your_profile_description")}
            <Icon
              size="xs"
              className="ms-auto"
            >
              <ArrowRightIcon className="rtl:rotate-180" />
            </Icon>
          </div>
          <Progress.Bar
            value={completedProfilePercentage}
            color={completedProfilePercentage >= 100 ? "success" : "warning"}
          />
        </div>
        <Controller
          render={({ field }) => (
            <Form.Input
              isRequired
              error={errors.name?.message}
              label={t("common.name_in_arabic")}
              placeholder={t("common.name_in_arabic_input_placeholder")}
              description={t("common.name_in_arabic_helper")}
              className="mb-0"
              {...field}
            />
          )}
          name={"name"}
          control={control}
        />
        <Controller
          render={({ field }) => (
            <Form.Input
              isRequired
              error={errors.email?.message}
              disabled={!!member?.email}
              label={t("common.email")}
              placeholder={t("common.email_input_placeholder")}
              className="mb-0"
              {...field}
            />
          )}
          name={"email"}
          control={control}
        />
        <Controller
          name={"phone"}
          control={control}
          render={({ field }) => (
            <PhoneInput
              isRequired
              disabled={
                member?.country_code && member?.phone_code
                  ? !!member?.phone
                    ? isValidPhoneNumber(String(member?.phone), countryCallingCode as CountryCode)
                    : false
                  : false
              }
              className="h-12 grow"
              label={t("common.phone")}
              placeholder={t("common.phone_input_placeholder")}
              error={errors.phone?.message}
              {...field}
            />
          )}
        />
        {isNationalIdRequired && (
          <Controller
            control={control}
            name="national_id"
            render={({ field }) => (
              <Form.Input
                className="mb-0"
                isRequired
                error={errors.national_id?.message}
                label={t("common.national_id")}
                placeholder={t("common.national_id_input_placeholder")}
                description={t("common.national_id_message")}
                {...field}
              />
            )}
          />
        )}
        <CustomProfileFields
          //@ts-expect-error
          control={control}
          errors={errors}
        />
      </Modal.Body>
      <Modal.Footer className="flex flex-col justify-between space-y-4 sm:!flex-row sm:!space-y-0">
        <Button
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          onPress={() => onSubmit()}
        >
          {t("common.save_edits")}
        </Button>
        {profileRequiredFieldsCompleted && (
          <Button
            color="gray"
            onPress={() => dispatch(setOpenCompleteProfileModal(false))}
          >
            {t("common.cancel")}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CompleteProfileModal;
