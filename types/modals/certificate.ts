import { Course, Member } from "@/types";

export type Certificate = {
  id: number;
  serial: string;
  created_at: string;
  course: Course | null;
  member: Member;
};
