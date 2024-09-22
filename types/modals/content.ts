import { ContentAttachment } from "@/types";

export type Content<T = {}> = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  type: string;
  sort: number;
  can_access: boolean;
  contentable: T;
  attachments: ContentAttachment[];
  created_at: string;
  updated_at: string;
  settings: {
    discussions_enabled: boolean;
  };
};
