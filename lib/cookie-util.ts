import { RequestCookie, parseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies, headers } from "next/headers";

export function getCookie(cookieName: string): RequestCookie | undefined {
  const allCookiesAsString = headers().get("Set-Cookie");

  if (!allCookiesAsString) {
    return cookies().get(cookieName);
  }

  const allCookiesAsObjects = allCookiesAsString
    .split(", ")
    .map((singleCookieAsString) => parseCookie(singleCookieAsString.trim()));

  const targetCookieAsObject = allCookiesAsObjects.find(
    (singleCookieAsObject) => typeof singleCookieAsObject.get(cookieName) == "string"
  );

  if (!targetCookieAsObject) {
    return cookies().get(cookieName);
  }

  return {
    name: cookieName,
    value: targetCookieAsObject.get(cookieName) ?? ""
  };
}
