"use server";

import { AnyObject, Appointment } from "@/types";
import { redirect } from "@/utils/navigation";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { getErrorByStatus } from "../config/error-handler";

export async function fetchAppointment(params: { slug: string; appointment: string | number }) {
  const response = await fetchBaseQuery<Appointment>({
    url: `/appointments/${params.appointment}`,
    method: "GET"
  });

  if (response.error) {
    if (response.error.status === 401) {
      redirect(
        `/login?callbackUrl=${encodeURI(`/coaching-sessions/${params.slug}/${params.appointment}/booking-details`)}`
      );
    }

    const error = getErrorByStatus(response.error.status === "FETCH_ERROR" ? "FETCH_ERROR" : response.error.status);

    if (error) {
      throw error;
    }

    return null;
  }

  return response.data;
}

export async function fetchAppointments(params: AnyObject) {
  const response = await fetchBaseQuery<Appointment[]>({
    url: "/appointments",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}
