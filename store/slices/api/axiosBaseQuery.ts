import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { axios, getTenantHost } from "@/lib/axios";
import { RootState } from "@/store";
import { IS_CLIENT, handleSessionId } from "@/utils";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, headers, data, params }, { getState }) => {
    try {
      const appState = (getState() as RootState).app;

      const result = await axios({
        url,
        headers: {
          ...headers,
          "X-Academy-Domain": appState.tenantHost || (IS_CLIENT && getTenantHost(window.location.host)),
          "X-Session-ID": IS_CLIENT ? handleSessionId() : undefined,
          "Accept-Language": appState.appLocale,
          Authorization: appState.accessToken ? `Bearer ${appState.accessToken}` : undefined,
          ...appState.conversionPixelHeaders
        },
        method,
        data,
        params
      });

      return { data: result.data };
    } catch (axiosError) {
      let { response, ...err } = axiosError as AxiosError;

      return {
        error: {
          ...(response?.data ?? { message: err.message }),
          status: response?.status
        }
      };
    }
  };

export default axiosBaseQuery;
