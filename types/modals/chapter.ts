import { Content } from "@/types";

export type Chapter = {
  id: number;
  title: string;
  sort: number;
  can_access: boolean;
  drip_enabled: boolean;
  drip_type: "started_at" | "created_at" | "dripped_at";
  dripped_at: string | null;
  drip_after: number;
  contents: Content[];
  updated_at: string;
  created_at: string;
};
