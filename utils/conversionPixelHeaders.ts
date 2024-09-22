import { CookieValueTypes, getCookie, hasCookie } from "cookies-next";
import { OptionsType } from "cookies-next/src/types";
import type { ParsedUrlQuery } from "querystring";

const CONVERSION_PIXEL_COOKIE_KEYS = ["_fbp", "_fbc", "_scid", "_ttp", "ref"];
const MAPPED_CONVERSION_PIXEL_COOKIE_KEYS = [
  {
    key: "ref",
    mappedKey: "X-Referred-By"
  }
];

const CONVERSION_QUERY_PARAMS_KEYS = ["fbclid", "ScCid", "ttclid"];

export function getConversionPixelHeaders(
  query: ParsedUrlQuery,
  sourceUrl: string,
  cookieOptions?: OptionsType
): Record<string, CookieValueTypes> {
  const conversionPixelHeaders: Record<string, CookieValueTypes> = {};

  CONVERSION_PIXEL_COOKIE_KEYS.forEach((key) => {
    if (hasCookie(key, cookieOptions)) {
      const mappedKey = MAPPED_CONVERSION_PIXEL_COOKIE_KEYS.find((item) => item.key === key)?.mappedKey;

      if (mappedKey) {
        conversionPixelHeaders[mappedKey] = getCookie(key, cookieOptions);
      } else {
        conversionPixelHeaders[key.replace("_", "x-")] = getCookie(key, cookieOptions);
      }
    }
  });

  CONVERSION_QUERY_PARAMS_KEYS.forEach((key) => {
    if (query[key]) {
      conversionPixelHeaders[`x-${key}`] = query[key] as string;
    }
  });

  conversionPixelHeaders["x-source-url"] = sourceUrl;

  return conversionPixelHeaders;
}

export function getConversionPixelHeadersFromString(cookieString: string): Record<string, CookieValueTypes> {
  const conversionPixelHeaders: Record<string, CookieValueTypes> = {};
  const cookieArray = cookieString.split("; ");

  const cookieObjects = cookieArray.map((pair) => {
    const [key, value] = pair.split("=");

    return { key, value };
  });

  CONVERSION_PIXEL_COOKIE_KEYS.forEach((key) => {
    if (cookieObjects.find((item) => item.key === key)) {
      const mappedKey = MAPPED_CONVERSION_PIXEL_COOKIE_KEYS.find((item) => item.key === key)?.mappedKey;

      if (mappedKey) {
        conversionPixelHeaders[mappedKey] = cookieObjects.find((item) => item.key === key)?.value;
      } else {
        conversionPixelHeaders[key.replace("_", "x-")] = cookieObjects.find((item) => item.key === key)?.value;
      }
    }
  });

  return conversionPixelHeaders;
}
