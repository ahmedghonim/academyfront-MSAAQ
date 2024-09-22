import { AnyObject, PaginationLink } from "@/types";

export type Filter = {
  name: string;
  type: string;
  label: string;
  select_type: string;
  options: Array<any>;
  hasOptions: boolean;
};

export enum StatusCode {
  COURSE_COMPLETED = "COURSE_COMPLETED"
}

export type APIActionResponse<T> = {
  data: {
    data: T;
    message?: {
      body: string;
      title?: string;
    };
    code?: StatusCode;
  };
  error?: {
    status: number;
    message: string;
    errors: AnyObject;
  };
};

export type APIResponse<T> = {
  data: Array<T>;
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<PaginationLink>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type APISingleResourceResponse<T> = {
  data: T;
};

export type IpInfo = {
  countryCode: string | null;
};
