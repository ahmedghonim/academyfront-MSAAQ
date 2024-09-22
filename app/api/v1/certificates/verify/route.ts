import { NextResponse } from "next/server";

import fetchBaseQuery from "@/server-actions/config/base-query";
import { Certificate } from "@/types";

export async function POST(request: Request) {
  const { serial } = await request.json();

  const response = await fetchBaseQuery<Certificate>({
    url: "/certificates/verify",
    method: "POST",
    body: {
      serial
    }
  });

  if (response.error) {
    return NextResponse.json(response.error, { status: 500 });
  }

  return NextResponse.json(
    {
      data: {
        created_at: response.data.created_at,
        member: {
          avatar: response.data.member.avatar,
          name: response.data.member.name,
          english_name: response.data.member.name
        }
      }
    },
    { status: 200 }
  );
}
