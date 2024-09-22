import React from "react";

import { Control, Controller, FieldErrors } from "react-hook-form";
import * as yup from "yup";

import { Select } from "@/components/select";
import { useTenant } from "@/components/store/TenantProvider";
import { Academy, AnyObject, Member } from "@/types";
import PhoneInput from "@/ui/inputs/phone-input";

import { Form } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

export type ICustomProfileFieldsFormInputs = {
  meta?: {
    complete_profile: AnyObject;
  };
};

export interface CustomProfileFieldsProps {
  control: Control<ICustomProfileFieldsFormInputs>;
  errors: FieldErrors<ICustomProfileFieldsFormInputs>;
  className?: string;
}
export const customProfileFieldsSchema = (tenant: Academy | undefined) => {
  return yup.object().shape({
    meta: yup.object().when(([], schema) => {
      if (tenant) {
        return schema.shape({
          complete_profile: yup.object().shape(
            tenant.complete_profile_fields
              .map((metaField) => {
                if (metaField.required) {
                  if (metaField.type === "select") {
                    return {
                      [metaField.name]: yup
                        .object()
                        .shape({
                          value: yup.string().required(),
                          label: yup.string().required()
                        })
                        .required()
                    };
                  } else {
                    return {
                      [metaField.name]: yup.mixed().required()
                    };
                  }
                } else {
                  return {
                    [metaField.name]: yup.mixed().notRequired()
                  };
                }
              })
              // @ts-ignore
              .reduce((acc, curr) => ({ ...acc, ...curr }), {})
          )
        });
      }

      return schema.nullable().notRequired();
    })
  });
};

export const resetCustomProfileFields = (tenant: Academy | undefined, member: Member | undefined) => {
  if (!member || !tenant) {
    return {};
  }

  return {
    meta: {
      complete_profile: Object.keys(member?.meta?.complete_profile ?? {})
        ?.map((metaField) => {
          const field = tenant.complete_profile_fields.find((field) => field.name === metaField);

          if (!field) {
            return {};
          }

          if (field.type === "select") {
            const option = field?.options?.find((opt) => opt.value === member.meta?.complete_profile[metaField]);

            if (!option) {
              return {
                [field.name]: {
                  value: field?.options?.[0]?.value,
                  label: field?.options?.[0]?.label
                }
              };
            }

            return {
              [field.name]: {
                value: option.value,
                label: option.label
              }
            };
          }

          return {
            [field.name]: member.meta?.complete_profile[metaField]
          };
        })
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }
  };
};
const CustomProfileFields = ({ control, errors, className }: CustomProfileFieldsProps) => {
  const tenant = useTenant()((state) => state.tenant);

  if (!tenant) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {tenant.complete_profile_fields.map((metaField, index) => {
        const key = `metaField-${metaField.type}-${index}`;
        const name = `meta.complete_profile.${metaField.name}` as `meta.complete_profile.${string}`;
        const error = errors.meta?.complete_profile?.[metaField.name]?.message as string;

        if (metaField.type === "select") {
          return (
            <Form.Group
              key={key}
              className="mb-0 space-y-2"
              label={metaField.label}
              required={metaField.required}
              errors={error}
            >
              <Controller
                control={control}
                name={name}
                render={({ field }) => (
                  <Select
                    placeholder={metaField.placeholder}
                    options={metaField.options}
                    {...field}
                  />
                )}
              />
            </Form.Group>
          );
        }
        if (metaField.type === "phone") {
          return (
            <Controller
              key={key}
              name={name}
              control={control}
              render={({ field }) => (
                <PhoneInput
                  className="mb-0 h-12 grow"
                  label={metaField.label}
                  isRequired={metaField.required}
                  placeholder={metaField.placeholder}
                  error={error}
                  {...field}
                />
              )}
            />
          );
        }
        if (metaField.type === "text" || metaField.type === "email") {
          return (
            <Controller
              key={key}
              name={name}
              control={control}
              render={({ field }) => (
                <Form.Input
                  className="mb-0"
                  label={metaField.label}
                  placeholder={metaField.placeholder}
                  isRequired={metaField.required}
                  error={error}
                  {...field}
                />
              )}
            />
          );
        }
        if (metaField.type === "number") {
          return (
            <Controller
              key={key}
              name={name}
              control={control}
              render={({ field }) => (
                <Form.Input
                  type="number"
                  className="mb-0"
                  label={metaField.label}
                  placeholder={metaField.placeholder}
                  isRequired={metaField.required}
                  error={error}
                  {...field}
                />
              )}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default CustomProfileFields;
