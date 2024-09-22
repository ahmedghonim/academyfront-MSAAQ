import { ReactNode, useEffect, useMemo, useState } from "react";

import { useLocale } from "next-intl";
import { isRtlLang } from "rtl-detect";

import { classNames } from "@/utils";

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/20/solid";

import { Button, Icon } from "@msaaqcom/abjad";

const PaginationButton = ({
  label,
  active,
  onClick,
  disabled,
  icon
}: {
  label?: string;
  active?: boolean;
  onClick: () => void;
  disabled: boolean;
  icon?: ReactNode;
}) => {
  return (
    <Button
      onPress={onClick}
      size="sm"
      className={classNames("text-sm", !active ? "border-0" : "")}
      children={label}
      variant={active ? "outline" : "link"}
      isDisabled={disabled}
      color="primary"
      icon={icon ? <Icon>{icon}</Icon> : undefined}
    />
  );
};

const Pagination = ({
  links,
  onPageChange,
  fetchQuery,
  onFetching,
  params,
  showMoreAction,
  showFirstLast = false,
  total
}: {
  links: any;
  total: number;
  onPageChange: (data: []) => void;
  showMoreAction?: ReactNode;
  params: {
    page: number;
    limit: number;
    relation_type?: string;
    relation_id?: number[];
    filters?: any;
  };
  fetchQuery: any;
  onFetching: (fetching: boolean) => void;
  showFirstLast?: boolean;
}) => {
  const [$params, setParams] = useState(params);
  const [initialState, setInitialState] = useState(true);
  const locale = useLocale();

  const isRTL = isRtlLang(locale);
  const {
    data: $data,
    isLoading,
    isFetching
  } = fetchQuery($params, {
    skip: initialState && $params.page === 1
  });

  useEffect(() => {
    if (isFetching) {
      onFetching(isFetching);
    } else {
      onFetching(false);
    }
  }, [isFetching]);

  useEffect(() => {
    if (!isLoading && $data) {
      onPageChange($data.data);
      setInitialState(false);
    }
  }, [$params, $data]);

  const calculatePages = (): ReactNode[] => {
    const pageCount = links ? links.slice(1, -1).length : 0;
    const pageIndex = $params.page - 1;

    const buttons = [];

    buttons.push(renderButton(0, pageIndex, isFetching));

    if (pageCount <= 5) {
      for (let i = 1; i < pageCount - 1; i++) {
        buttons.push(renderButton(i, pageIndex, isFetching));
      }
    } else {
      if (pageIndex <= 2) {
        for (let i = 1; i <= 3; i++) {
          buttons.push(renderButton(i, pageIndex, isFetching));
        }
        buttons.push(
          <span
            key="ellipsis-forward"
            className="mx-2 text-primary"
          >
            ...
          </span>
        );
      } else if (pageIndex >= pageCount - 3) {
        buttons.push(
          <span
            key="ellipsis-backward"
            className="mx-2 text-primary"
          >
            ...
          </span>
        );
        for (let i = pageCount - 3; i < pageCount - 1; i++) {
          buttons.push(renderButton(i, pageIndex, isFetching));
        }
      } else {
        buttons.push(
          <span
            key="ellipsis-backward-start"
            className="mx-2 text-primary"
          >
            ...
          </span>
        );
        for (let i = pageIndex - 1; i <= pageIndex + 1; i++) {
          buttons.push(renderButton(i, pageIndex, isFetching));
        }
        buttons.push(
          <span
            key="ellipsis-forward-end"
            className="mx-2 text-primary"
          >
            ...
          </span>
        );
      }
    }

    if (pageCount > 1) {
      buttons.push(renderButton(pageCount - 1, pageIndex, isFetching));
    }

    return buttons;
  };

  const renderButton = (i: number, pageIndex: number, isFetching: boolean) => {
    return (
      <PaginationButton
        key={i}
        label={`${i + 1}`}
        active={i === pageIndex}
        onClick={() => {
          setParams({
            ...$params,
            page: i + 1
          });
        }}
        disabled={isFetching}
      />
    );
  };

  const hasPagination = useMemo(() => total > params.limit, [total, params.limit]);

  if (!hasPagination) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      <div className="flex items-center gap-1">
        {showFirstLast && (
          <PaginationButton
            disabled={isFetching || $params.page === 1}
            icon={isRTL ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
            onClick={() => {
              if ($params.page !== 1) {
                setParams({
                  ...$params,
                  page: 1
                });
              }
            }}
          />
        )}
        <PaginationButton
          disabled={isFetching || $params.page === 1}
          icon={isRTL ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          onClick={() => {
            if ($params.page !== 1) {
              setParams({
                ...$params,
                page: $params.page - 1
              });
            }
          }}
        />
        {calculatePages()}
        <PaginationButton
          disabled={isFetching || $params.page === (links ? links.slice(1, -1).length : 0)}
          icon={isRTL ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          onClick={() => {
            if ($params.page !== (links ? links.slice(1, -1).length : 0)) {
              setParams({
                ...$params,
                page: $params.page + 1
              });
            }
          }}
        />
        {showFirstLast && (
          <PaginationButton
            disabled={isFetching || $params.page === (links ? links.slice(1, -1).length : 0)}
            icon={isRTL ? <ChevronDoubleLeftIcon /> : <ChevronDoubleRightIcon />}
            onClick={() => {
              if ($params.page !== (links ? links.slice(1, -1).length : 0)) {
                setParams({
                  ...$params,
                  page: links ? links.slice(1, -1).length : 0
                });
              }
            }}
          />
        )}
      </div>
      {showMoreAction}
    </div>
  );
};

export default Pagination;
