import { NextRequest, NextResponse } from "next/server";

import fetchBaseQuery from "@/server-actions/config/base-query";

// This function should fetch the file content from your CMS.
async function fetchFromCMS(): Promise<string> {
  const data = await fetchBaseQuery<string>({
    url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/.well-known/apple-developer-merchantid-domain-association`,
    method: "GET"
  });

  if (data.data) {
    //@ts-ignore
    return data.data;
  }
  return "";
}

export async function GET(req: NextRequest) {
  try {
    const content = await fetchFromCMS();
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=UTF-8"
      }
    });
  } catch (error) {
    return new NextResponse("Error fetching file from CMS", { status: 500 });
  }
}
