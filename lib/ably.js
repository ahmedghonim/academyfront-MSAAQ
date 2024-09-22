const API_KEY = process.env.ABLY_API_KEY;

if (API_KEY) {
  const keyv = require("./keyv");
  const Ably = require("ably");
  const { axios } = require("./axios");

  const realtime = new Ably.Realtime(API_KEY);

  const channel = realtime.channels.get("private:tenant.channel");

  channel.subscribe(async function (message) {
    const event = message.name;
    const payload = message.data;
    const host = payload.academy.domain;
    const isForced = payload.forced;

    if (event === "tenant.translations.updated") {
      const date = new Date();

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();

      const formattedDate = `${year}-${month}-${day}-${hour}:${minute}`;

      const translationsUpdatingCacheKey = `translations:${host}-updating-${formattedDate}`;

      if (!isForced && (await keyv.get(translationsUpdatingCacheKey))) {
        return;
      }

      try {
        if (!isForced) {
          // start updating translations
          await keyv.set(translationsUpdatingCacheKey, true, 60 * 1000);
        }

        const response = await axios
          .get("/translations", {
            headers: {
              "X-Academy-Domain": host,
              "X-API-Whitelist-Token": process.env.API_WHITELIST_TOKEN ? process.env.API_WHITELIST_TOKEN : undefined
            }
          })
          .then((response) => response.data.data);

        await keyv.set(host, response);
      } catch (error) {
        //eslint-disable-next-line no-console
        console.error(error);
      }
      // end updating translations
      await keyv.delete(translationsUpdatingCacheKey);
    }
  });
} else {
  //eslint-disable-next-line no-console
  console.error("ABLY_API_KEY is not set");
}
