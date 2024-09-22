"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useSession } from "@/providers/session-provider";

interface IFormInputs {
  email: string;
}

const useValidateMemberBeforeCheckout = () => {
  const { member } = useSession();

  const schema = yup.object({
    email: yup.string().when(([], schema) => {
      if (!member) {
        return schema.email().required();
      }

      return schema.nullable().notRequired();
    })
  });

  const useFormApi = useForm<IFormInputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema)
  });

  const { getValues } = useFormApi;

  const isMemberValid = () => {
    const email = getValues("email");

    if (!member && !email) {
      return false;
    }

    return {
      email
    };
  };

  return {
    useFormApi,
    isMemberValid
  };
};

export default useValidateMemberBeforeCheckout;
