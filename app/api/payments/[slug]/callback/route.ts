import { NextResponse } from "next/server";

import fetchBaseQuery from "@/server-actions/config/base-query";
import { redirect } from "@/utils/navigation";

export async function GET(
  request: Request,
  {
    params
  }: {
    params: Partial<{
      [key: string]: string | string[];
    }>;
  }
) {
  const { slug, ...query } = params;

  const response = await fetchBaseQuery<any>({
    url: `payments/${slug}/callback`,
    method: "POST",
    params: query
  });

  if (response.error) {
    redirect("/cart/checkout");
  }

  const uuid = response.data?.data?.cart?.uuid;

  if (uuid) {
    redirect(`/cart/${uuid}/thank-you`);
  } else {
    redirect("/cart/checkout");
  }
}

export async function POST(
  request: Request,
  {
    params
  }: {
    params: Partial<{
      [key: string]: string | string[];
    }>;
  }
) {
  const { slug, ...query } = params;
  const body = await request.json();

  const response = await fetchBaseQuery<string>({
    url: `payments/${slug}/callback`,
    method: "POST",
    params: query,
    body
  });

  if (response.error) {
    return NextResponse.json(response.error, { status: 500 });
  }

  // @ts-ignore
  return NextResponse.json(response.data, { status: response.status });
}
