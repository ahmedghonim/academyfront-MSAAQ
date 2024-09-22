const Keyv = require("keyv");
const KeyvSqlite = require("@keyv/sqlite");
const CACHE_PATH = "sqlite://cache.sqlite3";
const keyv = new Keyv({ store: new KeyvSqlite(CACHE_PATH) });

module.exports = keyv;
