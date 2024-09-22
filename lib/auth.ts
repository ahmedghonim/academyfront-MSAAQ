"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { SignJWT, jwtVerify } from "jose";

import fetchBaseQuery from "@/server-actions/config/base-query";
import { AuthorizeResponse, Member } from "@/types";

const secretKey = process.env.APP_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"]
    });

    return payload;
  } catch (error) {
    return null;
  }
}

type AuthorizeActionType = {
  via: "email" | "phone";
  email?: string;
  phone_code?: string;
  phone?: string;
};

export async function emailVerify(payload: { id: string; signature: string }) {
  return await fetchBaseQuery({
    url: `/auth/email/verify/${payload.id}/${payload.signature}`,
    method: "POST"
  });
}

export async function authorize(payload: AuthorizeActionType) {
  return await fetchBaseQuery<AuthorizeResponse>({
    url: "/auth/authorize",
    method: "POST",
    body: payload
  });
}

type RegisterActionType = {
  via: "password" | "otp";
  email?: string;
  phone?: string;
  phone_code?: string;
  password?: string;
  otp_code?: string;
};

export async function verify(payload: RegisterActionType) {
  const res = await fetchBaseQuery<{ token: string; member: Member }>({
    url: "/auth/authorize/verify",
    method: "POST",
    body: payload,
    headers: {
      "X-API-Whitelist-Token": process.env.API_WHITELIST_TOKEN ? process.env.API_WHITELIST_TOKEN : undefined
    }
  });

  if (res.error) {
    return res;
  }

  const { token, member } = res.data;

  await setSession(token, member);

  return {
    data: {
      data: {
        status: "authenticated"
      }
    }
  };
}

async function setSession(token: string, member: Member) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ token, member, expires });

  cookies().set("session", session, {
    expires,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
  phone_code: string;
}) {
  const res = await fetchBaseQuery<{ token: string; member: Member }>({
    url: "/auth/register",
    method: "POST",
    body: payload
  });

  if (res.error) {
    return res;
  }

  const { token, member } = res.data;

  await setSession(token, member);

  return {
    data: {
      data: {
        status: "authenticated"
      }
    }
  };
}

export async function forgetPassword(payload: { email: string }) {
  return await fetchBaseQuery({
    url: "/auth/password/email",
    method: "POST",
    body: payload
  });
}

export async function resetPassword(payload: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}) {
  return await fetchBaseQuery({
    url: "/auth/password/reset",
    method: "POST",
    body: payload
  });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;

  if (!session) return null;

  return (await decrypt(session)) as { token: string; member: Member; expires: Date };
}

export async function updateMember(payload: Member) {
  const session = await getSession();

  if (!session) return null;

  session.member = payload;

  await setSession(session.token, session.member);
}

export async function isAuthenticated(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) return false;

  const parsed = await decrypt(session);

  return parsed.expires > new Date();
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) return null;

  const parsed = await decrypt(session);

  if (!parsed) return null;

  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return {
    name: "session",
    value: await encrypt(parsed),
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: parsed.expires
  } as ResponseCookie;
}
