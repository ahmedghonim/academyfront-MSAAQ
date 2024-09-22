import { NextResponse } from "next/server";

import getClientAccessToken from "@/utils/get-client-access-token";

export async function POST() {
  try {
    const accessToken = await getClientAccessToken();

    return NextResponse.json(
      {
        data: {
          status: "success",
          access_token: accessToken
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: "Failed to get client access token"
        }
      },
      { status: 500 }
    );
  }
}
