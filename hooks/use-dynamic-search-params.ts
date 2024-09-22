"use client";

import { useSearchParams } from "next/navigation";

import { AnyObject } from "@/types";
import { objectToQueryString, unflatten } from "@/utils";
import { usePathname, useRouter } from "@/utils/navigation";

const useDynamicSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const set = (query: { [key: string]: any }, id?: string, opts?: { scroll?: boolean }) => {
    if (id) {
      router.push(`${pathname}?${objectToQueryString(query)}${id && `&#${id}`}`, opts);
    } else {
      router.push(`${pathname}?${objectToQueryString(query)}`, opts);
    }
  };

  const clear = () => {
    router.push(`${pathname}`);
  };

  const getUnflattenParams = () => {
    const result: AnyObject = {};

    for (let pair of searchParams.entries()) {
      if (result[pair[0]]) {
        if (Array.isArray(result[pair[0]])) {
          result[pair[0]].push(pair[1]);
        } else {
          result[pair[0]] = [result[pair[0]], pair[1]];
        }
      } else result[pair[0]] = pair[1];
    }

    return unflatten(result);
  };

  return {
    ...searchParams,
    set,
    get unflattenParams() {
      return getUnflattenParams();
    },
    clear
  };
};

export default useDynamicSearchParams;
