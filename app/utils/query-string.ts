"use client";

// @ts-ignore
import deParam from "can-deparam";

export const parseQueryString = (input: string | URL) => {
  let queryString = "";

  if (typeof input === "string") {
    const split = input.split("?");

    queryString = split.length > 1 ? split[1] : split[0];
  } else if (input instanceof URL) {
    queryString = input.search.slice(1);
  } else {
    throw new Error("Invalid input: expected a string or URL object");
  }

  return deParam(queryString);
};

export const objectToQueryString = (initialObj: any) => {
  const reducer =
    (obj: any, parentPrefix = null) =>
    (prev: any, key: any) => {
      const val = obj[key];

      const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;

      if (val == null || typeof val === "function") {
        prev.push(`${prefix}=`);

        return prev;
      }

      if (["number", "boolean", "string"].includes(typeof val)) {
        prev.push(`${prefix}=${val}`);

        return prev;
      }

      prev.push(Object.keys(val).reduce(reducer(val, prefix), []).join("&"));

      return prev;
    };

  return Object.keys(initialObj).reduce(reducer(initialObj), []).join("&");
};

type NestedObject = { [key: string]: any };

const { hasOwnProperty } = Object.prototype;

export function unflatten(obj: { [key: string]: any }): NestedObject {
  const result: NestedObject = {};

  for (const key in obj) {
    if (!hasOwnProperty.call(obj, key)) {
      continue;
    }

    const keys = key.replace(/\]/g, "").split(/\[/);
    let current = result;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        if (Array.isArray(current)) {
          current.push(obj[key]);
        } else {
          current[k] = obj[key];
        }
      } else {
        if (!current[k]) {
          current[k] = isNaN(Number(keys[index + 1])) ? {} : [];
        }
        current = current[k];
      }
    });
  }

  return result;
}
