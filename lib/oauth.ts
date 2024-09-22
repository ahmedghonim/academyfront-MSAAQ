import "server-only";

export const internalFetchClientAccessToken = async (): Promise<string | null> => {
  try {
    const port = process.env.PORT || process.env.APP_PORT || process.env.NEXT_PUBLIC_APP_PORT || 3000;

    const response = await fetch(`http://localhost:${port}/api/oauth`, {
      method: "POST"
    });

    const data = await response.json();

    const { access_token } = data.data;

    return access_token;
  } catch (error) {
    return null;
  }
};
