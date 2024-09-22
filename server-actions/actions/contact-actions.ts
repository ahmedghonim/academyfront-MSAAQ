"use server";

import { ContactFields } from "@/types/modals/contactFields";

import fetchBaseQuery from "../config/base-query";

export async function createContact(payload: {
  name: string;
  email: string;
  message: string;
  subject: string;
  path: string;
}) {
  const response = await fetchBaseQuery<ContactFields>({
    url: "/pages/contact",
    method: "POST",
    body: payload
  });

  return response;
}

export async function subscribeToNewsletter(payload: { name: string; email: string }) {
  const response = await fetchBaseQuery<ContactFields>({
    url: "/newsletter",
    method: "POST",
    body: payload
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response;
}
