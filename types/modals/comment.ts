import { Member } from "@/types";

export type Comment = {
  content: string;
  id: number | string;
  user: Member | null;
  replies?: Replay[];
  created_at: string;
  updated_at: string;
};

export type Replay = {
  id: number | string;
  content: string;
  created_at: string;
  updated_at: string;
  user: Member | null;
};
