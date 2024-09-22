import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

import createIntlMiddleware from "next-intl/middleware";

// import { DEFAULT_LOCALE } from "@/i18n/config";
import { updateSession } from "@/lib/auth";
import { getTenantProtocol } from "@/lib/axios";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { randomUUID } from "@/utils";

import { DEFAULT_LOCALE, LOCALES } from "./i18n";
import { localePrefix } from "./utils/navigation";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - images (images)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|images|_next/static|_next/image|favicon.ico).*)"
  ]
};

type Environment = "production" | "development" | "other";

const protectedPaths = ["/account", "/library"];
const authPaths = ["/login", "/password/reset", "/passwordless", "/register"];

async function setCommonCookies(request: NextRequest, response: NextResponse, session: ResponseCookie | null) {
  const currentEnv = process.env.NODE_ENV as Environment;
  let sessionId = request.cookies.get("X-Session-ID")?.value;

  if (!sessionId) {
    sessionId = randomUUID();
  }

  response.cookies.set({
    name: "X-Session-ID",
    value: sessionId,
    path: "/",
    sameSite: "strict",
    secure: currentEnv === "production"
  });

  if (session) {
    response.cookies.set(session);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const session = await updateSession(request);
  const { nextUrl } = request;

  const path = nextUrl.pathname.replace(/^\/(ar|en)\//, "/");
  const host = request.headers.get("host");

  request.headers.set("x-current-path", request.nextUrl.pathname);

  if (session && authPaths.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const currentEnv = process.env.NODE_ENV as Environment;

  const protocol = getTenantProtocol(request.headers.get("x-forwarded-proto"));

  if (currentEnv === "production" && protocol !== "https") {
    return NextResponse.redirect(`https://${host}${request.nextUrl.pathname}`, 301);
  }

  if (
    nextUrl.pathname.startsWith("/sitemap.xml") ||
    nextUrl.pathname.startsWith("/robots") ||
    nextUrl.pathname.startsWith("/.well-known")
  ) {
    return NextResponse.next();
  }

  if (path.startsWith("/magic-login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!session && protectedPaths.some((p) => path.startsWith(p))) {
    const { pathname, search, origin, basePath } = request.nextUrl;

    const loginPageUrl = new URL(`${basePath}/login`, origin);

    loginPageUrl.searchParams.append("callbackUrl", `${basePath}${pathname}${search}`);

    const response = NextResponse.redirect(loginPageUrl);

    return await setCommonCookies(request, response, session);
  }
  try {
    const tenant = await fetchTenant();

    if (!tenant) {
      const response = NextResponse.next();

      return await setCommonCookies(request, response, session);
    }

    if (currentEnv === "production" && tenant && tenant.domain && tenant.domain !== host) {
      return NextResponse.redirect(`https://${tenant.domain}${request.nextUrl.pathname}`, 301);
    }

    const locales = tenant.supported_locales?.map((locale) => locale.code) || [];

    // Redirect if there is no locale
    const locale = tenant.locale;

    const appLocale = locale ?? DEFAULT_LOCALE;

    const handleI18nRouting = createIntlMiddleware({
      defaultLocale: appLocale,
      localePrefix,
      locales: locales
    });

    const response = handleI18nRouting(request);

    response.headers.set("x-current-path", request.nextUrl.pathname);

    return await setCommonCookies(request, response, session);
  } catch (error) {
    const handleI18nRouting = createIntlMiddleware({
      defaultLocale: DEFAULT_LOCALE,
      localePrefix,
      locales: LOCALES
    });

    const response = handleI18nRouting(request);

    return await setCommonCookies(request, response, session);
  }
}
