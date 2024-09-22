export * from "./order-history-col";
export * from "./withdraw-earning-col";

export type CellProps<T> = {
  row: {
    original: T;
  };
};
