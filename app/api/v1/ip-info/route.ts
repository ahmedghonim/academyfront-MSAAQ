import { headers as nextHeaders } from "next/headers";
import { NextResponse } from "next/server";

import fetchBaseQuery from "@/server-actions/config/base-query";

export async function GET() {
  const headers = {
    "proxy-cf-connecting-ip": nextHeaders().get("cf-connecting-ip"),
    "proxy-cf-ipcountry": nextHeaders().get("cf-ipcountry"),
    "proxy-cf-connecting-ip-6": nextHeaders().get("cf-connecting-ip-6"),
    "x-forwarded-for": nextHeaders().get("x-forwarded-for"),
    "x-forwarded-host": nextHeaders().get("x-forwarded-host"),
    "x-forwarded-port": nextHeaders().get("x-forwarded-port")
  };

  try {
    const response = await fetchBaseQuery({
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/ip-info`,
      headers: {
        ...headers,
        "X-API-Whitelist-Token": process.env.API_WHITELIST_TOKEN ? process.env.API_WHITELIST_TOKEN : undefined
      }
    });

    return NextResponse.json(response.data, {
      status: 200
    });
  } catch (error) {
    return NextResponse.json(
      {
        //@ts-ignore
        message: error?.response?.data?.message ?? error.message ?? error ?? "Internal Server Error"
      },
      {
        status: 500
      }
    );
  }
}
