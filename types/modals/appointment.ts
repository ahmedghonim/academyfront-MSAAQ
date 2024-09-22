import { Product } from "@/types";

export enum AppointmentStatus {
  PENDING = "pending",
  AVTIVE = "active",
  CANCELED = "canceled",
  COMPLETED = "completed"
}

export type Appointment = {
  id: number;
  join_url: string;
  status: AppointmentStatus;
  start_at: string;
  end_at: string;
  is_ended: boolean;
  is_upcoming: boolean;
  product: Product | undefined | null;
  created_at: string;
  updated_at: string;
};

export type LibraryAppointment = {
  duration: number;
  end_at: string;
  id: number;
  join_url: string;
  member_timezone: string;
  start_at: string;
  title: string;
  type: "coaching_session" | "meeting" | "webinar";
  is_recurring: boolean;
  occurrence: {
    total: number;
    status: string;
    current: number;
    duration: number;
    start_time: string;
    occurrence_id: number;
  };
};
