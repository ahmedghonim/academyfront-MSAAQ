export enum ProductModelType {
  PRODUCT = "product",
  COURSE = "course"
}

export const DAY_MON_YEAR_TIME_FORMAT = "D MMM YYYY, h:mmA";
export const DAY_MON_YEAR_FORMAT = "D MMM YYYY";
export const ACCESS_TOKEN: string = "access_token";
export type FETCH_STATUSES = "loaded" | "loading" | "failed";
export const FETCH_STATUS_LOADED: FETCH_STATUSES = "loaded";
export const FETCH_STATUS_LOADING: FETCH_STATUSES = "loading";
export const FETCH_STATUS_FAILED: FETCH_STATUSES = "failed";

export const TAMARA_SUPPORTED_COUNTRIES = ["SA", "SAU", "AE", "ARE", "KW", "KWT"];
/*
export const BREAKPOINTS = {
  xs: "(min-width: 320px)",
  sm: "(min-width: 490px)",
  md: "(min-width: 744px)",
  lg: "(min-width: 960px)",
  xl: "(min-width: 1440px)",
  "2xl": "(min-width: 1920px)"
};*/

export const BREAKPOINTS = {
  xs: "(min-width:  480px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)"
};
