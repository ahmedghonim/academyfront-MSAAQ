"use server";

import "server-only";

import keyv from "@/lib/keyv";

const fetchClientAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-API-Whitelist-Token": process.env.API_WHITELIST_TOKEN ? process.env.API_WHITELIST_TOKEN : ""
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET
      }),
      next: {
        //keep cache forever
        revalidate: 60 * 60 * 24 * 30
      }
    });

    const data = await response.json();

    const { access_token, expires_in } = data.data;

    await keyv.set("client_access_token", access_token, expires_in);

    return access_token;
  } catch (error) {
    return null;
  }
};

const getClientAccessToken = async (): Promise<string> => {
  let accessToken = "";

  accessToken = await keyv.get("client_access_token");

  if (!accessToken) {
    accessToken = (await fetchClientAccessToken()) || "";
  }

  return accessToken;
};

export default getClientAccessToken;
