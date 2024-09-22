"use client";

import { useState } from "react";

import saveAs from "file-saver";
import { useTranslations } from "next-intl";

import { useAppSelector, useToast } from "@/hooks";
import { axios, getTenantHost } from "@/lib/axios";
import { AppSliceStateType } from "@/store/slices/app-slice";

const useDownloadFile = () => {
  const t = useTranslations();
  const [toast] = useToast();
  const app = useAppSelector<AppSliceStateType>((state) => state.app);
  const [downloading, setDownloading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const downloadFile = async (url: string, filename: string) => {
    if (downloading) {
      return;
    }

    const slugify = (await import("slugify")).default;
    const mime = await import("mime-types");

    setDownloading(true);
    setCurrentUrl(url);

    const data = await axios
      .get(url, {
        responseType: "blob",
        headers: {
          "X-Academy-Domain": getTenantHost(window.location.host),
          Authorization: app.accessToken ? `Bearer ${app.accessToken}` : undefined,
          ...app.conversionPixelHeaders
        }
      })
      .then((res) => res.data)
      .catch(() => {
        toast.error({
          message: t("common.download_error")
        });
      })
      .finally(() => {
        setDownloading(false);
        setCurrentUrl(null);
      });

    if (data) {
      if (mime.lookup(filename) || mime.extension(data.type)) {
        saveAs(data, slugify(filename));
      } else {
        saveAs(data, slugify(filename) + ".zip");
      }
    }
  };

  const isDownloading = (url: string) => {
    return downloading && currentUrl === url;
  };

  return {
    downloadFile,
    isDownloading,
    downloading
  };
};
export default useDownloadFile;
