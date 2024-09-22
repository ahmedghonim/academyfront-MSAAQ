"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { APIFetchResponse } from "@/server-actions/config/base-query";
import { AnyObject } from "@/types";

const calculateTotalPages = (total: number, limit: number) => {
  return Math.ceil(total / limit);
};

const useInfiniteScroll = <T>(
  initialData: APIFetchResponse<T[]>,
  action: (_: AnyObject) => Promise<APIFetchResponse<T[]>>,
  { ...queryParameters }
) => {
  const { limit } = queryParameters;

  const [response, setResponse] = useState<APIFetchResponse<T[]>>(() => initialData);

  const [data, setData] = useState<T[]>(() => initialData.data);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUninitialized, setIsUninitialized] = useState<boolean>(true);

  const totalPages = useMemo<number>(() => {
    return calculateTotalPages(response.meta?.total as number, limit);
  }, [response.meta?.total, limit]);

  const loadMore = () => {
    if (currentPage < totalPages && currentPage === response.meta?.current_page) {
      setCurrentPage((page) => page + 1);
    }
  };

  const canLoadMore = useMemo<boolean>(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const getMoreData = useCallback(async () => {
    setIsUninitialized(false);
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const response = await action({
      page: currentPage,
      limit,
      ...queryParameters
    });

    if (response.error) {
      return;
    }

    setResponse(response);
    setData((prev) => [...prev, ...response.data]);
    setIsLoading(false);
  }, [currentPage, queryParameters, action, isLoading]);

  useEffect(() => {
    setResponse(initialData);
    setData(initialData.data);
  }, [initialData]);

  useEffect(() => {
    if (currentPage === 1) {
      return;
    }
    if (currentPage !== response.meta?.current_page) {
      getMoreData();
    }

    return () => {
      setIsLoading(false);
      setIsUninitialized(true);
    };
  }, [response, currentPage]);

  const refresh = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    data,
    currentPage,
    loadMore,
    canLoadMore,
    refresh,
    totalPages,
    isLoading,
    isUninitialized,
    total: response.meta?.total ?? 0,
    refetch: getMoreData
  };
};

export default useInfiniteScroll;
