import { FetchCollectionDataType, FetchDataType, FetchErrorType } from "./base-query";

export const ErrorType = {
  UNAUTHORIZED: "UNAUTHORIZED",
  SUBSCRIPTION_EXPIRED: "SUBSCRIPTION_EXPIRED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN: "FORBIDDEN"
};

export const ErrorStatus = {
  401: ErrorType.UNAUTHORIZED,
  402: ErrorType.SUBSCRIPTION_EXPIRED,
  500: ErrorType.INTERNAL_SERVER_ERROR,
  503: ErrorType.SERVICE_UNAVAILABLE,
  429: ErrorType.TOO_MANY_ATTEMPTS,
  403: ErrorType.FORBIDDEN,
  400: ErrorType.BAD_REQUEST,
  FETCH_ERROR: ErrorType.INTERNAL_SERVER_ERROR,
  404: ErrorType.NOT_FOUND,
  422: ErrorType.BAD_REQUEST
};

export const getErrorByStatus = (status: keyof typeof ErrorStatus) => {
  const msg = ErrorStatus[status];

  return new Error(msg ?? ErrorType.INTERNAL_SERVER_ERROR);
};

// Type guard to check if response has a data property
export function hasData<T>(
  response: FetchDataType<T> | FetchCollectionDataType<T> | FetchErrorType
): response is FetchDataType<T> | FetchCollectionDataType<T> {
  return (response as FetchDataType<T>).data !== undefined;
}
