"use server";

import { tags } from "@/server-actions/config/tags";
import { AnyObject, Appointment, Certificate, Course, LibraryAppointment, Product } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";

export async function fetchMemberCertificates(params?: AnyObject) {
  const response = await fetchBaseQuery<Certificate[]>({
    url: "/certificates",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchMemberAppointments(params?: AnyObject) {
  const response = await fetchBaseQuery<Appointment[]>({
    url: "/account/appointments",
    method: "GET",
    params,
    tags: [tags.fetchMemberAppointments]
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchMemberUpcomingAppointments(params?: AnyObject) {
  const response = await fetchBaseQuery<LibraryAppointment[]>({
    url: "/account/upcoming-appointments",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchMemberCourses(params?: AnyObject) {
  const response = await fetchBaseQuery<Course[]>({
    url: "/account/courses",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchMemberStats(params?: AnyObject) {
  const response = await fetchBaseQuery<{
    todo_courses: number;
    in_progress_courses: number;
    completed_courses: number;
    watched_videos_duration: number;
    accepted_assignments: number;
    eligible_certificates: number;
  }>({
    url: "/account/stats",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response.data;
}

export async function fetchMemberRejectedAssignments(params?: AnyObject) {
  const response = await fetchBaseQuery<
    {
      id: number;
      title: string;
      course: Course;
      content_id: number;
      chapter_id: number;
    }[]
  >({
    url: "/account/assignments/rejected",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchMemberAssignments(params?: AnyObject) {
  const response = await fetchBaseQuery<
    {
      id: number;
      title: string;
      course: Course;
      content_id: number;
      chapter_id: number;
    }[]
  >({
    url: "/account/assignments",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchMemberQuizzes(params?: AnyObject) {
  const response = await fetchBaseQuery<
    {
      id: number;
      course: Course;
      content_id: number;
      chapter_id: number;
      title: string;
    }[]
  >({
    url: "/account/quizzes",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchMemberProducts(params?: AnyObject) {
  const response = await fetchBaseQuery<Product[]>({
    url: "/account/products",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}
