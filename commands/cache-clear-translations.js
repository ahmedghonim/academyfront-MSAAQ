require("dotenv").config();

const keyv = require("../lib/keyv");

const args = process.argv.slice(2);
const hostname = args[0];

if (!hostname) {
  // eslint-disable-next-line no-console
  console.error("Hostname is required");
  process.exit(1);
}

(async () => {
  // eslint-disable-next-line no-console
  console.info(`Clearing cache for ${hostname}`);
  if (await keyv.delete(hostname)) {
    // eslint-disable-next-line no-console
    console.info(`Cache cleared for ${hostname}`);
  } else {
    // eslint-disable-next-line no-console
    console.info(`Cache not found for ${hostname}`);
  }

  process.exit(0);
})();
