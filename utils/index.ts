import { getCookie, setCookie } from "cookies-next";
import { decode } from "html-entities";

import { AnyObject, Course, ReviewsAverage, TAMARA_SUPPORTED_COUNTRIES } from "@/types";
import AppStorage from "@/utils/AppStorage";
import { randomUUID } from "@/utils/uuid";

export const DEFAULT_NS = ["common", "validation", "currencies"];

export * from "./uuid";
export * from "./decimalToTime";
export * from "./query-string";
export * from "./country";
export * from "./countries";
export { toClassName, toCssVar, classNames, CSS } from "./css";
export * from "./calculateDiscount";
export * from "./AppStorage";
export const getRef = (url: string) => {
  let ref = null;

  try {
    ref = new URL(url).searchParams.get("ref");
  } catch {
    ref = new URL(`https://example.com${url}`).searchParams.get("ref");
  }

  return ref && Number.isInteger(Number(ref)) ? Number(ref) : null;
};

export function getWildcardCookiePath() {
  const envHost = process.env.NEXT_PUBLIC_OVERWRITE_TENANT_DOMAIN;

  if (envHost) return envHost;

  const { host, hostname } = window.location;

  if (host.split(".").length === 1) {
    return hostname;
  } else {
    let domainParts = host.split(".");

    domainParts.shift();

    return "." + domainParts.join(".");
  }
}

export function getHostName() {
  try {
    const { hostname } = window.location;

    return hostname;
  } catch (error) {}
}

export const IS_CLIENT: boolean = typeof window !== "undefined";
export const handleSessionId = (): string => {
  let sessionId = getCookie("X-Session-ID") as string;

  if (!sessionId) {
    sessionId = randomUUID();
    setCookie("X-Session-ID", sessionId, {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });
  }

  return sessionId;
};
export const toEnglishDigits = (str: string): string => {
  const persianNumbers: RegExp[] = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers: RegExp[] = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

  for (let i = 0; i < 10; i++) {
    str = str.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString());
  }

  return str;
};

export const isEnglish = (value: string): boolean => {
  const regExp: RegExp = /^[A-Za-z0-9]*$/;

  return regExp.test(value);
};

export const isNumeric = (value: string): boolean => {
  const regExp: RegExp = /^[0-9]*$/;

  return regExp.test(value);
};

export function stripHtmlTags(html: string): string {
  if (!html) return "";

  return decode(html).replace(/(<([^>]+)>)/gi, "");
}

export function truncateString(str: string, length: number, suffix: string = "..."): string {
  const suffixLength = suffix.length;

  return str.length > length ? str.slice(0, length - suffixLength) + suffix : str;
}

export const getStatusColor = (status: string) => {
  const colors: any = {
    draft: "default",
    accepted: "success",
    unlisted: "purple",
    published: "success",
    rejected: "danger",
    queued: "warning",
    processing: "info",
    ready: "success",
    failed: "danger",
    cancelled: "danger",
    declined: "danger",
    past_due: "warning",
    paused: "danger",
    deleted: "danger",
    completed: "success",
    approved: "success",
    paid: "success",
    refunded: "purple",
    pending: "orange",
    success: "success",
    transfer: "purple",
    fully_refunded: "default",
    partially_refunded: "default",
    active: "success",
    trialing: "purple"
  };

  return colors[status as string] ?? "default";
};

export const firstName = (name: string = "") => {
  return name.split(" ")[0]?.trim();
};

export const average = (reviews: ReviewsAverage[], total: number): number => {
  const totalWeightedSum = reviews.reduce((accumulator, review) => {
    return accumulator + review.rating * review.aggregate;
  }, 0);

  const avg = totalWeightedSum / total;

  if (isNaN(avg) || avg === Infinity) return 0;

  return Number(avg.toFixed(1));
};

export function isValidEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
}

export const createImportsScript = (
  src: string,
  attributes: AnyObject = {},
  onload: any = null,
  appendToHead: boolean = false
) => {
  const tempScript = document.createElement("script");

  tempScript.setAttribute("src", src);
  Object.keys(attributes).forEach((att) => {
    tempScript.setAttribute(att, attributes[att]);
  });
  tempScript.onload = () => {
    if (onload) {
      onload();
    }
  };
  if (appendToHead) {
    document.head.appendChild(tempScript);
  } else {
    document.body.appendChild(tempScript);
  }
};

export const isAppleDevice = () => {
  const devices = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod", "Mac", "MacIntel"];

  let isAppleDevice;

  try {
    isAppleDevice = devices.includes(navigator.platform) || navigator.userAgent.includes("Mac");
  } catch (e) {
    isAppleDevice = false;
  }

  return isAppleDevice;
};

export const shouldColorBeBlack = (backgroundColor: string | null): boolean => {
  if (!backgroundColor) return false;

  return computeLuminance(backgroundColor) > 0.179;
};

