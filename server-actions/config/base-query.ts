import { headers as nextHeaders } from "next/headers";

import { getSession } from "@/lib/auth";
import { getCookie } from "@/lib/cookie-util";
import { internalFetchClientAccessToken } from "@/lib/oauth";
import { objectToQueryString } from "@/utils";

import { ErrorStatus, getErrorByStatus } from "./error-handler";
import { pollingInterval } from "./tags";
import { getTenantHost } from "./utils";

const isPlainObject = (value: unknown) => value?.constructor === Object;
const isJsonContentType = (headers: Headers) =>
  /*applicat*/ /ion\/(vnd\.api\+)?json/.test(headers.get("content-type") || "");

function stripUndefined(obj: any) {
  if (!isPlainObject(obj)) {
    return obj;
  }
  const copy: Record<string, any> = { ...obj };

  for (const [k, v] of Object.entries(copy)) {
    if (v === undefined || v === null) delete copy[k];
  }

  return copy;
}

export type Override<T1, T2> = T2 extends any ? Omit<T1, keyof T2> & T2 : never;

type CustomRequestInit = Override<
  RequestInit,
  {
    headers?: Headers | string[][] | Record<string, string | undefined | null> | undefined | null;
  }
>;

const validateStatus = (response: Response) => response.status >= 200 && response.status <= 299;

export interface FetchArgs extends Omit<CustomRequestInit, "next"> {
  url: string;
  params?: Record<string, any>;
  body?: any;
  tags?: string[];
}

export type FetchErrorType = {
  error: {
    /**
     * * `number`:
     *   HTTP status code
     */
    status: keyof typeof ErrorStatus | "FETCH_ERROR";
    message?:
      | string
      | {
          body: string;
          title: string;
        };
    errors: any;
  };
};
export interface FetchCollectionDataType<T> extends FetchErrorType {
  status?: any;
  data: T;
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<any>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
  errors?: Record<string, string | Array<string>>;
  message?:
    | string
    | {
        body: string;
        title?: string;
      };
}

export interface FetchDataType<T> extends FetchErrorType {
  data: T;
  errors?: Record<string, string | Array<string>>;
  message?:
    | string
    | {
        body: string;
        title?: string;
      };
}

interface ActionDataType<T> {
  data?: T;
  status: string;
  message:
    | string
    | {
        body: string;
        title?: string;
      };
  errors?: Record<string, string | Array<string>>;
}

export type APIFetchResponse<T> = T extends any[] ? FetchCollectionDataType<T> : FetchDataType<T>;

export type APIActionResponse<T> = ActionDataType<T>;

export type FetchReturnValue<T = unknown, E = unknown> =
  | {
      error: E;
      data?: undefined;
    }
  | APIFetchResponse<T>;

export function isAbsoluteUrl(url: string) {
  return new RegExp(`(^|:)//`).test(url);
}

const withoutTrailingSlash = (url: string) => url.replace(/\/$/, "");
const withoutLeadingSlash = (url: string) => url.replace(/^\//, "");

export function joinUrls(base: string | undefined, url: string | undefined): string {
  if (!base) {
    return url!;
  }
  if (!url) {
    return base;
  }

  if (isAbsoluteUrl(url)) {
    return url;
  }

  const delimiter = base.endsWith("/") || !url.startsWith("?") ? "/" : "";

  base = withoutTrailingSlash(base);
  url = withoutLeadingSlash(url);

  return `${base}${delimiter}${url}`;
}

const baseUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/tenant`;

export default async function fetchBaseQuery<T>(arg: FetchArgs): Promise<APIFetchResponse<T>> {
  let { url, headers, params, tags, ...rest } = arg;

  let config: RequestInit = rest;

  const host = getTenantHost();
  let accessToken = "";
  const session = await getSession();

  if (session && session.token) {
    accessToken = session.token;
  } else {
    accessToken = (await internalFetchClientAccessToken()) ?? "";
  }

  headers = new Headers(
    stripUndefined({
      Accept: "application/json",
      "X-Academy-Domain": host,
      "X-Requested-With": "XMLHttpRequest",
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      "X-Session-ID": getCookie("X-Session-ID")?.value,
      "x-client-ip": nextHeaders().get("cf-connecting-ip") ?? nextHeaders().get("x-forwarded-for"),
      ...headers
    })
  );

  config.headers = headers;

  // Only set the content-type to json if appropriate. Will not be true for FormData, ArrayBuffer, Blob, etc.
  const isJsonifiable = (body: any) =>
    typeof body === "object" && (isPlainObject(body) || Array.isArray(body) || typeof body.toJSON === "function");

  if (!config.headers.has("content-type") && isJsonifiable(config.body)) {
    config.headers.set("content-type", "application/json");
  }

  if (isJsonifiable(config.body) && isJsonContentType(config.headers)) {
    config.body = JSON.stringify(config.body);
  }

  if (params) {
    const divider = ~url.indexOf("?") ? "&" : "?";
    const query = objectToQueryString(stripUndefined(params));

    url += divider + query;
  }

  url = joinUrls(baseUrl, url);

  let response;

  if (tags) {
    config.next = {
      tags,
      revalidate: pollingInterval
    };
  }

  try {
    response = await fetch(url, config);
    let data = undefined;

    if (isJsonContentType(response.headers)) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return validateStatus(response)
      ? data
      : {
          error: {
            status: response.status,
            message: data.message ?? response.statusText,
            errors: data.errors
          }
        };
  } catch (error) {
    return {
      error: {
        status: "FETCH_ERROR",
        error: String(error)
      }
    } as any;
  }
}

export function validateAPIResponse(response: FetchErrorType): void {
  if (response.error) {
    if (response.error.status === 404) {
    }

    const error = getErrorByStatus(response.error.status);

    if (error) {
      throw error;
    }
  }
}
