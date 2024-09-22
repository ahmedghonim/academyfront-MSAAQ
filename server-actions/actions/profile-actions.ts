"use server";

import { APIFetchResponse } from "@/server-actions/config/base-query";
import { Member } from "@/types";

import fetchBaseQuery from "../config/base-query";

type UpdateProfileActionType = {
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
};

export async function updateProfile(payload: UpdateProfileActionType) {
  const res = await fetchBaseQuery<Member>({
    url: "/account",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    method: "POST",
    params: {
      _method: "PATCH"
    },
    body: payload
  });

  if (res.error) {
    return res;
  }

  return res.data;
}

export async function updateLoginCredentials(payload: any) {
  const res = await fetchBaseQuery<any>({
    url: "/account/login-credentials",
    method: "POST",
    params: {
      _method: "PATCH"
    },
    body: payload
  });

  if (res.error) {
    return res;
  }

  return res.data;
}

export async function verifyLoginCredentials(payload: any) {
  const res = await fetchBaseQuery<APIFetchResponse<any>>({
    url: "/account/login-credentials/verify",
    method: "POST",
    params: {
      _method: "PATCH"
    },
    body: payload
  });

  if (res.error) {
    return res;
  }

  return res.data;
}

export async function updatePassword(payload: any) {
  const res = await fetchBaseQuery<APIFetchResponse<any>>({
    url: "/account/login-credentials/verify",
    method: "POST",
    params: {
      _method: "PATCH"
    },
    body: payload
  });

  if (res.error) {
    return res;
  }

  return res.data;
}
