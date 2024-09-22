import { ContentAttachment } from "@/types";

export type Assignment = {
  id: number;
  content: string;
  submissions: {
    id: number;
    status: "processing" | "accepted" | "rejected";
    message: string;
    notes?: string;
    attachment: ContentAttachment;
    updated_at: string;
    created_at: string;
  }[];
  attachments: ContentAttachment[];
};
