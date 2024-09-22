"use client";

import { useEffect, useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { LoadingScreen } from "@/components/loading-screen";
import CustomProfileFields, {
  ICustomProfileFieldsFormInputs,
  customProfileFieldsSchema,
  resetCustomProfileFields
} from "@/components/modals/custom-profile-fields";
import { Select } from "@/components/select";
import CountriesSelect from "@/components/select/CountriesSelect";
import { useTenant } from "@/components/store/TenantProvider";
import { useResponseToastHandler } from "@/hooks";
import { updateMember } from "@/lib/auth";
import { useSession } from "@/providers/session-provider";
import { updateProfile } from "@/server-actions/actions/profile-actions";
import { Countries } from "@/utils";

import { UserIcon } from "@heroicons/react/24/outline";

import { Avatar, Button, Form, Icon } from "@msaaqcom/abjad";

interface IFormInputs extends ICustomProfileFieldsFormInputs {
  name: string;
  english_name: string;
  username: string;
  gender: {
    label: string;
    value: any;
  };
  dob: string;
  job_title: string;
  bio: string;
  education: {
    label: string;
    value: any;
  };
  national_id: string | undefined;
  avatar: any;
  country_code: {
    label: string;
    value: any;
  };
}

const genderOptions = [
  { value: "male", label: "common.male" },
  { value: "female", label: "common.female" }
];
const educationalLevelOptions = [
  { value: "primary", label: "profile.personal_data_primary" },
  { value: "intermediate", label: "profile.personal_data_intermediate" },
  { value: "bachelor", label: "profile.personal_data_bachelor" },
  { value: "prof", label: "profile.personal_data_prof" }
];

const PersonalData = () => {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);
  const { member } = useSession();
  const [profilePicture, setProfilePicture] = useState<any>(null);

  const arabicRegex = /^[\u0600-\u06FF\s]+$/;

  const schema = customProfileFieldsSchema(tenant).shape({
    avatar: yup.mixed().nullable().notRequired(),
    name: yup
      .string()
      .matches(arabicRegex, () => t("validation.name_must_be_in_arabic"))
      .required(),
    username: yup.string().required(),
    national_id: yup.string().when(
      ["country_code"], // Notice the $ sign!!!
      ([country_code], schema) => {
        if (tenant && tenant.nelc_compliant && country_code?.value?.toLowerCase() === "sa") {
          return schema.required();
        }

        return schema.nullable().notRequired();
      }
    ),
    dob: yup.string().nullable(),
    country_code: yup
      .object()
      .shape({
        label: yup.string().required(),
        value: yup.string().required()
      })
      .required(),
    job_title: yup.string().nullable(),
    bio: yup.string().nullable(),
    gender: yup
      .object()
      .shape({
        label: yup.string().nullable(),
        value: yup.string().nullable()
      })
      .nullable(),
    education: yup
      .object()
      .shape({
        label: yup.string().nullable(),
        value: yup.string().nullable()
      })
      .nullable()
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<IFormInputs>({
    // resolver: yupResolver(schema),
    mode: "onSubmit"
  });

  const isNationalIdRequired = useMemo(() => {
    return tenant && tenant.nelc_compliant && watch("country_code")?.value?.toLowerCase() === "sa";
  }, [watch("country_code")]);
  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  console.log("displayErrors >>>> ", displayErrors);

  useEffect(() => {
    setProfilePicture(member?.avatar);
    if (member) {
      const g = genderOptions.find((g) => g.value === member.gender);
      const e = educationalLevelOptions.find((e) => e.value === member.education);
      const currentCountry = Countries.find((c) => c.iso_3166_1_alpha2 === member.country_code);

      reset({
        name: member.name,
        // english_name: member.english_name,
        username: member.username,
        national_id: member.national_id,
        country_code: {
          label: currentCountry?.ar_name,
          value: currentCountry?.iso_3166_1_alpha2
        },
        dob: member.dob,
        job_title: member.job_title,
        bio: member.bio,
        gender: {
          label: t(g?.label ?? ""),
          value: g?.value
        },
        education: {
          label: t(e?.label ?? ""),
          value: e?.value
        },
        ...resetCustomProfileFields(tenant, member)
      });
    }
  }, [member]);

  const onProfilePictureChange = (input: any) => {
    if (input.files && input.files[0]) {
      let reader = new FileReader();

      reader.onload = function (e) {
        setProfilePicture(e?.target?.result ?? "");
      };

      reader.readAsDataURL(input.files[0]);

      setValue("avatar", input.files[0], { shouldDirty: true });
    }
  };

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const response = (await updateProfile({
      ...data,
      national_id: isNationalIdRequired ? data.national_id : undefined,
      country_code: data.country_code.value.toLowerCase(),
      gender: data.gender.value,
      education: data.education.value
    })) as any;

    if (displayErrors(response)) return;

    if (response.data) {
      await updateMember(response.data);
    }

    displaySuccess(response);
  };

  return !member ? (
    <LoadingScreen />
  ) : (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <label className="mb-10 flex flex-col items-center">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => onProfilePictureChange(e.target)}
        />
        {!profilePicture && (
          <div className="flex items-center justify-center rounded-full border border-gray bg-gray-50 p-5">
            <Icon
              size="lg"
              children={<UserIcon />}
            />
          </div>
        )}
        {profilePicture && (
          <Avatar
            size="xl"
            name={member?.name ?? ""}
            imageUrl={profilePicture}
          />
        )}
        <Button
          size="sm"
          color="gray"
          children={t("profile.personal_data_upload_avatar")}
          className="mt-4"
        />
      </label>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Form.Input
            // isRequired
            error={errors.name?.message}
            label={t("profile.personal_data_student_name")}
            description={t("common.name_in_arabic_helper")}
            placeholder={t("profile.personal_data_student_name_input_placeholder")}
            {...field}
          />
        )}
      />
      <Controller
        render={({ field }) => (
          <Form.Input
            // isRequired
            error={errors.username?.message}
            label={t("common.username")}
            placeholder={t("profile.personal_data_username_input_placeholder")}
            {...field}
          />
        )}
        control={control}
        name="username"
      />
      <Form.Group
        // required
        className="space-y-2"
        label={t("common.country")}
        errors={errors.country_code?.value?.message as string}
      >
        <Controller
          render={({ field }) => (
            <CountriesSelect
              placeholder={t("common.search_country_name")}
              {...field}
            />
          )}
          name={"country_code"}
          control={control}
        />
      </Form.Group>

      {isNationalIdRequired && (
        <Controller
          control={control}
          name="national_id"
          render={({ field }) => (
            <Form.Input
              isRequired
              type="number"
              error={errors.national_id?.message}
              label={t("profile.personal_data_id_number")}
              placeholder={t("profile.personal_data_id_number_input_placeholder")}
              description={t("profile.personal_data_id_number_message")}
              {...field}
            />
          )}
        />
      )}
      <Form.Group
        className="space-y-2"
        label={t("common.gender")}
        errors={errors.gender?.value?.message as string}
      >
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select
              placeholder={t("common.select")}
              options={genderOptions.map((gender) => ({
                label: t(gender.label),
                value: gender.value
              }))}
              {...field}
            />
          )}
        />
      </Form.Group>
      <Controller
        control={control}
        name="dob"
        render={({ field }) => (
          <Form.Input
            label={t("common.dob")}
            type="date"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="job_title"
        render={({ field }) => (
          <Form.Input
            label={t("profile.personal_data_job_title")}
            placeholder={t("profile.personal_data_job_title_input_placeholder")}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="bio"
        render={({ field }) => (
          <Form.Input
            label={t("profile.personal_data_introduction")}
            placeholder={t("profile.personal_data_introduction_input_placeholder")}
            {...field}
          />
        )}
      />
      <Form.Group
        className="space-y-2"
        label={t("profile.personal_data_educational_level")}
        errors={errors.education?.value?.message as string}
      >
        <Controller
          control={control}
          name="education"
          render={({ field }) => (
            <Select
              menuPlacement="top"
              placeholder={t("common.select")}
              options={educationalLevelOptions.map((gender) => ({
                label: t(gender.label),
                value: gender.value
              }))}
              {...field}
            />
          )}
        />
      </Form.Group>
      <CustomProfileFields
        className="mb-6"
        //@ts-expect-error
        control={control}
        errors={errors}
      />
      <Button
        type="submit"
        children={t("common.save_modifications")}
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
      />
    </Form>
  );
};

export default PersonalData;
