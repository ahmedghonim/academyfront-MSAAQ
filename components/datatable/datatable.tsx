"use client";

import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import cloneDeep from "lodash/cloneDeep";
import { useTranslations } from "next-intl";

import EmptyStateTable from "@/components/datatable/EmptyData";
import EmptyState from "@/components/empty-state";
import { useDynamicSearchParams } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { AnyObject } from "@/types";

import { CircleStackIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { Table, TableProps } from "@msaaqcom/abjad";

interface props extends Omit<TableProps<any>, "data"> {
  emptyState?: ReactElement<typeof EmptyState>;
  setIsTableEmpty?: (value: boolean) => void;
  fetcher: any;
  columns: { columns: any; props?: object };
  params?: {
    [key: string]: any;
  };
  onMetaLoaded?: (value: object) => void;
  onIsLoading?: (value: boolean) => void;
  dataFormatter?: (data: object[]) => any;
  defaultPerPage?: number;
  scrollOnRouteChange?: boolean;
  isShallow?: boolean;
}

const Datatable = ({
  fetcher,
  params: providedParams = {},
  columns: providedColumns,
  dataFormatter = (data) => data,
  defaultPerPage = 10,
  emptyState,
  setIsTableEmpty,
  onMetaLoaded,
  onIsLoading,
  scrollOnRouteChange = true,
  ...props
}: props) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { unflattenParams, set } = useDynamicSearchParams();

  const params = useMemo(() => ({ ...unflattenParams, ...providedParams }), [providedParams, unflattenParams]);
  const page = searchParams.get("page");

  const [items, setItems] = useState<APIFetchResponse<Array<AnyObject>>>({} as APIFetchResponse<Array<AnyObject>>);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetcher(params);

      setItems(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [params, fetcher]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  useEffect(() => {
    onIsLoading?.(isLoading);
  }, [isLoading, items]);

  const columns = useMemo(() => providedColumns.columns({ ...(providedColumns?.props ?? {}) }), []);

  useEffect(() => {
    setIsTableEmpty?.(!!items?.data?.length);
  }, [items]);
  const handleSortChange = (column: string | null, direction: "desc" | "asc" | null) => {
    let query = cloneDeep(unflattenParams);

    if (!column) {
      delete query.sort;
      delete query.sort_direction;
    } else {
      query.sort = column;
      query.sort_direction = direction ?? "desc";
    }

    set(query, undefined, {
      scroll: scrollOnRouteChange
    });
  };

  const handlePagination = (pageIndex: number, page: number) => {
    set({ ...unflattenParams, page: page }, undefined, {
      scroll: scrollOnRouteChange
    });
  };

  const pageCount = Math.ceil((items?.meta?.total ?? 0) / (items?.meta?.per_page ?? defaultPerPage));

  useEffect(() => {
    if (pageCount < parseInt(params.page)) {
      handlePagination(0, 1);
    }
    if (items?.meta) {
      onMetaLoaded?.(items?.meta);
    }
  }, [items]);

  return !isError ? (
    <Table
      isLoading={isLoading}
      columns={columns}
      data={dataFormatter(items?.data ?? [])}
      hasPagination={items?.data?.length > 0 && pageCount > 1}
      pageCount={pageCount}
      pageSize={items?.meta?.per_page ?? defaultPerPage}
      pageIndex={page ? parseInt(page as string) - 1 : 0}
      onPageChange={handlePagination}
      onSortChange={handleSortChange}
      messages={{
        emptyState: emptyState ?? (
          <EmptyStateTable
            title={t("empty_state:no_data_title")}
            content={t("empty_state:no_data_description")}
            icon={<CircleStackIcon />}
          />
        )
      }}
      {...props}
    />
  ) : (
    <EmptyStateTable
      title={t("error_state:no_data_title")}
      content={t("error_state:no_data_content")}
      icon={<ExclamationTriangleIcon />}
    />
  );
};

export default Datatable;