export const computeLuminance = (
  backgroundColor:
    | string
    | {
        r: number;
        g: number;
        b: number;
      }
): number => {
  let colors: {
    r: number;
    g: number;
    b: number;
  };

  if (typeof backgroundColor === "string") {
    if (backgroundColor.includes("var")) return 0;

    const matches = backgroundColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    if (!matches) return 0;

    colors = {
      r: parseInt(matches[1], 10),
      g: parseInt(matches[2], 10),
      b: parseInt(matches[3], 10)
    };
  } else {
    colors = backgroundColor;
  }

  const components: ("r" | "g" | "b")[] = ["r", "g", "b"];

  for (const c of components) {
    colors[c] = colors[c] / 255.0;

    if (colors[c] <= 0.03928) {
      colors[c] = colors[c] / 12.92;
    } else {
      colors[c] = Math.pow((colors[c] + 0.055) / 1.055, 2.4);
    }
  }

  return 0.2126 * colors.r + 0.7152 * colors.g + 0.0722 * colors.b;
};

export const calculateDarkerColor = (rgbColor: string, amount: number): string => {
  const rgbParts = rgbColor.match(/\d+/g);
  if (rgbParts && rgbParts.length === 3) {
    const r = parseInt(rgbParts[0]);
    const g = parseInt(rgbParts[1]);
    const b = parseInt(rgbParts[2]);

    const darkerR = Math.max(0, r - amount);
    const darkerG = Math.max(0, g - amount);
    const darkerB = Math.max(0, b - amount);

    return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
  }
  return rgbColor;
};

export const canUseTamara = () => {
  if (!IS_CLIENT) return false;

  let country = AppStorage.getItem("current_country");

  if (!country) {
    return false;
  }

  return TAMARA_SUPPORTED_COUNTRIES.includes(country.toUpperCase());
};

export const has404Error = (fetcher: any, store: any, args?: any) => {
  return fetcher.select(args)(store.getState()).error?.status == 404;
};

export type GetQueryErrorsResult =
  | null
  | {
      props: any | Promise<any>;
    }
  | {
      notFound: true;
    }
  | {
      redirect: any;
    };

export function getDestination(path: string, query: any) {
  let destination = "";

  if (query && Object.keys(query).length) {
    destination = `${path}?${new URLSearchParams(query).toString()}`;
  } else {
    destination = path;
  }

  return destination;
}

export const getQueryErrors = (
  fetchers: Array<any> | any,
  store: any,
  args?: Array<any> | any,
  callbackURI?: string,
  redirectURI?: string
): GetQueryErrorsResult => {
  if (Array.isArray(fetchers)) {
    const errors = fetchers
      .map((fetcher, index) => {
        if (Array.isArray(args)) {
          return fetcher.select(args[index])(store.getState()).error;
        }

        return fetcher.select(args)(store.getState()).error;
      })
      .filter((error) => error);

    if (!errors.length) {
      return null;
    }

    if (errors.some((error) => error.status == 404)) {
      return {
        notFound: true
      };
    }

    if (errors.some((error) => error.status == 500)) {
      return {
        props: {
          _apiError: errors.find((error) => error.status == 500)
        }
      };
    }

    if (errors.some((error) => error.status == 403) && redirectURI) {
      return {
        redirect: {
          permanent: false,
          destination: encodeURI(redirectURI)
        }
      };
    }

    if (errors.some((error) => error.status == 401)) {
      return {
        redirect: {
          permanent: false,
          destination: callbackURI ? `/login?callbackUrl=${encodeURI(callbackURI)}` : "/login"
        }
      };
    }
  } else {
    const error = fetchers.select(args)(store.getState()).error;

    if (!error) {
      return null;
    }

    if (error?.status == 404) {
      return {
        notFound: true
      };
    }

    if (error?.status == 500 || error?.status == 503) {
      return {
        props: {
          _apiError: error
        }
      };
    }

    if (error?.status == 403 && redirectURI) {
      return {
        redirect: {
          permanent: false,
          destination: encodeURI(redirectURI)
        }
      };
    }

    if (error?.status == 401) {
      return {
        redirect: {
          permanent: false,
          destination: callbackURI ? `/login?callbackUrl=${encodeURI(callbackURI)}` : "/login"
        }
      };
    }
  }

  return {
    props: {}
  };
};

export const getLastViewedPath = (course: Course) => {
  if (!course) {
    return "#";
  }

  if (course.enrollment?.last_viewed) {
    const chapter = course.chapters?.find((chapter) => chapter.id === course.enrollment.last_viewed?.chapter_id);

    if (chapter && chapter.drip_enabled && !chapter.can_access) {
      return `/courses/${course.slug}/chapters/${chapter.id}`;
    } else {
      return `/courses/${course.slug}/chapters/${course.enrollment.last_viewed?.chapter_id}/contents/${course.enrollment.last_viewed?.content_id}`;
    }
  } else if (course.chapters?.length) {
    const chapter = course.chapters.find((chapter) => chapter.can_access);

    if (chapter && chapter.contents?.length) {
      const content = chapter.contents.find((content) => content.can_access);

      if (content) {
        return `/courses/${course.slug}/chapters/${chapter.id}/contents/${content.id}`;
      }
    }
  }

  return `/courses/${course.slug}`;
};
