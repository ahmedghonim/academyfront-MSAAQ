class AppStorage {
  getItem(key: string) {
    if (this.storageAvailable()) {
      if (window.localStorage !== undefined && window.localStorage !== null) {
        return window.localStorage?.getItem(key);
      }
    }

    return undefined;
  }
  setItem(key: string, value: string) {
    if (this.storageAvailable()) {
      if (window.localStorage !== undefined && window.localStorage !== null) {
        window.localStorage?.setItem(key, value);
      }
    }
  }
  storageAvailable(type = "localStorage") {
    let storage;

    try {
      storage = window[type as "localStorage" | "sessionStorage"];
      const x = "__storage_test__";

      storage.setItem(x, x);
      storage.removeItem(x);

      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
}

const appStorage = new AppStorage();

export default appStorage;
